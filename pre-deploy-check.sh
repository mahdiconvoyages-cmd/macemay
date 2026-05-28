#!/bin/bash
# Script de vérification pré-déploiement Ionos
# Usage: bash pre-deploy-check.sh

echo "📋 Macemay Custom - Vérification Pré-Déploiement Ionos"
echo "========================================================"
echo ""

ERRORS=0
WARNINGS=0

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Fonction pour afficher les logs
log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
    ((ERRORS++))
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# ==============================================================================
# 1. Vérifier les fichiers HTML
# ==============================================================================
echo "🔍 1. Vérification Fichiers HTML"
echo "--------------------------------"

HTML_FILES=("index.html" "catalogue.html" "configurateur.html" "boutique.html" "accessoires.html" "textile.html" "textile-entreprise.html" "paiement-retour.html" "admin.html")

for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        log_success "$file présent"
        
        # Vérifier que le fichier contient des balises HTML minimales
        if grep -q "<html\|<!DOCTYPE" "$file"; then
            log_success "$file a une structure HTML valide"
        else
            log_warning "$file ne semble pas avoir de doctype"
        fi
        
        # Vérifier site-config.js est chargé
        if grep -q "site-config.js" "$file"; then
            log_success "$file charge site-config.js"
        else
            log_warning "$file ne charge pas site-config.js"
        fi
    else
        log_error "$file manquant"
    fi
done

echo ""

# ==============================================================================
# 2. Vérifier les fichiers CSS/JS
# ==============================================================================
echo "🎨 2. Vérification CSS/JS"
echo "-------------------------"

CSS_FILES=("styles.css" "site-refonte.css" "admin.css" "configurateur.css" "pages/pages.css")
JS_FILES=("script.js" "shop-products.js" "configurateur.js" "admin.js" "site-config.js" "cookies.js")

for file in "${CSS_FILES[@]}"; do
    if [ -f "$file" ]; then
        SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        if [ "$SIZE" -gt 0 ]; then
            log_success "$file OK ($(numfmt --to=iec-i --suffix=B $SIZE 2>/dev/null || echo $SIZE bytes))"
        else
            log_error "$file vide"
        fi
    else
        log_error "$file manquant"
    fi
done

for file in "${JS_FILES[@]}"; do
    if [ -f "$file" ]; then
        SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        if [ "$SIZE" -gt 0 ]; then
            log_success "$file OK ($(numfmt --to=iec-i --suffix=B $SIZE 2>/dev/null || echo $SIZE bytes))"
        else
            log_error "$file vide"
        fi
    else
        log_error "$file manquant"
    fi
done

echo ""

# ==============================================================================
# 3. Vérifier les images
# ==============================================================================
echo "🖼️  3. Vérification Images"
echo "------------------------"

IMAGES=("hero-1.png" "hero-2.png" "hero-3.png" "logo.jpg")

for img in "${IMAGES[@]}"; do
    if [ -f "$img" ]; then
        SIZE=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        log_success "$img OK ($SIZE bytes)"
    else
        log_warning "$img manquante (non-critique)"
    fi
done

if [ -d "images/logos" ] && [ "$(ls -A images/logos)" ]; then
    log_success "Dossier images/logos présent et non-vide"
else
    log_warning "Dossier images/logos vide ou absent"
fi

if [ -d "images/regions" ] && [ "$(ls -A images/regions)" ]; then
    log_success "Dossier images/regions présent et non-vide"
else
    log_warning "Dossier images/regions vide ou absent"
fi

echo ""

# ==============================================================================
# 4. Vérifier les fichiers API PHP
# ==============================================================================
echo "⚙️  4. Vérification API PHP"
echo "---------------------------"

API_FILES=("api/_bootstrap.php" "api/config.sample.php" "api/create-mollie-payment.php" "api/mollie-webhook.php" "api/create-paypal-order.php" "api/capture-paypal-order.php" "api/order-status.php" "api/admin-orders.php")

for file in "${API_FILES[@]}"; do
    if [ -f "$file" ]; then
        if grep -q "<?php" "$file"; then
            log_success "$file présent et est un fichier PHP"
        else
            log_warning "$file présent mais ne semble pas être du PHP valide"
        fi
    else
        log_error "$file manquant"
    fi
done

# Vérifier que config.local.php NE PAS présent
if [ ! -f "api/config.local.php" ]; then
    log_success "config.local.php n'existe pas (à créer sur Ionos)"
else
    log_warning "config.local.php existe - À NE PAS uploader!"
fi

echo ""

# ==============================================================================
# 5. Vérifier les fichiers de protection
# ==============================================================================
echo "🔒 5. Vérification Sécurité"
echo "---------------------------"

if [ -f ".htaccess" ]; then
    if grep -q "RewriteEngine On" ".htaccess"; then
        log_success ".htaccess présent avec mod_rewrite"
    else
        log_warning ".htaccess présent mais mod_rewrite absent"
    fi
else
    log_error ".htaccess manquant (devrait être à la racine)"
fi

if [ -f "api/.htaccess" ]; then
    if grep -q "Require all denied" "api/.htaccess"; then
        log_success "api/.htaccess protège les fichiers sensibles"
    else
        log_warning "api/.htaccess présent mais règles incomplètes"
    fi
else
    log_error "api/.htaccess manquant"
fi

if [ -f "data/.htaccess" ]; then
    log_success "data/.htaccess en place"
else
    log_warning "data/.htaccess manquant - recommandé de créer"
fi

echo ""

# ==============================================================================
# 6. Vérifier les fichiers de configuration
# ==============================================================================
echo "⚙️  6. Vérification Configuration"
echo "--------------------------------"

if [ -f "site-config.js" ]; then
    if grep -q "MACEMAY_CONFIG" "site-config.js"; then
        log_success "site-config.js contient MACEMAY_CONFIG"
        
        if grep -q "mollieCreatePaymentUrl.*api/" "site-config.js"; then
            log_success "URLs Mollie utilisent URLs relatives (bon pour Ionos)"
        else
            log_warning "URLs Mollie peuvent être absolues - à vérifier"
        fi
    else
        log_error "site-config.js ne contient pas MACEMAY_CONFIG"
    fi
else
    log_error "site-config.js manquant"
fi

if [ -f "robots.txt" ]; then
    if grep -q "Sitemap:" "robots.txt"; then
        log_success "robots.txt contient Sitemap"
    else
        log_warning "robots.txt n'a pas de lien Sitemap"
    fi
else
    log_warning "robots.txt manquant (optionnel mais recommandé)"
fi

if [ -f "sitemap.xml" ]; then
    if grep -q "<?xml" "sitemap.xml"; then
        log_success "sitemap.xml présent et valide"
    else
        log_warning "sitemap.xml n'a pas de déclaration XML"
    fi
else
    log_warning "sitemap.xml manquant (optionnel mais recommandé)"
fi

echo ""

# ==============================================================================
# 7. Vérifier les fichiers documentation
# ==============================================================================
echo "📚 7. Vérification Documentation"
echo "-------------------------------"

if [ -f "GUIDE_DEPLOIEMENT_IONOS.md" ]; then
    log_success "GUIDE_DEPLOIEMENT_IONOS.md présent"
else
    log_warning "GUIDE_DEPLOIEMENT_IONOS.md manquant"
fi

if [ -f "CHECKLIST_DEPLOIEMENT_IONOS.md" ]; then
    log_success "CHECKLIST_DEPLOIEMENT_IONOS.md présent"
else
    log_warning "CHECKLIST_DEPLOIEMENT_IONOS.md manquant"
fi

if [ -f "DEPLOIEMENT_IONOS_MOLLIE.md" ]; then
    log_success "DEPLOIEMENT_IONOS_MOLLIE.md présent"
else
    log_warning "DEPLOIEMENT_IONOS_MOLLIE.md manquant"
fi

echo ""

# ==============================================================================
# 8. Vérifier les fichiers à NE PAS uploader
# ==============================================================================
echo "⛔ 8. Vérification Fichiers Sensibles"
echo "------------------------------------"

FORBIDDEN_FILES=(".env" ".git" ".gitignore" ".venv" "node_modules")

for file in "${FORBIDDEN_FILES[@]}"; do
    if [ -e "$file" ]; then
        log_warning "$file sera ignoré lors de l'upload (OK)"
    fi
done

if [ -f ".env" ]; then
    if grep -q "MOLLIE_API_KEY\|admin_token" ".env"; then
        log_error ".env contient des secrets - À NE PAS UPLOADER"
    fi
fi

echo ""

# ==============================================================================
# 9. Vérifier les répertoires
# ==============================================================================
echo "📁 9. Vérification Répertoires"
echo "-----------------------------"

DIRS=("api" "data" "images" "pages" "images/logos" "images/regions")

for dir in "${DIRS[@]}"; do
    if [ -d "$dir" ]; then
        log_success "Répertoire /$dir présent"
    else
        log_error "Répertoire /$dir manquant"
    fi
done

echo ""

# ==============================================================================
# 10. Vérifier les références HTML croisées
# ==============================================================================
echo "🔗 10. Vérification Références"
echo "-----------------------------"

if grep -r "script.js" . --include="*.html" 2>/dev/null | grep -q "script.js"; then
    log_success "script.js est chargé dans les pages HTML"
else
    log_warning "script.js ne semble pas chargé - à vérifier"
fi

if grep -r "site-config.js" . --include="*.html" 2>/dev/null | grep -q "site-config.js"; then
    log_success "site-config.js est chargé dans les pages HTML"
else
    log_warning "site-config.js ne semble pas chargé - à vérifier"
fi

echo ""

# ==============================================================================
# Résumé
# ==============================================================================
echo "========================================================"
echo "📊 RÉSUMÉ"
echo "========================================================"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Aucune erreur critique${NC}"
else
    echo -e "${RED}✗ $ERRORS erreur(s) critique(s)${NC}"
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS avertissement(s)${NC}"
else
    echo -e "${GREEN}✓ Aucun avertissement${NC}"
fi

echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ PRÊT POUR UPLOAD IONOS${NC}"
    exit 0
else
    echo -e "${RED}❌ CORRIGER LES ERREURS AVANT UPLOAD${NC}"
    exit 1
fi
