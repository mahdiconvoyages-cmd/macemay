# Configuration Ionos - Instructions Rapides

**Domaine :** `https://macemaycustom.fr`  
**Hébergeur :** Ionos  
**Type :** Site statique + API PHP

---

## 📝 Checklist Rapide (5 min)

- [ ] Tous fichiers HTML/CSS/JS uploadés
- [ ] `api/` complet (tous `.php` sauf `config.local.php`)
- [ ] `data/orders/` créé (permissions `755`)
- [ ] `.htaccess` global en place
- [ ] `api/.htaccess` et `data/.htaccess` en place
- [ ] HTTPS activé
- [ ] `config.local.php` créé sur Ionos avec clés Mollie
- [ ] Test paiement Mollie réussi
- [ ] Commande visible en admin

---

## 🚀 Étapes Déploiement

### 1. Préparer Fichiers (Local)
```bash
# Vérifier que tout est prêt
bash pre-deploy-check.sh
# Résultat : "✅ PRÊT POUR UPLOAD IONOS"
```

### 2. Upload sur Ionos (FTP)
```
Fichiers : Tous les .html, .css, .js, .png
Dossiers : api/, data/, images/, pages/
SAUF : .env, node_modules/, config.local.php
```

### 3. Configuration Ionos (SSH ou Panel)

**SSH :**
```bash
ssh user@ionos-server
mkdir -p /public_html/data/orders
chmod 755 /public_html/data/orders
nano /public_html/api/config.local.php
```

**Contenu config.local.php :**
```php
<?php
return [
    'mollie_api_key' => 'test_xxxxxxxxxxxxxx',  // Remplacer
    'admin_api_token' => 'mon-token-secret',     // Remplacer
    'currency' => 'EUR',
    'public_base_url' => 'https://macemaycustom.fr',
];
```

**Permissions :**
```bash
chmod 644 /public_html/*.html /public_html/*.js /public_html/*.css
chmod 644 /public_html/api/*.php
chmod 600 /public_html/api/config.local.php
chmod 755 /public_html/data
chmod 755 /public_html/data/orders
```

> Si vous avez une clé API publique Ionos, vous pouvez la conserver dans `site-config.js` en lançant :
> 
> ```powershell
> .\deploy-ionos.ps1 -UpdateSiteConfig
> ```

### 4. Tester

```bash
# Page charge
curl https://macemaycustom.fr

# API répond
curl https://macemaycustom.fr/api/order-status.php?order=test

# Fichiers sensibles bloqués
curl https://macemaycustom.fr/api/config.local.php
# Doit retourner 403 Forbidden
```

### 5. Paiement Mollie

- [ ] Dashboard Mollie : webhook configurée sur `https://macemaycustom.fr/api/mollie-webhook.php`
- [ ] Test paiement avec clé `test_`
- [ ] Vérifier commande dans admin

### 6. Production

```php
// Dans config.local.php, remplacer :
'mollie_api_key' => 'live_xxxxxxxxxxxxxx',  // Clé production
```

---

## 📚 Fichiers Détaillés

- **[GUIDE_DEPLOIEMENT_IONOS.md](GUIDE_DEPLOIEMENT_IONOS.md)** - Guide complet étape-par-étape
- **[CHECKLIST_DEPLOIEMENT_IONOS.md](CHECKLIST_DEPLOIEMENT_IONOS.md)** - Checklist détaillée
- **[DEPLOIEMENT_IONOS_MOLLIE.md](DEPLOIEMENT_IONOS_MOLLIE.md)** - Config Mollie & API

---

## 🆘 Problèmes Courants

| Problème | Solution |
|----------|----------|
| 503 Service Unavailable | Vérifier PHP version 8.0+, vérifier `.htaccess` |
| Paiement Mollie échoue | Vérifier clé API, vérifier webhook URL |
| Images ne s'affichent | Vérifier `/images/` existe, vérifier chemins HTML |
| `config.local.php` visible | Vérifier `api/.htaccess` et permissions `600` |
| Cache gênant | Vider cache browser, incrémenter version `.js?v=X` |

---

## 📞 Support

- **Ionos :** support@ionos.fr | +33 1 86 25 67 89
- **Mollie :** support@mollie.com

---

**Status :** ✅ Prêt pour Ionos
