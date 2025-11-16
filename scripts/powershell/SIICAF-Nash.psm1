<#
.SYNOPSIS
    Módulo PowerShell para análise de estratégias judiciais usando Teoria de Nash
    SIICAF - Sistema de Inteligência e Investigação de Condutas Antijurídicas e Fraudes

.DESCRIPTION
    Módulo PowerShell que integra a biblioteca Nash para análise estratégica de processos judiciais.
    Permite executar análises diretamente do PowerShell e integrar com workflows de automação.

.NOTES
    © Dra. Idelvânia Menezes de Araújo - OAB/GO 64.265-A
    Licenciado pelo INPI - Todos os direitos reservados
#>

# Variáveis globais
$Script:SIICAFPath = "$PSScriptRoot\..\.."
$Script:CLIPath = "$Script:SIICAFPath\dist\apps\judicial-cli\main.js"

<#
.SYNOPSIS
    Analisa negociação de acordo judicial

.PARAMETER ValorCausa
    Valor da causa em reais

.PARAMETER Evidencia
    Força das evidências (0.0 a 1.0)

.PARAMETER CustoLitigacao
    Custos de litigação em reais

.PARAMETER Output
    Caminho do arquivo para salvar relatório

.PARAMETER Formato
    Formato do relatório (txt, json, html)

.EXAMPLE
    Analyze-SettlementNegotiation -ValorCausa 100000 -Evidencia 0.7 -CustoLitigacao 20000

.EXAMPLE
    Analyze-SettlementNegotiation -ValorCausa 50000 -Evidencia 0.6 -CustoLitigacao 15000 -Output "relatorio.html" -Formato html
#>
function Analyze-SettlementNegotiation {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [double]$ValorCausa,

        [Parameter(Mandatory=$true)]
        [ValidateRange(0.0, 1.0)]
        [double]$Evidencia,

        [Parameter(Mandatory=$true)]
        [double]$CustoLitigacao,

        [Parameter(Mandatory=$false)]
        [string]$Output,

        [Parameter(Mandatory=$false)]
        [ValidateSet('txt', 'json', 'html')]
        [string]$Formato = 'txt'
    )

    Write-Host "🏛️  SIICAF - Análise de Negociação de Acordo" -ForegroundColor Cyan
    Write-Host ""

    $arguments = @(
        "settlement",
        "--valor", $ValorCausa,
        "--evidencia", $Evidencia,
        "--custo", $CustoLitigacao,
        "--format", $Formato
    )

    if ($Output) {
        $arguments += "--output"
        $arguments += $Output
    }

    & node $Script:CLIPath $arguments
}

<#
.SYNOPSIS
    Analisa dilema de delação premiada

.PARAMETER PenaMaxima
    Pena máxima em anos

.PARAMETER Output
    Caminho do arquivo para salvar relatório

.PARAMETER Formato
    Formato do relatório (txt, json, html)

.EXAMPLE
    Analyze-PleaBargain -PenaMaxima 10

.EXAMPLE
    Analyze-PleaBargain -PenaMaxima 15 -Output "delacao.json" -Formato json
#>
function Analyze-PleaBargain {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [double]$PenaMaxima,

        [Parameter(Mandatory=$false)]
        [string]$Output,

        [Parameter(Mandatory=$false)]
        [ValidateSet('txt', 'json', 'html')]
        [string]$Formato = 'txt'
    )

    Write-Host "⚖️  SIICAF - Análise de Delação Premiada" -ForegroundColor Cyan
    Write-Host ""

    $arguments = @(
        "plea-bargain",
        "--max-sentence", $PenaMaxima,
        "--format", $Formato
    )

    if ($Output) {
        $arguments += "--output"
        $arguments += $Output
    }

    & node $Script:CLIPath $arguments
}

<#
.SYNOPSIS
    Analisa decisão de recurso/apelação

.PARAMETER ValorSentenca
    Valor da sentença em reais

.PARAMETER CustoRecurso
    Custo do recurso em reais

.PARAMETER ProbabilidadeReversao
    Probabilidade de reversão (0.0 a 1.0)

.PARAMETER Output
    Caminho do arquivo para salvar relatório

.PARAMETER Formato
    Formato do relatório (txt, json, html)

.EXAMPLE
    Analyze-Appeal -ValorSentenca 80000 -CustoRecurso 20000 -ProbabilidadeReversao 0.3

.EXAMPLE
    Analyze-Appeal -ValorSentenca 100000 -CustoRecurso 25000 -ProbabilidadeReversao 0.4 -Output "recurso.html" -Formato html
#>
function Analyze-Appeal {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [double]$ValorSentenca,

        [Parameter(Mandatory=$true)]
        [double]$CustoRecurso,

        [Parameter(Mandatory=$true)]
        [ValidateRange(0.0, 1.0)]
        [double]$ProbabilidadeReversao,

        [Parameter(Mandatory=$false)]
        [string]$Output,

        [Parameter(Mandatory=$false)]
        [ValidateSet('txt', 'json', 'html')]
        [string]$Formato = 'txt'
    )

    Write-Host "📑 SIICAF - Análise de Recurso/Apelação" -ForegroundColor Cyan
    Write-Host ""

    $arguments = @(
        "appeal",
        "--julgamento", $ValorSentenca,
        "--custo", $CustoRecurso,
        "--reversao", $ProbabilidadeReversao,
        "--format", $Formato
    )

    if ($Output) {
        $arguments += "--output"
        $arguments += $Output
    }

    & node $Script:CLIPath $arguments
}

<#
.SYNOPSIS
    Analisa caso customizado a partir de arquivo JSON

.PARAMETER ConfigFile
    Caminho do arquivo JSON com configuração do jogo

.PARAMETER Output
    Caminho do arquivo para salvar relatório

.PARAMETER Formato
    Formato do relatório (txt, json, html)

.EXAMPLE
    Analyze-CustomCase -ConfigFile "caso.json"

.EXAMPLE
    Analyze-CustomCase -ConfigFile "caso.json" -Output "analise.html" -Formato html
#>
function Analyze-CustomCase {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$ConfigFile,

        [Parameter(Mandatory=$false)]
        [string]$Output,

        [Parameter(Mandatory=$false)]
        [ValidateSet('txt', 'json', 'html')]
        [string]$Formato = 'txt'
    )

    Write-Host "🎯 SIICAF - Análise Customizada" -ForegroundColor Cyan
    Write-Host ""

    if (-not (Test-Path $ConfigFile)) {
        Write-Error "Arquivo não encontrado: $ConfigFile"
        return
    }

    $arguments = @(
        "custom",
        "--input", $ConfigFile,
        "--format", $Formato
    )

    if ($Output) {
        $arguments += "--output"
        $arguments += $Output
    }

    & node $Script:CLIPath $arguments
}

<#
.SYNOPSIS
    Gera relatório para processo do SIICAF

.PARAMETER NumeroProcesso
    Número do processo

.PARAMETER TipoAnalise
    Tipo de análise (settlement, plea-bargain, appeal, custom)

.PARAMETER Output
    Caminho do arquivo para salvar relatório

.PARAMETER Formato
    Formato do relatório (txt, json, html, pdf)

.EXAMPLE
    Generate-SIICAFReport -NumeroProcesso "1234567-89.2023.8.09.0051" -TipoAnalise settlement

.EXAMPLE
    Generate-SIICAFReport -NumeroProcesso "1234567-89.2023.8.09.0051" -TipoAnalise appeal -Output "relatorio.pdf" -Formato pdf
#>
function Generate-SIICAFReport {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$NumeroProcesso,

        [Parameter(Mandatory=$false)]
        [ValidateSet('settlement', 'plea-bargain', 'appeal', 'custom')]
        [string]$TipoAnalise,

        [Parameter(Mandatory=$false)]
        [string]$Output,

        [Parameter(Mandatory=$false)]
        [ValidateSet('txt', 'json', 'html', 'pdf')]
        [string]$Formato = 'txt'
    )

    Write-Host "📊 SIICAF - Gerador de Relatórios" -ForegroundColor Cyan
    Write-Host ""

    $arguments = @(
        "report",
        "--processo", $NumeroProcesso,
        "--format", $Formato
    )

    if ($TipoAnalise) {
        $arguments += "--tipo"
        $arguments += $TipoAnalise
    }

    if ($Output) {
        $arguments += "--output"
        $arguments += $Output
    }

    & node $Script:CLIPath $arguments
}

<#
.SYNOPSIS
    Processa múltiplos casos em lote

.PARAMETER InputFile
    Arquivo CSV ou JSON com lista de casos

.PARAMETER OutputDir
    Diretório para salvar relatórios

.EXAMPLE
    Process-BatchCases -InputFile "casos.csv" -OutputDir ".\relatorios"
#>
function Process-BatchCases {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$InputFile,

        [Parameter(Mandatory=$false)]
        [string]$OutputDir = ".\reports"
    )

    Write-Host "📦 SIICAF - Processamento em Lote" -ForegroundColor Cyan
    Write-Host ""

    if (-not (Test-Path $InputFile)) {
        Write-Error "Arquivo não encontrado: $InputFile"
        return
    }

    $arguments = @(
        "batch",
        "--input", $InputFile,
        "--output", $OutputDir
    )

    & node $Script:CLIPath $arguments
}

<#
.SYNOPSIS
    Exibe informações sobre o módulo SIICAF-Nash

.EXAMPLE
    Get-SIICAFInfo
#>
function Get-SIICAFInfo {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "  SIICAF - Nash Strategy Analyzer" -ForegroundColor Green
    Write-Host "  Sistema de Inteligência e Investigação de Condutas" -ForegroundColor White
    Write-Host "  Antijurídicas e Fraudes" -ForegroundColor White
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  📋 Funções Disponíveis:" -ForegroundColor Yellow
    Write-Host "    • Analyze-SettlementNegotiation   - Análise de acordo" -ForegroundColor White
    Write-Host "    • Analyze-PleaBargain             - Análise de delação" -ForegroundColor White
    Write-Host "    • Analyze-Appeal                  - Análise de recurso" -ForegroundColor White
    Write-Host "    • Analyze-CustomCase              - Análise customizada" -ForegroundColor White
    Write-Host "    • Generate-SIICAFReport           - Gerar relatório" -ForegroundColor White
    Write-Host "    • Process-BatchCases              - Processamento em lote" -ForegroundColor White
    Write-Host ""
    Write-Host "  📚 Exemplos de Uso:" -ForegroundColor Yellow
    Write-Host "    Analyze-SettlementNegotiation -ValorCausa 100000 -Evidencia 0.7 -CustoLitigacao 20000" -ForegroundColor Gray
    Write-Host "    Analyze-PleaBargain -PenaMaxima 10 -Output 'relatorio.html' -Formato html" -ForegroundColor Gray
    Write-Host "    Analyze-Appeal -ValorSentenca 80000 -CustoRecurso 20000 -ProbabilidadeReversao 0.3" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  💡 Para ajuda detalhada:" -ForegroundColor Yellow
    Write-Host "    Get-Help Analyze-SettlementNegotiation -Detailed" -ForegroundColor Gray
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "  © Dra. Idelvânia Menezes de Araújo - OAB/GO 64.265-A" -ForegroundColor White
    Write-Host "  Licenciado pelo INPI - Propriedade Intelectual Protegida" -ForegroundColor White
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
}

# Exportar funções
Export-ModuleMember -Function @(
    'Analyze-SettlementNegotiation',
    'Analyze-PleaBargain',
    'Analyze-Appeal',
    'Analyze-CustomCase',
    'Generate-SIICAFReport',
    'Process-BatchCases',
    'Get-SIICAFInfo'
)

# Exibir mensagem de boas-vindas ao importar módulo
Get-SIICAFInfo
