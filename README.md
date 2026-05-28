# macemay

Site e-commerce pour plaques d'immatriculation et accessoires, avec backend PHP pour traitement des paiements Mollie.

## Structure

- `index.html` et pages statiques dans la racine
- `pages/` pour les pages légales et contact
- `images/` pour les visuels et logos
- `api/` pour les endpoints PHP Mollie et administration
- `data/` pour les commandes et fichiers protégés
- `site-config.js` pour les URLs API public

## Déploiement GitHub

Ce dépôt est prêt à être poussé sur GitHub.

```bash
git remote add origin https://github.com/compteclient/macemay.git
git branch -M main
git push -u origin main
```

Si vous utilisez SSH :

```bash
git remote set-url origin git@github.com:compteclient/macemay.git
git push -u origin main
```

## Notes Ionos

- `api/config.local.php` doit être créé directement sur le serveur Ionos avec la clé Mollie et le token admin.
- `deploy-ionos.ps1` permet de préparer la configuration locale avec une clé API publique Ionos.
- Ne pas uploader `config.local.php` dans le dépôt.

## Fichiers importants

- `.htaccess` - configuration Apache/HTTPS/sécurité
- `pre-deploy-check.sh` - vérification pré-déploiement
- `deploy-ionos.ps1` - script de préparation déploiement Ionos
- `GUIDE_DEPLOIEMENT_IONOS.md` - guide détaillé de déploiement
- `CHECKLIST_DEPLOIEMENT_IONOS.md` - checklist de vérification
