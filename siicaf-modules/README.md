# SIICAF - Sistema Inteligente de Análise de Casos e Fluxos

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Language: C](https://img.shields.io/badge/Language-C-blue.svg)](https://en.wikipedia.org/wiki/C_(programming_language))

Sistema especializado em análise de documentos processuais do PJe (Processo Judicial Eletrônico), validação de assinaturas digitais e geração de sugestões de acompanhamento com IA.

## 🎯 Funcionalidades

### 1. Validação de Assinaturas Digitais
- ✅ Validação de certificados ICP-Brasil
- ✅ Verificação de competência legal (LOMAN, OAB, CNJ)
- ✅ Detecção de atos privativos
- ✅ Verificação de validade temporal

### 2. Extração de Metadados PJe
- 📄 Extração automática de metadados de documentos
- 🔍 Detecção de padrões:
  - "Este documento foi gerado pelo usuário XXX.***.***-XX em DD/MM/YYYY HH:MM:SS"
  - "Assinado eletronicamente por: NOME - DD/MM/YYYY HH:MM:SS"
  - Números de processo e documento
- ⚠️ Detecção de anomalias temporais

### 3. Análise com IA
- 🤖 Geração de prompts especializados para análise jurídica
- 📋 Sugestões de acompanhamento baseadas no caso concreto
- 📚 Recomendações de estudo e jurisprudência
- 🎯 Estratégias processuais
- ⏰ Alertas de prazos e procedimentos

## 📦 Instalação

### Dependências

```bash
# Ubuntu/Debian
sudo apt-get install build-essential libssl-dev libcurl4-openssl-dev

# Fedora/RHEL
sudo dnf install gcc openssl-devel libcurl-devel

# macOS
brew install openssl curl
```

### Compilação

```bash
# Clone o repositório
git clone https://github.com/Idelvania/INSTALA-O-DO-SIICAF-INPI.git
cd siicaf-modules

# Compile
make all

# Execute exemplo
make run

# Instale no sistema (opcional)
sudo make install
```

## 🚀 Uso Rápido

### Exemplo 1: Extração de Metadados

```c
#include "metadata_extractor.h"

DocumentMetadata metadata;
const char *texto = "Este documento foi gerado pelo usuário 495.***.***-34 em 05/11/2025 16:20:49\n"
                    "Assinado eletronicamente por: SEBASTIAO BARBOSA FARIAS - 01/07/2025 13:15:24";

if (extract_metadata_from_text(texto, &metadata)) {
    printf("Processo: %s\n", metadata.process_number);
    printf("Assinaturas: %zu\n", metadata.signature_count);

    if (metadata.has_anomalies) {
        printf("⚠️ ANOMALIAS: %s\n", metadata.anomaly_report);
    }
}
```

### Exemplo 2: Validação de Assinatura

```c
#include "digital_signature.h"

PJeDocument documento;
// ... preencher documento ...

if (validate_pje_document(&documento)) {
    printf("✓ Documento válido!\n");
} else {
    printf("✗ Problemas: %s\n", documento.error_summary);
}

// Verificar competência
if (!is_authorized_for_act(SIGNATORY_LAWYER, ACT_SENTENCE)) {
    printf("🚨 ALERTA: Advogado não pode assinar sentença!\n");
}
```

### Exemplo 3: Sugestões com IA

```c
#include "ai_suggestions.h"

CaseContext contexto;
strcpy(contexto.process_number, "1032332-11.2023.8.11.0003");
strcpy(contexto.case_description, "Ação de repetição de indébito...");
contexto.primary_area = AREA_CONSUMIDOR;
contexto.current_phase = PHASE_SENTENCA;

// Gera prompt para IA
char prompt[MAX_PROMPT_SIZE];
generate_case_analysis_prompt(&contexto, prompt, sizeof(prompt));

// Use com sua API preferida (OpenAI, Claude, etc)
const char *api_key = "sua-chave-api";
AIAnalysisResult resultado;
if (analyze_case_with_ai(&contexto, api_key, &resultado)) {
    printf("Análise: %s\n", resultado.ai_analysis);
}
```

## 📚 Documentação Completa

### Estrutura do Projeto

```
siicaf-modules/
├── include/              # Headers públicos
│   ├── digital_signature.h
│   ├── metadata_extractor.h
│   └── ai_suggestions.h
├── src/                  # Implementações
│   ├── digital_signature.c
│   ├── metadata_extractor.c
│   └── ai_suggestions.c
├── examples/             # Exemplos de uso
│   └── exemplo_completo.c
├── build/                # Arquivos compilados
│   ├── obj/
│   ├── bin/
│   └── libsiicaf.a
├── docs/                 # Documentação adicional
├── Makefile
└── README.md
```

### Módulos

#### 1. `digital_signature.h/c`

**Principais funções:**
- `validate_digital_signature()` - Valida assinatura digital completa
- `is_authorized_for_act()` - Verifica competência legal
- `validate_certificate()` - Valida certificado ICP-Brasil
- `has_timestamp_anomaly()` - Detecta anomalias temporais
- `validate_pje_document()` - Valida documento completo

**Tipos importantes:**
- `SignatoryType` - JUDGE, CLERK, LAWYER, PROSECUTOR, etc.
- `ProcessActType` - SENTENCE, DECISION, PETITION, etc.
- `ValidationResult` - OK, INVALID_SIGNATURE, UNAUTHORIZED_SIGNATORY, etc.

#### 2. `metadata_extractor.h/c`

**Principais funções:**
- `extract_metadata_from_file()` - Extrai de arquivo
- `extract_metadata_from_text()` - Extrai de texto
- `extract_generation_info()` - Extrai info de geração
- `extract_signatures()` - Extrai assinaturas
- `detect_anomalies()` - Detecta anomalias
- `generate_metadata_report()` - Gera relatório JSON

**Padrões detectados:**
- CPF: `XXX.XXX.XXX-XX` ou `XXX.***.***-XX`
- Timestamps: `DD/MM/YYYY HH:MM:SS`
- Processo: `XXXXXXX-XX.XXXX.X.XX.XXXX`

#### 3. `ai_suggestions.h/c`

**Principais funções:**
- `generate_case_analysis_prompt()` - Gera prompt de análise
- `generate_followup_suggestions_prompt()` - Gera prompt de sugestões
- `generate_anomaly_detection_prompt()` - Gera prompt de anomalias
- `call_ai_api()` - Chama API de IA (OpenAI, Claude, etc)
- `analyze_case_with_ai()` - Análise completa com IA

**Áreas do Direito:**
- CIVIL, CONSUMIDOR, BANCARIO, TRIBUTARIO, TRABALHO, PENAL, etc.

**Fases Processuais:**
- INICIAL, CONTESTACAO, INSTRUCAO, SENTENCA, RECURSAL, EXECUCAO

## 🔧 Integração com SIICAF Principal

### Opção 1: Biblioteca Estática

```c
// No seu código SIICAF principal:
#include <siicaf/digital_signature.h>
#include <siicaf/metadata_extractor.h>
#include <siicaf/ai_suggestions.h>

// Compile linkando com a biblioteca
gcc seu_codigo.c -lsiicaf -lssl -lcrypto -lcurl
```

### Opção 2: Integração Direta

Copie os arquivos `include/*.h` e `src/*.c` para o seu projeto SIICAF e compile junto.

## 🤖 Integração com IA

### OpenAI (GPT-4)

```c
const char *api_key = "sk-...";
call_ai_api(prompt, api_key, "gpt-4", response, sizeof(response));
```

### Claude (Anthropic)

```c
// Modifique call_ai_api() para usar endpoint da Anthropic
// https://api.anthropic.com/v1/messages
```

### Modelos Locais (Ollama, LM Studio)

```c
// Configure endpoint local:
// curl_easy_setopt(curl, CURLOPT_URL, "http://localhost:11434/api/generate");
```

## ⚖️ Base Legal

O sistema valida competências conforme:

- **LOMAN** (Lei Orgânica da Magistratura) - Atos privativos de juízes
- **Código de Ética da OAB** - Atribuições de advogados
- **Resoluções do CNJ** - Processos digitais no PJe
- **CPC/2015** - Atos processuais e prazos

### Matriz de Competências

| Ato | Juiz | Servidor | Advogado | Promotor |
|-----|------|----------|----------|----------|
| Sentença | ✅ | ❌ | ❌ | ❌ |
| Decisão | ✅ | ❌ | ❌ | ❌ |
| Despacho | ✅ | ❌ | ❌ | ❌ |
| Certidão | ❌ | ✅ | ❌ | ❌ |
| Petição | ❌ | ❌ | ✅ | ✅ |

## 🔒 Segurança

- ✅ Validação de certificados ICP-Brasil
- ✅ Verificação de revogação (CRL)
- ✅ Detecção de anomalias temporais
- ✅ Análise de competência legal
- ⚠️ **IMPORTANTE:** Não expor chaves de API no código!

## 🐛 Exemplos de Anomalias Detectadas

```
[ANOMALIA GRAVE] Assinatura anterior à geração do documento
[ALERTA] Advogado assinando sentença (ato privativo de juiz)
[ALERTA] Divergência temporal > 24h entre geração e assinatura
[ANOMALIA] Mesma pessoa assinou múltiplas vezes
[ALERTA] Certificado digital expirado
```

## 📝 Exemplo de Prompt Gerado

```
ANÁLISE DE CASO CONCRETO

IDENTIFICAÇÃO:
Processo: 1032332-11.2023.8.11.0003
Fase: Sentença
Área Principal: Direito do Consumidor

DESCRIÇÃO:
Ação de repetição de indébito bancário c/c indenização por danos morais...

TAREFA:
Analise este caso e forneça:
1. Sugestões de acompanhamento específicas para esta fase
2. Jurisprudência aplicável (STF, STJ, tribunais relevantes)
3. Fundamentação legal detalhada
4. Recomendações de estudo para aprofundamento
5. Alertas sobre prazos e procedimentos obrigatórios
6. Estratégias processuais recomendadas

Organize as sugestões por prioridade (1-5, sendo 5 mais urgente).
```

## 🤝 Contribuindo

Este projeto é privado, mas aceita contribuições da equipe SIICAF.

## 📄 Licença

MIT License - Veja LICENSE para detalhes.

## 👥 Autores

- **Equipe SIICAF**
- Sistema desenvolvido para análise de processos jurídicos do PJe

## 📞 Suporte

Para dúvidas e sugestões:
- Issues: GitHub Issues (repositório privado)
- Email: [seu-email]

---

**SIICAF** - Aprimorando o conhecimento jurídico através da tecnologia 🚀⚖️
