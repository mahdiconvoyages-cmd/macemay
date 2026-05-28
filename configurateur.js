/* ============================================
   CONFIGURATEUR WIZARD - JavaScript 4 étapes
   ============================================ */

(function() {
    'use strict';

    /* ---------- CONSTANTES PRIX ---------- */
    const PRICES = {
        auto: 15.90,
        moto: 15.90,
        '4x4': 19.90,
        usa: 19.90,
        ww: 15.90,
        wgarage: 15.90
    };
    const CONTOUR_EXTRA = 2.00;
    const RIVETS_UNIT_PRICE = 1.50;
    const FONT_EXTRA = { officiel: 0 };
    const TOTAL_STEPS = 4;
    const FORMAT_LABELS = { auto: 'Auto', moto: 'Moto', '4x4': 'SUV', usa: 'Collection noire', ww: 'Provisoire WW', wgarage: 'W garage' };
    const FORMAT_SIZES = { auto: '520 × 110 mm', moto: '210 × 130 mm', '4x4': '275 × 200 mm', usa: 'Look rétro', ww: '520 × 110 mm', wgarage: '520 × 110 mm' };
    const DECOR_FORMAT_LABELS = { auto: 'auto', moto: 'moto', '4x4': '4×4', usa: 'USA' };
    const PROVISIONAL_DEFAULTS = { ww: 'WW-123-AA', wgarage: 'W-123-AA' };
    const PRODUCT_LABELS = {
        auto: 'Plaque Auto Plexiglas',
        moto: 'Plaque Moto Plexiglas',
        '4x4': 'Plaque SUV Plexiglas',
        usa: 'Plaque collection noire',
        ww: 'Plaque provisoire WW',
        wgarage: 'Plaque W garage'
    };
    const CAR_LOGO_LABELS = {
        none: 'Logo régional SIV',
        peugeot: 'Peugeot',
        renault: 'Renault',
        citroen: 'Citroën',
        audi: 'Audi',
        bmw: 'BMW',
        mercedes: 'Mercedes',
        volkswagen: 'Volkswagen',
        porsche: 'Porsche',
        tesla: 'Tesla',
        toyota: 'Toyota',
        ford: 'Ford',
        opel: 'Opel',
        fiat: 'Fiat',
        nissan: 'Nissan',
        honda: 'Honda',
        'alfa-romeo': 'Alfa Romeo',
        alpine: 'Alpine',
        ferrari: 'Ferrari',
        custom: 'Logo personnalisé'
    };
    const IMMAT_MODE_LABELS = {
        siv: 'Format actuel SIV',
        fni: 'Ancien format FNI'
    };

    /* ---------- STATE ---------- */
    const state = {
        step: 1,
        format: 'auto',        // auto | moto | 4x4 | usa (collection noire)
        homolog: 'yes',        // yes | no
        decorativeUsa: false,
        immatMode: 'siv',      // siv | fni
        immat: '',
        font: 'officiel',      // officiel | classic | italic
        dept: '75',
        deptName: 'Paris',
        regionName: 'Île-de-France',
        euBand: 'yes',
        carLogo: 'none',       // none | peugeot | renault | citroen | audi | bmw | ... | custom
        customCarLogoText: '', // Texte libre si carLogo === 'custom'
        message: '',
        decorImageData: '',
        decorImageName: '',
        decorAdminMessage: '',
        contour: 'none',       // none | int | ext
        contourColor: '#c9a227',
        rivets: false,
        quantity: 1,
        previewBg: 'dark',
        enable3D: false,
        formatLocked: true,
        homologLocked: true
    };

    /* ---------- RÉGIONS / DÉPARTEMENTS ---------- */
    const REGIONS = {
        'aura': { name: 'Auvergne-Rhône-Alpes', short: 'ARA', img: 'images/regions/aura.svg', colors: ['#0f5e9c', '#f4c542'], motif: 'mountain' },
        'bfc':  { name: 'Bourgogne-Franche-Comté', short: 'BFC', img: 'images/regions/bfc.svg', colors: ['#7a1f31', '#f0c36a'], motif: 'vine' },
        'bre':  { name: 'Bretagne', short: 'BRE', img: 'images/regions/bre.svg', colors: ['#111827', '#ffffff'], motif: 'waves' },
        'cvl':  { name: 'Centre-Val de Loire', short: 'CVL', img: 'images/regions/cvl.svg', colors: ['#126b4f', '#d8b45a'], motif: 'leaf' },
        'cor':  { name: 'Corse', short: 'COR', img: 'images/regions/cor.svg', colors: ['#ffffff', '#111827'], motif: 'island' },
        'ges':  { name: 'Grand Est', short: 'GES', img: 'images/regions/ges.svg', colors: ['#0b5b8e', '#e23b3b'], motif: 'spark' },
        'hdf':  { name: 'Hauts-de-France', short: 'HDF', img: 'images/regions/hdf.svg', colors: ['#2f5fa8', '#78b843'], motif: 'field' },
        'idf':  { name: 'Île-de-France', short: 'IDF', img: 'images/regions/idf.svg', colors: ['#1f4ea8', '#d7263d'], motif: 'star' },
        'nor':  { name: 'Normandie', short: 'NOR', img: 'images/regions/nor.svg', colors: ['#c21f32', '#f0c36a'], motif: 'lion' },
        'naq':  { name: 'Nouvelle-Aquitaine', short: 'NAQ', img: 'images/regions/naq.svg', colors: ['#8b2f6f', '#4fa3a5'], motif: 'wave' },
        'occ':  { name: 'Occitanie', short: 'OCC', img: 'images/regions/occ.svg', colors: ['#c61d42', '#f2b84b'], motif: 'cross' },
        'pdl':  { name: 'Pays de la Loire', short: 'PDL', img: 'images/regions/pdl.svg', colors: ['#007f8c', '#f2c14e'], motif: 'river' },
        'pac':  { name: 'Provence-Alpes-Côte d’Azur', short: 'PAC', img: 'images/regions/pac.svg', colors: ['#0067b1', '#f5a623'], motif: 'sun' },
        'gua':  { name: 'Guadeloupe', short: '971', img: 'images/regions/gua.svg', colors: ['#0f766e', '#facc15'], motif: 'sun' },
        'mar':  { name: 'Martinique', short: '972', img: 'images/regions/mar.svg', colors: ['#2563eb', '#ffffff'], motif: 'waves' },
        'guy':  { name: 'Guyane', short: '973', img: 'images/regions/guy.svg', colors: ['#15803d', '#facc15'], motif: 'leaf' },
        'reu':  { name: 'La Réunion', short: '974', img: 'images/regions/reu.svg', colors: ['#ea580c', '#2563eb'], motif: 'mountain' },
        'may':  { name: 'Mayotte', short: '976', img: 'images/regions/may.svg', colors: ['#0284c7', '#facc15'], motif: 'wave' }
    };

    const DEPT_TO_REGION = {
        '01':'aura','03':'aura','07':'aura','15':'aura','26':'aura','38':'aura','42':'aura','43':'aura','63':'aura','69':'aura','73':'aura','74':'aura',
        '21':'bfc','25':'bfc','39':'bfc','58':'bfc','70':'bfc','71':'bfc','89':'bfc','90':'bfc',
        '22':'bre','29':'bre','35':'bre','56':'bre',
        '18':'cvl','28':'cvl','36':'cvl','37':'cvl','41':'cvl','45':'cvl',
        '2A':'cor','2B':'cor','20':'cor',
        '08':'ges','10':'ges','51':'ges','52':'ges','54':'ges','55':'ges','57':'ges','67':'ges','68':'ges','88':'ges',
        '02':'hdf','59':'hdf','60':'hdf','62':'hdf','80':'hdf',
        '75':'idf','77':'idf','78':'idf','91':'idf','92':'idf','93':'idf','94':'idf','95':'idf',
        '14':'nor','27':'nor','50':'nor','61':'nor','76':'nor',
        '16':'naq','17':'naq','19':'naq','23':'naq','24':'naq','33':'naq','40':'naq','47':'naq','64':'naq','79':'naq','86':'naq','87':'naq',
        '09':'occ','11':'occ','12':'occ','30':'occ','31':'occ','32':'occ','34':'occ','46':'occ','48':'occ','65':'occ','66':'occ','81':'occ','82':'occ',
        '44':'pdl','49':'pdl','53':'pdl','72':'pdl','85':'pdl',
        '04':'pac','05':'pac','06':'pac','13':'pac','83':'pac','84':'pac',
        '971':'gua','972':'mar','973':'guy','974':'reu','976':'may'
    };

    const DEPT_DATA = {
        '01':'Ain','02':'Aisne','03':'Allier','04':'Alpes-de-Haute-Provence','05':'Hautes-Alpes','06':'Alpes-Maritimes',
        '07':'Ardèche','08':'Ardennes','09':'Ariège','10':'Aube','11':'Aude','12':'Aveyron','13':'Bouches-du-Rhône',
        '14':'Calvados','15':'Cantal','16':'Charente','17':'Charente-Maritime','18':'Cher','19':'Corrèze',
        '2A':"Corse-du-Sud",'2B':'Haute-Corse','21':"Côte-d'Or",'22':"Côtes-d'Armor",'23':'Creuse','24':'Dordogne',
        '25':'Doubs','26':'Drôme','27':'Eure','28':'Eure-et-Loir','29':'Finistère','30':'Gard','31':'Haute-Garonne',
        '32':'Gers','33':'Gironde','34':'Hérault','35':'Ille-et-Vilaine','36':'Indre','37':'Indre-et-Loire',
        '38':'Isère','39':'Jura','40':'Landes','41':'Loir-et-Cher','42':'Loire','43':'Haute-Loire','44':'Loire-Atlantique',
        '45':'Loiret','46':'Lot','47':'Lot-et-Garonne','48':'Lozère','49':'Maine-et-Loire','50':'Manche','51':'Marne',
        '52':'Haute-Marne','53':'Mayenne','54':'Meurthe-et-Moselle','55':'Meuse','56':'Morbihan','57':'Moselle',
        '58':'Nièvre','59':'Nord','60':'Oise','61':'Orne','62':'Pas-de-Calais','63':'Puy-de-Dôme',
        '64':'Pyrénées-Atlantiques','65':'Hautes-Pyrénées','66':'Pyrénées-Orientales','67':'Bas-Rhin','68':'Haut-Rhin',
        '69':'Rhône','70':'Haute-Saône','71':'Saône-et-Loire','72':'Sarthe','73':'Savoie','74':'Haute-Savoie',
        '75':'Paris','76':'Seine-Maritime','77':'Seine-et-Marne','78':'Yvelines','79':'Deux-Sèvres','80':'Somme',
        '81':'Tarn','82':'Tarn-et-Garonne','83':'Var','84':'Vaucluse','85':'Vendée','86':'Vienne','87':'Haute-Vienne',
        '88':'Vosges','89':'Yonne','90':'Territoire de Belfort','91':'Essonne','92':'Hauts-de-Seine',
        '93':'Seine-Saint-Denis','94':'Val-de-Marne','95':"Val-d'Oise",
        '971':'Guadeloupe','972':'Martinique','973':'Guyane','974':'La Réunion','976':'Mayotte'
    };

    function getDeptSortRank(code) {
        if (code === '2A') return 20.1;
        if (code === '2B') return 20.2;
        return parseInt(code, 10);
    }

    const DEPT_CODES = Object.keys(DEPT_DATA).sort((a, b) => getDeptSortRank(a) - getDeptSortRank(b));

    const REGION_SYMBOLS = {
        mountain: '<path d="M18 54 30 30l8 14 6-9 12 19H18Z" fill="rgba(255,255,255,.9)"/><path d="M30 30 24 42h12l-6-12Z" fill="rgba(255,255,255,.55)"/>',
        vine: '<path d="M31 24c-9 4-12 15-7 22 8-2 14-9 15-20-3-2-5-3-8-2Z" fill="rgba(255,255,255,.9)"/><circle cx="41" cy="36" r="5" fill="rgba(255,255,255,.7)"/>',
        waves: '<path d="M13 42c7-7 13 7 20 0s13 7 20 0" fill="none" stroke="rgba(255,255,255,.92)" stroke-width="5" stroke-linecap="round"/><path d="M13 52c7-7 13 7 20 0s13 7 20 0" fill="none" stroke="rgba(255,255,255,.65)" stroke-width="4" stroke-linecap="round"/>',
        leaf: '<path d="M46 22C28 22 18 34 20 50c16 2 29-8 30-26l-16 14" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
        island: '<path d="M36 19c-5 7-7 12-5 18 2 7-2 11-7 16 11 0 18-5 20-13 2-7-2-14-8-21Z" fill="rgba(17,24,39,.9)"/>',
        spark: '<path d="M32 18 37 33l15 5-15 5-5 15-5-15-15-5 15-5 5-15Z" fill="rgba(255,255,255,.9)"/>',
        field: '<path d="M14 47c12-8 24-8 36 0" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="5" stroke-linecap="round"/><path d="M18 35h28" stroke="rgba(255,255,255,.65)" stroke-width="5" stroke-linecap="round"/>',
        star: '<path d="M32 18 36 29h12l-10 7 4 12-10-7-10 7 4-12-10-7h12l4-11Z" fill="rgba(255,255,255,.92)"/>',
        lion: '<path d="M24 45c6-18 26-17 26-2 0 9-7 14-17 14-8 0-15-4-18-9 4 1 7 0 9-3Z" fill="rgba(255,255,255,.85)"/><circle cx="37" cy="37" r="3" fill="rgba(255,255,255,.95)"/>',
        wave: '<path d="M15 48c14 5 28-1 35-16-12 6-19-5-31 2 8 1 13 5 15 9-6 2-12 2-19 5Z" fill="rgba(255,255,255,.9)"/>',
        cross: '<path d="M29 17h6v13h13v6H35v13h-6V36H16v-6h13V17Z" fill="rgba(255,255,255,.92)"/>',
        river: '<path d="M18 23c18 7 10 18 28 25" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="6" stroke-linecap="round"/><path d="M18 41c13 0 18 8 28 8" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="4" stroke-linecap="round"/>',
        sun: '<circle cx="32" cy="36" r="10" fill="rgba(255,255,255,.92)"/><path d="M32 17v7M32 48v7M13 36h7M44 36h7M19 23l5 5M40 44l5 5M45 23l-5 5M24 44l-5 5" stroke="rgba(255,255,255,.72)" stroke-width="4" stroke-linecap="round"/>'
    };

    function getRegionLogo(deptCode) {
        const region = getRegionInfo(deptCode);
        if (region) {
            if (region.img) {
                return `<img class="region-logo-img" src="${region.img}" alt="${region.name}">`;
            }
            return renderRegionMark(region);
        }
        return renderRegionMark({ name: 'France', short: 'FR', colors: ['#0055A4', '#E30613'], motif: 'star' });
    }

    function renderRegionMark(region) {
        const [primary, secondary] = region.colors;
        const symbol = REGION_SYMBOLS[region.motif] || REGION_SYMBOLS.star;
        return `
            <svg class="region-mark" viewBox="0 0 64 78" role="img" aria-label="${region.name}">
                <defs>
                    <linearGradient id="rg-${region.short.replace(/[^a-zA-Z0-9]/g, '')}" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stop-color="${primary}"/>
                        <stop offset="1" stop-color="${secondary}"/>
                    </linearGradient>
                </defs>
                <path d="M32 3 58 13v25c0 17-11 29-26 36C17 67 6 55 6 38V13L32 3Z" fill="url(#rg-${region.short.replace(/[^a-zA-Z0-9]/g, '')})"/>
                <path d="M32 7 54 16v22c0 14-9 25-22 31C19 63 10 52 10 38V16L32 7Z" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="2"/>
                ${symbol}
                <text x="32" y="68" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="800" fill="#fff">${region.short}</text>
            </svg>`;
    }

    function getRegionName(deptCode) {
        const region = getRegionInfo(deptCode);
        return region ? region.name : 'France';
    }

    function getRegionInfo(deptCode) {
        const regionCode = DEPT_TO_REGION[deptCode];
        return regionCode && REGIONS[regionCode] ? REGIONS[regionCode] : null;
    }

    /* ---------- DOM ---------- */
    let $;
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        $ = {
            steps: document.querySelectorAll('.wizard-step'),
            panes: document.querySelectorAll('.wizard-pane'),
            prev: document.getElementById('wizardPrev'),
            next: document.getElementById('wizardNext'),
            addCart: document.getElementById('addToCartBtn'),
            qtyWrap: document.getElementById('qtyWrap'),
            qtyMinus: document.getElementById('qtyMinus'),
            qtyPlus: document.getElementById('qtyPlus'),
            qtyValue: document.getElementById('qtyValue'),

            // Étape 1
            paneOneTitle: document.getElementById('paneOneTitle'),
            paneOneDesc: document.getElementById('paneOneDesc'),
            paneTwoTitle: document.getElementById('paneTwoTitle'),
            paneTwoDesc: document.getElementById('paneTwoDesc'),
            formatField: document.getElementById('formatField'),
            formatGrid: document.getElementById('formatGrid'),
            selectedProductCard: document.getElementById('selectedProductCard'),
            homologField: document.getElementById('homologField'),
            homologToggle: document.getElementById('homologToggle'),
            selectedModeCard: document.getElementById('selectedModeCard'),
            homologHint: document.getElementById('homologHint'),
            immatModeField: document.getElementById('immatModeField'),
            immatModeToggle: document.getElementById('immatModeToggle'),
            immatModeHint: document.getElementById('immatModeHint'),
            immatField: document.getElementById('immatField'),
            immat: document.getElementById('immatInput'),
            immatHint: document.getElementById('immatHint'),
            decorUploadField: document.getElementById('decorUploadField'),
            decorImageInput: document.getElementById('decorImageInput'),
            decorImageStatus: document.getElementById('decorImageStatus'),
            decorImageName: document.getElementById('decorImageName'),
            decorImageRemove: document.getElementById('decorImageRemove'),
            decorAdminMessage: document.getElementById('decorAdminMessageInput'),
            decorAdminMsgCounter: document.getElementById('decorAdminMsgCounter'),

            // Étape 2
            deptToggleBtn: document.getElementById('deptToggleBtn'),
            deptCurrentLogo: document.getElementById('deptCurrentLogo'),
            deptCurrentNum: document.getElementById('deptCurrentNum'),
            deptCurrentName: document.getElementById('deptCurrentName'),
            deptSearch: document.getElementById('deptSearch'),
            deptList: document.getElementById('deptList'),
            euBandToggle: document.getElementById('euBandToggle'),
            carLogoField: document.getElementById('carLogoField'),
            carLogoGrid: document.getElementById('carLogoGrid'),
            customCarLogoField: document.getElementById('customCarLogoField'),
            customCarLogoInput: document.getElementById('customCarLogoInput'),

            // Étape 3
            message: document.getElementById('messageInput'),
            msgCounter: document.getElementById('msgCounter'),
            messagePaneDesc: document.getElementById('messagePaneDesc'),

            // Étape 4
            contourTypeToggle: document.getElementById('contourTypeToggle'),
            contourColorField: document.getElementById('contourColorField'),
            contourPalette: document.getElementById('contourPalette'),
            rivetsOption: document.getElementById('rivetsOption'),

            // Étape 5
            recap: document.getElementById('wizardRecap'),

            // Aperçu
            preview: document.getElementById('plaquePreviewEl'),
            previewBadge: document.getElementById('previewBadgeText'),
            previewRegionLogo: document.getElementById('previewRegionLogo'),
            officialPlateSvg: document.getElementById('officialPlateSvg'),
            decorImageSlot: document.getElementById('decorImageSlot'),
            decorImagePreview: document.getElementById('decorImagePreview'),
            decorImageEmpty: document.getElementById('decorImageEmpty'),
            plaqueText: document.getElementById('plaqueText'),
            plaqueMsg: document.getElementById('plaqueMsg'),
            bandLeft: document.getElementById('bandLeft'),
            bandRight: document.getElementById('bandRight'),
            deptLogo: document.getElementById('deptLogo'),
            deptNum: document.getElementById('deptNum'),
            euStars: document.querySelector('.eu-stars'),
            unitPrice: document.getElementById('unitPriceDisplay'),
            previewFormatMeta: document.getElementById('previewFormatMeta'),
            previewPrimaryMetaLabel: document.getElementById('previewPrimaryMetaLabel'),
            previewDeptMeta: document.getElementById('previewDeptMeta'),
            liveSummaryFormat: document.getElementById('liveSummaryFormat'),
            liveSummaryRegion: document.getElementById('liveSummaryRegion'),
            liveSummaryPrice: document.getElementById('liveSummaryPrice'),

            // Éléments Premium 3D
            toggle3DBtn: document.getElementById('toggle3DBtn'),
            premiumBgBtns: document.querySelectorAll('.premium-bg-btn'),
            wizardPreview: document.querySelector('.wizard-preview'),
            plaqueStage: document.querySelector('.wizard-plaque-stage'),
            plaqueReflection: document.querySelector('.plaque-reflection'),

            cartBtn: document.getElementById('cartBtn')
        };

        applyUrlParams();
        bindEvents();
        syncControlsFromState();
        buildDeptList('');
        updateDeptCurrent();
        updatePreview();
        updatePrice();
        updateNavButtons();
    }

    function applyUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const format = params.get('format');
        const homolog = params.get('homolog');
        const font = params.get('font');
        const dept = (params.get('dept') || '').toUpperCase();
        const immat = params.get('immat');
        const immatMode = (params.get('immatMode') || params.get('mode') || '').toLowerCase();
        const decorativeParam = (params.get('decorative') || params.get('usage') || params.get('type') || '').toLowerCase();
        const message = params.get('message');

        if (format && Object.prototype.hasOwnProperty.call(PRICES, format)) state.format = format;
        state.decorativeUsa = state.format === 'usa' && ['yes', 'true', '1', 'decorative', 'deco'].includes(decorativeParam);
        state.formatLocked = true;
        if (homolog === 'yes' || homolog === 'no') {
            state.homolog = homolog;
        } else if (state.format !== 'usa') {
            state.homolog = 'yes';
        }
        state.homologLocked = true;
        if (font && Object.prototype.hasOwnProperty.call(FONT_EXTRA, font)) state.font = font;
        if (immatMode === 'fni' || immatMode === 'ancien' || immatMode === 'old') state.immatMode = 'fni';
        if (dept && DEPT_DATA[dept]) {
            state.dept = dept;
            state.deptName = DEPT_DATA[dept];
            state.regionName = getRegionName(dept);
        }
        if (immat) state.immat = isProvisionalFormat(state.format)
            ? normalizeProvisionalInput(immat, state.format)
            : normalizeImmatInput(immat, state.immatMode);
        if (state.immatMode === 'fni') {
            const deptFromImmat = getFniDeptFromImmat(state.immat);
            if (deptFromImmat) {
                state.dept = deptFromImmat;
                state.deptName = DEPT_DATA[deptFromImmat];
                state.regionName = getRegionName(deptFromImmat);
            }
        }
        if (message) state.message = message.toUpperCase().slice(0, 30);

        if (isProvisionalFormat(state.format)) state.homolog = 'yes';
        if (state.format === 'usa') state.homolog = 'no';
        if (state.homolog === 'yes' && state.font !== 'officiel') state.font = 'officiel';
        if (state.homolog !== 'yes' || state.format === 'usa' || isProvisionalFormat(state.format)) state.immatMode = 'siv';
    }

    function syncControlsFromState() {
        $.formatGrid.querySelectorAll('.wizard-card').forEach(c => {
            c.classList.toggle('selected', c.dataset.format === state.format);
        });
        $.homologToggle.querySelectorAll('.wizard-toggle-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.homolog === state.homolog);
        });
        if ($.euBandToggle) {
            $.euBandToggle.querySelectorAll('.wizard-toggle-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.eu === state.euBand);
            });
        }
        if ($.immatModeToggle) {
            $.immatModeToggle.querySelectorAll('.wizard-toggle-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.immatMode === state.immatMode);
            });
        }
        $.carLogoGrid.querySelectorAll('.wizard-card').forEach(c => {
            c.classList.toggle('selected', c.dataset.car === state.carLogo);
        });
        $.contourTypeToggle.querySelectorAll('.wizard-toggle-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.contour === state.contour);
        });
        $.contourPalette.querySelectorAll('.wizard-color-swatch').forEach(s => {
            s.classList.toggle('selected', s.dataset.color === state.contourColor);
        });

        $.immat.value = state.immat;
        updateImmatModeUI();
        $.message.value = state.message;
        $.msgCounter.textContent = `${state.message.length} / 30`;
        if ($.decorAdminMessage) $.decorAdminMessage.value = state.decorAdminMessage;
        if ($.decorAdminMsgCounter) $.decorAdminMsgCounter.textContent = `${state.decorAdminMessage.length} / 300`;
        $.contourColorField.style.display = state.contour === 'none' ? 'none' : '';
        $.qtyValue.textContent = state.quantity;
        if ($.rivetsOption) $.rivetsOption.checked = state.rivets;

        // Afficher ou masquer le champ texte personnalisé voiture
        if (state.carLogo === 'custom') {
            $.customCarLogoField.style.display = '';
            $.customCarLogoInput.value = state.customCarLogoText || '';
        } else {
            $.customCarLogoField.style.display = 'none';
        }

        updateModeUI();
        updateLockedProductUI();
        updateDecorImageUI();
        updateHomologAvailability();
    }

    function isDecorative() {
        return state.homolog === 'no' && !isCollectionPlate();
    }

    function isCollectionPlate() {
        return state.format === 'usa' && !state.decorativeUsa;
    }

    function isProvisionalFormat(format) {
        return format === 'ww' || format === 'wgarage';
    }

    function isProvisionalPlate() {
        return state.homolog === 'yes' && isProvisionalFormat(state.format);
    }

    function getDecorImageLabel() {
        return state.decorImageName || 'À importer';
    }

    function getProductLabel() {
        if (isDecorative()) return `Plaque déco format ${DECOR_FORMAT_LABELS[state.format] || FORMAT_LABELS[state.format]}`;
        return PRODUCT_LABELS[state.format] || PRODUCT_LABELS.auto;
    }

    function getProductSummaryLabel() {
        if (isDecorative()) return `Déco ${DECOR_FORMAT_LABELS[state.format] || FORMAT_LABELS[state.format]}`;
        if (isCollectionPlate()) return 'Collection noire';
        return FORMAT_LABELS[state.format];
    }

    function getProductIconLabel() {
        if (isDecorative()) return 'DEC';
        if (isCollectionPlate()) return 'COL';
        if (state.format === 'ww') return 'WW';
        if (state.format === 'wgarage') return 'W';
        return FORMAT_LABELS[state.format].slice(0, 3).toUpperCase();
    }

    function getModeLabel() {
        if (isCollectionPlate()) return 'Homologuée collection';
        if (isProvisionalPlate()) return 'Homologuée provisoire';
        return isDecorative() ? 'Décorative non homologuée' : 'Homologuée route';
    }

    function getCarLogoLabel() {
        if (state.carLogo === 'custom') {
            return state.customCarLogoText ? `Personnalisé (${state.customCarLogoText})` : 'Logo personnalisé';
        }

        return CAR_LOGO_LABELS[state.carLogo] || 'Logo régional SIV';
    }

    function getProductDescription() {
        if (isDecorative()) return 'Configuration dédiée : image personnalisée, message et finition décorative.';
        if (isCollectionPlate()) return 'Configuration dédiée : plaque noire pour véhicule avec mention collection.';
        if (isProvisionalPlate()) return 'Configuration dédiée : fond rose provisoire et numéro WW ou W garage.';
        return `Configuration dédiée au format ${FORMAT_SIZES[state.format]}, avec région SIV et aperçu officiel.`;
    }

    function setFieldVisible(field, visible) {
        if (field) field.hidden = !visible;
    }

    function updateLockedProductUI() {
        if ($.formatGrid) $.formatGrid.hidden = true;
        if ($.homologToggle) $.homologToggle.hidden = true;
        if ($.homologHint) $.homologHint.hidden = true;

        if ($.selectedProductCard) {
            $.selectedProductCard.hidden = false;
            $.selectedProductCard.innerHTML = `
                <div class="selected-product-icon" aria-hidden="true">${escapeSvgText(getProductIconLabel())}</div>
                <div class="selected-product-copy">
                    <strong>${escapeSvgText(getProductLabel())}</strong>
                    <span>${escapeSvgText(FORMAT_SIZES[state.format])} · ${escapeSvgText(getProductDescription())}</span>
                </div>
                <a href="catalogue.html" class="selected-product-change">Changer</a>
            `;
        }

        if ($.selectedModeCard) {
            $.selectedModeCard.hidden = false;
            $.selectedModeCard.innerHTML = `
                <strong>${escapeSvgText(getModeLabel())}</strong>
                <span>${isCollectionPlate()
                    ? 'Réservée aux véhicules avec mention « véhicule de collection » sur la carte grise.'
                    : isProvisionalPlate()
                        ? 'Plaque provisoire homologuée avec fond rose dédié.'
                    : isDecorative()
                        ? 'Usage privé, décoration ou événementiel.'
                        : 'Configuration route verrouillée pour éviter les mélanges de produit.'}</span>
            `;
        }
    }

    function shouldUseOfficialPlateSvg() {
        return !isDecorative()
            && !isCollectionPlate()
            && (isProvisionalPlate() || (state.euBand === 'yes' && ['auto', 'moto', '4x4'].includes(state.format)));
    }

    function escapeSvgText(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function escapeSvgAttr(value) {
        return escapeSvgText(value);
    }

    function escapeHTML(value) {
        return escapeSvgText(value);
    }

    function normalizeImmatInput(value, mode = state.immatMode) {
        const raw = (value || '').toUpperCase();

        if (mode === 'fni') {
            const compact = raw.replace(/[^A-Z0-9]/g, '').slice(0, 10);
            const numberPart = compact.match(/^\d{0,4}/)?.[0] || '';
            let rest = compact.slice(numberPart.length);
            const letterPart = rest.match(/^[A-Z]{0,3}/)?.[0] || '';
            rest = rest.slice(letterPart.length);
            const deptPart = rest.slice(0, 3);
            return [numberPart, letterPart, deptPart].filter(Boolean).join(' ');
        }

        let clean = raw.replace(/[^A-Z0-9]/g, '');
        if (clean.length > 2) clean = clean.slice(0, 2) + '-' + clean.slice(2);
        if (clean.length > 6) clean = clean.slice(0, 6) + '-' + clean.slice(6);
        return clean.slice(0, 9);
    }

    function normalizeProvisionalInput(value, format = state.format) {
        const prefix = format === 'wgarage' ? 'W' : 'WW';
        let clean = (value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (format === 'wgarage' && clean.startsWith('WW')) clean = 'W' + clean.slice(2);
        if (!clean.startsWith(prefix)) clean = prefix + clean.replace(/^W{1,2}/, '');

        const rest = clean.slice(prefix.length);
        const numberPart = (rest.match(/^\d{0,3}/) || [''])[0];
        const letterPart = rest.slice(numberPart.length).replace(/[^A-Z]/g, '').slice(0, 2);
        return [prefix, numberPart, letterPart].filter(Boolean).join('-').slice(0, prefix.length + 7);
    }

    function getFniDeptFromImmat(value) {
        const match = (value || '').toUpperCase().match(/^\d{1,4}\s[A-Z]{1,3}\s(2A|2B|\d{2,3})$/);
        return match && DEPT_DATA[match[1]] ? match[1] : '';
    }

    function getImmatPlaceholder() {
        if (isProvisionalFormat(state.format)) return PROVISIONAL_DEFAULTS[state.format] || 'WW-123-AA';
        if (isCollectionPlate()) return '1234 AB 75';
        return state.immatMode === 'fni' ? '123 AB 45' : 'AB-123-CD';
    }

    function updateImmatModeUI() {
        if ($.immatModeHint) {
            $.immatModeHint.textContent = isProvisionalPlate()
                ? 'Format provisoire : WW-123-AA ou W-123-AA.'
                : state.immatMode === 'fni'
                ? 'Ancien format : 123 AB 45 ou 1234 ABC 75.'
                : 'Format actuel : AB-123-CD.';
        }
        if ($.immatHint) {
            $.immatHint.textContent = isProvisionalPlate()
                ? (state.format === 'wgarage' ? 'Format W garage : W-123-AA.' : 'Format provisoire WW : WW-123-AA.')
                : isCollectionPlate()
                ? 'Texte libre conseillé : chiffres, lettres et département.'
                : state.immatMode === 'fni'
                    ? 'Ancien format FNI : 123 AB 45.'
                    : 'Format SIV : AB-123-CD';
        }
        if ($.immat) {
            $.immat.placeholder = getImmatPlaceholder();
            $.immat.maxLength = isProvisionalPlate() ? (state.format === 'wgarage' ? 8 : 9) : (isCollectionPlate() ? 12 : (state.immatMode === 'fni' ? 11 : 9));
        }
    }

    function splitPlateText(value) {
        const fallback = state.immatMode === 'fni' ? '123 AB 45' : 'AA-123-AA';
        const text = (value || fallback).toUpperCase();
        if (state.immatMode === 'fni') {
            const match = text.match(/^(\d{1,4})\s([A-Z]{1,3})\s(2A|2B|\d{2,3})$/);
            if (match) {
                return {
                    first: `${match[1]} ${match[2]}`,
                    second: match[3]
                };
            }
        }
        const parts = text.split('-');

        if (parts.length === 3) {
            return {
                first: `${parts[0]}-${parts[1]}`,
                second: parts[2]
            };
        }

        const compact = text.replace(/[^A-Z0-9]/g, '');
        return {
            first: compact.slice(0, 6) || 'AA-123',
            second: compact.slice(6, 8) || 'AA'
        };
    }

    function renderProvisionalPlateSvg(format, immat, dept) {
        const plateText = escapeSvgText(immat || PROVISIONAL_DEFAULTS[format] || 'WW-123-AA');
        const deptText = escapeSvgText(dept || '35');
        const modeText = format === 'wgarage' ? 'W GARAGE' : 'PROVISOIRE WW';
        const regionLogo = getRegionInfo(dept)?.img || '';
        const hasCarLogo = state.carLogo && state.carLogo !== 'none' && state.carLogo !== 'custom';
        const regionSlotLogo = state.carLogo && state.carLogo !== 'none' && state.carLogo !== 'custom'
            ? `images/cars/${state.carLogo}.svg`
            : regionLogo;
        const customRegionSlotText = state.carLogo === 'custom'
            ? escapeSvgText(state.customCarLogoText || '?')
            : '';
        const deptFontSize = deptText.length > 2 ? 29 : 36;

        const renderRegionImage = (x, y, width, height) => {
            if (customRegionSlotText) {
                const fontSize = Math.max(5, Math.min(10, width / Math.max(1, customRegionSlotText.length) * 1.7));
                return `<text x="${x + width / 2}" y="${y + height / 2 + fontSize / 3}" fill="#111111" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="900" text-anchor="middle">${customRegionSlotText}</text>`;
            }

            if (hasCarLogo) {
                const inset = Math.max(1.5, Math.min(4, width * 0.12));
                return `
                    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#0b0b0b" rx="2"/>
                    <image href="${escapeSvgAttr(regionSlotLogo)}" x="${x + inset}" y="${y + inset}" width="${width - inset * 2}" height="${height - inset * 2}" preserveAspectRatio="xMidYMid meet"/>
                `;
            }

            return regionSlotLogo
                ? `<image href="${escapeSvgAttr(regionSlotLogo)}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"/>`
                : `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#ffffff" rx="2"/>`;
        };

        return `
            <svg class="plate-svg plate-svg-provisional" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 110" role="img" aria-label="Plaque provisoire fond rose">
                <defs>
                    <clipPath id="plate-clip-provisional-preview"><rect x="2" y="2" width="516" height="106" rx="6" /></clipPath>
                    <linearGradient id="provisional-pink-preview" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stop-color="#ffe3ec"/>
                        <stop offset="0.52" stop-color="#ffc2d5"/>
                        <stop offset="1" stop-color="#f4a9c3"/>
                    </linearGradient>
                </defs>
                <rect x="2" y="2" width="516" height="106" rx="6" fill="url(#provisional-pink-preview)" stroke="#161616" stroke-width="3"/>
                <g clip-path="url(#plate-clip-provisional-preview)">
                    <rect x="2" y="2" width="50" height="106" fill="#003399"/>
                    <rect x="468" y="2" width="50" height="106" fill="#003399"/>
                </g>
                <circle cx="27" cy="30" r="14" fill="none" stroke="#ffcc00" stroke-width="3" stroke-dasharray="3 4.3"/>
                <text x="27" y="92" fill="#ffffff" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle">F</text>
                <rect x="476" y="10" width="34" height="34" fill="#ffffff" rx="3"/>
                ${renderRegionImage(479, 12, 28, 30)}
                <text x="493" y="92" fill="#ffffff" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="${deptFontSize}" font-weight="bold" text-anchor="middle">${deptText}</text>
                <text x="260" y="82" fill="#111111" font-family="'Caractères L1', 'Caractères', 'Impact', sans-serif" font-size="76" text-anchor="middle" letter-spacing="4" transform="scale(1, 0.95)">${plateText}</text>
                <text x="260" y="24" fill="rgba(17,17,17,.52)" font-family="Arial, sans-serif" font-size="11" font-weight="900" text-anchor="middle" letter-spacing="3">${modeText}</text>
            </svg>`;
    }

    function renderOfficialPlateSvg(format, immat, dept) {
        if (isProvisionalFormat(format)) return renderProvisionalPlateSvg(format, immat, dept);

        const plateText = escapeSvgText(immat || (state.immatMode === 'fni' ? '123 AB 45' : 'AA-123-AA'));
        const deptText = escapeSvgText(dept || '35');
        const tallText = splitPlateText(immat);
        const firstLine = escapeSvgText(tallText.first);
        const secondLine = escapeSvgText(tallText.second);
        const regionLogo = getRegionInfo(dept)?.img || '';
        const hasCarLogo = state.carLogo && state.carLogo !== 'none' && state.carLogo !== 'custom';
        const regionSlotLogo = state.carLogo && state.carLogo !== 'none' && state.carLogo !== 'custom'
            ? `images/cars/${state.carLogo}.svg`
            : regionLogo;
        const customRegionSlotText = state.carLogo === 'custom'
            ? escapeSvgText(state.customCarLogoText || '?')
            : '';

        const renderRegionImage = (x, y, width, height) => {
            if (customRegionSlotText) {
                const fontSize = Math.max(5, Math.min(10, width / Math.max(1, customRegionSlotText.length) * 1.7));
                return `<text x="${x + width / 2}" y="${y + height / 2 + fontSize / 3}" fill="#111111" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="900" text-anchor="middle">${customRegionSlotText}</text>`;
            }

            if (hasCarLogo) {
                const inset = Math.max(1.5, Math.min(4, width * 0.12));
                return `
                    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#0b0b0b" rx="2"/>
                    <image href="${escapeSvgAttr(regionSlotLogo)}" x="${x + inset}" y="${y + inset}" width="${width - inset * 2}" height="${height - inset * 2}" preserveAspectRatio="xMidYMid meet"/>
                `;
            }

            return regionSlotLogo
                ? `<image href="${escapeSvgAttr(regionSlotLogo)}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"/>`
                : `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#ffffff" rx="2"/>`;
        };

        if (format === 'moto') {
            const deptFontSize = deptText.length > 2 ? 14 : 18;
            const motoTextSize = state.immatMode === 'fni' ? 42 : 50;
            return `
                <svg class="plate-svg plate-svg-moto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 130" role="img" aria-label="Plaque moto 210 par 130 millimètres">
                    <defs><clipPath id="plate-clip-moto-preview"><rect x="2" y="2" width="206" height="126" rx="6" /></clipPath></defs>
                    <rect x="2" y="2" width="206" height="126" rx="6" fill="#ffffff" stroke="#222222" stroke-width="3"/>
                    <g clip-path="url(#plate-clip-moto-preview)">
                        <rect x="2" y="2" width="25" height="68" fill="#003399"/>
                        <rect x="183" y="2" width="25" height="68" fill="#003399"/>
                    </g>
                    <circle cx="14.5" cy="22" r="7" fill="none" stroke="#ffcc00" stroke-width="1.5" stroke-dasharray="2 2"/>
                    <text x="14.5" y="58" fill="#ffffff" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">F</text>
                    <rect x="186.5" y="8" width="18" height="18" fill="#ffffff" rx="2"/>
                    ${renderRegionImage(187.5, 9, 16, 16)}
                    <text x="195.5" y="58" fill="#ffffff" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="${deptFontSize}" font-weight="bold" text-anchor="middle">${deptText}</text>
                    <text x="105" y="62" fill="#000000" font-family="'Caractères L1', 'Caractères', 'Impact', sans-serif" font-size="${motoTextSize}" text-anchor="middle" letter-spacing="2" transform="scale(1, 0.95)">${firstLine}</text>
                    <text x="105" y="118" fill="#000000" font-family="'Caractères L1', 'Caractères', 'Impact', sans-serif" font-size="${motoTextSize}" text-anchor="middle" letter-spacing="2" transform="scale(1, 0.95)">${secondLine}</text>
                </svg>`;
        }

        if (format === '4x4') {
            const deptFontSize = deptText.length > 2 ? 19 : 24;
            const suvFirstSize = state.immatMode === 'fni' ? 58 : 70;
            const suvSecondSize = state.immatMode === 'fni' ? 64 : 75;
            return `
                <svg class="plate-svg plate-svg-suv" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 275 200" role="img" aria-label="Plaque SUV 275 par 200 millimètres">
                    <defs><clipPath id="plate-clip-suv-preview"><rect x="2" y="2" width="271" height="196" rx="6" /></clipPath></defs>
                    <rect x="2" y="2" width="271" height="196" rx="6" fill="#ffffff" stroke="#222222" stroke-width="3"/>
                    <g clip-path="url(#plate-clip-suv-preview)">
                        <rect x="2" y="2" width="30" height="100" fill="#003399"/>
                        <rect x="243" y="2" width="30" height="100" fill="#003399"/>
                    </g>
                    <circle cx="17" cy="30" r="10" fill="none" stroke="#ffcc00" stroke-width="2" stroke-dasharray="2 3.7"/>
                    <text x="17" y="85" fill="#ffffff" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" text-anchor="middle">F</text>
                    <rect x="247" y="15" width="22" height="22" fill="#ffffff" rx="2"/>
                    ${renderRegionImage(249, 17, 18, 18)}
                    <text x="258" y="85" fill="#ffffff" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="${deptFontSize}" font-weight="bold" text-anchor="middle">${deptText}</text>
                    <text x="137.5" y="90" fill="#000000" font-family="'Caractères L1', 'Caractères', 'Impact', sans-serif" font-size="${suvFirstSize}" text-anchor="middle" letter-spacing="3" transform="scale(1, 0.95)">${firstLine}</text>
                    <text x="137.5" y="180" fill="#000000" font-family="'Caractères L1', 'Caractères', 'Impact', sans-serif" font-size="${suvSecondSize}" text-anchor="middle" letter-spacing="3" transform="scale(1, 0.95)">${secondLine}</text>
                </svg>`;
        }

        const deptFontSize = deptText.length > 2 ? 29 : 36;
        const autoTextFontSize = state.immatMode === 'fni' ? 70 : 80;
        const autoLetterSpacing = state.immatMode === 'fni' ? 2 : 4;
        return `
            <svg class="plate-svg plate-svg-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 110" role="img" aria-label="Plaque auto 520 par 110 millimètres">
                <defs><clipPath id="plate-clip-auto-preview"><rect x="2" y="2" width="516" height="106" rx="6" /></clipPath></defs>
                <rect x="2" y="2" width="516" height="106" rx="6" fill="#ffffff" stroke="#222222" stroke-width="3"/>
                <g clip-path="url(#plate-clip-auto-preview)">
                    <rect x="2" y="2" width="50" height="106" fill="#003399"/>
                    <rect x="468" y="2" width="50" height="106" fill="#003399"/>
                </g>
                <circle cx="27" cy="30" r="14" fill="none" stroke="#ffcc00" stroke-width="3" stroke-dasharray="3 4.3"/>
                <text x="27" y="92" fill="#ffffff" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle">F</text>
                <rect x="476" y="10" width="34" height="34" fill="#ffffff" rx="3"/>
                ${renderRegionImage(479, 12, 28, 30)}
                <text x="493" y="92" fill="#ffffff" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="${deptFontSize}" font-weight="bold" text-anchor="middle">${deptText}</text>
                <text x="260" y="82" fill="#000000" font-family="'Caractères L1', 'Caractères', 'Impact', sans-serif" font-size="${autoTextFontSize}" text-anchor="middle" letter-spacing="${autoLetterSpacing}" transform="scale(1, 0.95)">${plateText}</text>
            </svg>`;
    }

    function updateOfficialPlateSvg() {
        if (!$.officialPlateSvg) return;

        const enabled = shouldUseOfficialPlateSvg();
        $.preview.classList.toggle('svg-plate-mode', enabled);
        $.officialPlateSvg.hidden = !enabled;
        $.officialPlateSvg.innerHTML = enabled ? renderOfficialPlateSvg(state.format, state.immat, state.dept) : '';
    }

    function getRightLogoMarkup() {
        if (state.carLogo === 'custom') {
            return `<span class="custom-right-logo">${escapeSvgText(state.customCarLogoText || '?')}</span>`;
        }

        if (state.carLogo && state.carLogo !== 'none') {
            return `<img class="car-region-logo" src="images/cars/${escapeSvgAttr(state.carLogo)}.svg" alt="${escapeSvgAttr(getCarLogoLabel())}">`;
        }

        return getRegionLogo(state.dept);
    }

    function updateLiveSummary() {
        if ($.liveSummaryFormat) {
            $.liveSummaryFormat.textContent = getProductSummaryLabel();
        }
        if ($.liveSummaryRegion) {
            $.liveSummaryRegion.textContent = isDecorative()
                ? 'Plaque décorative'
                : isCollectionPlate()
                    ? 'Collection noire'
                    : getRegionName(state.dept);
        }
        if ($.liveSummaryPrice) {
            $.liveSummaryPrice.textContent = computeUnitPrice().toFixed(2).replace('.', ',') + ' €';
        }
        if ($.previewRegionLogo) {
            const showRegionLogo = !isDecorative() && !isCollectionPlate();
            $.previewRegionLogo.hidden = !showRegionLogo;
            $.previewRegionLogo.innerHTML = showRegionLogo ? getRightLogoMarkup() : '';
        }
    }

    function getVisibleSteps() {
        return [1, 2, 3, 4];
    }

    function getAdjacentStep(direction) {
        const visible = getVisibleSteps();
        const index = visible.indexOf(state.step);
        const nextIndex = Math.max(0, Math.min(visible.length - 1, index + direction));
        return visible[nextIndex];
    }

    function updateStepVisibility() {
        $.steps.forEach(s => {
            const step = parseInt(s.dataset.step);
            s.classList.remove('is-hidden');
            const num = s.querySelector('.wizard-step-num');
            if (num) {
                num.textContent = String(step);
            }
        });
    }

    function updateModeUI() {
        const decorative = isDecorative();
        const collection = isCollectionPlate();
        const provisional = isProvisionalPlate();
        const routePlate = !decorative && !collection;
        const immatModePlate = routePlate && !provisional;
        $.immatField.hidden = decorative;
        $.decorUploadField.hidden = !decorative;
        $.paneOneTitle.textContent = collection ? 'Votre plaque noire collection' : getProductLabel();
        $.paneOneDesc.textContent = collection
            ? 'Cette configuration est dédiée aux véhicules avec mention « véhicule de collection » sur la carte grise.'
            : decorative
            ? 'Importez votre image, ajoutez votre texte, puis choisissez la finition.'
            : provisional
            ? 'Renseignez le numéro provisoire, le fond rose est appliqué automatiquement.'
            : 'Renseignez l’immatriculation et la région SIV de cette plaque, sans changer de format.';
        if ($.paneTwoTitle) $.paneTwoTitle.textContent = routePlate ? 'Région & finitions' : 'Finition de la plaque';
        if ($.paneTwoDesc) {
            $.paneTwoDesc.hidden = decorative;
            $.paneTwoDesc.textContent = routePlate
                ? 'Choisissez le département, le logo régional SIV et les finitions haut de gamme.'
                : collection
                    ? 'La plaque noire collection ne comporte pas d’identifiant territorial.'
                    : '';
        }
        $.messagePaneDesc.textContent = collection
            ? 'Ajoutez un message facultatif en bas de la plaque collection.'
            : provisional
            ? 'Ajoutez un message facultatif en bas de la plaque provisoire.'
            : decorative
            ? 'Ajoutez le texte du client sous l’image (30 caractères max).'
            : 'Ajoutez un petit texte sous l\'immatriculation (optionnel, 30 caractères max).';
        if (!immatModePlate) state.immatMode = 'siv';
        setFieldVisible($.immatModeField, immatModePlate);
        updateImmatModeUI();

        setFieldVisible($.deptToggleBtn?.closest('.wizard-field'), routePlate);
        setFieldVisible($.deptSearch?.closest('.wizard-field'), routePlate);
        state.euBand = routePlate ? 'yes' : 'no';
        setFieldVisible($.euBandToggle?.closest('.wizard-field'), false);
        setFieldVisible($.carLogoField, routePlate);
        if (!routePlate) {
            state.carLogo = 'none';
            state.customCarLogoText = '';
            if ($.customCarLogoField) $.customCarLogoField.style.display = 'none';
        }
        updateStepVisibility();
    }

    function updateDecorImageUI() {
        const hasImage = Boolean(state.decorImageData);
        $.decorImageStatus.hidden = !hasImage;
        $.decorImageName.textContent = state.decorImageName || 'Aucune image';
        $.decorImageSlot.hidden = !isDecorative();
        $.decorImagePreview.hidden = !hasImage;
        $.decorImageEmpty.hidden = hasImage;
        if (hasImage) {
            $.decorImagePreview.src = state.decorImageData;
        } else {
            $.decorImagePreview.removeAttribute('src');
        }
    }

    function updateHomologAvailability() {
        const homologYes = $.homologToggle.querySelector('[data-homolog="yes"]');
        const homologNo = $.homologToggle.querySelector('[data-homolog="no"]');
        if (!homologYes) return;
        homologYes.disabled = state.format === 'usa';
        $.homologToggle.classList.toggle('homolog-locked', state.format === 'usa');
        if (homologNo) homologNo.textContent = state.format === 'usa' ? 'Collection noire' : 'Décorative';
        if ($.homologHint) {
            $.homologHint.textContent = state.format === 'usa'
                ? 'Plaque noire autorisée uniquement pour les véhicules avec mention collection.'
                : 'Une plaque homologuée est conforme à la réglementation française et utilisable sur la route.';
            if (state.homologLocked) $.homologHint.hidden = true;
        }
    }

    /* ---------- ÉVÉNEMENTS ---------- */
    function bindEvents() {
        // Navigation étapes
        $.steps.forEach(s => s.addEventListener('click', () => goToStep(parseInt(s.dataset.step))));
        $.prev.addEventListener('click', () => goToStep(getAdjacentStep(-1)));
        $.next.addEventListener('click', () => goToStep(getAdjacentStep(1)));
        $.addCart.addEventListener('click', addToCart);

        // Quantité
        $.qtyMinus.addEventListener('click', () => changeQty(-1));
        $.qtyPlus.addEventListener('click', () => changeQty(1));

        // Étape 1 - format
        $.formatGrid.querySelectorAll('.wizard-card').forEach(c => {
            c.addEventListener('click', () => selectFormat(c.dataset.format));
        });
        // Étape 1 - homologation
        $.homologToggle.querySelectorAll('.wizard-toggle-btn').forEach(b => {
            b.addEventListener('click', () => selectHomolog(b.dataset.homolog));
        });
        if ($.immatModeToggle) {
            $.immatModeToggle.querySelectorAll('.wizard-toggle-btn').forEach(b => {
                b.addEventListener('click', () => selectImmatMode(b.dataset.immatMode));
            });
        }
        // Étape 1 - immat
        $.immat.addEventListener('input', handleImmat);
        $.decorImageInput.addEventListener('change', handleDecorImage);
        $.decorImageRemove.addEventListener('click', removeDecorImage);
        if ($.decorAdminMessage) $.decorAdminMessage.addEventListener('input', handleDecorAdminMessage);

        // Étape 2 - département
        $.deptToggleBtn.addEventListener('click', () => $.deptList.classList.toggle('open'));
        $.deptSearch.addEventListener('input', e => {
            buildDeptList(e.target.value);
            $.deptList.classList.add('open');
        });
        $.deptSearch.addEventListener('focus', () => $.deptList.classList.add('open'));
        document.addEventListener('click', e => {
            if (!e.target.closest('.wizard-dept-search') && !e.target.closest('#deptToggleBtn')) {
                $.deptList.classList.remove('open');
            }
        });
        if ($.euBandToggle) {
            $.euBandToggle.querySelectorAll('.wizard-toggle-btn').forEach(b => {
                b.addEventListener('click', () => selectEuBand(b.dataset.eu));
            });
        }
        $.carLogoGrid.querySelectorAll('.wizard-card').forEach(c => {
            c.addEventListener('click', () => {
                state.carLogo = c.dataset.car;
                syncControlsFromState();
                updatePreview();
            });
        });
        $.customCarLogoInput.addEventListener('input', e => {
            state.customCarLogoText = e.target.value.toUpperCase();
            updatePreview();
        });

        // Étape 3 - message
        $.message.addEventListener('input', handleMessage);
        if ($.rivetsOption) {
            $.rivetsOption.addEventListener('change', handleRivetsToggle);
        }

        // Étape 4 - contour
        $.contourTypeToggle.querySelectorAll('.wizard-toggle-btn').forEach(b => {
            b.addEventListener('click', () => selectContour(b.dataset.contour));
        });
        $.contourPalette.querySelectorAll('.wizard-color-swatch').forEach(s => {
            s.addEventListener('click', () => selectContourColor(s.dataset.color));
        });

        // Contrôles premium (Effet 3D & arrière-plans réalistes)
        if ($.toggle3DBtn) {
            $.toggle3DBtn.addEventListener('click', () => {
                state.enable3D = !state.enable3D;
                $.toggle3DBtn.classList.toggle('active', state.enable3D);
                $.preview.classList.toggle('mode-3d', state.enable3D);
                if (!state.enable3D) {
                    $.preview.style.transform = '';
                    if ($.plaqueReflection) {
                        $.plaqueReflection.style.transform = '';
                        $.plaqueReflection.style.opacity = '';
                    }
                }
            });
        }

        if ($.premiumBgBtns) {
            $.premiumBgBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const bg = btn.dataset.bg;
                    state.previewBg = bg;
                    $.premiumBgBtns.forEach(b => b.classList.toggle('active', b === btn));
                    if ($.wizardPreview) {
                        $.wizardPreview.classList.remove('bg-dark', 'bg-carbon', 'bg-white', 'bg-garage');
                        $.wizardPreview.classList.add(`bg-${bg}`);
                    }
                });
            });
        }

        if ($.plaqueStage) {
            $.plaqueStage.addEventListener('mousemove', (e) => {
                if (!state.enable3D) return;
                const rect = $.plaqueStage.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calculer l'angle d'inclinaison (max 15 deg)
                const rotateY = ((x / rect.width) - 0.5) * 26; // -13deg à +13deg
                const rotateX = -((y / rect.height) - 0.5) * 22; // -11deg à +11deg
                
                $.preview.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                
                // Mettre à jour l'effet de reflet plaque-reflection
                if ($.plaqueReflection) {
                    const pctX = (x / rect.width) * 100;
                    const pctY = (y / rect.height) * 100;
                    $.plaqueReflection.style.background = `linear-gradient(${115 + (rotateY * 1.5)}deg, transparent 0%, rgba(255, 255, 255, ${0.35 + (pctY / 300)}) ${pctX - 10}%, rgba(255, 255, 255, 0.55) ${pctX}%, rgba(255, 255, 255, 0) ${pctX + 15}%)`;
                    $.plaqueReflection.style.opacity = '1';
                }
            });
            
            $.plaqueStage.addEventListener('mouseleave', () => {
                if (!state.enable3D) return;
                // Transition souple vers la position de face légèrement inclinée
                $.preview.style.transform = 'rotateX(4deg) rotateY(0deg) scale(1)';
                if ($.plaqueReflection) {
                    $.plaqueReflection.style.background = '';
                    $.plaqueReflection.style.opacity = '';
                }
            });
        }
    }

    /* ---------- NAVIGATION ---------- */
    function goToStep(n) {
        if (n < 1 || n > TOTAL_STEPS) return;
        const visibleSteps = getVisibleSteps();
        if (!visibleSteps.includes(n)) {
            n = visibleSteps.find(step => step > state.step) || visibleSteps[visibleSteps.length - 1];
        }
        state.step = n;
        updateStepVisibility();
        $.steps.forEach(s => {
            const step = parseInt(s.dataset.step);
            const completed = step < n;
            s.classList.toggle('active', step === n);
            s.classList.toggle('completed', completed);
            const num = s.querySelector('.wizard-step-num');
            if (num) num.textContent = completed ? '✓' : String(step);
        });
        $.panes.forEach(p => p.classList.toggle('active', parseInt(p.dataset.pane) === n));
        if (n === 4) buildRecap();
        updateNavButtons();
    }

    function updateNavButtons() {
        const visibleSteps = getVisibleSteps();
        $.prev.style.visibility = state.step === visibleSteps[0] ? 'hidden' : 'visible';
        const isLast = state.step === TOTAL_STEPS;
        $.next.style.display = isLast ? 'none' : '';
        $.addCart.style.display = isLast ? '' : 'none';
        $.qtyWrap.style.display = isLast ? '' : 'none';
    }

    /* ---------- ÉTAPE 1 : FORMAT / HOMOLOG / IMMAT / POLICE ---------- */
    function selectFormat(format) {
        if (state.formatLocked) return;
        state.format = format;
        $.formatGrid.querySelectorAll('.wizard-card').forEach(c => {
            c.classList.toggle('selected', c.dataset.format === format);
        });
        if (format === 'usa') {
            selectHomolog('no', { force: true });
        } else if (isProvisionalFormat(format)) {
            selectHomolog('yes', { force: true });
        }
        updateHomologAvailability();
        // Reformater immat selon le format
        handleImmat();
        updatePreview();
        updatePrice();
    }

    function selectHomolog(value, options = {}) {
        if (state.homologLocked && !options.force) return;
        if (state.format === 'usa') value = 'no';
        if (isProvisionalFormat(state.format)) value = 'yes';
        state.homolog = value;
        $.homologToggle.querySelectorAll('.wizard-toggle-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.homolog === value);
        });
        if (value === 'no') {
            state.immat = '';
            $.immat.value = '';
            if (state.step === 2) goToStep(3);
        }
        // Si décorative, débloquer toutes les polices ; sinon forcer officielle
        if (value === 'yes' && state.font !== 'officiel') {
            selectFont('officiel');
        }
        if ($.fontHint) {
            $.fontHint.textContent = value === 'yes'
                ? 'Police FE-Schrift requise pour les plaques homologuées.'
                : 'Toutes les polices disponibles en mode décoratif.';
        }
        updateModeUI();
        updateHomologAvailability();
        syncControlsFromState();
        updatePreview();
    }

    function selectImmatMode(mode) {
        if (!['siv', 'fni'].includes(mode) || state.immatMode === mode) return;
        state.immatMode = mode;
        state.immat = '';
        $.immat.value = '';
        if ($.immatModeToggle) {
            $.immatModeToggle.querySelectorAll('.wizard-toggle-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.immatMode === mode);
            });
        }
        updateImmatModeUI();
        updatePreview();
    }

    function handleImmat(e) {
        if (isDecorative()) {
            state.immat = '';
            $.immat.value = '';
            updatePreview();
            return;
        }
        let value = ($.immat.value || '').toUpperCase();
        if (isProvisionalPlate()) {
            value = normalizeProvisionalInput(value, state.format);
        } else if (isCollectionPlate()) {
            value = value.replace(/[^A-Z0-9 \-]/g, '').slice(0, 12);
        } else if (state.homolog === 'no') {
            // décoratif : libre
            value = value.replace(/[^A-Z0-9 \-]/g, '').slice(0, 9);
        } else {
            value = normalizeImmatInput(value, state.immatMode);
        }
        $.immat.value = value;
        state.immat = value;
        if (state.immatMode === 'fni') {
            const deptFromImmat = getFniDeptFromImmat(value);
            if (deptFromImmat && deptFromImmat !== state.dept) {
                state.dept = deptFromImmat;
                state.deptName = DEPT_DATA[deptFromImmat];
                state.regionName = getRegionName(deptFromImmat);
                updateDeptCurrent();
                buildDeptList($.deptSearch.value);
            }
        }
        updatePreview();
    }

    function handleDecorImage(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            notify('Veuillez importer une image valide', 'error');
            $.decorImageInput.value = '';
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            notify('Image trop lourde : maximum 3 Mo', 'error');
            $.decorImageInput.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            state.decorImageData = reader.result;
            state.decorImageName = file.name;
            updateDecorImageUI();
            updatePreview();
        };
        reader.readAsDataURL(file);
    }

    function removeDecorImage() {
        state.decorImageData = '';
        state.decorImageName = '';
        $.decorImageInput.value = '';
        updateDecorImageUI();
        updatePreview();
    }

    function handleDecorAdminMessage() {
        const value = ($.decorAdminMessage.value || '').slice(0, 300);
        $.decorAdminMessage.value = value;
        state.decorAdminMessage = value;
        if ($.decorAdminMsgCounter) $.decorAdminMsgCounter.textContent = `${value.length} / 300`;
        if (state.step === 4) buildRecap();
    }

    function selectFont(font) {
        state.font = 'officiel';
        updatePreview();
        updatePrice();
    }

    /* ---------- ÉTAPE 2 : DÉPARTEMENT ---------- */
    function buildDeptList(filter) {
        const f = (filter || '').toLowerCase().trim();
        const items = DEPT_CODES
            .map(code => [code, DEPT_DATA[code]])
            .filter(([code, name]) => !f || code.toLowerCase().includes(f) || name.toLowerCase().includes(f))
            .map(([code, name]) => `
                <div class="wizard-dept-item" data-dept="${code}">
                    <span class="dept-list-logo">${getRegionLogo(code)}</span>
                    <span class="dept-num">${code}</span>
                    <span class="dept-list-name">${name}<small>${getRegionName(code)}</small></span>
                </div>
            `).join('');
        $.deptList.innerHTML = items || '<div class="wizard-dept-item">Aucun résultat</div>';
        $.deptList.querySelectorAll('[data-dept]').forEach(el => {
            el.addEventListener('click', () => selectDept(el.dataset.dept));
        });
    }

    function selectDept(code) {
        state.dept = code;
        state.deptName = DEPT_DATA[code] || '';
        state.regionName = getRegionName(code);
        updateDeptCurrent();
        $.deptList.classList.remove('open');
        $.deptSearch.value = '';
        buildDeptList('');
        updatePreview();
    }

    function updateDeptCurrent() {
        $.deptCurrentLogo.innerHTML = getRegionLogo(state.dept);
        $.deptCurrentNum.textContent = state.dept;
        $.deptCurrentName.textContent = state.deptName + ' · ' + state.regionName;
    }

    function selectEuBand(value) {
        state.euBand = value;
        if ($.euBandToggle) {
            $.euBandToggle.querySelectorAll('.wizard-toggle-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.eu === value);
            });
        }
        updatePreview();
    }

    /* ---------- ÉTAPE 3 : MESSAGE ---------- */
    function handleMessage() {
        let v = ($.message.value || '').toUpperCase().slice(0, 30);
        $.message.value = v;
        state.message = v;
        $.msgCounter.textContent = `${v.length} / 30`;
        $.msgCounter.classList.toggle('warn', v.length >= 20 && v.length < 28);
        $.msgCounter.classList.toggle('over', v.length >= 28);
        updatePreview();
    }

    function handleRivetsToggle() {
        state.rivets = !!($.rivetsOption && $.rivetsOption.checked);
        updatePrice();
        if (state.step === 4) buildRecap();
    }

    /* ---------- ÉTAPE 4 : CONTOUR ---------- */
    function selectContour(type) {
        state.contour = type;
        $.contourTypeToggle.querySelectorAll('.wizard-toggle-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.contour === type);
        });
        $.contourColorField.style.display = type === 'none' ? 'none' : '';
        updatePreview();
        updatePrice();
    }

    function selectContourColor(color) {
        state.contourColor = color;
        $.contourPalette.querySelectorAll('.wizard-color-swatch').forEach(s => {
            s.classList.toggle('selected', s.dataset.color === color);
        });
        updatePreview();
    }

    /* ---------- ÉTAPE 5 : RÉCAP ---------- */
    function buildRecap() {
        const labels = {
            format: { auto: 'Auto 520×110', moto: 'Moto 210×130', '4x4': 'SUV 275×200', usa: 'Collection noire', ww: 'Provisoire WW 520×110', wgarage: 'W garage 520×110' },
            font:   { officiel: 'Officielle (FE-Schrift)' },
            contour:{ none: 'Aucun', int: 'Intérieur', ext: 'Extérieur' }
        };
        const unitPrice = computeUnitPrice();
        const rows = isDecorative()
            ? [
                ['Format', getProductLabel()],
                ['Type', 'Décorative'],
                ['Image', getDecorImageLabel()],
                ['Message', state.message || '—'],
                ['Message atelier', state.decorAdminMessage || '—'],
                ['Contour', labels.contour[state.contour] + (state.contour !== 'none' ? ' (+2€)' : '')]
            ]
            : isCollectionPlate()
            ? [
                ['Format', labels.format[state.format]],
                ['Type', 'Homologuée collection'],
                ['Condition', 'Carte grise collection'],
                ['Texte plaque', state.immat || '—'],
                ['Message', state.message || '—'],
                ['Contour', labels.contour[state.contour] + (state.contour !== 'none' ? ' (+2€)' : '')]
            ]
            : isProvisionalPlate()
            ? [
                ['Format', labels.format[state.format]],
                ['Type', 'Homologuée provisoire'],
                ['Fond', 'Rose provisoire'],
                ['Numéro provisoire', state.immat || '—'],
                ['Département', `${state.dept} · ${state.deptName}`],
                ['Logo droit', state.carLogo === 'none' ? getRegionName(state.dept) : getCarLogoLabel()],
                ['Message', state.message || '—'],
                ['Contour', labels.contour[state.contour] + (state.contour !== 'none' ? ' (+2€)' : '')]
            ]
            : [
                ['Format', labels.format[state.format]],
                ['Type', 'Homologuée'],
                ['Format plaque', IMMAT_MODE_LABELS[state.immatMode]],
                ['Immatriculation', state.immat || '—'],
                ['Police', labels.font[state.font]],
                ['Département', `${state.dept} · ${state.deptName}`],
                ['Logo droit', state.carLogo === 'none' ? getRegionName(state.dept) : getCarLogoLabel()],
                ['Message', state.message || '—'],
                ['Contour', labels.contour[state.contour] + (state.contour !== 'none' ? ' (+2€)' : '')]
            ];
        if (state.rivets) {
            rows.push(['Rivets', `Lot de 2 rivets blancs (+${RIVETS_UNIT_PRICE.toFixed(2).replace('.', ',')}€ par plaque)`]);
        }
        $.recap.innerHTML = rows.map(([k, v]) => `
            <div class="wizard-recap-row">
                <span class="label">${escapeHTML(k)}</span>
                <span class="value">${escapeHTML(v)}</span>
            </div>
        `).join('') + `
            <div class="wizard-recap-total">
                <span class="label">Total (${state.quantity} × ${unitPrice.toFixed(2).replace('.', ',')}€)</span>
                <span class="value">${(unitPrice * state.quantity).toFixed(2).replace('.', ',')} €</span>
            </div>`;
    }

    /* ---------- QUANTITÉ ---------- */
    function changeQty(delta) {
        state.quantity = Math.max(1, Math.min(20, state.quantity + delta));
        $.qtyValue.textContent = state.quantity;
        if (state.step === 4) buildRecap();
    }

    /* ---------- PRIX ---------- */
    function computeUnitPrice() {
        let p = PRICES[state.format] || 15.90;
        if (state.contour !== 'none') p += CONTOUR_EXTRA;
        p += FONT_EXTRA[state.font] || 0;
        if (state.rivets) p += RIVETS_UNIT_PRICE;
        return p;
    }

    function updatePrice() {
        const p = computeUnitPrice();
        $.unitPrice.textContent = p.toFixed(2).replace('.', ',') + ' €';
        updateLiveSummary();
    }

    /* ---------- APERÇU ---------- */
    function updatePreview() {
        const p = $.preview;

        // Format - reset classes
        p.classList.remove('format-auto', 'format-moto', 'format-4x4', 'format-usa', 'format-ww', 'format-wgarage', 'moto');
        p.classList.add('format-' + state.format);
        if (state.format === 'moto') p.classList.add('moto');
        p.dataset.homolog = state.homolog;
        p.classList.toggle('decor-mode', isDecorative());
        p.classList.toggle('provisional-mode', isProvisionalPlate());

        // Police
        p.classList.remove('font-officiel', 'font-classic', 'font-italic');
        p.classList.add('font-' + state.font);

        // Texte (gestion moto/4x4 sur 2 lignes pour formats carrés)
        let txt = isDecorative() ? '' : (state.immat || getImmatPlaceholder());
        if (state.format === 'moto' || state.format === '4x4') {
            const parts = splitPlateText(txt);
            txt = parts.first + '\n' + parts.second;
        }
        $.plaqueText.textContent = txt;
        $.plaqueText.style.whiteSpace = 'pre-line';
        $.plaqueText.style.display = isDecorative() ? 'none' : '';
        updateDecorImageUI();

        // Message
        $.plaqueMsg.textContent = state.message;
        $.plaqueMsg.style.display = state.message ? '' : 'none';
        updateOfficialPlateSvg();

        // Bandes bleues : plaques route uniquement
        $.bandLeft.style.display = !isDecorative() && !isCollectionPlate() && state.euBand === 'yes' ? '' : 'none';
        $.bandRight.style.display = isDecorative() || isCollectionPlate() ? 'none' : '';

        $.euStars.classList.remove('has-car-logo', 'is-custom-text');
        $.euStars.style.backgroundImage = '';
        $.euStars.textContent = '';

        // Bande droite (département)
        $.deptLogo.innerHTML = getRightLogoMarkup();
        $.deptNum.textContent = state.dept;

        // Contour
        p.classList.remove('contour-int', 'contour-ext');
        if (state.contour !== 'none') {
            p.classList.add('contour-' + state.contour);
            p.style.setProperty('--contour-color', state.contourColor);
        }

        // Badge aperçu
        const homo = isCollectionPlate() ? 'Homologuée collection' : (isProvisionalPlate() ? 'Homologuée provisoire' : (state.homolog === 'yes' ? 'Homologuée' : 'Décorative'));
        $.previewBadge.textContent = isDecorative()
            ? `${getProductLabel()} · ${FORMAT_SIZES[state.format]}`
            : isProvisionalPlate()
                ? `${getProductLabel()} · Fond rose`
            : isCollectionPlate()
                ? `Plaque noire · ${homo}`
            : `${getProductSummaryLabel()} ${homo} · ${FORMAT_SIZES[state.format]}`;
        if ($.previewFormatMeta) $.previewFormatMeta.textContent = FORMAT_SIZES[state.format];
        if ($.previewPrimaryMetaLabel) $.previewPrimaryMetaLabel.textContent = isCollectionPlate() ? 'Usage' : (isDecorative() ? 'Image' : 'Département');
        if ($.previewDeptMeta) $.previewDeptMeta.textContent = isCollectionPlate()
            ? 'Collection noire'
            : isDecorative()
                ? (state.decorImageName || 'Image à importer')
                : `${state.dept} · ${state.deptName}`;
        updateLiveSummary();
    }

    /* ---------- AJOUT PANIER ---------- */
    function addToCart() {
        if (isDecorative()) {
            if (!state.decorImageData) {
                notify('Veuillez importer votre image pour la plaque décorative', 'error');
                goToStep(1);
                $.decorImageInput.focus();
                return;
            }
            if (!state.message.trim()) {
                notify('Veuillez ajouter votre texte pour la plaque décorative', 'error');
                goToStep(3);
                $.message.focus();
                return;
            }
        } else if (!state.immat) {
            notify('Veuillez renseigner l\'immatriculation à l\'étape 1', 'error');
            goToStep(1);
            $.immat.focus();
            return;
        }
        if (isProvisionalPlate()) {
            const regex = state.format === 'wgarage' ? /^W-[0-9]{3}-[A-Z]{2}$/ : /^WW-[0-9]{3}-[A-Z]{2}$/;
            if (!regex.test(state.immat)) {
                notify(state.format === 'wgarage'
                    ? 'Format W garage invalide (ex : W-123-AA)'
                    : 'Format WW invalide (ex : WW-123-AA)', 'error');
                goToStep(1);
                $.immat.focus();
                return;
            }
        } else if (!isDecorative() && state.homolog === 'yes') {
            const regex = state.immatMode === 'fni'
                ? /^\d{1,4}\s[A-Z]{1,3}\s(?:2A|2B|\d{2,3})$/
                : /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/;
            if (!regex.test(state.immat)) {
                notify(state.immatMode === 'fni'
                    ? 'Ancien format invalide (ex : 123 AB 45)'
                    : 'Format SIV invalide (AB-123-CD)', 'error');
                goToStep(1);
                $.immat.focus();
                return;
            }
            if (state.immatMode === 'fni' && !getFniDeptFromImmat(state.immat)) {
                notify('Département invalide dans l’ancien format', 'error');
                goToStep(1);
                $.immat.focus();
                return;
            }
        }

        const unitPrice = computeUnitPrice();
        const item = {
            id: 'plaque_' + Date.now(),
            type: 'plaque',
            name: isDecorative()
                ? `Plaque ${state.format.toUpperCase()} Déco - ${state.decorImageName}`
                : isProvisionalPlate()
                    ? `${getProductLabel()} - ${state.immat}`
                : isCollectionPlate()
                    ? `Plaque collection noire - ${state.immat}`
                    : `Plaque ${state.format.toUpperCase()} Homologuée - ${state.immat}`,
            details: {
                format: state.format,
                homolog: isCollectionPlate() ? 'collection' : (isProvisionalPlate() ? 'provisional' : state.homolog),
                immatMode: isDecorative() ? '' : state.immatMode,
                immat: isDecorative() ? '' : state.immat,
                font: state.font,
                dept: isDecorative() ? '' : state.dept,
                deptName: isDecorative() ? '' : state.deptName,
                euBand: isDecorative() ? 'no' : state.euBand,
                carLogo: state.carLogo,
                customCarLogoText: state.carLogo === 'custom' ? state.customCarLogoText : '',
                message: state.message,
                decorImageName: isDecorative() ? state.decorImageName : '',
                decorImageData: isDecorative() ? state.decorImageData : '',
                decorImageSource: isDecorative() ? 'upload' : '',
                decorAdminMessage: isDecorative() ? state.decorAdminMessage : '',
                contour: state.contour,
                contourColor: state.contourColor,
                rivets: state.rivets,
                rivetsUnitPrice: state.rivets ? RIVETS_UNIT_PRICE : 0
            },
            price: unitPrice,
            quantity: state.quantity
        };

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));

        if (typeof window.updateCartUI === 'function') window.updateCartUI();
        if ($.cartBtn) {
            $.cartBtn.classList.add('pulse');
            setTimeout(() => $.cartBtn.classList.remove('pulse'), 400);
        }
        notify(`Plaque ajoutée au panier (${state.quantity} × ${unitPrice.toFixed(2).replace('.', ',')}€)`, 'success');
    }

    function notify(msg, type) {
        if (typeof window.showNotification === 'function') window.showNotification(msg, type);
        else console.log(`[${type}] ${msg}`);
    }
})();
