# Guide Déploiement Macemay Custom sur Ionos

**Mis à jour :** 28 Mai 2026  
**Domaine de production :** `https://macemaycustom.fr`  
**Hébergeur :** Ionos (Apache, PHP 8.x, cURL)

---

## 📋 Checklist Pré-Déploiement

- [ ] Tous les fichiers HTML/CSS/JS testés en local
- [ ] Toutes les images optimisées et en place (`images/`, `pages/`)
- [ ] Fichier `site-config.js` mis à jour avec les bonnes URLs
- [ ] Clé Mollie API prête (mode test d'abord, puis production)
- [ ] Token admin généré et sécurisé
- [ ] Domaine pointé vers Ionos (DNS configuré)
- [ ] SSL/HTTPS activé sur Ionos
- [ ] `data/orders/` créé avec permissions `755` (ou `777` si nécessaire)

---

## 1️⃣ Préparation Fichiers Locaux

Avant l'envoi sur Ionos, vérifier en local que tout fonctionne :

```bash
# Lancer le serveur local
npm run dev  # ou python -m http.server si simple HTTP

# Ouvrir http://localhost:8000 et vérifier :
# - Accueil se charge bien
# - Catalogue affiche les plaques
# - Accessoires affichent le message vide
# - Page contact fonctionne
# - Panier s'ouvre/ferme
# - Images se chargent
```

### Fichiers À Envoyer

```
racine/
├── index.html
├── catalogue.html
├── configurateur.html
├── accessoires.html
├── textile.html
├── textile-entreprise.html
├── paiement-retour.html
├── robots.txt
├── sitemap.xml
├── .htaccess                     ← NOUVEAU (compression, HTTPS, cache)
├── script.js
├── styles.css
├── site-refonte.css
├── configurateur.js
├── shop-products.js
├── *.png (images hero)
├── pages/
│   ├── *.html (contact, faq, cgv, etc.)
│   ├── pages.css
│   └── ...
├── images/
│   ├── logos/
│   ├── regions/
│   └── ...
├── api/
│   ├── _bootstrap.php
│   ├── config.local.php          ← NE PAS ENVOYER PUBLIQUEMENT
│   ├── create-mollie-payment.php
│   ├── mollie-webhook.php
│   ├── order-status.php
│   ├── admin-orders.php
│   ├── .htaccess
│   └── config.sample.php
├── data/
│   ├── orders/                   ← Créer, permissions 755/777
│   └── .htaccess
```

### ⚠️ Fichiers À NE PAS Envoyer

```
.env                             # Variables sensibles
.venv/                           # Environnement Python
.git/                            # Historique Git
node_modules/                    # Dépendances Node
*.local.php                       # Config sensible
config.local.php                 # Mollie API Key (créer sur Ionos)
.DS_Store, thumbs.db             # Fichiers système
README.md (optionnel)            # Documentation locale
```

---

## 2️⃣ Configuration Ionos

### Étape A : Créer le Dossier Racine

1. **Connexion au FTP/SSH Ionos**
   ```bash
   # Via FTP : Adresse Ionos, identifiant FTP, mot de passe
   # Via SSH : ssh user@ionos-server.com
   ```

2. **Créer l'arborescence**
   ```bash
   mkdir -p /public_html/api
   mkdir -p /public_html/data/orders
   mkdir -p /public_html/images/logos
   mkdir -p /public_html/images/regions
   mkdir -p /public_html/pages
   chmod 755 /public_html/data/orders
   ```

### Étape B : Upload des Fichiers

1. **Via FTP (FileZilla, WinSCP, etc.)**
   - Charger tous les fichiers `.html`, `.css`, `.js` à la racine
   - Charger `images/` et `pages/` complètement
   - Charger `api/` avec tous les `.php` SAUF `config.local.php`

2. **Création de `config.local.php` Directement sur Ionos**
   ```bash
   # Via SSH ou Éditeur Ionos
   nano /public_html/api/config.local.php
   ```

   Copier ce contenu :
   ```php
   <?php
   return [
       'mollie_api_key' => 'test_xxxxxxxxxxxxxxxxxxxxxxxxxx',  // Remplacer par clé Mollie
       'admin_api_token' => 'votre-jeton-admin-tres-secret',   // Générer un jeton fort
       'currency' => 'EUR',
       'public_base_url' => 'https://macemaycustom.fr',
   ];
   ```

   **Important :** Ne jamais télécharger ce fichier, le créer directement sur le serveur Ionos.

### Étape C : Permissions Fichiers

```bash
# SSH sur Ionos
chmod 644 /public_html/*.html
chmod 644 /public_html/*.js
chmod 644 /public_html/*.css
chmod 755 /public_html/api
chmod 644 /public_html/api/*.php
chmod 600 /public_html/api/config.local.php    # Très restrictif
chmod 755 /public_html/data
chmod 755 /public_html/data/orders
```

### Étape D : SSL/HTTPS

1. **Ionos Panel → Paramètres SSL**
   - Activer HTTPS (Ionos fournit un certificat Let's Encrypt gratuit)
   - Forcer HTTPS via le `.htaccess` (déjà configuré)

2. **Tester :**
   ```bash
   curl -I https://macemaycustom.fr
   # Doit retourner 200, pas 301/302 après redirect
   ```

---

## 3️⃣ Configuration Mollie

### Sur Mollie Dashboard

1. Créer un compte Mollie (https://www.mollie.com)
2. Générer une clé API test (`test_...`) ou production (`live_...`)
3. Configurer le webhook dans Mollie Dashboard :
   - URL : `https://macemaycustom.fr/api/mollie-webhook.php`
   - Événements : `payment.created`, `payment.paid`, `payment.expired`, `payment.failed`, `payment.canceled`

### Sur Ionos (Fichier `config.local.php`)

```php
'mollie_api_key' => 'test_xxxxxxxxxxxxxxxxxxxxxx',
```

Remplacer `test_xxx` par la vraie clé Mollie (commencer en test, puis passer en `live_xxx`).

---

## 4️⃣ Configuration Site-Config.js

Mettre à jour [site-config.js](site-config.js) avec les vraies URLs Ionos :

```javascript
window.MACEMAY_CONFIG = {
    mollieCreatePaymentUrl: 'https://macemaycustom.fr/api/create-mollie-payment.php',
    mollieOrderStatusUrl: 'https://macemaycustom.fr/api/order-status.php',
    adminOrdersUrl: 'https://macemaycustom.fr/api/admin-orders.php',
};
```

**NE PAS mettre la clé Mollie ici** (c'est du JavaScript public).

---

## 5️⃣ Tests Post-Déploiement

### Test A : Page Chargée

```bash
curl -I https://macemaycustom.fr
# ✓ Status 200, Content-Type: text/html, charset=utf-8
```

### Test B : API Accessible

```bash
curl https://macemaycustom.fr/api/order-status.php?order=test
# ✓ Réponse JSON (erreur OK si pas de commande)
```

### Test C : Fichiers Sensibles Bloqués

```bash
curl https://macemaycustom.fr/api/config.local.php
# ✗ 403 Forbidden (attendu, .htaccess bloque)

curl https://macemaycustom.fr/api/_bootstrap.php
# ✗ 403 Forbidden (attendu)
```

### Test D : Paiement Mollie Test

1. Accéder à https://macemaycustom.fr/catalogue.html
2. Ajouter une plaque au panier
3. Cliquer "Commander"
4. Avec clé Mollie test, paiement test doit fonctionner
5. Vérifier que la commande passe en `paid` dans l'admin

### Test E : Compression & Cache

```bash
curl -H "Accept-Encoding: gzip" -I https://macemaycustom.fr/styles.css
# ✓ Content-Encoding: gzip (si mod_deflate activé)

curl -I https://macemaycustom.fr/script.js
# ✓ Cache-Control, Expires headers présents
```

---

## 6️⃣ Espace Admin

### Accéder à l'Admin

1. Ouvrir https://macemaycustom.fr/admin.html
2. Mot de passe admin (défini en local)
3. Section "Paramètres" → Token API Admin
   - Générer ou entrer un token fort
   - Le token doit correspondre à `admin_api_token` dans `config.local.php`

### Charger les Commandes IONOS

- Cliquer "Charger les commandes IONOS"
- Entrer le token admin
- Les commandes Mollie apparaissent

---

## 7️⃣ Monitoring & Logs

### Logs Ionos

- **Erreurs PHP :** `public_html/error.log` ou panel Ionos
- **Accès :** `public_html/access.log` (optionnel)
- **Mollie :** Webhook dans https://dashboard.mollie.com → Logs

### Health Checks Réguliers

```bash
# Cron Ionos (si nécessaire)
0 * * * * curl -s https://macemaycustom.fr > /dev/null
```

---

## 8️⃣ Migration Production (Test → Live)

1. **Mollie :**
   - Générer clé `live_xxxxx` sur Mollie
   - Remplacer dans `config.local.php` :
     ```php
     'mollie_api_key' => 'live_xxxxxxxxxxxxxxxxxxxxxx',
     ```

2. **Tester un paiement réel** (petite montant)

3. **Backup :**
   ```bash
   # Avant : backup config.local.php et data/orders
   tar -czf backup-macemay-$(date +%Y%m%d).tar.gz public_html/
   ```

4. **Monitoring :**
   - Vérifier dashboard Mollie après chaque paiement
   - Vérifier que les commandes arrivent en admin

---

## 🚨 Troubleshooting

### Problème : 503 Service Unavailable

**Cause :** PHP mal configuré ou mod_rewrite désactivé  
**Solution :**
- Contacter support Ionos, vérifier version PHP (8.0+)
- Vérifier `.htaccess` n'a pas d'erreur

### Problème : Paiement Mollie ne fonctionne pas

**Cause :** Clé API mal entrée ou webhook non appelé  
**Solution :**
- Vérifier clé dans `config.local.php`
- Tester webhook sur Mollie Dashboard
- Vérifier logs Ionos pour erreurs PHP

### Problème : Images ne s'affichent pas

**Cause :** Chemin relatif incorrect  
**Solution :**
- Vérifier que `/images/` a tous les fichiers
- Rechecker les URLs dans HTML (pas d'absolute path nécessaire)

### Problème : Cache gênant après mise à jour

**Solution :**
- Vider cache navigateur (Ctrl+Shift+Del)
- Vider cache Ionos si disponible
- Incrémenter version fichiers : `script.js?v=macemay-9`

---

## ✅ Checklist Finale

- [ ] Tous fichiers uploadés
- [ ] Permissions correctes (755 pour dossiers, 644 pour fichiers)
- [ ] `.htaccess` en place (redirection HTTPS, compression, cache)
- [ ] `config.local.php` créé sur Ionos avec vraies clés
- [ ] HTTPS fonctionne
- [ ] Images chargent
- [ ] API répond
- [ ] Mollie test fonctionne
- [ ] Mollie production prête (clé `live_`)
- [ ] Admin accès fonctionne
- [ ] Commandes se créent après paiement
- [ ] Logs surveillés

---

## 📞 Support Ionos

- **Chat support :** Dans le panel Ionos
- **Email :** support@ionos.fr
- **Téléphone :** +33 1 86 25 67 89

---

**Déploiement prêt !** 🚀
