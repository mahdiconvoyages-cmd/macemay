# Déploiement Ionos - Notes de Projet

**Mise à jour :** 28 Mai 2026  
**Status :** ✅ Prêt pour déploiement  
**Domaine :** https://macemaycustom.fr

---

## 📦 Fichiers Créés pour Ionos

| Fichier | Description | Priorité |
|---------|-------------|----------|
| `.htaccess` | Configuration Apache (HTTPS, compression, cache, sécurité) | ⭐⭐⭐ |
| `GUIDE_DEPLOIEMENT_IONOS.md` | Guide complet étape-par-étape | ⭐⭐⭐ |
| `CHECKLIST_DEPLOIEMENT_IONOS.md` | Checklist de vérification complète | ⭐⭐⭐ |
| `DEPLOIEMENT_RAPIDE_IONOS.md` | Résumé 5 minutes pour rappel | ⭐⭐ |
| `pre-deploy-check.sh` | Script Bash de vérification pré-upload | ⭐⭐ |
| `.gitignore` | Empêcher commit de secrets | ⭐⭐⭐ |
| `data/orders/.gitkeep` | Assurer dossier orders existe | ⭐⭐ |

---

## 🎯 Checklist de Préparation (À Faire AVANT Upload)

### 1. Validation Locale (Commande)
```bash
bash pre-deploy-check.sh
```
**Résultat attendu :** `✅ PRÊT POUR UPLOAD IONOS`

### 2. Vérifier Structure
```
✓ .htaccess global (racine)
✓ api/.htaccess (protection config)
✓ data/.htaccess (protection dossier)
✓ data/orders/ créé vide
✓ Tous les .html, .css, .js présents
✓ Tous les /pages/*.html présents
✓ Tous les /images/* présents
```

### 3. Vérifier Configuration
```
✓ site-config.js a MACEMAY_CONFIG
✓ URLs API relatives (api/create-mollie-payment.php)
✓ Pas de secrets en JavaScript
✓ robots.txt et sitemap.xml présents
```

### 4. Vérifier Sécurité
```
✓ Pas de .env présent
✓ Pas de config.local.php présent
✓ .gitignore ignore config.local.php
✓ Pas de node_modules, .venv uploadés
```

---

## 📋 Étapes d'Upload (Sur Ionos)

### 1. Préparation FTP (30 min)
```
- Créer structure /api/, /data/, /images/, /pages/
- Uploader tous les fichiers
- SAUF : .env, config.local.php, .venv/, node_modules/
```

### 2. Configuration SSH (15 min)
```bash
# Créer config.local.php localement sur Ionos
nano /public_html/api/config.local.php

# Ajouter :
# - mollie_api_key (test_xxx ou live_xxx)
# - admin_api_token (jeton fort aléatoire)
# - Garder currency = EUR et public_base_url = https://macemaycustom.fr
```

### 3. Permissions (10 min)
```bash
chmod 755 /public_html/data/orders
chmod 600 /public_html/api/config.local.php
```

### 4. Vérification HTTPS (5 min)
```bash
curl -I https://macemaycustom.fr
# Status : 200 OK
# Pas de redirection 301/302
```

### 5. Test Paiement (15 min)
```
- Ajouter plaque au panier
- Cliquer "Commander"
- Mollie test payment doit fonctionner
- Commande doit apparaître en admin
```

---

## 🔐 Secrets à Configurer (SUR IONOS UNIQUEMENT)

| Variable | Où | Format |
|----------|-----|--------|
| `mollie_api_key` | `api/config.local.php` | `test_xxxxx` (dev) ou `live_xxxxx` (prod) |
| `admin_api_token` | `api/config.local.php` | Jeton aléatoire 32+ caractères |
| Webhook Mollie | Dashboard Mollie | URL : `https://macemaycustom.fr/api/mollie-webhook.php` |

**⚠️ JAMAIS en Git, JAMAIS en JavaScript, JAMAIS en commit**

---

## 📚 Documentation Complète

### Pour Admin/Support
- **[GUIDE_DEPLOIEMENT_IONOS.md](GUIDE_DEPLOIEMENT_IONOS.md)** - Tout en détail
- **[CHECKLIST_DEPLOIEMENT_IONOS.md](CHECKLIST_DEPLOIEMENT_IONOS.md)** - Checklist complète

### Pour Dev/Rappel Rapide
- **[DEPLOIEMENT_RAPIDE_IONOS.md](DEPLOIEMENT_RAPIDE_IONOS.md)** - Résumé 5 min

### Original (Déjà Existant)
- **[DEPLOIEMENT_IONOS_MOLLIE.md](DEPLOIEMENT_IONOS_MOLLIE.md)** - Config Mollie + API

---

## 🚀 Ordre de Priorité

1. **URGENT** - Créer `.htaccess` global ✅
2. **URGENT** - Créer guide déploiement ✅
3. **IMPORTANT** - Créer checklist ✅
4. **IMPORTANT** - Créer script vérification ✅
5. **RECOMMANDÉ** - Créer .gitignore ✅
6. **OPTIONNEL** - Créer guide rapide ✅

---

## 🧪 Après Upload (Checklist Post-Déploiement)

- [ ] `https://macemaycustom.fr` ouvre sans erreur
- [ ] Fichier `config.local.php` inaccessible (403 Forbidden)
- [ ] Fichier `_bootstrap.php` inaccessible (403 Forbidden)
- [ ] Dossier `/data/orders/` non lisible publiquement
- [ ] Paiement test Mollie fonctionne
- [ ] Commande visible en admin
- [ ] Images se chargent correctement
- [ ] CSS appliqué correctement
- [ ] WhatsApp button visible
- [ ] Compression gzip active
- [ ] Cache headers présents

---

## 🆘 Support

### Problèmes Ionos
- Support Ionos : support@ionos.fr
- Tél : +33 1 86 25 67 89
- Chat : ionos.fr panel

### Problèmes Mollie
- Support Mollie : support@mollie.com
- Dashboard : mollie.com/support

### Problèmes Code
- Vérifier logs Ionos : `/error.log`
- Vérifier logs Mollie : Dashboard → Logs
- Relancer avec clé test d'abord

---

## ✅ Validation Finale

**À faire AVANT de passer en production :**

1. [ ] Script `pre-deploy-check.sh` passe sans erreurs
2. [ ] Tous fichiers uploadés avec bonnes permissions
3. [ ] `config.local.php` créé avec vraies clés
4. [ ] HTTPS fonctionne
5. [ ] Paiement test Mollie réussi
6. [ ] Commande visible en admin
7. [ ] Dossier `/data/orders/` inscriptible

**Ensuite :** Changer clé Mollie de `test_` en `live_`, faire test réel, monitorer.

---

**Status Final :** ✅ **PRÊT POUR IONOS** 🚀
