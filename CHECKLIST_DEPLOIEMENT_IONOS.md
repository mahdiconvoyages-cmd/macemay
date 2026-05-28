# 📋 Checklist Déploiement Ionos - Macemay Custom

**Date :** _____________  
**Responsable :** _____________  
**Statut :** ☐ En cours | ☐ Complété | ☐ Vérifié

---

## 🔧 Préparation Locale

### Code & Assets
- [ ] Tous les fichiers HTML validés (W3C)
- [ ] CSS minifiés et testés
- [ ] JavaScript sans erreurs console
- [ ] Images optimisées (JPG/PNG compressées)
- [ ] Icônes/fonts chargent correctement
- [ ] Pas de chemins absolus locaux (utiliser relatifs)
- [ ] site-config.js complété avec URLs Ionos

### Configuration
- [ ] `script.js` version à jour
- [ ] `admin.js` avec token admin généré
- [ ] `shop-products.js` sans données de test
- [ ] `robots.txt` configuré
- [ ] `sitemap.xml` complet

### Accumulateurs Mollie
- [ ] Mollie API test key prête
- [ ] Admin API token généré (aléatoire 32+ chars)
- [ ] Webhook URL : `https://macemaycustom.fr/api/mollie-webhook.php`

---

## 📤 Upload Ionos

### Structure Créée
- [ ] Dossier `/public_html/` créé
- [ ] `/api/` avec tous les fichiers `.php`
- [ ] `/data/orders/` vide mais présent
- [ ] `/images/logos/` et `/images/regions/`
- [ ] `/pages/` avec tous les `.html`

### Fichiers Uploadés
- [ ] `index.html` ✓
- [ ] `catalogue.html` ✓
- [ ] `configurateur.html` ✓
- [ ] `accessoires.html` ✓
- [ ] `textile.html` ✓
- [ ] `textile-entreprise.html` ✓
- [ ] `paiement-retour.html` ✓
- [ ] `admin.html` ✓
- [ ] Tous les `.css` ✓
- [ ] Tous les `.js` ✓
- [ ] Tous les `.png` (heroes) ✓
- [ ] `robots.txt` ✓
- [ ] `sitemap.xml` ✓
- [ ] `.htaccess` global ✓
- [ ] `api/*.php` (sauf config.local.php) ✓

### Configuration Ionos
- [ ] `api/config.local.php` créé (NE PAS télécharger)
- [ ] Clé Mollie test entrée
- [ ] Admin token entré
- [ ] Base URL correcte : `https://macemaycustom.fr`
- [ ] `api/.htaccess` en place
- [ ] `data/.htaccess` en place

### Permissions
- [ ] Fichiers HTML : `644`
- [ ] Fichiers CSS/JS : `644`
- [ ] Fichiers PHP : `644`
- [ ] Dossiers : `755`
- [ ] `config.local.php` : `600`
- [ ] `/data/orders/` : `755` (ou `777` si problème)

---

## 🔒 HTTPS & Sécurité

### SSL/HTTPS
- [ ] Certificat SSL activé (Let's Encrypt Ionos)
- [ ] Domain : `macemaycustom.fr` (sans www ou avec ?)
- [ ] HTTPS force activée dans `.htaccess`
- [ ] `https://macemaycustom.fr` ouvre correctement
- [ ] `http://macemaycustom.fr` redirige en HTTPS 301

### Fichiers Protégés
- [ ] `/api/config.local.php` → 403 (bloqué)
- [ ] `/api/_bootstrap.php` → 403 (bloqué)
- [ ] `/data/orders/` → pas d'accès directory listing
- [ ] `/.htaccess` → pas de téléchargement direct

---

## 🧪 Tests Fonctionnels

### Page Chargement
- [ ] Accueil (index.html) charge en < 3s
- [ ] Images hero affichent
- [ ] CSS appliqué (pas de défaut de style)
- [ ] Logo Macemay visible
- [ ] Navigation fonctionne
- [ ] Footer affiche crédits

### Catalogue & Plaques
- [ ] Catalogue.html charge
- [ ] Plaques s'affichent
- [ ] Filtre régions fonctionne
- [ ] Prévisualisation plaque fonctionne
- [ ] Ajouter au panier fonctionne
- [ ] Panier compteur s'incrémente

### Accessoires
- [ ] Accessoires.html charge
- [ ] État vide affiche message correct
- [ ] Lien "Demande accessoire" fonctionne
- [ ] Section "Commande accessoires" lisible

### Floquage (Textile)
- [ ] textile.html charge
- [ ] Galerie images s'affiche
- [ ] Bouton contact fonctionne

### Contact
- [ ] pages/contact.html charge
- [ ] Formulaire valide
- [ ] Envoi message fonctionne (ou prépare)
- [ ] Redirection après envoi OK

### Admin
- [ ] admin.html charge
- [ ] Écran login affiche
- [ ] Connexion avec mot de passe
- [ ] Section admin affiche bien
- [ ] Images hero peuvent s'uploader
- [ ] Accès aux commandes fonctionne

---

## 💳 Mollie Paiement

### Configuration API
- [ ] Mollie dashboard accédé
- [ ] Webhook enregistrée : `https://macemaycustom.fr/api/mollie-webhook.php`
- [ ] Événements sélectionnés (paid, failed, expired, canceled)
- [ ] Test key configurée dans `config.local.php`

### Tests Paiement (Mode Test)
- [ ] Ajouter plaque au panier
- [ ] Cliquer "Commander"
- [ ] Redirection vers Mollie test
- [ ] Paiement test approuvé
- [ ] Redirection vers `paiement-retour.html?order=...`
- [ ] Commande visible en admin (section Commandes)
- [ ] Statut changé en `paid`

### Tests API
- [ ] `POST /api/create-mollie-payment.php` répond
- [ ] `GET /api/order-status.php?order=XXX` répond JSON
- [ ] `/api/mollie-webhook.php` reçoit webhook Mollie
- [ ] Logs PHP sans erreur

---

## 📊 Performance & Cache

### Compression
- [ ] `gzip` activé (Deflate)
- [ ] Fichiers CSS compressés
- [ ] Fichiers JS compressés
- [ ] Images optimisées (< 100KB hero images)

### Cache
- [ ] Cache navigateur activé (30j CSS/JS)
- [ ] Cache HTML : 24h
- [ ] ETags/Last-Modified présents

### Vitesse
- [ ] FCP (First Contentful Paint) < 2s
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] CLS (Cumulative Layout Shift) < 0.1

---

## 📝 Documentation

### Sur Ionos
- [ ] `GUIDE_DEPLOIEMENT_IONOS.md` uploadé (optionnel)
- [ ] `DEPLOIEMENT_IONOS_MOLLIE.md` référencé
- [ ] Fichier `README.md` ou `DEPLOIEMENT.txt` en cas besoin

### Credentials Sécurisés
- [ ] Admin API token sauvegardé (gestionnaire passwords sécurisé)
- [ ] Clé Mollie sauvegardée (gestionnaire passwords sécurisé)
- [ ] FTP credentials changées après déploiement (optionnel)

---

## 🔄 Post-Déploiement (Semaine 1)

### Monitoring
- [ ] Vérifier logs erreurs Ionos (quotidien J1)
- [ ] Tester un paiement réel (mini montant)
- [ ] Vérifier commande dans admin
- [ ] Vérifier email client reçu (si applicable)

### Optimisations
- [ ] Analyser Google PageSpeed Insights
- [ ] Corriger warnings majeurs
- [ ] Tester sur mobile (iOS/Android)
- [ ] Tester compatibilité navigateurs

### Sauvegardes
- [ ] Backup complet public_html créé
- [ ] Backup `config.local.php` sécurisé
- [ ] Backup `data/orders/` planifié

---

## 🚀 Migration Production (Test → Live)

- [ ] Backup avant migration complet
- [ ] Clé Mollie `test_` changée en `live_`
- [ ] Domaine DNS pointe vers Ionos
- [ ] HTTPS vérifié
- [ ] Test paiement réel
- [ ] Logs surveillés

---

## 📞 Contacts d'Urgence

**Ionos Support :**
- Tél : +33 1 86 25 67 89
- Chat : panel.ionos.fr
- Email : support@ionos.fr

**Mollie Support :**
- Dashboard : mollie.com/support
- Email : support@mollie.com

---

## ✅ Validation Finale

**Signatures :**

Déploiement réalisé par : _________________ Date : _____________

Validation tech : _________________ Date : _____________

Validation client : _________________ Date : _____________

**Notes :** ___________________________________________________________________

________________________________________________________________________

________________________________________________________________________

---

**Status : ✅ PRÊT POUR PRODUCTION**
