# SIICAF - Sistema de Inteligência e Investigação de Condutas Antijurídicas e Fraudes

## 🎯 Descrição

Sistema integrado de análise **CUI BONO** (latim: "quem se beneficia") para investigação de processos judiciais, identificação de violações processuais, análise de beneficiários e comparação de gastos do Judiciário.

## 🚀 Funcionalidades

### ✅ Análise Cui Bono Completa
- **Identificação de Beneficiários**: Detecta quem se beneficia de decisões judiciais
- **Rede de Relacionamentos**: Mapeia conexões entre partes, advogados e beneficiários
- **Score de Risco**: Calcula score 0-100 baseado em múltiplos indicadores
- **Análise Detalhada**: Relatório completo com evidências e fundamentação

### 🔍 Detector de Violações Processuais
Detecta automaticamente:
- ❌ Decisão interlocutória quando caberia apelação (e vice-versa)
- ❌ Sentenças sem análise de todos os pedidos e provas
- ❌ Acórdãos que não enfrentam todos os argumentos
- ❌ Violações do devido processo legal
- ❌ Gastos excessivos e superfaturamento
- ❌ Corrupção e favorecimento ilícito
- ❌ Nepotismo

### 📊 Integração com Fontes Oficiais
- **Portal da Transparência**: Dados de gastos públicos
- **CNJ** (Conselho Nacional de Justiça): Estatísticas do Judiciário
- **Comparação TJ-GO**: Usa TJ-GO como referência para comparação

### 📈 Visualizações e Relatórios
- **Gráficos**: Barras, pizza, linha, dispersão e rede
- **Tabelas**: Formatadas com cores de gradação por gravidade
- **Organogramas**: Visualização de estruturas hierárquicas
- **Cores de Gravidade**: Sistema de gradação forte conforme gravidade

### ⚖️ Fundamentação Ética
Sistema fundamentado com códigos de ética de:
- 🔹 OAB (Ordem dos Advogados do Brasil)
- 🔹 Magistratura (CNJ, LOMAN)
- 🔹 Procuradoria/Ministério Público
- 🔹 Promotorias
- 🔹 Serventuários da Justiça
- 🔹 TI e Segurança da Informação

## 📦 Instalação

### Pré-requisitos
- Node.js 20.12.0 ou superior
- npm 9.2+ ou 10.0+
- PowerShell 5.1+ (Windows) ou PowerShell Core 7+ (multiplataforma)

### Passo 1: Clone o repositório
```bash
git clone <repositorio>
cd vscode-idl/apps/siicaf
```

### Passo 2: Instale as dependências
```bash
npm install
```

### Passo 3: Compile o TypeScript
```bash
npm run build
```

## 🎮 Uso

### Modo 1: PowerShell (Recomendado)

#### Windows
```powershell
# Análise básica
.\siicaf-cui-bono.ps1 -Processo "0123456-78.2023.8.09.0051" -Tribunal "TJ-GO" -Estado "GO"

# Análise com abertura automática do relatório
.\siicaf-cui-bono.ps1 -Processo "0123456-78.2023.8.09.0051" -Tribunal "TJ-SP" -Estado "SP" -AbrirRelatorio

# Modo demonstração
.\siicaf-cui-bono.ps1 -Demo
```

#### Linux/Mac
```bash
# Instale PowerShell Core primeiro
pwsh siicaf-cui-bono.ps1 -Processo "0123456-78.2023.8.09.0051" -Tribunal "TJ-GO" -Estado "GO"
```

### Modo 2: Node.js

```bash
# Análise de processo
node dist/main.js analyze -p "0123456-78.2023.8.09.0051" -t "TJ-GO" -e "GO"

# Modo demonstração
node dist/main.js demo
```

### Modo 3: NPM Scripts

```bash
# Análise
npm run analyze

# Demonstração
npm start

# Desenvolvimento (watch mode)
npm run dev
```

### Modo 4: VSCode Integrado

1. Abra a pasta `apps/siicaf` no VSCode
2. Pressione `Ctrl+Shift+P` (ou `Cmd+Shift+P` no Mac)
3. Digite "Tasks: Run Task"
4. Selecione "SIICAF: Análise Cui Bono"

## 📊 Saída dos Relatórios

Os relatórios são gerados em `./relatorios-siicaf/`:

```
relatorios-siicaf/
├── SIICAF_01234567820238090051_2024-11-16T18-30-00.html
├── SIICAF_01234567820238090051_2024-11-16T18-30-00.json
└── SIICAF_01234567820238090051_2024-11-16T18-30-00.txt
```

### Formato HTML
- ✅ Visualização interativa com gráficos
- ✅ Tabelas formatadas com cores
- ✅ Score Cui Bono visual
- ✅ Recomendações destacadas

### Formato JSON
- ✅ Dados estruturados completos
- ✅ Importável para outras ferramentas
- ✅ API-friendly

### Formato TXT
- ✅ Conclusões em texto plano
- ✅ Fácil compartilhamento
- ✅ Impressão otimizada

## 🎨 Sistema de Cores de Gravidade

| Gravidade | Cor | Hex | Nível |
|-----------|-----|-----|-------|
| Muito Baixa | 🟢 Verde | #28A745 | 1 |
| Baixa | 🔵 Azul | #17A2B8 | 2 |
| Média | 🟡 Amarelo | #FFC107 | 3 |
| Alta | 🟠 Laranja | #FD7E14 | 4 |
| Muito Alta | 🔴 Vermelho | #DC3545 | 5 |
| Crítica | ⚫ Vermelho Escuro | #8B0000 | 6 |

## 📖 Exemplos de Uso

### Exemplo 1: Processo com Violações Graves
```powershell
.\siicaf-cui-bono.ps1 `
  -Processo "0001234-56.2023.8.09.0001" `
  -Tribunal "TJ-GO" `
  -Estado "GO" `
  -AbrirRelatorio
```

**Saída esperada:**
- Score Cui Bono: 75/100 (RISCO ALTO)
- 8 violações detectadas
- 3 beneficiários identificados
- Relatório HTML com gráficos interativos

### Exemplo 2: Comparação entre Estados
```powershell
# Analisa processo do TJ-SP e compara com TJ-GO
.\siicaf-cui-bono.ps1 `
  -Processo "0001234-56.2023.8.26.0001" `
  -Tribunal "TJ-SP" `
  -Estado "SP"
```

**Saída esperada:**
- Comparação de gastos TJ-SP vs TJ-GO
- Diferença percentual destacada
- Análise de eficiência

### Exemplo 3: Demonstração Completa
```powershell
.\siicaf-cui-bono.ps1 -Demo
```

**Saída esperada:**
- Processo exemplo pré-configurado
- Todas as funcionalidades demonstradas
- Relatório completo gerado

## 🔧 Configuração Avançada

### Arquivo de Configuração (config.json)
```json
{
  "tribunalReferencia": "TJ-GO",
  "estadoReferencia": "GO",
  "ano": 2024,
  "incluirPortalTransparencia": true,
  "incluirCNJ": true,
  "nivelMinimoGravidade": 3,
  "gerarOrganograma": true,
  "gerarGraficos": true,
  "formatoRelatorio": "HTML"
}
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes com coverage
npm run test:coverage

# Testes de integração
npm run test:integration
```

## 📚 Documentação da API

### Classes Principais

#### `SIICAFEngine`
Motor principal do sistema.

```typescript
const engine = new SIICAFEngine();
await engine.analisarProcesso(numero, tribunal, estado);
```

#### `CuiBonoAnalyzer`
Análise de beneficiários.

```typescript
const analyzer = new CuiBonoAnalyzer();
const analise = await analyzer.analisarProcesso(processo);
```

#### `ViolationDetector`
Detector de violações.

```typescript
const detector = new ViolationDetector();
const violacoes = await detector.detectarViolacoes(processo);
```

#### `TransparencyAPI`
Integração com APIs governamentais.

```typescript
const api = new TransparencyAPI();
const gastos = await api.obterGastosCNJ('TJ-GO', 'GO', 2024);
```

#### `ReportGenerator`
Gerador de relatórios.

```typescript
const generator = new ReportGenerator();
const relatorio = generator.gerarRelatorioCompleto(processo, violacoes, cuiBono, comparacoes);
```

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../../LICENSE.txt) para mais detalhes.

## 👥 Autores

- **SIICAF Development Team**
- Integrado ao vscode-idl project

## 📞 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Email: suporte@siicaf.dev
- Documentação: https://siicaf.dev/docs

## 🙏 Agradecimentos

- CNJ - Conselho Nacional de Justiça
- Portal da Transparência
- Comunidade de desenvolvedores do vscode-idl

---

**SIICAF** - *Sistema de Inteligência e Investigação de Condutas Antijurídicas e Fraudes*

*"Qui bono?" - Quem se beneficia?*
