# Déploiement GitHub → Ionos via SSH/Git

**Dépôt GitHub :** `https://github.com/compteclient/macemay.git`  
**Domaine Ionos :** `https://macemaycustom.fr`  
**Dossier public :** `/public_html/`

---

## Étape 1 : Connexion SSH à Ionos

```bash
ssh user@ionos-server
# Remplacer user par votre login Ionos
```

Vous devrez entrer votre mot de passe SSH Ionos.

---

## Étape 2 : Cloner le dépôt GitHub dans `/public_html/`

```bash
cd /home/user
git clone https://github.com/compteclient/macemay.git public_html
cd public_html
```

Cela crée le dossier `public_html` et y télécharge tous les fichiers du dépôt.

> **Important :** Si `/public_html/` existe déjà, sauvegardez-le d'abord, ou videz-le, ou clonez dans un dossier temporaire puis copiez.

---

## Étape 3 : Vérifier les fichiers importants

```bash
ls -la
# Vous devez voir :
# - .htaccess (configuration Apache)
# - index.html
# - api/ (dossier)
# - data/ (dossier)
# - README.md
# - LICENSE
```

---

## Étape 4 : Créer `api/config.local.php`

```bash
nano api/config.local.php
```

Copier-coller le contenu ci-dessous :

```php
<?php
return [
    'mollie_api_key' => 'test_xxxxxxxxxxxxxxxxxxxxxx',  // ← Remplacer par votre clé Mollie
    'admin_api_token' => 'votre-jeton-admin-tres-secret',  // ← Générer un jeton fort
    'currency' => 'EUR',
    'public_base_url' => 'https://macemaycustom.fr',
];
```

Sauvegarder :
- Appuyer sur `Ctrl+O` → Enter
- Appuyer sur `Ctrl+X` pour quitter

---

## Étape 5 : Créer `/data/orders/` s'il n'existe pas

```bash
mkdir -p data/orders
chmod 755 data/orders
```

---

## Étape 6 : Configurer les permissions

```bash
chmod 644 *.html *.css *.js *.png *.jpg
chmod 644 api/*.php
chmod 600 api/config.local.php
chmod 755 api
chmod 755 data
chmod 755 images
chmod 755 pages
```

---

## Étape 7 : Vérifier les fichiers sensibles sont bloqués

```bash
curl https://macemaycustom.fr/api/config.local.php
# Doit retourner : 403 Forbidden
```

---

## Étape 8 : Tester le site

```bash
curl -I https://macemaycustom.fr
# Doit retourner : HTTP/1.1 200 OK
```

---

## Étape 9 : Garder le repo à jour (optionnel)

Pour mettre à jour depuis GitHub plus tard :

```bash
cd /public_html
git pull origin main
```

Puis refaire les étapes 4 et 6 si nécessaire.

---

## 🆘 Problèmes courants

### Erreur : "Permission denied (publickey)" lors du clone
- Vous devez utiliser HTTPS (pas SSH)
- Utilisez : `git clone https://github.com/compteclient/macemay.git`

### Erreur : "File exists" lors du clone
- Le dossier `/public_html/` existe déjà
- Renommez l'ancien dossier ou videz-le d'abord
- Puis relancez le clone

### Les fichiers ne s'affichent pas après le clone
- Vérifier les permissions : `chmod 644` sur les fichiers
- Vérifier que HTTPS est activé sur Ionos

### API ne fonctionne pas
- Vérifier que `api/config.local.php` existe et contient la clé Mollie
- Vérifier que PHP 8.0+ est activé sur Ionos
- Vérifier les logs : `/var/log/apache2/error.log`

---

## Résumé des commandes

```bash
ssh user@ionos-server
cd /home/user
git clone https://github.com/compteclient/macemay.git public_html
cd public_html
nano api/config.local.php
# [Ajouter config.local.php]
mkdir -p data/orders
chmod 755 data/orders
chmod 644 *.html *.css *.js *.png *.jpg
chmod 644 api/*.php
chmod 600 api/config.local.php
chmod 755 api data images pages
curl -I https://macemaycustom.fr
# ✓ Vous êtes prêt !
```

---

## Après le déploiement

- [ ] Tester la page d'accueil
- [ ] Tester l'admin
- [ ] Faire un paiement test Mollie
- [ ] Vérifier les commandes dans l'admin
- [ ] Changer clé Mollie de `test_` en `live_` pour la production

**Bon déploiement !** 🚀
