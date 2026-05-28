/* Bannière cookies RGPD - vanilla JS */
(function() {
    'use strict';
    const KEY = 'cookieConsent';
    if (localStorage.getItem(KEY)) return;

    document.addEventListener('DOMContentLoaded', () => {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-banner-inner">
                <div class="cookie-banner-text">
                    <strong>🍪 Cookies & confidentialité</strong>
                    <p>Nous utilisons des cookies pour améliorer votre expérience, mesurer l'audience et personnaliser le contenu. Vous pouvez accepter, refuser ou personnaliser vos préférences.</p>
                </div>
                <div class="cookie-banner-actions">
                    <button type="button" class="cookie-btn cookie-btn-reject" data-action="reject">Refuser</button>
                    <button type="button" class="cookie-btn cookie-btn-accept" data-action="accept">Tout accepter</button>
                </div>
            </div>
        `;
        const style = document.createElement('style');
        style.textContent = `
            #cookie-banner {
                position: fixed; bottom: 0; left: 0; right: 0;
                background: #fff; box-shadow: 0 -4px 24px rgba(0,0,0,.15);
                z-index: 9999; padding: 20px; border-top: 3px solid #c9a227;
                animation: slideUp .4s ease-out;
            }
            @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
            .cookie-banner-inner {
                max-width: 1200px; margin: 0 auto;
                display: flex; gap: 24px; align-items: center; flex-wrap: wrap;
            }
            .cookie-banner-text { flex: 1; min-width: 280px; }
            .cookie-banner-text strong { display: block; margin-bottom: 6px; color: #1a1a2e; font-size: 1.05rem; }
            .cookie-banner-text p { margin: 0; font-size: .92rem; color: #4a5568; line-height: 1.5; }
            .cookie-banner-actions { display: flex; gap: 10px; flex-wrap: wrap; }
            .cookie-btn {
                padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;
                border: none; font-size: .95rem; transition: all .2s;
            }
            .cookie-btn-accept { background: #c9a227; color: #fff; }
            .cookie-btn-accept:hover { background: #b8911c; }
            .cookie-btn-reject { background: transparent; color: #4a5568; border: 1.5px solid #cbd5e0; }
            .cookie-btn-reject:hover { background: #f7fafc; }
            @media (max-width: 640px) {
                .cookie-banner-actions { width: 100%; }
                .cookie-btn { flex: 1; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(banner);

        banner.querySelectorAll('[data-action]').forEach(b => {
            b.addEventListener('click', () => {
                localStorage.setItem(KEY, b.dataset.action);
                banner.style.animation = 'slideUp .3s reverse';
                setTimeout(() => banner.remove(), 300);
            });
        });
    });
})();
