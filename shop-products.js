/* ======================================================================
   Macemay custom - produits administrables (boutique)
   ====================================================================== */
(function() {
    'use strict';

    const STORAGE_KEY = 'macemay_shop_products';
    const MIGRATION_KEY = 'macemay_shop_products_empty_accessories_v2';
    const CATEGORY_MIGRATION_KEY = 'macemay_shop_category_boutique_v3';
    const BOUTIQUE_CATEGORY = 'boutique';
    const LEGACY_BOUTIQUE_CATEGORIES = ['boutique', 'accessoire'];
    const LEGACY_DEFAULT_IDS = [
        'acc-rivets-noirs',
        'acc-kit-pose',
        'acc-support-moto',
        'acc-cache-rivets',
        'txt-tshirt',
        'txt-veste',
        'txt-casquette',
        'txt-bonnet'
    ];

    const DEFAULT_PRODUCTS = [];

    function cloneDefaults() {
        return DEFAULT_PRODUCTS.map(product => ({ ...product }));
    }

    function isBoutiqueCategory(category) {
        return LEGACY_BOUTIQUE_CATEGORIES.includes(category);
    }

    function normalizeProduct(product) {
        const normalized = { ...product };
        if (normalized.category === 'accessoire') {
            normalized.category = BOUTIQUE_CATEGORY;
        }
        if (normalized.category === 'textile' && normalized.tag === 'Textile') {
            normalized.tag = 'Floquage';
        }
        const nameMap = {
            'T-shirt floque': 'T-shirt floqué',
            'Veste floquee': 'Veste floquée',
            'Casquette floquee': 'Casquette floquée',
            'Bonnet floque': 'Bonnet floqué',
            'Kit de pose plaque': 'Kit fixation plaque'
        };
        if (nameMap[normalized.name]) normalized.name = nameMap[normalized.name];
        const descMap = {
            'Lot de 4 rivets noirs pour une pose discrète sur plaque Plexiglas.': 'Lot de 4 rivets noirs pour une fixation discrète sur plaque Plexiglas.',
            'Lot de 4 rivets noirs pour pose propre sur plaque Plexiglas.': 'Lot de 4 rivets noirs pour une fixation discrète sur plaque Plexiglas.',
            'Kit complet pour installer proprement une plaque auto ou SUV.': 'Ensemble de fixation pour plaque auto ou SUV.',
            'Kit complet avec rivets et accessoires de fixation.': 'Ensemble de fixation avec rivets et accessoires.',
            'Support robuste pour installation moto et scooter.': 'Support robuste pour plaque moto et scooter.'
        };
        if (descMap[normalized.desc]) normalized.desc = descMap[normalized.desc];
        if (normalized.tag === 'Pose' || normalized.tag === 'Atelier') normalized.tag = 'Fixation';
        return normalized;
    }

    function migrateAccessoireCategory() {
        if (localStorage.getItem(CATEGORY_MIGRATION_KEY) === 'done') return;

        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    const migrated = parsed.map(product => {
                        if (product.category === 'accessoire') {
                            return { ...product, category: BOUTIQUE_CATEGORY };
                        }
                        return product;
                    });
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
                }
            } catch (error) {
                /* ignore */
            }
        }

        localStorage.setItem(CATEGORY_MIGRATION_KEY, 'done');
    }

    function getAllProducts() {
        migrateLegacyDefaultProducts();
        migrateAccessoireCategory();
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return cloneDefaults();
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed.map(normalizeProduct) : cloneDefaults();
        } catch (error) {
            return cloneDefaults();
        }
    }

    function saveAllProducts(products) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }

    function ensureProductsSeeded() {
        migrateLegacyDefaultProducts();
        migrateAccessoireCategory();
        if (!localStorage.getItem(STORAGE_KEY)) {
            saveAllProducts(cloneDefaults());
        }
    }

    function migrateLegacyDefaultProducts() {
        if (localStorage.getItem(MIGRATION_KEY) === 'done') return;

        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(MIGRATION_KEY, 'done');
            return;
        }

        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                const cleaned = parsed.filter(product => !LEGACY_DEFAULT_IDS.includes(product.id));
                localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
            }
        } catch (error) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        }

        localStorage.setItem(MIGRATION_KEY, 'done');
    }

    function getProducts(category) {
        return getAllProducts().filter(product => {
            if (product.active === false) return false;
            if (category === BOUTIQUE_CATEGORY) return isBoutiqueCategory(product.category);
            return product.category === category;
        });
    }

    function formatPrice(price) {
        return `${Number(price || 0).toFixed(2).replace('.', ',')} €`;
    }

    function escapeHTML(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function initials(name) {
        return String(name || 'MC')
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(word => word.charAt(0).toUpperCase())
            .join('') || 'MC';
    }

    function renderProductCard(product, options = {}) {
        const mode = options.mode || 'cart';
        const contactSubject = options.subject || product.category || 'produit';
        const contactBase = options.contactBase || 'pages/contact.html';
        const contactHref = `${contactBase}?subject=${encodeURIComponent(contactSubject)}&product=${encodeURIComponent(product.name || '')}`;
        const contactLabel = options.actionLabel || 'Contacter';
        const visual = product.imageData
            ? `<img src="${escapeHTML(product.imageData)}" alt="${escapeHTML(product.name)}">`
            : `<span>${escapeHTML(initials(product.name))}</span>`;
        const action = mode === 'contact'
            ? `<a class="shop-contact-btn" href="${escapeHTML(contactHref)}">${escapeHTML(contactLabel)}</a>`
            : `<button type="button" class="shop-add-btn" data-product-id="${escapeHTML(product.id)}">Ajouter au panier</button>`;
        const priceLabel = formatPrice(product.price);

        return `
            <article class="shop-product-card">
                <div class="shop-product-media">${visual}</div>
                <div class="shop-product-body">
                    <div class="shop-product-topline">
                        <span>${escapeHTML(product.tag || (product.category === 'textile' ? 'Floquage' : 'Boutique'))}</span>
                    </div>
                    <h3>${escapeHTML(product.name)}</h3>
                    <p>${escapeHTML(product.desc || '')}</p>
                    <div class="shop-product-bottom">
                        <strong>${escapeHTML(priceLabel)}</strong>
                        ${action}
                    </div>
                </div>
            </article>
        `;
    }

    function addProductToCart(product) {
        if (!isBoutiqueCategory(product.category)) {
            if (typeof window.showNotification === 'function') {
                window.showNotification('Cet article se commande en contactant le vendeur.', 'info');
            }
            window.location.href = `pages/contact.html?subject=${encodeURIComponent(product.category || 'produit')}&product=${encodeURIComponent(product.name || '')}`;
            return;
        }

        const item = {
            id: `${BOUTIQUE_CATEGORY}_${product.id}_${Date.now()}`,
            type: BOUTIQUE_CATEGORY,
            name: product.name,
            details: {
                category: BOUTIQUE_CATEGORY,
                tag: product.tag || '',
                productId: product.id
            },
            price: Number(product.price || 0),
            quantity: 1
        };

        if (typeof window.addToCart === 'function') {
            window.addToCart(item);
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));

        if (typeof window.updateCartUI === 'function') window.updateCartUI();
        if (typeof window.showNotification === 'function') {
            window.showNotification(`${product.name} ajouté au panier`, 'success');
        }
    }

    function renderProducts(rootId, category, emptyLabel, options = {}) {
        const root = document.getElementById(rootId);
        if (!root) return;

        const products = getProducts(category);
        if (!products.length) {
            root.innerHTML = `
                <div class="shop-empty-state">
                    <strong>${options.emptyTitle || 'Aucun produit publié'}</strong>
                    <p>${emptyLabel || 'Ajoutez vos produits depuis l\'espace administrateur.'}</p>
                </div>
            `;
            return;
        }

        root.innerHTML = products.map(product => renderProductCard(product, options)).join('');
        if ((options.mode || 'cart') === 'cart') {
            root.querySelectorAll('.shop-add-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const product = products.find(item => item.id === button.dataset.productId);
                    if (product) addProductToCart(product);
                });
            });
        }
    }

    function renderContactProducts(rootId, category, emptyLabel, options = {}) {
        renderProducts(rootId, category, emptyLabel, {
            ...options,
            mode: 'contact',
            subject: options.subject || category || 'produit'
        });
    }

    window.MacemayShop = {
        STORAGE_KEY,
        BOUTIQUE_CATEGORY,
        DEFAULT_PRODUCTS: cloneDefaults(),
        LEGACY_DEFAULT_IDS,
        ensureProductsSeeded,
        getAllProducts,
        saveAllProducts,
        getProducts,
        renderProducts,
        renderContactProducts,
        addProductToCart,
        formatPrice,
        isBoutiqueCategory
    };
})();
