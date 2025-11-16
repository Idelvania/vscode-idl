# Guia de Integração SIICAF - Nash Strategy Analyzer

**Sistema de Inteligência e Investigação de Condutas Antijurídicas e Fraudes**

© Dra. Idelvânia Menezes de Araújo - OAB/GO 64.265-A
Licenciado pelo INPI - Propriedade Intelectual Protegida

---

## 📋 Índice

1. [Introdução](#introdução)
2. [Instalação](#instalação)
3. [Uso via PowerShell](#uso-via-powershell)
4. [Integração com VS Code](#integração-com-vs-code)
5. [Uso via CLI (Terminal)](#uso-via-cli)
6. [Integração com Código SIICAF](#integração-com-código-siicaf)
7. [Exemplos Práticos](#exemplos-práticos)
8. [Automação de Processos](#automação-de-processos)
9. [Troubleshooting](#troubleshooting)

---

## 📖 Introdução

Este guia explica como integrar a **biblioteca Nash** com o sistema SIICAF, permitindo análise estratégica de processos judiciais diretamente em seus workflows.

### O que você poderá fazer:

✅ Analisar estratégias de negociação de acordos
✅ Avaliar delações premiadas usando dilema do prisioneiro
✅ Decidir sobre recursos e apelações
✅ Executar análises via PowerShell, VS Code ou linha de comando
✅ Automatizar análises em lote
✅ Gerar relatórios em HTML, JSON ou TXT
✅ Integrar com código-fonte do SIICAF

---

## 🚀 Instalação

### Pré-requisitos

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **PowerShell** 5.1+ (já incluso no Windows)
- **VS Code** (opcional, para integração)
- **Git** (para clonar repositório)

### Passo 1: Clonar Repositório

```bash
git clone https://github.com/Idelvania/vscode-idl.git
cd vscode-idl
```

### Passo 2: Instalar Dependências

```bash
npm install
```

### Passo 3: Build do Projeto

```bash
npm run build
# ou
npx nx build judicial-cli
```

### Passo 4: Instalar Módulo PowerShell

**Opção A: Instalação Global (Recomendado)**

```powershell
.\scripts\powershell\Install-SIICAF.ps1 -Global -AddToProfile
```

**Opção B: Instalação Local**

```powershell
.\scripts\powershell\Install-SIICAF.ps1
```

### Verificar Instalação

```powershell
Import-Module .\scripts\powershell\SIICAF-Nash.psm1
Get-SIICAFInfo
```

Você deverá ver a tela de boas-vindas do SIICAF-Nash.

---

## 💻 Uso via PowerShell

### Importar Módulo

```powershell
Import-Module .\scripts\powershell\SIICAF-Nash.psm1
```

### Comandos Disponíveis

#### 1. Analisar Negociação de Acordo

```powershell
Analyze-SettlementNegotiation `
    -ValorCausa 100000 `
    -Evidencia 0.7 `
    -CustoLitigacao 20000
```

**Com Relatório HTML:**

```powershell
Analyze-SettlementNegotiation `
    -ValorCausa 150000 `
    -Evidencia 0.8 `
    -CustoLitigacao 25000 `
    -Output ".\relatorios\acordo-caso-123.html" `
    -Formato html
```

#### 2. Analisar Delação Premiada

```powershell
Analyze-PleaBargain -PenaMaxima 10
```

**Com Relatório JSON:**

```powershell
Analyze-PleaBargain `
    -PenaMaxima 15 `
    -Output ".\relatorios\delacao.json" `
    -Formato json
```

#### 3. Analisar Recurso/Apelação

```powershell
Analyze-Appeal `
    -ValorSentenca 80000 `
    -CustoRecurso 20000 `
    -ProbabilidadeReversao 0.3
```

#### 4. Análise Customizada

Crie arquivo JSON (`caso-custom.json`):

```json
{
  "players": [
    { "name": "Empresa A", "type": "plaintiff" },
    { "name": "Empresa B", "type": "defendant" }
  ],
  "strategies": [
    [
      { "name": "Acordo 60%", "description": "Aceitar 60%", "cost": 5000, "successProbability": 1.0 },
      { "name": "Litigar", "description": "Litigar", "cost": 30000, "successProbability": 0.6 }
    ],
    [
      { "name": "Acordo 60%", "description": "Oferecer 60%", "cost": 5000, "successProbability": 1.0 },
      { "name": "Resistir", "description": "Resistir", "cost": 30000, "successProbability": 0.4 }
    ]
  ],
  "context": {
    "caseType": "commercial",
    "claimValue": 200000,
    "evidence": 0.6
  }
}
```

Execute:

```powershell
Analyze-CustomCase -ConfigFile ".\caso-custom.json" -Output ".\analise.html" -Formato html
```

#### 5. Gerar Relatório SIICAF

```powershell
Generate-SIICAFReport `
    -NumeroProcesso "1234567-89.2023.8.09.0051" `
    -TipoAnalise settlement `
    -Output ".\relatorio-processo.html" `
    -Formato html
```

#### 6. Processamento em Lote

Crie CSV (`casos.csv`):

```csv
numero_processo,tipo,valor_causa,evidencia,custo
1234567-89.2023.8.09.0051,settlement,100000,0.7,20000
2345678-90.2023.8.09.0052,settlement,80000,0.6,15000
3456789-01.2023.8.09.0053,settlement,120000,0.8,25000
```

Execute:

```powershell
Process-BatchCases -InputFile ".\casos.csv" -OutputDir ".\relatorios"
```

### Ajuda Detalhada

```powershell
Get-Help Analyze-SettlementNegotiation -Detailed
Get-Help Analyze-PleaBargain -Examples
Get-Help Analyze-Appeal -Full
```

---

## 🖥️ Integração com VS Code

### Configuração

O arquivo `.vscode/tasks.json` já está configurado com tasks prontas.

### Executar Tasks

1. **Abra VS Code**
2. Pressione `Ctrl+Shift+P` (ou `Cmd+Shift+P` no Mac)
3. Digite: `Tasks: Run Task`
4. Selecione uma das opções:
   - `SIICAF: Analisar Acordo`
   - `SIICAF: Analisar Delação`
   - `SIICAF: Analisar Recurso`
   - `SIICAF: Análise Customizada`

### Atalho de Teclado (Opcional)

Adicione em `.vscode/keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+n",
    "command": "workbench.action.tasks.runTask",
    "args": "SIICAF: Analisar Acordo"
  }
]
```

### Snippets (Opcional)

Crie `.vscode/siicaf.code-snippets`:

```json
{
  "Análise de Acordo SIICAF": {
    "prefix": "siicaf-acordo",
    "body": [
      "Analyze-SettlementNegotiation `",
      "    -ValorCausa ${1:100000} `",
      "    -Evidencia ${2:0.7} `",
      "    -CustoLitigacao ${3:20000} `",
      "    -Output \"${4:relatorio.html}\" `",
      "    -Formato html"
    ],
    "description": "Análise de negociação de acordo"
  }
}
```

---

## 🔧 Uso via CLI (Terminal)

### Comandos Básicos

```bash
# Acordo
node dist/apps/judicial-cli/main.js settlement --valor 100000 --evidencia 0.7 --custo 20000

# Delação
node dist/apps/judicial-cli/main.js plea-bargain --max-sentence 10

# Recurso
node dist/apps/judicial-cli/main.js appeal --julgamento 80000 --custo 20000 --reversao 0.3

# Customizado
node dist/apps/judicial-cli/main.js custom --input caso.json
```

### Salvar Relatórios

```bash
# HTML
node dist/apps/judicial-cli/main.js settlement \
    --valor 100000 \
    --evidencia 0.7 \
    --custo 20000 \
    --output relatorio.html \
    --format html

# JSON
node dist/apps/judicial-cli/main.js settlement \
    --valor 100000 \
    --evidencia 0.7 \
    --custo 20000 \
    --output dados.json \
    --format json
```

### Alias (Opcional)

**PowerShell:**

```powershell
Set-Alias siicaf-nash "node dist/apps/judicial-cli/main.js"
```

**Bash/Zsh:**

```bash
alias siicaf-nash="node dist/apps/judicial-cli/main.js"
```

Então:

```bash
siicaf-nash settlement --valor 100000 --evidencia 0.7 --custo 20000
```

---

## 🔗 Integração com Código SIICAF

### Importar Biblioteca

```typescript
import {
  SIICAFIntegration,
  SIICAFProcesso,
  SIICAFParte,
  SIICAFEvidencia,
} from '@vscode-idl/judicial-strategy';
```

### Exemplo: Analisar Processo

```typescript
// Definir processo
const processo: SIICAFProcesso = {
  numeroProcesso: '1234567-89.2023.8.09.0051',
  tipo: 'civil',
  status: 'ativo',
  dataAbertura: new Date('2023-01-15'),
  valorCausa: 150000,
  partes: [
    {
      nome: 'João Silva',
      tipo: 'autor',
      advogado: 'Dra. Idelvânia Menezes - OAB/GO 64.265-A',
      recursos: 50000,
    },
    {
      nome: 'Empresa XYZ Ltda',
      tipo: 'reu',
      advogado: 'Dr. Carlos Santos - OAB/GO 12345',
      recursos: 200000,
    },
  ],
  evidencias: [
    {
      tipo: 'documento',
      descricao: 'Contrato assinado com cláusulas violadas',
      forca: 0.8,
      data: new Date('2023-02-01'),
    },
    {
      tipo: 'testemunho',
      descricao: 'Testemunhas presenciaram negociação',
      forca: 0.6,
      data: new Date('2023-02-15'),
    },
  ],
};

// Executar análise
const analise = await SIICAFIntegration.analyzeProcesso(
  processo,
  'acordo',
  {
    valorCausa: 150000,
    evidencia: 0.7,
    custoLitigacao: 25000,
    analista: 'Dra. Idelvânia Menezes',
  }
);

// Gerar relatório
const relatorio = SIICAFIntegration.generateRelatorio(processo, analise);

console.log(relatorio);

// Salvar em arquivo
import * as fs from 'fs';
fs.writeFileSync('relatorio-processo.txt', relatorio);
```

### Exemplo: Criar Jogo do Processo

```typescript
const jogo = SIICAFIntegration.createGameFromProcesso(processo);
const analise = jogo.analyze();

console.log(jogo.printAnalysis());
```

---

## 📚 Exemplos Práticos

### Exemplo 1: Workflow Completo - Caso Civil

```powershell
# 1. Analisar acordo
Analyze-SettlementNegotiation `
    -ValorCausa 200000 `
    -Evidencia 0.75 `
    -CustoLitigacao 30000 `
    -Output ".\casos\caso-001-acordo.html" `
    -Formato html

# 2. Se não houver acordo, analisar litígio
Analyze-CustomCase `
    -ConfigFile ".\casos\caso-001-litigio.json" `
    -Output ".\casos\caso-001-litigio.html" `
    -Formato html

# 3. Se perder, analisar recurso
Analyze-Appeal `
    -ValorSentenca 200000 `
    -CustoRecurso 40000 `
    -ProbabilidadeReversao 0.35 `
    -Output ".\casos\caso-001-recurso.html" `
    -Formato html
```

### Exemplo 2: Análise Comparativa

```powershell
# Cenário A: Evidências fortes
Analyze-SettlementNegotiation `
    -ValorCausa 100000 `
    -Evidencia 0.9 `
    -CustoLitigacao 20000 `
    -Output ".\analises\cenario-a.html" `
    -Formato html

# Cenário B: Evidências fracas
Analyze-SettlementNegotiation `
    -ValorCausa 100000 `
    -Evidencia 0.4 `
    -CustoLitigacao 20000 `
    -Output ".\analises\cenario-b.html" `
    -Formato html

# Cenário C: Custos altos
Analyze-SettlementNegotiation `
    -ValorCausa 100000 `
    -Evidencia 0.7 `
    -CustoLitigacao 40000 `
    -Output ".\analises\cenario-c.html" `
    -Formato html
```

### Exemplo 3: Integração com Banco de Dados

```typescript
// Em seu sistema SIICAF
import { SIICAFIntegration } from '@vscode-idl/judicial-strategy';
import { database } from './siicaf-database';

async function analisarProcessosDoBanco() {
  // Buscar processos ativos
  const processos = await database.getProcessosAtivos();

  for (const proc of processos) {
    // Converter para formato SIICAF
    const processoSIICAF = convertToSIICAFFormat(proc);

    // Analisar
    const analise = await SIICAFIntegration.analyzeProcesso(
      processoSIICAF,
      'acordo'
    );

    // Salvar análise no banco
    await database.saveAnalise(proc.id, analise);

    // Gerar relatório
    const relatorio = SIICAFIntegration.generateRelatorio(
      processoSIICAF,
      analise
    );

    // Salvar relatório
    await database.saveRelatorio(proc.id, relatorio);

    console.log(`✓ Processo ${proc.numeroProcesso} analisado`);
  }
}
```

---

## ⚙️ Automação de Processos

### Script PowerShell para Análise Diária

```powershell
# analise-diaria.ps1

Import-Module .\scripts\powershell\SIICAF-Nash.psm1

$processos = Import-Csv ".\processos-pendentes.csv"
$dataHoje = Get-Date -Format "yyyy-MM-dd"
$outputDir = ".\relatorios\$dataHoje"

# Criar diretório
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

foreach ($proc in $processos) {
    Write-Host "Analisando processo: $($proc.numero_processo)" -ForegroundColor Cyan

    Analyze-SettlementNegotiation `
        -ValorCausa ([double]$proc.valor_causa) `
        -Evidencia ([double]$proc.evidencia) `
        -CustoLitigacao ([double]$proc.custo) `
        -Output "$outputDir\$($proc.numero_processo).html" `
        -Formato html

    Write-Host "✓ Concluído" -ForegroundColor Green
}

Write-Host "`nTodos os processos foram analisados!" -ForegroundColor Green
Write-Host "Relatórios salvos em: $outputDir" -ForegroundColor Yellow
```

Agendar no Windows:

```powershell
# Task Scheduler
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File C:\SIICAF\analise-diaria.ps1"
$trigger = New-ScheduledTaskTrigger -Daily -At 8am
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "SIICAF-Analise-Diaria" -Description "Análise diária de processos SIICAF"
```

---

## 🐛 Troubleshooting

### Erro: "Node.js não encontrado"

**Solução:**
```powershell
# Verificar instalação
node --version

# Se não instalado, baixar de: https://nodejs.org/
```

### Erro: "Módulo não pode ser carregado"

**Solução:**
```powershell
# Permitir execução de scripts
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Erro: "CLI não encontrado"

**Solução:**
```powershell
# Build do projeto
npx nx build judicial-cli

# Verificar se existe
Test-Path .\dist\apps\judicial-cli\main.js
```

### Erro: "Arquivo de configuração inválido"

**Solução:**
```powershell
# Validar JSON
Get-Content .\caso.json | ConvertFrom-Json
```

### Performance Lenta

**Solução:**
```powershell
# Usar formato txt ao invés de html para análises rápidas
Analyze-SettlementNegotiation ... -Formato txt
```

---

## 📞 Suporte

Para questões e suporte técnico:

- **E-mail:** dra.idelvania@siicaf.com (exemplo)
- **Issues GitHub:** https://github.com/Idelvania/vscode-idl/issues

---

## 📄 Licença

**PROPRIEDADE INTELECTUAL PROTEGIDA**

Sistema licenciado pelo INPI.
Propriedade exclusiva de Dra. Idelvânia Menezes de Araújo - OAB/GO 64.265-A.

Todos os direitos reservados. Uso não autorizado é proibido por lei.

---

**Desenvolvido com ❤️ para o Sistema SIICAF**
