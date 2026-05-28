/* ============================================
   ADMIN PANEL - JavaScript
   ============================================ */

(function() {
    'use strict';

    const STORAGE_KEYS = {
        AUTH: 'admin_authenticated',
        PASSWORD: 'admin_password',
        PASSWORD_HASH: 'admin_password_hash',
        HERO_IMAGES: 'hero_images',
        REALISATIONS: 'realisations',
        ORDERS: 'macemay_orders',
        SETTINGS: 'site_settings'
    };

    // État
    let currentSection = 'hero';
    let selectedImageData = null;

    function escapeHTML(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function readStorageArray(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || '[]');
            return Array.isArray(value) ? value : [];
        } catch (error) {
            console.warn(`Storage invalide pour ${key}`, error);
            return [];
        }
    }

    // Initialisation
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initAuth();
        initNavigation();
        initUploadZones();
        initRealisations();
        initProducts();
        initSettings();
        initModal();
        loadAllData();
    }

    /* ============================================
       AUTHENTICATION
       ============================================ */
    function initAuth() {
        const loginForm = document.getElementById('loginForm');
        const logoutBtn = document.getElementById('logoutBtn');
        const loginScreen = document.getElementById('loginScreen');
        const dashboard = document.getElementById('adminDashboard');
        const loginHint = document.getElementById('loginHint');
        const loginError = document.getElementById('loginError');

        updateLoginHint(loginHint);

        // Vérifier si déjà authentifié
        if (sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true') {
            loginScreen.style.display = 'none';
            dashboard.style.display = 'flex';
        }

        // Formulaire de connexion
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = document.getElementById('password').value;
            const authResult = await authenticateAdmin(password);

            if (authResult.ok) {
                sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
                loginScreen.style.display = 'none';
                dashboard.style.display = 'flex';
                showToast(authResult.created ? 'Mot de passe admin créé' : 'Connexion réussie', 'success');
            } else {
                loginError.textContent = authResult.message;
                shakeElement(document.getElementById('password'));
            }
        });

        // Déconnexion
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem(STORAGE_KEYS.AUTH);
            location.reload();
        });

        // Changer le mot de passe
        document.getElementById('changePasswordBtn').addEventListener('click', async () => {
            const newPass = document.getElementById('newPassword').value;
            const confirmPass = document.getElementById('confirmPassword').value;

            if (!newPass) {
                showToast('Veuillez entrer un nouveau mot de passe', 'error');
                return;
            }

            if (newPass !== confirmPass) {
                showToast('Les mots de passe ne correspondent pas', 'error');
                return;
            }

            const passwordValidation = validateAdminPassword(newPass);
            if (!passwordValidation.ok) {
                showToast(passwordValidation.message, 'error');
                return;
            }

            await storeAdminPassword(newPass);
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            showToast('Mot de passe modifié avec succès', 'success');
        });
    }

    function updateLoginHint(loginHint) {
        const hasStoredPassword = localStorage.getItem(STORAGE_KEYS.PASSWORD_HASH) || localStorage.getItem(STORAGE_KEYS.PASSWORD);
        if (!loginHint) return;

        loginHint.textContent = hasStoredPassword
            ? ''
            : 'Première connexion : créez un mot de passe admin fort.';
    }

    async function authenticateAdmin(password) {
        const storedHash = localStorage.getItem(STORAGE_KEYS.PASSWORD_HASH);
        const legacyPassword = localStorage.getItem(STORAGE_KEYS.PASSWORD);

        if (storedHash) {
            const passwordHash = await hashPassword(password);
            return storedHash === passwordHash
                ? { ok: true, created: false }
                : { ok: false, message: 'Mot de passe incorrect' };
        }

        if (legacyPassword) {
            if (password !== legacyPassword) {
                return { ok: false, message: 'Mot de passe incorrect' };
            }

            await storeAdminPassword(password);
            localStorage.removeItem(STORAGE_KEYS.PASSWORD);
            return { ok: true, created: false };
        }

        const passwordValidation = validateAdminPassword(password);
        if (!passwordValidation.ok) {
            return { ok: false, message: passwordValidation.message };
        }

        await storeAdminPassword(password);
        return { ok: true, created: true };
    }

    function validateAdminPassword(password) {
        if (password.length < 10) {
            return { ok: false, message: 'Le mot de passe doit contenir au moins 10 caractères' };
        }

        if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
            return { ok: false, message: 'Ajoutez au moins une lettre et un chiffre' };
        }

        return { ok: true };
    }

    async function storeAdminPassword(password) {
        const passwordHash = await hashPassword(password);
        localStorage.setItem(STORAGE_KEYS.PASSWORD_HASH, passwordHash);
    }

    async function hashPassword(password) {
        if (!window.crypto || !window.crypto.subtle) {
            return `plain:${password}`;
        }

        const data = new TextEncoder().encode(password);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return `sha256:${hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')}`;
    }

    function shakeElement(el) {
        el.classList.add('shake');
        setTimeout(() => el.classList.remove('shake'), 500);
    }

    /* ============================================
       NAVIGATION
       ============================================ */
    function initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.admin-section');
        const sectionTitle = document.getElementById('sectionTitle');

        const titles = {
            hero: 'Images Hero',
            realisations: 'Floquage',
            products: 'Mini boutique accessoires',
            orders: 'Commandes',
            settings: 'Paramètres'
        };

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                currentSection = section;

                // Update nav
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Update sections
                sections.forEach(sec => sec.classList.remove('active'));
                document.getElementById(section + 'Section').classList.add('active');

                // Update title
                sectionTitle.textContent = titles[section] || 'Administration';
                if (section === 'orders') renderOrdersAdmin();
            });
        });
    }

    /* ============================================
       UPLOAD ZONES
       ============================================ */
    function initUploadZones() {
        // Hero images upload
        setupUploadZone('heroUploadZone', 'heroFileInput', 'hero');
        
        // Les réalisations floquage utilisent désormais un formulaire dédié.
    }

    function setupUploadZone(zoneId, inputId, type) {
        const zone = document.getElementById(zoneId);
        const input = document.getElementById(inputId);

        if (!zone || !input) return;

        // Click to browse
        zone.addEventListener('click', () => input.click());

        // Drag & drop
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('dragover');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            handleFiles(e.dataTransfer.files, type);
        });

        // File input change
        input.addEventListener('change', (e) => {
            handleFiles(e.target.files, type);
            input.value = ''; // Reset for same file selection
        });
    }

    function handleFiles(files, type) {
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                showToast('Seules les images sont acceptées', 'error');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                showToast('L\'image est trop lourde (max 5MB)', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    id: Date.now() + Math.random().toString(36).substr(2, 9),
                    name: file.name,
                    data: e.target.result,
                    title: file.name.replace(/\.[^.]+$/, ''),
                    support: 'Floquage',
                    desc: '',
                    active: true,
                    date: new Date().toISOString()
                };

                saveImage(imageData, type);
                showToast('Image ajoutée avec succès', 'success');
            };
            reader.readAsDataURL(file);
        });
    }

    function saveImage(imageData, type) {
        const key = type === 'hero' ? STORAGE_KEYS.HERO_IMAGES : STORAGE_KEYS.REALISATIONS;
        const images = JSON.parse(localStorage.getItem(key) || '[]');
        images.push(imageData);
        localStorage.setItem(key, JSON.stringify(images));
        renderImages(type);
    }

    function deleteImage(id, type) {
        const key = type === 'hero' ? STORAGE_KEYS.HERO_IMAGES : STORAGE_KEYS.REALISATIONS;
        let images = JSON.parse(localStorage.getItem(key) || '[]');
        images = images.filter(img => img.id !== id);
        localStorage.setItem(key, JSON.stringify(images));
        renderImages(type);
        closeModal();
        showToast('Image supprimée', 'success');
    }

    function renderImages(type) {
        const key = type === 'hero' ? STORAGE_KEYS.HERO_IMAGES : STORAGE_KEYS.REALISATIONS;
        const gridId = type === 'hero' ? 'heroImagesGrid' : 'realisationsGrid';
        const grid = document.getElementById(gridId);
        const images = JSON.parse(localStorage.getItem(key) || '[]');

        if (!grid) return;

        // Images par défaut pour hero si vide
        let displayImages = images;
        if (type === 'hero' && images.length === 0) {
            displayImages = [
                { id: 'default-1', name: 'hero-1.png', data: 'hero-1.png', isDefault: true },
                { id: 'default-2', name: 'hero-2.png', data: 'hero-2.png', isDefault: true },
                { id: 'default-3', name: 'hero-3.png', data: 'hero-3.png', isDefault: true }
            ];
        }

        if (type === 'realisations') {
            renderRealisationsAdmin();
            return;
        }

        grid.innerHTML = displayImages.map((img, index) => `
            <div class="image-card" data-id="${img.id}" data-type="${type}">
                ${type === 'hero' ? `<span class="image-order">${index + 1}</span>` : ''}
                <img src="${img.data}" alt="${img.name}" onclick="window.adminPreview('${img.id}', '${type}')">
                <div class="image-card-info">
                    <span class="image-card-name">${img.name}</span>
                    <div class="image-card-actions">
                        ${!img.isDefault ? `
                        <button class="btn-icon-delete" onclick="window.adminDelete('${img.id}', '${type}')" title="Supprimer">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                        ` : '<span style="font-size:0.7rem;color:#999;">Défaut</span>'}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Global functions for inline handlers
    window.adminPreview = function(id, type) {
        const key = type === 'hero' ? STORAGE_KEYS.HERO_IMAGES : STORAGE_KEYS.REALISATIONS;
        let images = JSON.parse(localStorage.getItem(key) || '[]');
        
        // Check defaults for hero
        if (type === 'hero' && images.length === 0) {
            images = [
                { id: 'default-1', name: 'hero-1.png', data: 'hero-1.png', isDefault: true },
                { id: 'default-2', name: 'hero-2.png', data: 'hero-2.png', isDefault: true },
                { id: 'default-3', name: 'hero-3.png', data: 'hero-3.png', isDefault: true }
            ];
        }

        const img = images.find(i => i.id === id);
        if (img) {
            selectedImageData = { ...img, type };
            document.getElementById('modalImage').src = img.data;
            document.getElementById('imageModal').classList.add('show');
            
            // Hide delete for default images
            document.getElementById('modalDelete').style.display = img.isDefault ? 'none' : 'flex';
        }
    };

    window.adminDelete = function(id, type) {
        if (confirm('Supprimer cette image ?')) {
            deleteImage(id, type);
        }
    };

    /* ============================================
       FLOQUAGE REALISATIONS
       ============================================ */
    function normalizeRealisation(item) {
        const name = item.name || item.title || 'Réalisation floquage';
        return {
            id: item.id || `real-${Date.now()}`,
            name,
            title: item.title || String(name).replace(/\.[^.]+$/, '') || 'Réalisation floquage',
            support: item.support || 'Floquage',
            desc: item.desc || item.description || '',
            data: item.data || item.imageData || '',
            active: item.active !== false,
            date: item.date || new Date().toISOString()
        };
    }

    function getRealisations() {
        return readStorageArray(STORAGE_KEYS.REALISATIONS).map(normalizeRealisation);
    }

    function saveAllRealisations(items) {
        localStorage.setItem(STORAGE_KEYS.REALISATIONS, JSON.stringify(items.map(normalizeRealisation)));
    }

    function initRealisations() {
        const saveBtn = document.getElementById('saveRealisationBtn');
        const resetBtn = document.getElementById('resetRealisationBtn');
        const imageInput = document.getElementById('realisationImageInput');

        if (!saveBtn || !resetBtn || !imageInput) return;

        saveBtn.addEventListener('click', saveRealisationFromForm);
        resetBtn.addEventListener('click', resetRealisationForm);
        imageInput.addEventListener('change', handleRealisationImage);
    }

    function handleRealisationImage(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Seules les images sont acceptées', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('Image trop lourde (max 5MB)', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById('realisationImageData').value = e.target.result;
            renderRealisationImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    function saveRealisationFromForm() {
        const id = document.getElementById('realisationId').value || `real-${Date.now()}`;
        const title = document.getElementById('realisationTitle').value.trim();
        const support = document.getElementById('realisationSupport').value.trim();
        const desc = document.getElementById('realisationDesc').value.trim();
        const data = document.getElementById('realisationImageData').value;

        if (!title) {
            showToast('Le titre est obligatoire', 'error');
            return;
        }

        if (!data) {
            showToast('Ajoutez une image pour cette réalisation', 'error');
            return;
        }

        const realisations = getRealisations();
        const existingIndex = realisations.findIndex(item => item.id === id);
        const item = normalizeRealisation({
            id,
            name: title,
            title,
            support: support || 'Floquage',
            desc,
            data,
            active: document.getElementById('realisationActive').checked,
            date: existingIndex >= 0 ? realisations[existingIndex].date : new Date().toISOString()
        });

        if (existingIndex >= 0) {
            realisations[existingIndex] = item;
        } else {
            realisations.unshift(item);
        }

        saveAllRealisations(realisations);
        renderRealisationsAdmin();
        resetRealisationForm();
        showToast('Réalisation enregistrée', 'success');
    }

    function renderRealisationImagePreview(src) {
        const preview = document.getElementById('realisationImagePreview');
        if (!preview) return;
        preview.innerHTML = src ? `<img src="${escapeHTML(src)}" alt="Aperçu réalisation">` : 'Aucune image';
    }

    function resetRealisationForm() {
        document.getElementById('realisationFormTitle').textContent = 'Ajouter une réalisation';
        document.getElementById('realisationId').value = '';
        document.getElementById('realisationTitle').value = '';
        document.getElementById('realisationSupport').value = '';
        document.getElementById('realisationDesc').value = '';
        document.getElementById('realisationImageData').value = '';
        document.getElementById('realisationImageInput').value = '';
        document.getElementById('realisationActive').checked = true;
        renderRealisationImagePreview('');
    }

    function renderRealisationsAdmin() {
        const grid = document.getElementById('realisationsGrid');
        if (!grid) return;

        const realisations = getRealisations();
        if (!realisations.length) {
            grid.innerHTML = '<div class="admin-empty">Aucune réalisation floquage. Ajoutez une première image avec sa description.</div>';
            return;
        }

        grid.innerHTML = realisations.map(item => `
            <article class="admin-product-card admin-realisation-card ${item.active === false ? 'is-offline' : ''}">
                <div class="admin-product-media">
                    ${item.data ? `<img src="${escapeHTML(item.data)}" alt="${escapeHTML(item.title)}">` : `<span>${escapeHTML((item.title || 'FL').slice(0, 2).toUpperCase())}</span>`}
                </div>
                <div class="admin-product-info">
                    <span class="admin-product-category">${escapeHTML(item.support || 'Floquage')}${item.active === false ? ' · masqué' : ''}</span>
                    <strong>${escapeHTML(item.title)}</strong>
                    <small>${escapeHTML(item.desc || 'Sans description')}</small>
                </div>
                <div class="admin-product-actions">
                    <button type="button" onclick="window.adminEditRealisation('${item.id}')">Modifier</button>
                    <button type="button" class="danger" onclick="window.adminDeleteRealisation('${item.id}')">Supprimer</button>
                </div>
            </article>
        `).join('');
    }

    window.adminEditRealisation = function(id) {
        const item = getRealisations().find(realisation => realisation.id === id);
        if (!item) return;

        document.getElementById('realisationFormTitle').textContent = 'Modifier la réalisation';
        document.getElementById('realisationId').value = item.id;
        document.getElementById('realisationTitle').value = item.title || '';
        document.getElementById('realisationSupport').value = item.support || '';
        document.getElementById('realisationDesc').value = item.desc || '';
        document.getElementById('realisationImageData').value = item.data || '';
        document.getElementById('realisationActive').checked = item.active !== false;
        renderRealisationImagePreview(item.data || '');
        document.querySelector('.realisation-admin-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.adminDeleteRealisation = function(id) {
        if (!confirm('Supprimer cette réalisation ?')) return;
        const realisations = getRealisations().filter(item => item.id !== id);
        saveAllRealisations(realisations);
        renderRealisationsAdmin();
        resetRealisationForm();
        showToast('Réalisation supprimée', 'success');
    };

    /* ============================================
       SETTINGS
       ============================================ */
    function initSettings() {
        const saveBtn = document.getElementById('saveSettingsBtn');
        
        saveBtn.addEventListener('click', () => {
            const settings = {
                siteName: document.getElementById('siteName').value,
                sitePhone: document.getElementById('sitePhone').value,
                siteEmail: document.getElementById('siteEmail').value,
                slideDuration: parseInt(document.getElementById('slideDuration').value) || 5,
                slideAutoplay: document.getElementById('slideAutoplay').checked
            };

            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
            showToast('Paramètres enregistrés', 'success');
            
            // Update main site (if in same origin)
            try {
                if (window.opener) {
                    window.opener.postMessage({ type: 'settings_updated', settings }, '*');
                }
            } catch(e) {}
        });
    }

    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
        
        if (settings.siteName) document.getElementById('siteName').value = settings.siteName;
        if (settings.sitePhone) document.getElementById('sitePhone').value = settings.sitePhone;
        if (settings.siteEmail) document.getElementById('siteEmail').value = settings.siteEmail;
        if (settings.slideDuration) document.getElementById('slideDuration').value = settings.slideDuration;
        if (settings.slideAutoplay !== undefined) document.getElementById('slideAutoplay').checked = settings.slideAutoplay;
    }

    /* ============================================
       PRODUCTS
       ============================================ */
    function initProducts() {
        if (!window.MacemayShop) return;
        window.MacemayShop.ensureProductsSeeded();

        const saveBtn = document.getElementById('saveProductBtn');
        const resetBtn = document.getElementById('resetProductBtn');
        const imageInput = document.getElementById('productImageInput');

        if (!saveBtn || !resetBtn || !imageInput) return;

        saveBtn.addEventListener('click', saveProductFromForm);
        resetBtn.addEventListener('click', resetProductForm);
        imageInput.addEventListener('change', handleProductImage);
    }

    function handleProductImage(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Seules les images sont acceptées', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('Image trop lourde (max 5MB)', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById('productImageData').value = e.target.result;
            renderProductImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    function saveProductFromForm() {
        const id = document.getElementById('productId').value || `prod-${Date.now()}`;
        const name = document.getElementById('productName').value.trim();
        const price = parseFloat(document.getElementById('productPrice').value);

        if (!name) {
            showToast('Le nom de l\'accessoire est obligatoire', 'error');
            return;
        }

        if (Number.isNaN(price) || price < 0) {
            showToast('Le prix doit être valide', 'error');
            return;
        }

        const products = window.MacemayShop.getAllProducts();
        const existingIndex = products.findIndex(product => product.id === id);
        const product = {
            id,
            category: document.getElementById('productCategory').value,
            name,
            tag: document.getElementById('productTag').value.trim(),
            desc: document.getElementById('productDesc').value.trim(),
            price,
            imageData: document.getElementById('productImageData').value,
            active: document.getElementById('productActive').checked
        };

        if (existingIndex >= 0) {
            products[existingIndex] = product;
        } else {
            products.push(product);
        }

        window.MacemayShop.saveAllProducts(products);
        renderProductsAdmin();
        resetProductForm();
        showToast('Accessoire enregistré', 'success');
    }

    function renderProductImagePreview(src) {
        const preview = document.getElementById('productImagePreview');
        if (!preview) return;
        preview.innerHTML = src ? `<img src="${src}" alt="Aperçu produit">` : 'Aucune image';
    }

    function resetProductForm() {
        document.getElementById('productFormTitle').textContent = 'Ajouter un accessoire';
        document.getElementById('productId').value = '';
        document.getElementById('productCategory').value = 'accessoire';
        document.getElementById('productName').value = '';
        document.getElementById('productTag').value = '';
        document.getElementById('productDesc').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productImageData').value = '';
        document.getElementById('productImageInput').value = '';
        document.getElementById('productActive').checked = true;
        renderProductImagePreview('');
    }

    function renderProductsAdmin() {
        if (!window.MacemayShop) return;
        const grid = document.getElementById('adminProductsGrid');
        if (!grid) return;

        const products = window.MacemayShop.getAllProducts().filter(product => product.category === 'accessoire');
        if (!products.length) {
            grid.innerHTML = '<div class="admin-empty">Boutique vide. Ajoutez un premier accessoire quand le client aura validé son offre.</div>';
            return;
        }

        grid.innerHTML = products.map(product => `
            <article class="admin-product-card ${product.active === false ? 'is-offline' : ''}">
                <div class="admin-product-media">
                    ${product.imageData ? `<img src="${product.imageData}" alt="${product.name}">` : `<span>${(product.name || 'MC').slice(0, 2).toUpperCase()}</span>`}
                </div>
                <div class="admin-product-info">
                    <span class="admin-product-category">Accessoires${product.active === false ? ' · masqué' : ''}</span>
                    <strong>${product.name}</strong>
                    <small>${window.MacemayShop.formatPrice(product.price)}</small>
                </div>
                <div class="admin-product-actions">
                    <button type="button" onclick="window.adminEditProduct('${product.id}')">Modifier</button>
                    <button type="button" class="danger" onclick="window.adminDeleteProduct('${product.id}')">Supprimer</button>
                </div>
            </article>
        `).join('');
    }

    window.adminEditProduct = function(id) {
        const product = window.MacemayShop.getAllProducts().find(item => item.id === id);
        if (!product) return;

        document.getElementById('productFormTitle').textContent = 'Modifier l\'accessoire';
        document.getElementById('productId').value = product.id;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productName').value = product.name;
        document.getElementById('productTag').value = product.tag || '';
        document.getElementById('productDesc').value = product.desc || '';
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productImageData').value = product.imageData || '';
        document.getElementById('productActive').checked = product.active !== false;
        renderProductImagePreview(product.imageData || '');
        document.querySelector('.product-editor-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.adminDeleteProduct = function(id) {
        if (!confirm('Supprimer cet accessoire ?')) return;
        const products = window.MacemayShop.getAllProducts().filter(product => product.id !== id);
        window.MacemayShop.saveAllProducts(products);
        renderProductsAdmin();
        showToast('Accessoire supprimé', 'success');
    };

    /* ============================================
       ORDERS
       ============================================ */
    function formatPrice(value) {
        return `${(Number(value) || 0).toFixed(2).replace('.', ',')} €`;
    }

    function formatDate(value) {
        if (!value) return 'Date inconnue';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return 'Date inconnue';
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    async function fetchServerOrders(forcePrompt = false) {
        const config = window.MACEMAY_CONFIG || {};
        const endpoint = config.adminOrdersUrl;
        if (!endpoint) return null;

        let token = localStorage.getItem('macemay_admin_api_token') || '';
        if (!token && forcePrompt) {
            token = prompt('Jeton API admin IONOS');
            if (token) localStorage.setItem('macemay_admin_api_token', token);
        }
        if (!token) return null;

        const response = await fetch(endpoint, {
            headers: { 'X-Admin-Token': token }
        });

        if (response.status === 401) {
            localStorage.removeItem('macemay_admin_api_token');
            if (forcePrompt) showToast('Jeton API admin invalide', 'error');
            return null;
        }

        if (!response.ok) return null;
        const payload = await response.json();
        return Array.isArray(payload.orders) ? payload.orders : null;
    }

    async function renderOrdersAdmin(forceServerPrompt = false) {
        const list = document.getElementById('adminOrdersList');
        if (!list) return;

        list.innerHTML = '<div class="admin-empty">Chargement des commandes...</div>';
        const serverOrders = await fetchServerOrders(forceServerPrompt);
        const orders = serverOrders || readStorageArray(STORAGE_KEYS.ORDERS);
        const isServerSource = Boolean(serverOrders);
        const serverButton = (window.MACEMAY_CONFIG || {}).adminOrdersUrl
            ? '<button type="button" class="btn-secondary-admin admin-load-server-orders" id="loadServerOrdersBtn">Charger les commandes IONOS</button>'
            : '';

        if (!orders.length) {
            list.innerHTML = `<div class="admin-empty">Aucune commande payée pour le moment.${serverButton}</div>`;
            document.getElementById('loadServerOrdersBtn')?.addEventListener('click', () => renderOrdersAdmin(true));
            return;
        }

        list.innerHTML = (!isServerSource && serverButton ? `<div class="admin-empty">Affichage local. Pour voir les commandes Mollie stockées sur IONOS, chargez les commandes serveur.${serverButton}</div>` : '') + orders.map(order => {
            const items = Array.isArray(order.items) ? order.items : [];
            const total = order.total ?? items.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
            return `
                <article class="admin-order-card">
                    <div class="admin-order-head">
                        <div>
                            <span class="admin-order-kicker">Commande payée</span>
                            <h3>${escapeHTML(order.id || 'Commande')}</h3>
                            <p>${escapeHTML(formatDate(order.date))}</p>
                        </div>
                        <div class="admin-order-total">${escapeHTML(formatPrice(total))}</div>
                    </div>
                    <div class="admin-order-meta">
                        <span>${escapeHTML(order.paymentProvider || 'Paiement')}</span>
                        ${order.paymentId ? `<span>ID paiement : ${escapeHTML(order.paymentId)}</span>` : ''}
                        ${order.payerName ? `<span>Client : ${escapeHTML(order.payerName)}</span>` : ''}
                        ${order.payerEmail ? `<span>${escapeHTML(order.payerEmail)}</span>` : ''}
                    </div>
                    <div class="admin-order-items">
                        ${items.map(renderOrderItem).join('')}
                    </div>
                    <div class="admin-order-actions">
                        <button type="button" class="danger" data-delete-order="${escapeHTML(order.id || '')}" data-order-source="${isServerSource ? 'server' : 'local'}">Supprimer</button>
                    </div>
                </article>
            `;
        }).join('');

        document.getElementById('loadServerOrdersBtn')?.addEventListener('click', () => renderOrdersAdmin(true));

        list.querySelectorAll('[data-delete-order]').forEach(button => {
            button.addEventListener('click', () => deleteOrder(button.dataset.deleteOrder, button.dataset.orderSource));
        });
    }

    function renderOrderItem(item) {
        const details = item.details || {};
        const quantity = Number(item.quantity) || 1;
        const itemTotal = (Number(item.price) || 0) * quantity;
        const decorImage = details.decorImageData || '';
        const decorImageName = details.decorImageName || '';
        const plateMessage = details.message || item.message || '';
        const adminMessage = details.decorAdminMessage || '';
        const immat = details.immat || item.immatriculation || '';
        const dept = details.dept || item.departement || '';

        return `
            <article class="admin-order-item">
                <div class="admin-order-media">
                    ${decorImage
                        ? `<img src="${escapeHTML(decorImage)}" alt="Image client ${escapeHTML(decorImageName)}">`
                        : '<span>Aucune image</span>'}
                </div>
                <div class="admin-order-item-body">
                    <div class="admin-order-item-title">
                        <strong>${escapeHTML(item.name || 'Article')}</strong>
                        <span>x${escapeHTML(quantity)} · ${escapeHTML(formatPrice(itemTotal))}</span>
                    </div>
                    <dl class="admin-order-details">
                        ${details.format ? `<div><dt>Format</dt><dd>${escapeHTML(details.format)}</dd></div>` : ''}
                        ${immat ? `<div><dt>Immatriculation</dt><dd>${escapeHTML(immat)}</dd></div>` : ''}
                        ${dept ? `<div><dt>Département</dt><dd>${escapeHTML(dept)}</dd></div>` : ''}
                        ${decorImageName ? `<div><dt>Image client</dt><dd>${escapeHTML(decorImageName)}</dd></div>` : ''}
                        ${plateMessage ? `<div><dt>Message plaque</dt><dd>${escapeHTML(plateMessage)}</dd></div>` : ''}
                    </dl>
                    ${adminMessage ? `<div class="admin-order-note"><span>Message atelier</span><p>${escapeHTML(adminMessage)}</p></div>` : '<div class="admin-order-note is-empty"><span>Message atelier</span><p>Aucun message client.</p></div>'}
                </div>
            </article>
        `;
    }

    async function deleteOrder(id, source = 'local') {
        if (!id || !confirm('Supprimer cette commande de l\'admin ?')) return;

        if (source === 'server') {
            const config = window.MACEMAY_CONFIG || {};
            const token = localStorage.getItem('macemay_admin_api_token') || '';
            if (config.adminOrdersUrl && token) {
                const response = await fetch(`${config.adminOrdersUrl}?order=${encodeURIComponent(id)}`, {
                    method: 'DELETE',
                    headers: { 'X-Admin-Token': token }
                });
                if (!response.ok) {
                    showToast('Suppression serveur impossible', 'error');
                    return;
                }
                renderOrdersAdmin();
                showToast('Commande supprimée', 'success');
                return;
            }
        }

        const orders = readStorageArray(STORAGE_KEYS.ORDERS).filter(order => order.id !== id);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        renderOrdersAdmin();
        showToast('Commande supprimée', 'success');
    }

    /* ============================================
       MODAL
       ============================================ */
    function initModal() {
        const modal = document.getElementById('imageModal');
        const closeBtn = document.getElementById('modalClose');
        const deleteBtn = document.getElementById('modalDelete');

        closeBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        deleteBtn.addEventListener('click', () => {
            if (selectedImageData && confirm('Supprimer cette image ?')) {
                deleteImage(selectedImageData.id, selectedImageData.type);
            }
        });

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    function closeModal() {
        document.getElementById('imageModal').classList.remove('show');
        selectedImageData = null;
    }

    /* ============================================
       UTILITIES
       ============================================ */
    function showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.querySelector('.toast-message').textContent = message;
        toast.className = 'toast ' + type;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function loadAllData() {
        renderImages('hero');
        renderImages('realisations');
        renderProductsAdmin();
        renderOrdersAdmin();
        loadSettings();
    }

})();
