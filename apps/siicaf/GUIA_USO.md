# 📘 Guia de Uso do SIICAF - Análise Cui Bono

## 🎯 Visão Geral

O SIICAF é uma ferramenta poderosa para análise de processos judiciais que identifica violações, beneficiários e compara gastos entre tribunais.

## 🚀 Início Rápido

### 1️⃣ Instalação Rápida

```bash
cd apps/siicaf
npm install
npm run build
```

### 2️⃣ Primeira Análise

```powershell
# Windows PowerShell
.\siicaf-cui-bono.ps1 -Demo

# Ou usando Node.js
node dist/main.js demo
```

### 3️⃣ Visualizar Relatório

O relatório HTML será gerado em `relatorios-siicaf/` e abrirá automaticamente no navegador.

## 📊 Casos de Uso

### Caso 1: Detectar Violações Processuais

**Cenário**: Você suspeita que um processo tem decisões irregulares.

**Comando**:
```powershell
.\siicaf-cui-bono.ps1 `
  -Processo "0123456-78.2023.8.09.0051" `
  -Tribunal "TJ-GO" `
  -Estado "GO" `
  -AbrirRelatorio
```

**O que o sistema detecta**:
- ✅ Decisões interlocutórias quando deveria ser apelação
- ✅ Apelações indevidas contra decisões interlocutórias
- ✅ Sentenças incompletas (sem análise de todos os pedidos)
- ✅ Acórdãos omissos (que não enfrentam todos os argumentos)
- ✅ Violações do devido processo legal

**Saída esperada**:
```
🔍 SIICAF - ANÁLISE CUI BONO
═══════════════════════════════════════════════════════

Processo: 0123456-78.2023.8.09.0051
Tribunal: TJ-GO - GO

VIOLAÇÕES DETECTADAS: 5
├─ CRÍTICA (1): Corrupção - múltiplas violações graves
├─ ALTA (2): Apelação indevida, Sentença incompleta
└─ MÉDIA (2): Decisão interlocutória errada

BENEFICIÁRIOS IDENTIFICADOS: 3
├─ Empresa XYZ Ltda: R$ 500.000,00
├─ Dr. Pedro Santos: R$ 50.000,00
└─ TJ-GO: R$ 25.000,00

SCORE CUI BONO: 72/100 - RISCO ALTO
```

### Caso 2: Comparar Gastos entre Tribunais

**Cenário**: Verificar se os gastos do TJ-SP são compatíveis com TJ-GO.

**Comando**:
```powershell
.\siicaf-cui-bono.ps1 `
  -Processo "0001234-56.2023.8.26.0001" `
  -Tribunal "TJ-SP" `
  -Estado "SP"
```

**O que o sistema faz**:
1. Consulta gastos do TJ-GO (referência)
2. Consulta gastos do TJ-SP
3. Compara os valores
4. Calcula diferença percentual
5. Gera análise com cores de gravidade

**Saída esperada**:
```
📊 COMPARAÇÃO DE GASTOS

TJ-GO (Referência)
├─ Despesa Total: R$ 1.200.000.000,00
├─ Gasto por Processo: R$ 12.000,00

TJ-SP
├─ Despesa Total: R$ 8.500.000.000,00
├─ Gasto por Processo: R$ 85.000,00
└─ Diferença: +608% vs TJ-GO ⚠️ CRÍTICO

⚠️ ANÁLISE: TJ-SP gasta 608% A MAIS que TJ-GO.
Diferença de R$ 7.300.000.000,00.
Requer investigação imediata de possíveis irregularidades.
```

### Caso 3: Análise de Rede de Beneficiários

**Cenário**: Identificar conexões entre beneficiários e responsáveis.

**Comando**:
```powershell
.\siicaf-cui-bono.ps1 `
  -Processo "0123456-78.2023.8.09.0051" `
  -Tribunal "TJ-GO" `
  -Estado "GO" `
  -AbrirRelatorio
```

**O que o relatório mostra**:
- 🔗 Grafo de relacionamentos
- 👥 Lista de beneficiários com conexões
- 💰 Valor estimado por beneficiário
- 📊 Densidade da rede de relacionamentos

**Visualização no HTML**:
```
REDE DE RELACIONAMENTOS
┌──────────────────────────┐
│  Empresa XYZ Ltda        │ ─┐
│  R$ 500.000,00           │  │
└──────────────────────────┘  │
                              ├─> Dr. João Silva (Juiz)
┌──────────────────────────┐  │
│  Dr. Pedro Santos        │ ─┤
│  R$ 50.000,00            │  │
└──────────────────────────┘  │
                              └─> Dr. Roberto Almeida
┌──────────────────────────┐
│  TJ-GO                   │
│  R$ 25.000,00            │
└──────────────────────────┘
```

## 🎨 Interpretando as Cores

### Cores de Gravidade

| Cor | Gravidade | Score | Ação Recomendada |
|-----|-----------|-------|------------------|
| 🟢 **Verde** | Muito Baixa | 0-20 | Monitoramento normal |
| 🔵 **Azul** | Baixa | 21-40 | Atenção básica |
| 🟡 **Amarelo** | Média | 41-60 | Investigação adicional |
| 🟠 **Laranja** | Alta | 61-80 | Investigação prioritária |
| 🔴 **Vermelho** | Muito Alta | 81-95 | Ação imediata |
| ⚫ **Vermelho Escuro** | Crítica | 96-100 | Encaminhar MP |

## 📑 Tipos de Relatórios

### 1. Relatório HTML (Recomendado)
- ✅ Visualização interativa
- ✅ Gráficos dinâmicos (Chart.js)
- ✅ Tabelas formatadas
- ✅ Cores de gradação
- ✅ Score visual

**Como usar**:
```powershell
.\siicaf-cui-bono.ps1 -Processo "..." -Tribunal "..." -Estado "..." -AbrirRelatorio
```

### 2. Relatório JSON
- ✅ Dados estruturados
- ✅ Importação para Excel
- ✅ Integração com outras ferramentas
- ✅ API-friendly

**Como usar**:
```bash
node dist/main.js analyze -p "..." -t "..." -e "..."
# O JSON será gerado automaticamente
```

### 3. Relatório TXT
- ✅ Conclusões resumidas
- ✅ Fácil compartilhamento
- ✅ Impressão otimizada

## 🔍 Exemplos Práticos

### Exemplo 1: Processo Simples

```powershell
.\siicaf-cui-bono.ps1 `
  -Processo "0001234-56.2023.8.09.0001" `
  -Tribunal "TJ-GO" `
  -Estado "GO"
```

### Exemplo 2: Processo em Outro Estado

```powershell
.\siicaf-cui-bono.ps1 `
  -Processo "0001234-56.2023.8.26.0001" `
  -Tribunal "TJ-SP" `
  -Estado "SP" `
  -AbrirRelatorio
```

### Exemplo 3: Usando Node.js

```bash
node dist/main.js analyze \
  -p "0001234-56.2023.8.09.0001" \
  -t "TJ-GO" \
  -e "GO"
```

### Exemplo 4: Via VSCode

1. Abra o Command Palette (`Ctrl+Shift+P`)
2. Digite "Tasks: Run Task"
3. Selecione "SIICAF: Análise Cui Bono"
4. Preencha os campos:
   - Número do Processo
   - Tribunal (dropdown)
   - Estado (dropdown)

## 🛠️ Troubleshooting

### Problema: "Node.js não encontrado"

**Solução**:
```bash
# Instale Node.js 20+
# Windows: https://nodejs.org/
# Linux: sudo apt install nodejs npm
# Mac: brew install node
```

### Problema: "npm install falha"

**Solução**:
```bash
# Limpe o cache
npm cache clean --force

# Remova node_modules
rm -rf node_modules package-lock.json

# Reinstale
npm install
```

### Problema: "PowerShell bloqueou execução"

**Solução**:
```powershell
# Execute como administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Problema: "Relatório não abre"

**Solução**:
```powershell
# Verifique se o diretório existe
ls relatorios-siicaf/

# Abra manualmente
explorer relatorios-siicaf\
```

## 📚 Documentação Adicional

- [README.md](README.md) - Documentação completa
- [API Reference](docs/api.md) - Documentação da API
- [Códigos de Ética](src/data/codigos-etica.ts) - Base de dados de ética

## 🤝 Suporte

Problemas ou dúvidas?
- 📧 Email: suporte@siicaf.dev
- 🐛 Issues: GitHub Issues
- 📖 Docs: https://siicaf.dev/docs

---

**SIICAF** - *"Qui bono?" - Quem se beneficia?*
