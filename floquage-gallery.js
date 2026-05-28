/* ======================================================================
   Macemay custom - galerie floquage admin
   ====================================================================== */
(function() {
    'use strict';

    const STORAGE_KEY = 'realisations';

    function escapeHTML(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function readRealisations() {
        try {
            const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            return Array.isArray(value) ? value : [];
        } catch (error) {
            console.warn('Galerie floquage illisible', error);
            return [];
        }
    }

    function normalizeRealisation(item) {
        const name = item.name || item.title || 'Réalisation floquage';
        return {
            title: item.title || String(name).replace(/\.[^.]+$/, '') || 'Réalisation floquage',
            support: item.support || 'Floquage',
            desc: item.desc || item.description || '',
            data: item.data || item.imageData || '',
            active: item.active !== false
        };
    }

    function renderGallery() {
        const grid = document.querySelector('.textile-realization-grid');
        if (!grid) return;

        const realisations = readRealisations()
            .map(normalizeRealisation)
            .filter(item => item.active && item.data);

        if (!realisations.length) return;

        grid.innerHTML = realisations.map(item => `
            <article class="textile-realization-card">
                <div class="textile-realization-media textile-realization-photo">
                    <img src="${escapeHTML(item.data)}" alt="${escapeHTML(item.title)}">
                </div>
                <div class="textile-realization-body">
                    <span>${escapeHTML(item.support)}</span>
                    <h3>${escapeHTML(item.title)}</h3>
                    <p>${escapeHTML(item.desc || 'Réalisation floquage Macemay custom.')}</p>
                </div>
            </article>
        `).join('');
    }

    document.addEventListener('DOMContentLoaded', renderGallery);
})();
