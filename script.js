/* ============================================
   PLAQUE IMMATRICULATION PERSONNALISÉE
   JavaScript Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé - Initialisation...');
    try { initHeader(); } catch(e) { console.log('initHeader skipped'); }
    try { initMobileMenu(); } catch(e) { console.log('initMobileMenu skipped'); }
    try { initPlaquePreview(); } catch(e) { console.log('initPlaquePreview skipped'); }
    try { initQuantitySelector(); } catch(e) { console.log('initQuantitySelector skipped'); }
    try { initFAQ(); } catch(e) { console.log('initFAQ skipped'); }
    try { initBackToTop(); } catch(e) { console.log('initBackToTop skipped'); }
    try { initForms(); } catch(e) { console.log('initForms skipped'); }
    try { initCart(); } catch(e) { console.error('initCart error:', e); }
    try { initAnimations(); } catch(e) { console.log('initAnimations skipped'); }
    try { initHeroSlideshow(); } catch(e) { console.log('initHeroSlideshow skipped'); }
    try { initVehicleSelector(); } catch(e) { console.log('initVehicleSelector skipped'); }
    try { initConfiguratorWizard(); } catch(e) { console.log('initConfiguratorWizard skipped'); }
    try { initAdvancedPlateOptions(); } catch(e) { console.log('initAdvancedPlateOptions skipped'); }
    try { initWhatsAppFloat(); } catch(e) { console.log('initWhatsAppFloat skipped'); }
    console.log('Initialisation terminée');
});

/* ============================================
   FLOATING WHATSAPP
   ============================================ */
function initWhatsAppFloat() {
    if (document.getElementById('whatsappFloat')) return;

    const phone = '33615622975';
    const link = document.createElement('a');
    link.id = 'whatsappFloat';
    link.className = 'whatsapp-float';
    link.href = `https://wa.me/${phone}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Contacter Macemay custom sur WhatsApp');
    link.title = 'WhatsApp';
    link.innerHTML = `
        <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <path d="M16 3.2c-6.96 0-12.6 5.26-12.6 11.76 0 2.22.66 4.28 1.8 6.04l-1.42 6.06 6.42-1.52a13.2 13.2 0 0 0 5.8 1.28c6.96 0 12.6-5.26 12.6-11.76S22.96 3.2 16 3.2Zm0 21.28c-1.86 0-3.58-.5-5.04-1.38l-.36-.22-3.66.86.8-3.44-.24-.36a9.02 9.02 0 0 1-1.58-4.98c0-5.2 4.52-9.42 10.08-9.42s10.08 4.22 10.08 9.42-4.52 9.52-10.08 9.52Z" />
            <path d="M21.76 17.88c-.3-.14-1.76-.82-2.04-.92-.28-.1-.48-.14-.68.14-.2.28-.78.92-.96 1.1-.18.18-.36.2-.66.06-.3-.14-1.28-.44-2.44-1.4-.9-.76-1.5-1.7-1.68-1.98-.18-.28-.02-.44.14-.58.14-.14.3-.36.46-.54.16-.18.2-.3.3-.5.1-.18.06-.36-.02-.5-.08-.14-.68-1.54-.94-2.12-.24-.56-.5-.48-.68-.48h-.58c-.2 0-.52.08-.8.36-.28.28-1.04.96-1.04 2.36s1.06 2.74 1.2 2.94c.14.18 2.08 3 5.04 4.22.7.3 1.26.48 1.7.62.72.22 1.38.18 1.9.12.58-.08 1.76-.68 2.02-1.34.26-.66.26-1.22.18-1.34-.08-.12-.28-.2-.58-.34Z" />
        </svg>
        <span>WhatsApp</span>
    `;

    if (!document.getElementById('whatsapp-float-styles')) {
        const style = document.createElement('style');
        style.id = 'whatsapp-float-styles';
        style.textContent = `
            .whatsapp-float {
                position: fixed;
                right: 22px;
                bottom: 22px;
                z-index: 1600;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 58px;
                min-width: 58px;
                height: 58px;
                min-height: 58px;
                padding: 0;
                color: #ffffff;
                background: #25d366;
                border: 1px solid rgba(255, 255, 255, 0.22);
                border-radius: 999px;
                box-shadow: 0 16px 38px rgba(0, 0, 0, 0.32);
                font-size: 0.92rem;
                font-weight: 850;
                line-height: 1;
                text-decoration: none;
                transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
            }

            .whatsapp-float:hover,
            .whatsapp-float:focus-visible {
                color: #ffffff;
                background: #1fbd5a;
                transform: translateY(-2px);
                box-shadow: 0 20px 46px rgba(37, 211, 102, 0.32);
                outline: none;
            }

            .whatsapp-float svg {
                width: 27px;
                height: 27px;
                display: block;
                fill: currentColor;
                flex: 0 0 auto;
            }

            .whatsapp-float span {
                position: absolute;
                width: 1px;
                height: 1px;
                overflow: hidden;
                clip: rect(0 0 0 0);
                white-space: nowrap;
            }

            @media (max-width: 640px) {
                .whatsapp-float {
                    right: 16px;
                    bottom: 16px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(link);
}

/* ============================================
   HEADER & MOBILE MENU
   ============================================ */
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initMobileMenu() {
    const mobileMenuBtns = document.querySelectorAll('.mobile-menu-btn');

    mobileMenuBtns.forEach(mobileMenuBtn => {
        const header = mobileMenuBtn.closest('.header, .config-header');
        const navLinks = header ? header.querySelector('.nav-links, .config-header-nav') : null;

        if (!navLinks) return;

        mobileMenuBtn.setAttribute('aria-expanded', 'false');

        mobileMenuBtn.addEventListener('click', function() {
            const isOpen = navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active', isOpen);
            mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    });
}

function initPlaquePreview() {
    // Cette fonction est gérée par configurateur.js pour le configurateur
    // Pour la page d'accueil, on ne fait rien de spécial
    console.log('initPlaquePreview ready');
}

/* ============================================
   ADVANCED CONFIGURATOR (CENTRE / CÔTÉS / FOND / MESSAGE)
   ============================================ */
function initConfiguratorWizard() {
    const stepsRoot = document.getElementById('wizardSteps');
    const panels = Array.from(document.querySelectorAll('.config-panel'));
    const prevBtn = document.getElementById('wizardPrev');
    const nextBtn = document.getElementById('wizardNext');

    if (!stepsRoot || panels.length === 0 || !prevBtn || !nextBtn) return;

    const stepOrder = ['centre', 'cotes', 'fond', 'message'];
    let current = 'centre';

    const setStep = (step) => {
        if (!stepOrder.includes(step)) return;
        current = step;

        stepsRoot.querySelectorAll('.step-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.step === step);
        });

        panels.forEach(panel => {
            panel.classList.toggle('active', panel.dataset.panel === step);
        });

        const idx = stepOrder.indexOf(step);
        prevBtn.disabled = idx === 0;
        nextBtn.disabled = idx === stepOrder.length - 1;
    };

    stepsRoot.addEventListener('click', (e) => {
        const btn = e.target.closest('.step-item');
        if (!btn) return;
        setStep(btn.dataset.step);
    });

    prevBtn.addEventListener('click', () => {
        const idx = stepOrder.indexOf(current);
        setStep(stepOrder[Math.max(0, idx - 1)]);
    });

    nextBtn.addEventListener('click', () => {
        const idx = stepOrder.indexOf(current);
        setStep(stepOrder[Math.min(stepOrder.length - 1, idx + 1)]);
    });

    setStep('centre');
}

function initAdvancedPlateOptions() {
    const plaque = document.querySelector('.plaque-large');
    if (!plaque) return;

    // Defaults (safe even if only some controls exist)
    plaque.classList.add('plaque-font-oswald', 'plaque-bg-white', 'plaque-border-standard', 'plaque-corners-round');

    const leftBandMode = document.getElementById('leftBandMode');
    const rightBandMode = document.getElementById('rightBandMode');
    const plateBg = document.getElementById('plateBg');
    const plateBorder = document.getElementById('plateBorder');
    const plateFont = document.getElementById('plateFont');
    const plateMessage = document.getElementById('plateMessage');

    const dashMode = document.getElementById('dashMode');
    const caseMode = document.getElementById('caseMode');
    const letterSpacing = document.getElementById('letterSpacing');
    const plateSize = document.getElementById('plateSize');
    const plateCorners = document.getElementById('plateCorners');
    const plateFinish = document.getElementById('plateFinish');
    const platePattern = document.getElementById('platePattern');
    const leftCustom = document.getElementById('leftCustom');
    const rightCustom = document.getElementById('rightCustom');

    const leftEl = plaque.querySelector('.plaque-left');
    const rightEl = plaque.querySelector('.plaque-right');
    const leftDefault = document.getElementById('leftDefault');
    const rightDefault = document.getElementById('rightDefault');
    const leftCustomText = document.getElementById('leftCustomText');
    const rightCustomText = document.getElementById('rightCustomText');
    const leftTextGroup = document.getElementById('leftTextGroup');
    const rightTextGroup = document.getElementById('rightTextGroup');
    const leftTextInput = document.getElementById('leftText');
    const rightTextInput = document.getElementById('rightText');

    const deptInput = document.getElementById('departement');
    const vehicleTypeInput = document.getElementById('vehicleType');

    const messageInput = document.getElementById('messageLine');
    const messageEl = document.getElementById('plaqueMessage');

    const setExclusive = (root, selector, activeEl) => {
        if (!root) return;
        root.querySelectorAll(selector).forEach(el => el.classList.remove('active'));
        if (activeEl) activeEl.classList.add('active');
    };

    const applyLeftMode = (mode) => {
        if (!leftEl) return;
        if (mode === 'none') {
            leftEl.style.display = 'none';
            if (leftTextGroup) leftTextGroup.style.display = 'none';
            return;
        }

        leftEl.style.display = '';
        if (mode === 'text') {
            if (leftTextGroup) leftTextGroup.style.display = '';
            if (leftDefault) leftDefault.style.display = 'none';
            if (leftCustomText) leftCustomText.style.display = '';
            const t = (leftTextInput?.value || '').trim().toUpperCase();
            if (leftCustomText) leftCustomText.textContent = t || 'FR';
            if (leftCustom) leftCustom.value = t;
        } else {
            if (leftTextGroup) leftTextGroup.style.display = 'none';
            if (leftDefault) leftDefault.style.display = '';
            if (leftCustomText) leftCustomText.style.display = 'none';
        }
    };

    const applyRightMode = (mode) => {
        if (!rightEl) return;
        if (mode === 'none') {
            rightEl.style.display = 'none';
            if (rightTextGroup) rightTextGroup.style.display = 'none';
            if (deptInput && vehicleTypeInput?.value === 'deco') deptInput.required = false;
            return;
        }

        rightEl.style.display = '';
        if (mode === 'text') {
            if (rightTextGroup) rightTextGroup.style.display = '';
            if (rightDefault) rightDefault.style.display = 'none';
            if (rightCustomText) rightCustomText.style.display = '';
            const t = (rightTextInput?.value || '').trim().toUpperCase();
            if (rightCustomText) rightCustomText.textContent = t || 'PARIS';
            if (rightCustom) rightCustom.value = t;
            if (deptInput && vehicleTypeInput?.value === 'deco') deptInput.required = false;
        } else {
            if (rightTextGroup) rightTextGroup.style.display = 'none';
            if (rightDefault) rightDefault.style.display = '';
            if (rightCustomText) rightCustomText.style.display = 'none';
            if (deptInput) deptInput.required = true;
        }
    };

    // Font
    document.querySelectorAll('[data-font]').forEach(btn => {
        btn.addEventListener('click', () => {
            const font = btn.dataset.font;
            const group = btn.closest('.segmented');
            if (group) setExclusive(group, '.segmented-btn', btn);
            plaque.classList.remove('plaque-font-oswald', 'plaque-font-inter');
            plaque.classList.add(font === 'inter' ? 'plaque-font-inter' : 'plaque-font-oswald');
            if (plateFont) plateFont.value = font;
        });
    });

    // Dashes
    document.querySelectorAll('[data-dash]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.dash;
            const group = btn.closest('.segmented');
            if (group) setExclusive(group, '.segmented-btn', btn);
            if (dashMode) dashMode.value = mode;
            document.getElementById('immatriculation')?.dispatchEvent(new Event('input', { bubbles: true }));
        });
    });

    // Case
    document.querySelectorAll('[data-case]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.case;
            const group = btn.closest('.segmented');
            if (group) setExclusive(group, '.segmented-btn', btn);
            if (caseMode) caseMode.value = mode;
            document.getElementById('immatriculation')?.dispatchEvent(new Event('input', { bubbles: true }));
        });
    });

    // Spacing
    document.querySelectorAll('[data-spacing]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.spacing;
            const group = btn.closest('.segmented');
            if (group) setExclusive(group, '.segmented-btn', btn);
            plaque.classList.toggle('plaque-spacing-wide', mode === 'wide');
            if (letterSpacing) letterSpacing.value = mode;
        });
    });

    // Size
    document.querySelectorAll('[data-size]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.size;
            const group = btn.closest('.segmented');
            if (group) setExclusive(group, '.segmented-btn', btn);
            plaque.classList.toggle('plaque-size-large', mode === 'large');
            if (plateSize) plateSize.value = mode;
        });
    });

    // Left band
    document.querySelectorAll('[data-left]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.left;
            const group = btn.closest('.segmented');
            if (group) setExclusive(group, '.segmented-btn', btn);
            if (leftBandMode) leftBandMode.value = mode;
            applyLeftMode(mode);
        });
    });

    leftTextInput?.addEventListener('input', () => {
        if ((leftBandMode?.value || 'eu') === 'text') applyLeftMode('text');
    });

    // Right band
    document.querySelectorAll('[data-right]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.right;
            const group = btn.closest('.segmented');
            if (group) setExclusive(group, '.segmented-btn', btn);
            if (rightBandMode) rightBandMode.value = mode;
            applyRightMode(mode);
        });
    });

    rightTextInput?.addEventListener('input', () => {
        if ((rightBandMode?.value || 'dept') === 'text') applyRightMode('text');
    });

    // Background
    document.querySelectorAll('#bgSelector .color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const bg = btn.dataset.bg;
            const root = document.getElementById('bgSelector');
            root?.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            plaque.classList.remove('plaque-bg-white', 'plaque-bg-gray', 'plaque-bg-black', 'plaque-bg-yellow', 'plaque-bg-primary');
            plaque.classList.add(`plaque-bg-${bg}`);
            if (plateBg) plateBg.value = bg;
        });
    });

    // Pattern
    document.querySelectorAll('[data-pattern]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.pattern;
            const group = btn.closest('.segmented');
            if (group) setExclusive(group, '.segmented-btn', btn);
            plaque.classList.toggle('plaque-pattern-carbon', mode === 'carbon');
            if (platePattern) platePattern.value = mode;
        });
    });

    // Finish
    document.querySelectorAll('[data-finish]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.finish;
            const group = btn.closest('.segmented');
            if (group) setExclusive(group, '.segmented-btn', btn);
            plaque.classList.toggle('plaque-finish-glossy', mode === 'glossy');
            if (plateFinish) plateFinish.value = mode;
        });
    });

    // Border
    document.querySelectorAll('[data-border]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.border;
            const group = btn.closest('.segmented');
            if (group) setExclusive(group, '.segmented-btn', btn);
            plaque.classList.remove('plaque-border-standard', 'plaque-border-thin', 'plaque-border-none');
            plaque.classList.add(`plaque-border-${mode}`);
            if (plateBorder) plateBorder.value = mode;
        });
    });

    // Corners
    document.querySelectorAll('[data-corner]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.corner;
            const group = btn.closest('.segmented');
            if (group) setExclusive(group, '.segmented-btn', btn);
            plaque.classList.remove('plaque-corners-round', 'plaque-corners-square');
            plaque.classList.add(mode === 'square' ? 'plaque-corners-square' : 'plaque-corners-round');
            if (plateCorners) plateCorners.value = mode;
        });
    });

    // Message
    const applyMessage = () => {
        if (!messageEl) return;
        const raw = (messageInput?.value || '').trim();
        const visibility = document.querySelector('[data-message-visibility].active')?.dataset.messageVisibility || 'show';
        messageEl.textContent = raw;
        messageEl.style.display = (raw && visibility === 'show') ? '' : 'none';
        if (plateMessage) plateMessage.value = raw;
    };

    messageInput?.addEventListener('input', applyMessage);
    document.querySelectorAll('[data-message-visibility]').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.closest('.segmented');
            if (group) setExclusive(group, '.segmented-btn', btn);
            applyMessage();
        });
    });

    // Initial state
    applyLeftMode(leftBandMode?.value || 'eu');
    applyRightMode(rightBandMode?.value || 'dept');
    applyMessage();
}

/* ============================================
   VEHICLE SELECTOR & CONFIGURATOR
   ============================================ */
function initVehicleSelector() {
    const options = Array.from(document.querySelectorAll('.vehicle-option'));
    if (options.length === 0) return;

    const plaqueContainer = document.querySelector('.plaque-large');
    const immatInput = document.getElementById('immatriculation');
    const immatHint = document.getElementById('immatHint');
    const vehicleTypeInput = document.getElementById('vehicleType');

    const decoOptions = document.getElementById('decoOptions');
    const decoColorOptions = decoOptions ? Array.from(decoOptions.querySelectorAll('.color-option[data-color]')) : [];

    const deptInput = document.getElementById('departement');
    const rightModeInput = document.getElementById('rightBandMode');

    const applyType = (type) => {
        if (vehicleTypeInput) vehicleTypeInput.value = type;
        options.forEach(opt => opt.classList.toggle('active', opt.dataset.type === type));
        plaqueContainer?.classList.toggle('moto', type === 'moto');

        if (decoOptions) {
            decoOptions.style.display = type === 'deco' ? '' : 'none';
        }

        if (immatInput && immatHint) {
            if (type === 'moto') {
                immatInput.placeholder = 'AA-123-AA';
                immatHint.textContent = 'Format Moto: AA-123-AA';
                immatInput.maxLength = 9;
            } else if (type === 'deco') {
                immatInput.placeholder = 'TEXTE LIBRE';
                immatHint.textContent = 'Texte libre (max 10 car.)';
                immatInput.maxLength = 10;
            } else {
                immatInput.placeholder = 'AB-123-CD';
                immatHint.textContent = 'Format: AB-123-CD';
                immatInput.maxLength = 9;
            }
        }

        // Déco: département optionnel sauf si côté droit = dept
        if (deptInput) {
            const rightMode = rightModeInput?.value || 'dept';
            deptInput.required = !(type === 'deco' && rightMode !== 'dept');
        }

        immatInput?.dispatchEvent(new Event('input', { bubbles: true }));
        deptInput?.dispatchEvent(new Event('input', { bubbles: true }));
    };

    options.forEach(option => {
        option.addEventListener('click', () => applyType(option.dataset.type));
        option.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                applyType(option.dataset.type);
            }
        });
    });

    // Accueil : options couleur Déco (legacy)
    if (decoColorOptions.length > 0 && plaqueContainer) {
        decoColorOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                decoColorOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');

                const color = opt.dataset.color;
                plaqueContainer.classList.remove('black', 'yellow');
                if (color && color !== 'white') plaqueContainer.classList.add(color);
            });
        });
    }

    const initialType = vehicleTypeInput?.value || options.find(o => o.classList.contains('active'))?.dataset.type || options[0]?.dataset.type;
    if (initialType) applyType(initialType);
}

/* ============================================
   HERO SLIDESHOW
   ============================================ */
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-bg-img');
    if (!slides || slides.length < 2) {
        console.log('Hero slideshow: pas assez d\'images trouvées', slides.length);
        return;
    }
    
    console.log('Hero slideshow initialisé avec', slides.length, 'images');
    let currentSlide = 0;
    
    // S'assurer que la première image est active
    slides.forEach((slide, i) => {
        if (i === 0) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        console.log('Slide changé vers:', currentSlide + 1);
    }, 5000); // Change every 5 seconds
}

/* ============================================
   CART LOGIC
   ============================================ */
const CART_STORAGE_KEY = 'cart';
const ORDERS_STORAGE_KEY = 'macemay_orders';
let cart = readStorageArray(CART_STORAGE_KEY);

function readStorageArray(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(value) ? value : [];
    } catch (error) {
        console.warn(`Storage invalide pour ${key}`, error);
        return [];
    }
}

function syncCartFromStorage() {
    cart = readStorageArray(CART_STORAGE_KEY);
    return cart;
}

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

const NON_PAYABLE_CART_MESSAGE = 'Seules les plaques sont payables en ligne. Pour les accessoires, le floquage ou le textile, contactez le vendeur.';

function isOnlinePayableItem(item) {
    if (!item || typeof item !== 'object') return false;
    if (item.type === 'plaque') return true;
    return Boolean(item.immatriculation || item.details?.immat || item.details?.formatPlaque);
}

function getNonPayableCartItems() {
    return cart.filter(item => !isOnlinePayableItem(item));
}

function hasOnlyPayableItems() {
    return cart.length > 0 && getNonPayableCartItems().length === 0;
}

function initCart() {
    updateCartUI();
    
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            syncCartFromStorage();
            if (cart.length === 0) {
                showNotification('Votre panier est vide', 'error');
                return;
            }
            if (!hasOnlyPayableItems()) {
                showNotification(NON_PAYABLE_CART_MESSAGE, 'error');
                return;
            }
            closeCart();
            openPaymentModal();
        });
    }
}

function openCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartDrawer) cartDrawer.classList.add('active');
    if (cartOverlay) cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartDrawer) cartDrawer.classList.remove('active');
    if (cartOverlay) cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function updateCartUI() {
    syncCartFromStorage();
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.querySelector('.cart-count');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart-message">Votre panier est vide</div>';
        if (cartTotal) cartTotal.textContent = '0,00€';
        if (cartCount) cartCount.textContent = '0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const title = item.name || (item.type === 'textile'
            ? 'Article floqué'
            : item.type === 'accessoire'
                ? 'Accessoire'
                : item.type === 'deco'
                    ? 'Plaque Déco'
                    : item.type === 'moto'
                        ? 'Plaque Moto'
                        : item.type === '4x4'
                            ? 'Plaque SUV'
                            : 'Plaque Auto');
        const details = item.immatriculation
            ? `${item.immatriculation}${item.departement ? ` - Dépt ${item.departement}` : ''}`
            : item.details?.immat
                ? `${item.details.immat}${item.details.dept ? ` - Dépt ${item.details.dept}` : ''}`
                : (item.details?.tag || item.details?.category || item.details?.format || 'Produit boutique');
        const plateMessage = item.details?.message || item.message || '';
        const adminMessage = item.details?.decorAdminMessage || '';
        
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-title">${escapeHTML(title)}</div>
                    <div class="cart-item-details">${escapeHTML(details)}</div>
                    ${plateMessage ? `<div class="cart-item-details">Message plaque: ${escapeHTML(plateMessage)}</div>` : ''}
                    ${adminMessage ? `<div class="cart-item-details">Message atelier: ${escapeHTML(adminMessage)}</div>` : ''}
                    <div class="cart-item-qty">Qté: ${escapeHTML(item.quantity)}</div>
                </div>
                <div class="cart-item-price">${itemTotal.toFixed(2).replace('.', ',')}€</div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">&times;</button>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    if (cartTotal) cartTotal.textContent = total.toFixed(2).replace('.', ',') + '€';
    if (cartCount) cartCount.textContent = cart.length.toString();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
    showNotification('Article retiré du panier', 'success');
}

// Global addToCart for configurateur.js
window.addToCart = function(item) {
    if (!isOnlinePayableItem(item)) {
        showNotification('Cet article se commande en contactant le vendeur.', 'info');
        return;
    }

    syncCartFromStorage();
    cart.push(item);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
    showNotification('Article ajouté au panier !', 'success');
};

window.updateCartUI = updateCartUI;

function updatePlaqueWithAnimation(element, newValue) {
    if (!element) return;
    
    // If element is empty or has simple text, clear it
    if (element.children.length === 0 && element.textContent.trim() === '') {
        element.innerHTML = '';
    }
    
    // Convert current DOM to string for comparison (simplified)
    const currentText = element.textContent;
    
    // If length is different, rebuild everything (simpler for dashes handling)
    if (currentText.length !== newValue.length) {
        element.innerHTML = '';
        newValue.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'char-animate';
            span.style.animationDelay = `${index * 0.05}s`;
            element.appendChild(span);
        });
        return;
    }
    
    // Diff update
    const chars = newValue.split('');
    const existingSpans = element.children;
    
    if (existingSpans.length === 0) {
         // First init
         element.innerHTML = '';
         chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'char-animate';
            element.appendChild(span);
        });
        return;
    }

    chars.forEach((char, index) => {
        if (existingSpans[index]) {
            if (existingSpans[index].textContent !== char) {
                existingSpans[index].textContent = char;
                // Trigger reflow for animation restart
                existingSpans[index].classList.remove('char-pop');
                void existingSpans[index].offsetWidth;
                existingSpans[index].classList.add('char-pop');
            }
        } else {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'char-animate';
            element.appendChild(span);
        }
    });
}

/* ============================================
   QUANTITY SELECTOR
   ============================================ */
function initQuantitySelector() {
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const quantityInput = document.getElementById('quantity');
    const totalPrice = document.getElementById('totalPrice');
    const unitPrice = 15.90;
    
    function updateTotal() {
        const qty = parseInt(quantityInput.value) || 1;
        const total = (qty * unitPrice).toFixed(2).replace('.', ',');
        if (totalPrice) totalPrice.textContent = total + '€';
    }
    
    if (qtyMinus && qtyPlus && quantityInput) {
        qtyMinus.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
                updateTotal();
            }
        });
        
        qtyPlus.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue < 10) {
                quantityInput.value = currentValue + 1;
                updateTotal();
            }
        });
        
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value) || 1;
            if (value < 1) value = 1;
            if (value > 10) value = 10;
            this.value = value;
            updateTotal();
        });
    }
}

/* ============================================
   FAQ ACCORDION
   ============================================ */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/* ============================================
   FORM HANDLING
   ============================================ */
function initForms() {
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const vehicleType = document.getElementById('vehicleType').value;
            const immatriculation = document.getElementById('immatriculation').value;
            const departement = document.getElementById('departement').value;
            const textePerso = document.getElementById('textePerso').value;
            const leftBandMode = document.getElementById('leftBandMode')?.value;
            const rightBandMode = document.getElementById('rightBandMode')?.value;
            const bg = document.getElementById('plateBg')?.value;
            const border = document.getElementById('plateBorder')?.value;
            const font = document.getElementById('plateFont')?.value;
            const message = document.getElementById('plateMessage')?.value || document.getElementById('messageLine')?.value;
            const dashMode = document.getElementById('dashMode')?.value;
            const caseMode = document.getElementById('caseMode')?.value;
            const letterSpacing = document.getElementById('letterSpacing')?.value;
            const plateSize = document.getElementById('plateSize')?.value;
            const plateCorners = document.getElementById('plateCorners')?.value;
            const plateFinish = document.getElementById('plateFinish')?.value;
            const platePattern = document.getElementById('platePattern')?.value;
            const leftCustom = document.getElementById('leftCustom')?.value;
            const rightCustom = document.getElementById('rightCustom')?.value;
            const messageVisibility = document.querySelector('[data-message-visibility].active')?.dataset.messageVisibility;
            
            // Validation only for Auto/Moto
            if (vehicleType !== 'deco') {
                const immatRegexDash = /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/;
                const immatRegexNoDash = /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/;
                if (!immatRegexDash.test(immatriculation) && !immatRegexNoDash.test(immatriculation)) {
                    showNotification('Veuillez entrer un numéro d\'immatriculation valide (format: AB-123-CD)', 'error');
                    return;
                }
                
                const deptNum = parseInt(departement);
                if (isNaN(deptNum) || deptNum < 1 || (deptNum > 95 && deptNum < 971) || deptNum > 976) {
                    showNotification('Veuillez entrer un numéro de département valide', 'error');
                    return;
                }
            }
            
            // Backward-compatible color (older selector)
            let color = bg || 'white';
            
            // Add to Cart
            const item = {
                type: vehicleType,
                immatriculation: immatriculation,
                departement: departement,
                textePerso: textePerso,
                color: color,
                leftBandMode: leftBandMode,
                rightBandMode: rightBandMode,
                bg: bg,
                border: border,
                font: font,
                message: message,
                dashMode: dashMode,
                caseMode: caseMode,
                letterSpacing: letterSpacing,
                plateSize: plateSize,
                plateCorners: plateCorners,
                plateFinish: plateFinish,
                platePattern: platePattern,
                leftCustom: leftCustom,
                rightCustom: rightCustom,
                messageVisibility: messageVisibility,
                quantity: parseInt(document.getElementById('quantity').value),
                price: 15.90,
                deptLogo: document.getElementById('deptLogo').textContent
            };
            
            addToCart(item);
        });
    }
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Message envoyé avec succès ! Nous vous répondrons rapidement.', 'success');
            contactForm.reset();
        });
    }
    
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Inscription réussie ! Merci de votre confiance.', 'success');
            this.reset();
        });
    }
    
    // Initialize Modal Events
    const modal = document.getElementById('paymentModal');
    const closeBtn = document.querySelector('.close-modal');
    if (modal && closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
}

/* ============================================
   PAYMENT MODAL & MOLLIE
   ============================================ */

function openPaymentModal() {
    syncCartFromStorage();
    const modal = document.getElementById('paymentModal');
    if (!hasOnlyPayableItems()) {
        showNotification(NON_PAYABLE_CART_MESSAGE, 'error');
        return;
    }
    
    // Calculate total from cart
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalString = totalAmount.toFixed(2).replace('.', ',') + '€';
    
    // Generate summary HTML
    let summaryHTML = '';
    cart.forEach(item => {
        const label = item.name || item.immatriculation || 'Article boutique';
        const detail = item.departement ? ` - Dépt ${item.departement}` : '';
        summaryHTML += `<p><strong>${escapeHTML(label)}</strong> (x${escapeHTML(item.quantity)})${escapeHTML(detail)}</p>`;
    });
    
    // Update Modal Content
    const summaryContainer = document.querySelector('.order-summary');
    summaryContainer.innerHTML = `
        <h3>Récapitulatif de la commande</h3>
        <div class="summary-items">
            ${summaryHTML}
        </div>
        <p class="summary-total">Total à payer: <span id="summaryTotal">${totalString}</span></p>
    `;
    
    modal.style.display = "flex";
    
    const container = document.getElementById('mollie-payment-container');
    if (container) renderMolliePaymentButton(container, totalString);
}

function saveCompletedOrder(paymentData, paymentDetails) {
    const cartSnapshot = JSON.parse(JSON.stringify(cart));
    const previousCartStorage = localStorage.getItem(CART_STORAGE_KEY);
    const totalAmount = cartSnapshot.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
    const payer = paymentDetails?.payer || {};
    const payerName = [payer.name?.given_name, payer.name?.surname].filter(Boolean).join(' ');
    const orderId = paymentData?.orderId || paymentData?.orderID || paymentData?.id || paymentDetails?.id || `CMD-${Date.now()}`;
    const paymentId = paymentData?.paymentId || paymentData?.id || paymentData?.orderID || paymentDetails?.id || '';
    const order = {
        id: orderId,
        date: new Date().toISOString(),
        status: paymentDetails?.status || 'paid',
        paymentProvider: paymentDetails?.paymentProvider || 'Mollie',
        paymentId,
        payerName,
        payerEmail: payer.email_address || '',
        total: totalAmount,
        items: cartSnapshot
    };

    try {
        localStorage.removeItem(CART_STORAGE_KEY);
        const orders = readStorageArray(ORDERS_STORAGE_KEY);
        orders.unshift(order);
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
        return true;
    } catch (error) {
        console.error('Commande non enregistrée', error);
        if (previousCartStorage) localStorage.setItem(CART_STORAGE_KEY, previousCartStorage);
        return false;
    }
}

function renderMolliePaymentButton(container, totalPriceString) {
    container.innerHTML = `
        <button type="button" class="btn btn-primary btn-large mollie-pay-btn" id="molliePayBtn">
            Payer ${escapeHTML(totalPriceString)} avec Mollie
        </button>
        <p class="payment-secure-copy">Carte bancaire et moyens de paiement activés dans Mollie.</p>
    `;

    const button = container.querySelector('#molliePayBtn');
    if (button) button.addEventListener('click', () => startMolliePayment(button));
}

async function startMolliePayment(button) {
    syncCartFromStorage();
    if (!cart.length) {
        showNotification('Votre panier est vide', 'error');
        return;
    }
    if (!hasOnlyPayableItems()) {
        showNotification(NON_PAYABLE_CART_MESSAGE, 'error');
        return;
    }

    const config = window.MACEMAY_CONFIG || {};
    const endpoint = config.mollieCreatePaymentUrl || 'api/create-mollie-payment.php';
    const previousText = button.textContent;
    button.disabled = true;
    button.textContent = 'Redirection vers le paiement...';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart })
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.checkoutUrl) {
            throw new Error(data.error || 'Paiement Mollie indisponible');
        }

        localStorage.setItem('macemay_pending_mollie_order', JSON.stringify({
            orderId: data.orderId,
            paymentId: data.paymentId,
            createdAt: new Date().toISOString()
        }));
        window.location.href = data.checkoutUrl;
    } catch (error) {
        console.error(error);
        button.disabled = false;
        button.textContent = previousText;
        showNotification('Le paiement Mollie est indisponible pour le moment.', 'error');
    }
}

/* ============================================
   NOTIFICATIONS
   ============================================ */
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        z-index: 10000;
        padding: 16px 20px;
        background: ${bgColor};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .notification-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: rgba(255,255,255,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                opacity: 0.7;
            }
            .notification-close:hover { opacity: 1; }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    const animateElements = document.querySelectorAll('.feature-card, .faq-item, .contact-item');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}
