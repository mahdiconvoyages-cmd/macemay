# Boutique + PayPal (Ionos)

## Côté admin (navigateur)

1. Ouvrir `admin.html` → section **Boutique en ligne**.
2. Créer un produit : nom, description, **prix TTC**, image, cocher **publié**.
3. Le produit apparaît sur `boutique.html` avec bouton **Ajouter au panier**.

## Côté client

1. Page **Boutique** → ajouter des articles au panier.
2. **Payer avec PayPal** → PayPal affiche le total calculé à partir des prix admin.
3. Après paiement, la commande est enregistrée (local + serveur Ionos).

## Configuration PayPal Developer

1. Créer une app sur [developer.paypal.com](https://developer.paypal.com).
2. Récupérer **Client ID** et **Secret** (sandbox pour les tests).
3. Sur Ionos, dans `api/config.local.php` :

```php
'paypal_client_id' => 'VOTRE_CLIENT_ID',
'paypal_client_secret' => 'VOTRE_SECRET',
'paypal_mode' => 'sandbox', // puis 'live' en production
```

4. Dans `site-config.js` (public), renseigner uniquement le Client ID :

```js
paypalClientId: 'VOTRE_CLIENT_ID',
```

Ne jamais mettre le **Secret** dans `site-config.js`.

## Fichiers API ajoutés

- `api/create-paypal-order.php` — crée la commande PayPal avec le détail des articles et prix.
- `api/capture-paypal-order.php` — valide le paiement après approbation client.

## Plaques vs boutique

- **Plaques** : paiement **Mollie** (inchangé).
- **Boutique** : paiement **PayPal** uniquement.
- Impossible de mélanger plaques et boutique dans le même panier.
