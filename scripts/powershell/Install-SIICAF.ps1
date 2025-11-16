<#
.SYNOPSIS
    Script de instalação do SIICAF-Nash

.DESCRIPTION
    Instala e configura o módulo SIICAF-Nash para uso no PowerShell e VS Code

.NOTES
    © Dra. Idelvânia Menezes de Araújo - OAB/GO 64.265-A
#>

param(
    [switch]$Global,
    [switch]$AddToProfile
)

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  SIICAF-Nash - Instalação" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Node.js
Write-Host "[1/5] Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Error "Node.js não encontrado. Por favor, instale Node.js primeiro: https://nodejs.org/"
    exit 1
}

# 2. Instalar dependências
Write-Host ""
Write-Host "[2/5] Instalando dependências..." -ForegroundColor Yellow
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $projectRoot

try {
    Write-Host "  Executando npm install..." -ForegroundColor Gray
    npm install --silent
    Write-Host "  ✓ Dependências instaladas" -ForegroundColor Green
} catch {
    Write-Error "Erro ao instalar dependências: $_"
    exit 1
}

# 3. Build do CLI
Write-Host ""
Write-Host "[3/5] Compilando CLI..." -ForegroundColor Yellow
try {
    Write-Host "  Executando build..." -ForegroundColor Gray
    npx nx build judicial-cli
    Write-Host "  ✓ CLI compilado com sucesso" -ForegroundColor Green
} catch {
    Write-Error "Erro ao compilar CLI: $_"
    exit 1
}

# 4. Importar módulo PowerShell
Write-Host ""
Write-Host "[4/5] Configurando módulo PowerShell..." -ForegroundColor Yellow

$modulePath = Join-Path $PSScriptRoot "SIICAF-Nash.psm1"

if ($Global) {
    $moduleDir = "$env:ProgramFiles\WindowsPowerShell\Modules\SIICAF-Nash"
    Write-Host "  Instalando globalmente em: $moduleDir" -ForegroundColor Gray

    if (-not (Test-Path $moduleDir)) {
        New-Item -ItemType Directory -Path $moduleDir -Force | Out-Null
    }

    Copy-Item $modulePath -Destination "$moduleDir\SIICAF-Nash.psm1" -Force
    Write-Host "  ✓ Módulo instalado globalmente" -ForegroundColor Green
} else {
    Write-Host "  Módulo disponível em: $modulePath" -ForegroundColor Gray
    Write-Host "  Use: Import-Module '$modulePath'" -ForegroundColor Gray
}

# 5. Adicionar ao profile (opcional)
if ($AddToProfile) {
    Write-Host ""
    Write-Host "[5/5] Adicionando ao PowerShell Profile..." -ForegroundColor Yellow

    $profileContent = @"

# SIICAF-Nash Module
Import-Module '$modulePath'
"@

    if (-not (Test-Path $PROFILE)) {
        New-Item -Path $PROFILE -ItemType File -Force | Out-Null
    }

    Add-Content -Path $PROFILE -Value $profileContent
    Write-Host "  ✓ Adicionado ao profile: $PROFILE" -ForegroundColor Green
    Write-Host "  O módulo será carregado automaticamente em novas sessões" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "[5/5] Profile não modificado" -ForegroundColor Yellow
    Write-Host "  Para carregar automaticamente, execute:" -ForegroundColor Gray
    Write-Host "  .\Install-SIICAF.ps1 -AddToProfile" -ForegroundColor Gray
}

# Testar instalação
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  Instalação Concluída!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para começar a usar:" -ForegroundColor Yellow
Write-Host "  1. Importe o módulo:" -ForegroundColor White
Write-Host "     Import-Module '$modulePath'" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Veja as funções disponíveis:" -ForegroundColor White
Write-Host "     Get-SIICAFInfo" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Execute uma análise:" -ForegroundColor White
Write-Host "     Analyze-SettlementNegotiation -ValorCausa 100000 -Evidencia 0.7 -CustoLitigacao 20000" -ForegroundColor Gray
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Importar módulo automaticamente nesta sessão
Import-Module $modulePath
