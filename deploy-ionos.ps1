<#
.SYNOPSIS
Prépare le déploiement Ionos et, si nécessaire, insère la clé API publique dans site-config.js.

.DESCRIPTION
Ce script vérifie que les fichiers clés existent, puis met à jour `site-config.js`
avec la clé publique Ionos fournie. Il ne déploie pas automatiquement sans
informations SSH/SFTP, mais il prépare la configuration et affiche les étapes.
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$IonosPublicKey,

    [Parameter(Mandatory=$false)]
    [string]$TargetDirectory = '/public_html',

    [switch]$UpdateSiteConfig
)

function Write-Section {
    param([string]$Message)
    Write-Host "`n=== $Message ===" -ForegroundColor Cyan
}

function Fail {
    param([string]$Message)
    Write-Host "ERROR: $Message" -ForegroundColor Red
    exit 1
}

Write-Section 'Préparation du déploiement Ionos'

$root = Resolve-Path .
$requiredFiles = @('site-config.js', '.htaccess', 'api/config.sample.php', 'api/.htaccess', 'data/.htaccess')
$missing = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missing += $file
    }
}

if ($missing.Count -gt 0) {
    Fail "Fichiers manquants : $($missing -join ', ')"
}

Write-Host "Tous les fichiers obligatoires sont présents." -ForegroundColor Green

if (-not $IonosPublicKey) {
    $IonosPublicKey = Read-Host 'Entrez la clé API publique Ionos (facultatif)'
}

if ($UpdateSiteConfig) {
    if (-not [string]::IsNullOrWhiteSpace($IonosPublicKey)) {
        $siteConfigPath = Join-Path $root 'site-config.js'
        $content = Get-Content $siteConfigPath -Raw

        if ($content -match "ionosPublicApiKey:\s*'.*?'" ) {
            $content = [regex]::Replace($content, "ionosPublicApiKey:\s*'.*?'", "ionosPublicApiKey: '$IonosPublicKey'")
            Write-Host "Mise à jour de la clé Ionos dans site-config.js" -ForegroundColor Yellow
        }
        else {
            $content = $content -replace "(\}\s*;)\s*$", "    ionosPublicApiKey: '$IonosPublicKey'`r`n};"
            Write-Host "Ajout de la clé Ionos dans site-config.js" -ForegroundColor Yellow
        }

        Set-Content -Path $siteConfigPath -Value $content -Encoding UTF8
        Write-Host "site-config.js mis à jour." -ForegroundColor Green
    }
    else {
        Write-Host "Clé API Ionos non fournie : site-config.js n'a pas été modifié." -ForegroundColor Yellow
    }
}
else {
    Write-Host "Aucune modification de site-config.js demandée." -ForegroundColor Yellow
}

Write-Section 'Étapes recommandées pour le déploiement'
Write-Host "1. Uploader tous les fichiers du projet sur Ionos dans $TargetDirectory." -ForegroundColor White
Write-Host "2. Créer api/config.local.php directement sur le serveur Ionos." -ForegroundColor White
Write-Host "3. Pour le déploiement de fichiers, utilisez SFTP/FTP ou SSH selon Ionos." -ForegroundColor White
Write-Host "4. Vérifier les permissions :" -ForegroundColor White
Write-Host "   - 644 pour les fichiers statiques et PHP" -ForegroundColor White
Write-Host "   - 755 pour les dossiers" -ForegroundColor White
Write-Host "   - 600 pour api/config.local.php" -ForegroundColor White

if ($IonosPublicKey) {
    Write-Host "5. La clé publique Ionos est prête à être utilisée dans site-config.js." -ForegroundColor Green
}
else {
    Write-Host "5. Si vous recevez une clé Ionos publique, relancez ce script avec -UpdateSiteConfig." -ForegroundColor Yellow
}

Write-Host "" -NoNewline
Write-Host "6. Après upload, testez :`n   https://macemaycustom.fr`n   https://macemaycustom.fr/api/order-status.php?order=test" -ForegroundColor White

Write-Section 'Fin'
Write-Host "Déploiement Ionos préparé. Suivez la documentation disponible dans GUIDE_DEPLOIEMENT_IONOS.md." -ForegroundColor Green
