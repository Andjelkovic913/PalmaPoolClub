# Deploys the site to Vercel as a PRIVATE preview and wires up its environment.
#
# One command instead of eight. It:
#   1. deploys, and reads the resulting URL from Vercel rather than asking
#   2. copies every needed variable out of .env.local, so nothing is retyped
#   3. sets NEXT_PUBLIC_SITE_URL to the deployed URL, not localhost, so the
#      approval links in the owner's email actually work
#   4. redeploys, because NEXT_PUBLIC_* is baked in at build time
#   5. VERIFIES the deployment is invisible to search engines, loudly
#
# It deliberately never sets SITE_IS_PRODUCTION. That flag is the only thing
# that opens the site to Google, and this script exists to produce a link that
# can be shared with friends before the client has seen it.
#
# Written for Windows PowerShell 5.1. Quote handling there is fragile, so the
# parsing below avoids nested quotes inside regex literals on purpose.
#
# Usage:  cd site ; .\scripts\deploy-preview.ps1

$ErrorActionPreference = "Stop"

$QUOTE  = [char]34   # "
$APOS   = [char]39   # '

if (-not (Test-Path ".env.local")) {
    Write-Host "Nema .env.local - pokreni iz foldera 'site'." -ForegroundColor Red
    exit 1
}

# ---- read .env.local -------------------------------------------------------
$envVars = @{}
foreach ($line in (Get-Content ".env.local")) {
    if ($line -match '^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$') {
        $key = $Matches[1]
        $val = $Matches[2].Trim().Trim($QUOTE).Trim($APOS)
        if ($val.Length -gt 0 -and -not $envVars.ContainsKey($key)) {
            $envVars[$key] = $val
        }
    }
}

$needed = @("DATABASE_URL", "RESEND_API_KEY", "OWNER_EMAIL", "OWNER_PASSWORD")
$missing = @($needed | Where-Object { -not $envVars.ContainsKey($_) })
if ($missing.Count -gt 0) {
    Write-Host ("Nedostaje u .env.local: " + ($missing -join ", ")) -ForegroundColor Red
    exit 1
}

function Get-DeployUrl($text) {
    $m = [regex]::Matches($text, 'https://[a-z0-9-]+\.vercel\.app')
    if ($m.Count -eq 0) { return $null }
    return $m[$m.Count - 1].Value
}

# ---- 1. deploy -------------------------------------------------------------
Write-Host ""
Write-Host "[1/4] Deploy..." -ForegroundColor Cyan
$out = (vercel --prod --yes 2>&1 | Out-String)
$url = Get-DeployUrl $out

if (-not $url) {
    Write-Host "Deploy nije uspeo ili URL nije prepoznat. Ispis:" -ForegroundColor Red
    Write-Host $out
    exit 1
}
Write-Host ("    " + $url) -ForegroundColor Green

# ---- 2. environment --------------------------------------------------------
Write-Host ""
Write-Host "[2/4] Promenljive okruzenja..." -ForegroundColor Cyan
$envVars["NEXT_PUBLIC_SITE_URL"] = $url

$allKeys = $needed + @("NEXT_PUBLIC_SITE_URL")
foreach ($key in $allKeys) {
    # Remove first: `vercel env add` refuses a name that already exists, and
    # this script is meant to be safe to run again.
    try { vercel env rm $key production --yes 2>&1 | Out-Null } catch { }
    $envVars[$key] | vercel env add $key production 2>&1 | Out-Null
    Write-Host ("    " + $key) -ForegroundColor DarkGray
}

# ---- 3. redeploy so NEXT_PUBLIC_* is baked in ------------------------------
Write-Host ""
Write-Host "[3/4] Ponovni deploy (NEXT_PUBLIC_* se ugradjuje u build)..." -ForegroundColor Cyan
$out2 = (vercel --prod --yes 2>&1 | Out-String)
$final = Get-DeployUrl $out2
if ($final) { $url = $final }

# ---- 4. prove it is not indexable -----------------------------------------
Write-Host ""
Write-Host "[4/4] Provera da Google ne moze da ga vidi..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

$tag = $null
$robots = ""
try {
    $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 5
    $tag = $resp.Headers["X-Robots-Tag"]
    $robots = (Invoke-WebRequest -Uri ($url + "/robots.txt") -UseBasicParsing).Content
} catch {
    Write-Host ("    Nije moguce proveriti: " + $_.Exception.Message) -ForegroundColor Yellow
}

Write-Host ""
if ($tag -and ($tag -match "noindex")) {
    Write-Host ("  X-Robots-Tag: " + $tag) -ForegroundColor Green
    if ($robots -match "Disallow: /") {
        Write-Host "  robots.txt:   Disallow: /" -ForegroundColor Green
    }
    Write-Host ""
    Write-Host "Sajt je NEVIDLJIV za pretrazivace. Link mozes da delis." -ForegroundColor Green
} else {
    Write-Host "  UPOZORENJE: X-Robots-Tag nije pronadjen!" -ForegroundColor Red
    Write-Host "  Proveri da SITE_IS_PRODUCTION nije postavljen na Vercelu." -ForegroundColor Red
    Write-Host "  NE deli link dok se ovo ne resi." -ForegroundColor Red
}

Write-Host ""
Write-Host ("  Sajt:   " + $url)
Write-Host ("  Admin:  " + $url + "/admin")
Write-Host ""
