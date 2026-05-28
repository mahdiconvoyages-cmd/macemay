# Deploiement IONOS + Mollie

Domaine de production : `https://macemaycustom.fr`

## 1. Hebergement IONOS

Le site peut etre depose sur un hebergement IONOS compatible PHP 8.x. Les fichiers HTML/CSS/JS restent statiques, et le dossier `api/` sert uniquement a creer les paiements Mollie et a recevoir le webhook.

A envoyer sur IONOS :

- Tous les fichiers `.html`, `.css`, `.js`.
- Les dossiers `images/`, `pages/`, `api/`, `data/`.
- Le fichier `data/.htaccess` doit rester en place pour bloquer l'acces public aux commandes stockees.

## 2. Configuration Mollie

Sur IONOS, copier :

```text
api/config.sample.php -> api/config.local.php
```

Puis renseigner :

```php
<?php
return [
    'mollie_api_key' => 'live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'admin_api_token' => 'un-jeton-admin-long-et-secret',
    'currency' => 'EUR',
    'public_base_url' => 'https://macemaycustom.fr',
];
```

Important :

- Ne jamais mettre la cle Mollie dans `site-config.js`.
- `config.local.php` est protege par `.htaccess`, mais il ne doit pas etre partage publiquement.
- `public_base_url` force les URLs de retour et webhook Mollie sur le domaine IONOS `https://macemaycustom.fr`.
- Tester d'abord avec une cle `test_...`, puis passer en cle `live_...`.

## 3. Flux paiement

Le bouton de commande appelle :

```text
api/create-mollie-payment.php
```

Cet endpoint :

- recoit le panier complet,
- cree une commande en statut `pending`,
- cree le paiement Mollie,
- renvoie l'URL de paiement Mollie.

Mollie appelle ensuite automatiquement :

```text
api/mollie-webhook.php
```

Le webhook met la commande en statut `paid`, `failed`, `canceled`, etc.

En production, Mollie recevra le webhook :

```text
https://macemaycustom.fr/api/mollie-webhook.php
```

Le client revient sur :

```text
https://macemaycustom.fr/paiement-retour.html?order=NUMERO_COMMANDE
```

Cette page lit :

```text
api/order-status.php
```

## 4. Commandes dans l'admin

Dans l'espace administrateur, section `Commandes`, cliquer sur `Charger les commandes IONOS` puis entrer le `admin_api_token` defini dans `api/config.local.php`.

Le jeton est conserve dans le navigateur de l'administrateur. Il peut etre supprime depuis la console navigateur avec :

```js
localStorage.removeItem('macemay_admin_api_token')
```

## 5. Verification avant mise en ligne

- Activer HTTPS sur IONOS.
- Verifier que `https://macemaycustom.fr` ouvre bien le site et que `http://macemaycustom.fr` redirige vers HTTPS.
- Verifier que PHP cURL est disponible.
- Verifier que `data/orders/` est inscriptible par PHP.
- Faire un paiement test Mollie.
- Verifier que la commande passe en `paid` dans l'admin.
- Passer la cle Mollie de `test_...` a `live_...` uniquement apres validation.
