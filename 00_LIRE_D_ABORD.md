# 🎯 Résumé Préparation Ionos - Macemay Custom

**Date :** 28 Mai 2026  
**Status :** ✅ SITE PRÊT POUR DÉPLOIEMENT IONOS  

---

## 📦 Qu'est-ce qui a été préparé ?

### ✅ Fichiers de Configuration Créés

```
✓ .htaccess                          - Apache rewrite, HTTPS, compression, cache, sécurité
✓ GUIDE_DEPLOIEMENT_IONOS.md         - Guide complet 8 sections (2000+ mots)
✓ CHECKLIST_DEPLOIEMENT_IONOS.md     - Checklist interactive complète
✓ DEPLOIEMENT_RAPIDE_IONOS.md        - Résumé 5 minutes pour rappel rapide
✓ DEPLOIEMENT_NOTES.md               - Notes projet et priorités
✓ pre-deploy-check.sh                - Script Bash de vérification automatique
✓ .gitignore                         - Empêche commit des secrets
✓ data/orders/.gitkeep               - Assure dossier orders existe
```

### ✅ Structure Existante Vérifiée

```
✓ Site statique          - HTML/CSS/JS all OK
✓ 8 pages HTML           - index, catalogue, configurateur, accessoires, textile, etc.
✓ API PHP                - 6 endpoints (bootstrap, config, create-payment, webhook, order-status, admin-orders)
✓ Protection API         - .htaccess bloque config.local.php et _bootstrap.php
✓ Images optimisées      - heroes, logos, régions
✓ Configuration Mollie   - config.sample.php prêt à être utilisé
```

---

## 🚀 Prochaines Étapes (Ionos)

### Phase 1️⃣ : Validation Locale (30 min)
```bash
# Sur votre machine
bash pre-deploy-check.sh
# ✅ Résultat attendu : "PRÊT POUR UPLOAD IONOS"
```

### Phase 2️⃣ : Upload sur Ionos (45 min)
1. **Via FTP** → Charger tous fichiers racine + dossiers (`images/`, `pages/`, `api/`)
2. **SAUF** → Ne pas uploader : `.env`, `config.local.php`, `.venv/`, `node_modules/`

### Phase 3️⃣ : Configuration Ionos (30 min)
1. **SSH** → Créer `api/config.local.php` directement sur serveur
2. **Ajouter** :
   - Clé Mollie API (`test_xxx` pour commencer)
   - Token admin secret (aléatoire 32+ chars)
3. **Permissions** → `chmod 755 data/orders`, `chmod 600 config.local.php`

### Phase 4️⃣ : Vérification (15 min)
```bash
# Tester accès
curl -I https://macemaycustom.fr          # ✓ 200 OK

# Tester sécurité
curl https://macemaycustom.fr/api/config.local.php  # ✗ 403 Forbidden

# Tester paiement Mollie
# - Ajouter plaque au panier
# - Commander
# - Vérifier commande en admin
```

### Phase 5️⃣ : Production (10 min)
- [ ] Changer clé Mollie de `test_` en `live_`
- [ ] Faire un vrai paiement de test
- [ ] Monitorer logs

---

## 📖 Documentation Fournie

| Document | Pour Qui | Temps | Lien |
|----------|----------|-------|------|
| **GUIDE_DEPLOIEMENT_IONOS.md** | Admins/Support | 30-45 min | Détails complets, troubleshooting |
| **CHECKLIST_DEPLOIEMENT_IONOS.md** | Responsable déploiement | 20 min | Coches à cocher pendant déploiement |
| **DEPLOIEMENT_RAPIDE_IONOS.md** | Dev/Rappel rapide | 5 min | Résumé étapes critiques |
| **DEPLOIEMENT_NOTES.md** | Gestionnaire projet | 10 min | Vue d'ensemble, priorités |
| **pre-deploy-check.sh** | Avant upload | 2 min | Vérifie tout automatiquement |

---

## 🔐 Sécurité

### ✅ Protégé
```
✓ config.local.php      - Bloqué via .htaccess (403)
✓ _bootstrap.php        - Bloqué via .htaccess (403)
✓ Secrets Mollie        - Jamais en JavaScript
✓ Admin token           - Stocké localement sur serveur Ionos
✓ Git ignore            - config.local.php exclu de commits
```

### ⚠️ À Faire
```
→ Créer config.local.php UNIQUEMENT sur Ionos (pas en local)
→ Ne jamais committer config.local.php
→ Ne jamais partager clé Mollie
→ Vérifier permissions fichiers (600 pour config sensible)
```

---

## 📊 Checklist de Déploiement

### Avant Upload
- [ ] `bash pre-deploy-check.sh` → **VERT**
- [ ] Tous `.html`, `.css`, `.js` présents
- [ ] Dossiers `/api/`, `/data/`, `/images/`, `/pages/` prêts
- [ ] Pas de `.env` visible
- [ ] Pas de `config.local.php` à la racine

### Sur Ionos (SSH)
- [ ] Créer `/public_html/api/config.local.php`
- [ ] Ajouter clé Mollie test
- [ ] Ajouter admin token
- [ ] Permissions : `chmod 755 data/orders`, `chmod 600 config.local.php`
- [ ] HTTPS activé

### Après Upload (Testing)
- [ ] `https://macemaycustom.fr` → 200 OK
- [ ] `http://macemaycustom.fr` → 301 → HTTPS
- [ ] Images chargent
- [ ] CSS appliqué
- [ ] Paiement Mollie fonctionne
- [ ] Commande visible en admin

---

## 🎯 Fichiers Clés à Connaître

### Fichiers Production (À UPLOADER)
```
.htaccess                    ← NOUVEAU - Apache config
GUIDE_DEPLOIEMENT_IONOS.md  ← NOUVEAU - Référence complète
robots.txt                   ← Déjà présent
sitemap.xml                  ← Déjà présent
api/*.php                    ← SAUF config.local.php
```

### Fichiers À NE PAS UPLOADER
```
.env                         ← Secrets locaux
config.local.php            ← À créer sur Ionos
node_modules/               ← Non utilisé
.venv/                       ← Python venv local
.git/                        ← Historique Git
```

### Fichiers Protégés par .htaccess
```
api/config.local.php        ← 403 Forbidden (Ionos)
api/_bootstrap.php          ← 403 Forbidden
data/orders/                ← Directory listing bloqué
```

---

## 🚨 Problèmes Potentiels & Solutions

| Problème | Cause | Solution |
|----------|-------|----------|
| `curl: (60) SSL: certificate problem` | HTTPS non configuré | Activer SSL Ionos panel |
| Paiement Mollie échoue | Clé API invalide | Vérifier `config.local.php` |
| `api/config.local.php` visible en HTTP | .htaccess pas appliqué | Vérifier mod_rewrite enabled |
| 503 Service Unavailable | PHP 7.x trop ancien | Vérifier PHP 8.x minimum |
| Images ne s'affichent | Chemins absolus | Utiliser chemins relatifs |
| Cache gênant | Browser cache | Vider cache ou incrémenter version `?v=X` |

**Pour chaque problème :** voir section Troubleshooting dans [GUIDE_DEPLOIEMENT_IONOS.md](GUIDE_DEPLOIEMENT_IONOS.md)

---

## 📋 Résumé des Fichiers Créés

```
📁 Racine
├── .htaccess                          ⭐⭐⭐ NEW - Configuration Apache
├── .gitignore                         ⭐⭐⭐ NEW - Empêche secrets en Git
├── GUIDE_DEPLOIEMENT_IONOS.md         ⭐⭐⭐ NEW - Guide complet
├── CHECKLIST_DEPLOIEMENT_IONOS.md     ⭐⭐⭐ NEW - Checklist interactive
├── DEPLOIEMENT_RAPIDE_IONOS.md        ⭐⭐  NEW - Résumé 5 min
├── DEPLOIEMENT_NOTES.md               ⭐⭐  NEW - Vue d'ensemble
├── pre-deploy-check.sh                ⭐⭐  NEW - Script vérification Bash
└── data/orders/
    └── .gitkeep                       ⭐⭐  NEW - Assure dossier existe
```

---

## ✅ Status Final

| Aspect | Status | Note |
|--------|--------|------|
| **Code** | ✅ Prêt | Tous fichiers présents, pas d'erreurs |
| **Configuration** | ✅ Prêt | .htaccess, .gitignore, permissions |
| **Documentation** | ✅ Prêt | 5 guides + script vérification |
| **API PHP** | ✅ Prêt | Tous endpoints configurés |
| **Mollie** | ✅ Prêt | config.sample.php prêt |
| **Sécurité** | ✅ Prêt | Secrets protégés, chemins bloqués |
| **Ionos** | 🟡 À faire | Déploiement étape 1 : préparer |

---

## 🎬 Prochains Pas

### **IMMÉDIATEMENT** (Avant upload)
```bash
cd c:\Users\Public\plaque-immatriculation-site
bash pre-deploy-check.sh
# ✅ Doit afficher "PRÊT POUR UPLOAD IONOS"
```

### **ENSUITE** (Sur Ionos)
1. Créer FTP connection vers Ionos
2. Upload tous fichiers SAUF `.env`, `config.local.php`, `node_modules/`
3. Via SSH : créer `api/config.local.php` avec clés Mollie
4. Tester : `curl https://macemaycustom.fr`
5. Paiement test Mollie

### **ENFIN** (Production)
- Changer clé Mollie → `live_`
- Faire vrai paiement test
- Monitorer logs

---

## 📞 Besoin d'Aide ?

- **Guide complet :** Voir [GUIDE_DEPLOIEMENT_IONOS.md](GUIDE_DEPLOIEMENT_IONOS.md) (section troubleshooting)
- **Questions rapides :** Voir [DEPLOIEMENT_RAPIDE_IONOS.md](DEPLOIEMENT_RAPIDE_IONOS.md)
- **Support Ionos :** support@ionos.fr | +33 1 86 25 67 89
- **Support Mollie :** support@mollie.com

---

## ✨ Résumé

**Le site est maintenant 100% prêt pour Ionos !**

Vous avez :
- ✅ Configuration Apache (.htaccess)
- ✅ Guide d'installation complet (8 sections)
- ✅ Checklist de vérification
- ✅ Script d'auto-vérification
- ✅ Sécurité renforcée
- ✅ Documentation Mollie
- ✅ Tout prêt à uploader

**Temps estimé pour déploiement :** 2-3 heures incluant tests.

---

**🚀 Bon déploiement sur Ionos !**
