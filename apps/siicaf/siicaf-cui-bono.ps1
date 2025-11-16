<#
.SYNOPSIS
    Comando PowerShell para análise CUI BONO - SIICAF

.DESCRIPTION
    Sistema de Inteligência e Investigação de Condutas Antijurídicas e Fraudes
    Analisa processos judiciais identificando violações e beneficiários
    Integrado com Portal da Transparência e CNJ

.PARAMETER Processo
    Número do processo a ser analisado

.PARAMETER Tribunal
    Sigla do tribunal (ex: TJ-GO, TJ-SP)

.PARAMETER Estado
    UF do estado (ex: GO, SP, RJ)

.PARAMETER GerarHTML
    Gera relatório HTML

.PARAMETER GerarJSON
    Gera relatório JSON

.PARAMETER AbrirRelatorio
    Abre relatório HTML automaticamente após geração

.EXAMPLE
    .\siicaf-cui-bono.ps1 -Processo "0123456-78.2023.8.09.0051" -Tribunal "TJ-GO" -Estado "GO"

.EXAMPLE
    .\siicaf-cui-bono.ps1 -Processo "0123456-78.2023.8.09.0051" -Tribunal "TJ-GO" -Estado "GO" -AbrirRelatorio

.NOTES
    Autor: SIICAF Development Team
    Versão: 1.0.0
    Requer: Node.js 20+
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false, HelpMessage="Número do processo")]
    [string]$Processo = "0123456-78.2023.8.09.0051",

    [Parameter(Mandatory=$false, HelpMessage="Tribunal (ex: TJ-GO)")]
    [string]$Tribunal = "TJ-GO",

    [Parameter(Mandatory=$false, HelpMessage="Estado (ex: GO)")]
    [string]$Estado = "GO",

    [Parameter(Mandatory=$false)]
    [switch]$GerarHTML = $true,

    [Parameter(Mandatory=$false)]
    [switch]$GerarJSON = $true,

    [Parameter(Mandatory=$false)]
    [switch]$AbrirRelatorio = $false,

    [Parameter(Mandatory=$false)]
    [switch]$Demo = $false
)

# Configurações
$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$appPath = Join-Path $scriptPath "src"
$mainFile = Join-Path $appPath "main.ts"
$relatoriosPath = Join-Path (Get-Location) "relatorios-siicaf"

# Cores para output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Header {
    Write-Host ""
    Write-ColorOutput "╔═══════════════════════════════════════════════════════════╗" "Cyan"
    Write-ColorOutput "║  SIICAF - ANÁLISE CUI BONO                                ║" "Cyan"
    Write-ColorOutput "║  Sistema de Inteligência e Investigação                   ║" "Cyan"
    Write-ColorOutput "║  de Condutas Antijurídicas e Fraudes                      ║" "Cyan"
    Write-ColorOutput "╚═══════════════════════════════════════════════════════════╝" "Cyan"
    Write-Host ""
}

function Test-NodeJS {
    try {
        $nodeVersion = node --version
        Write-ColorOutput "✓ Node.js detectado: $nodeVersion" "Green"
        return $true
    } catch {
        Write-ColorOutput "✗ Node.js não encontrado. Instale Node.js 20+ antes de continuar." "Red"
        return $false
    }
}

function Install-Dependencies {
    Write-ColorOutput "`n⚙️  Verificando dependências..." "Yellow"

    $packageJsonPath = Join-Path $scriptPath "package.json"

    if (Test-Path $packageJsonPath) {
        Push-Location $scriptPath
        try {
            $nodeModulesPath = Join-Path $scriptPath "node_modules"
            if (-not (Test-Path $nodeModulesPath)) {
                Write-ColorOutput "📦 Instalando dependências do npm..." "Yellow"
                npm install
                Write-ColorOutput "✓ Dependências instaladas" "Green"
            } else {
                Write-ColorOutput "✓ Dependências já instaladas" "Green"
            }
        } finally {
            Pop-Location
        }
    }
}

function Build-TypeScript {
    Write-ColorOutput "`n🔨 Compilando TypeScript..." "Yellow"

    Push-Location $scriptPath
    try {
        $distPath = Join-Path $scriptPath "dist"
        if (-not (Test-Path $distPath)) {
            npm run build
            Write-ColorOutput "✓ TypeScript compilado" "Green"
        } else {
            Write-ColorOutput "✓ Build já existe (use npm run build para recompilar)" "Green"
        }
    } catch {
        Write-ColorOutput "⚠️  Erro ao compilar. Tentando executar com ts-node..." "Yellow"
    } finally {
        Pop-Location
    }
}

function Start-Analysis {
    param(
        [string]$ProcessoNum,
        [string]$TribunalSigla,
        [string]$EstadoUF
    )

    Write-ColorOutput "`n🔍 Iniciando análise CUI BONO..." "Yellow"
    Write-ColorOutput "   Processo: $ProcessoNum" "White"
    Write-ColorOutput "   Tribunal: $TribunalSigla" "White"
    Write-ColorOutput "   Estado: $EstadoUF`n" "White"

    Push-Location $scriptPath
    try {
        # Tenta executar o arquivo compilado
        $distMain = Join-Path $scriptPath "dist" "main.js"

        if (Test-Path $distMain) {
            node $distMain analyze -p $ProcessoNum -t $TribunalSigla -e $EstadoUF
        } else {
            # Fallback para ts-node
            npx ts-node $mainFile analyze -p $ProcessoNum -t $TribunalSigla -e $EstadoUF
        }

        $LASTEXITCODE
    } finally {
        Pop-Location
    }
}

function Open-Report {
    Write-ColorOutput "`n📂 Procurando relatórios gerados..." "Yellow"

    if (Test-Path $relatoriosPath) {
        $htmlFiles = Get-ChildItem -Path $relatoriosPath -Filter "*.html" | Sort-Object LastWriteTime -Descending

        if ($htmlFiles.Count -gt 0) {
            $latestReport = $htmlFiles[0].FullName
            Write-ColorOutput "✓ Relatório encontrado: $latestReport" "Green"

            if ($AbrirRelatorio) {
                Write-ColorOutput "🌐 Abrindo relatório no navegador..." "Yellow"
                Start-Process $latestReport
            } else {
                Write-ColorOutput "💡 Use -AbrirRelatorio para abrir automaticamente" "Cyan"
            }
        } else {
            Write-ColorOutput "⚠️  Nenhum relatório HTML encontrado" "Yellow"
        }
    } else {
        Write-ColorOutput "⚠️  Diretório de relatórios não encontrado" "Yellow"
    }
}

function Show-Help {
    Write-Header
    Write-ColorOutput "USO:" "Yellow"
    Write-Host "  .\siicaf-cui-bono.ps1 -Processo <numero> -Tribunal <sigla> -Estado <uf> [-AbrirRelatorio]"
    Write-Host ""
    Write-ColorOutput "EXEMPLOS:" "Yellow"
    Write-Host "  .\siicaf-cui-bono.ps1 -Processo '0123456-78.2023.8.09.0051' -Tribunal 'TJ-GO' -Estado 'GO'"
    Write-Host "  .\siicaf-cui-bono.ps1 -Processo '0123456-78.2023.8.09.0051' -Tribunal 'TJ-SP' -Estado 'SP' -AbrirRelatorio"
    Write-Host "  .\siicaf-cui-bono.ps1 -Demo"
    Write-Host ""
    Write-ColorOutput "PARÂMETROS:" "Yellow"
    Write-Host "  -Processo         Número do processo a analisar"
    Write-Host "  -Tribunal         Sigla do tribunal (TJ-GO, TJ-SP, etc)"
    Write-Host "  -Estado           UF do estado (GO, SP, RJ, etc)"
    Write-Host "  -AbrirRelatorio   Abre o relatório HTML automaticamente"
    Write-Host "  -Demo             Executa análise de demonstração"
    Write-Host ""
}

# ═══════════════════════════════════════════════════════════
# EXECUÇÃO PRINCIPAL
# ═══════════════════════════════════════════════════════════

Write-Header

# Verifica Node.js
if (-not (Test-NodeJS)) {
    exit 1
}

# Instala dependências
Install-Dependencies

# Compila TypeScript
Build-TypeScript

# Executa análise
if ($Demo) {
    Write-ColorOutput "🎭 Executando modo demonstração..." "Cyan"
    Push-Location $scriptPath
    try {
        $distMain = Join-Path $scriptPath "dist" "main.js"
        if (Test-Path $distMain) {
            node $distMain demo
        } else {
            npx ts-node $mainFile demo
        }
    } finally {
        Pop-Location
    }
} else {
    Start-Analysis -ProcessoNum $Processo -TribunalSigla $Tribunal -EstadoUF $Estado
}

# Abre relatório se solicitado
if ($AbrirRelatorio -or $Demo) {
    Open-Report
}

Write-ColorOutput "`n✅ SIICAF - Análise concluída!" "Green"
Write-Host ""
