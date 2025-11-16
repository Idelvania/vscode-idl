# Integração com SIICAF Existente

Este documento explica como integrar os módulos C desenvolvidos ao seu sistema SIICAF existente.

## 🎯 Visão Geral

Os módulos desenvolvidos fornecem:

1. **Validação de assinaturas digitais** (`digital_signature.h/c`)
2. **Extração de metadados** (`metadata_extractor.h/c`)
3. **Sugestões com IA** (`ai_suggestions.h/c`)

## 📦 Opções de Integração

### Opção 1: Biblioteca Estática (Recomendado)

#### Passo 1: Compilar biblioteca

```bash
cd siicaf-modules
make lib
```

Isso gera `build/libsiicaf.a`

#### Passo 2: Instalar no sistema

```bash
sudo make install
```

Instala em:
- Headers: `/usr/local/include/siicaf/`
- Biblioteca: `/usr/local/lib/libsiicaf.a`

#### Passo 3: Usar no seu código

```c
#include <siicaf/digital_signature.h>
#include <siicaf/metadata_extractor.h>
#include <siicaf/ai_suggestions.h>

int main() {
    DocumentMetadata metadata;
    // ... seu código ...
}
```

#### Passo 4: Compilar seu projeto

```bash
gcc seu_arquivo.c -lsiicaf -lssl -lcrypto -lcurl -o seu_programa
```

---

### Opção 2: Integração Direta

Se preferir não instalar, copie os arquivos diretamente:

```bash
# No diretório do seu SIICAF
mkdir -p include/siicaf src/siicaf

# Copie os arquivos
cp siicaf-modules/include/*.h include/siicaf/
cp siicaf-modules/src/*.c src/siicaf/

# Compile junto com seu projeto
gcc -Iinclude seu_codigo.c src/siicaf/*.c -lssl -lcrypto -lcurl -o siicaf
```

---

### Opção 3: Submódulo Git

Se seu SIICAF é um repositório Git:

```bash
cd INSTALA-O-DO-SIICAF-INPI
git submodule add ./siicaf-modules modules/siicaf-core

# Atualizar
git submodule update --init --recursive
```

---

## 🔧 Fluxo de Integração Recomendado

### 1. Processamento de Documentos PJe

```c
// 1. Receber documento PJe (PDF, HTML, XML)
const char *documento_path = "/caminho/documento.pdf";

// 2. Extrair texto (use biblioteca apropriada)
char *texto_extraido = extrair_texto_pdf(documento_path);

// 3. Extrair metadados
DocumentMetadata metadata;
extract_metadata_from_text(texto_extraido, &metadata);

// 4. Verificar anomalias
if (metadata.has_anomalies) {
    printf("ALERTA: %s\n", metadata.anomaly_report);
    // Notificar usuário
}

// 5. Criar documento PJe estruturado
PJeDocument documento;
// ... preencher com dados extraídos ...

// 6. Validar assinaturas
validate_pje_document(&documento);

// 7. Armazenar no banco de dados do SIICAF
salvar_documento_bd(&documento, &metadata);
```

### 2. Análise com IA

```c
// 1. Montar contexto do caso
CaseContext contexto;
strcpy(contexto.process_number, metadata.process_number);
// ... preencher dados do caso ...

// 2. Gerar prompt
char prompt[MAX_PROMPT_SIZE];
generate_case_analysis_prompt(&contexto, prompt, sizeof(prompt));

// 3. Chamar IA (OpenAI, Claude, ou local)
const char *api_key = obter_chave_api_configuracao();
char resposta_ia[8192];

if (call_ai_api(prompt, api_key, "gpt-4", resposta_ia, sizeof(resposta_ia))) {
    // 4. Processar resposta
    exibir_sugestoes_usuario(resposta_ia);

    // 5. Armazenar sugestões no BD
    salvar_sugestoes_bd(contexto.process_number, resposta_ia);
}
```

### 3. Interface com Usuário

```c
// Exemplo de função para interface
void processar_documento_usuario(const char *path) {
    printf("Processando documento: %s\n", path);

    // Extrai metadados
    DocumentMetadata metadata;
    extract_metadata_from_file(path, &metadata);

    // Mostra informações
    printf("\n=== INFORMAÇÕES EXTRAÍDAS ===\n");
    printf("Processo: %s\n", metadata.process_number);
    printf("Assinaturas: %zu\n", metadata.signature_count);

    // Alerta anomalias
    if (metadata.has_anomalies) {
        printf("\n⚠️  ATENÇÃO: ANOMALIAS DETECTADAS!\n");
        printf("%s\n", metadata.anomaly_report);

        // Pergunta se usuário quer análise detalhada com IA
        printf("\nDeseja análise detalhada com IA? (s/n): ");
        char resposta;
        scanf(" %c", &resposta);

        if (resposta == 's' || resposta == 'S') {
            analisar_anomalias_com_ia(&metadata);
        }
    }

    // Gera sugestões
    gerar_sugestoes_acompanhamento(&metadata);
}
```

---

## 🗄️ Integração com Banco de Dados

### Schema Sugerido (SQL)

```sql
-- Tabela de documentos
CREATE TABLE documentos (
    id INTEGER PRIMARY KEY,
    numero_documento VARCHAR(64),
    numero_processo VARCHAR(32),
    tipo_ato INTEGER,
    data_geracao TIMESTAMP,
    usuario_geracao VARCHAR(15),
    tem_anomalias BOOLEAN,
    resumo_anomalias TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de assinaturas
CREATE TABLE assinaturas (
    id INTEGER PRIMARY KEY,
    documento_id INTEGER REFERENCES documentos(id),
    nome_signatario VARCHAR(256),
    cpf_signatario VARCHAR(15),
    cargo VARCHAR(128),
    tipo_signatario INTEGER,
    timestamp_assinatura TIMESTAMP,
    valida BOOLEAN,
    mensagem_validacao TEXT
);

-- Tabela de sugestões IA
CREATE TABLE sugestoes_ia (
    id INTEGER PRIMARY KEY,
    processo_numero VARCHAR(32),
    tipo_sugestao INTEGER,
    prioridade INTEGER,
    titulo VARCHAR(256),
    descricao TEXT,
    gerado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de análises
CREATE TABLE analises_caso (
    id INTEGER PRIMARY KEY,
    processo_numero VARCHAR(32),
    area_direito INTEGER,
    fase_processual INTEGER,
    analise_ia TEXT,
    confianca REAL,
    gerado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Funções de BD (Exemplo com SQLite)

```c
#include <sqlite3.h>

void salvar_documento_bd(PJeDocument *doc, DocumentMetadata *meta) {
    sqlite3 *db;
    sqlite3_open("siicaf.db", &db);

    char sql[2048];
    snprintf(sql, sizeof(sql),
        "INSERT INTO documentos (numero_documento, numero_processo, tipo_ato, "
        "data_geracao, usuario_geracao, tem_anomalias, resumo_anomalias) "
        "VALUES ('%s', '%s', %d, %ld, '%s', %d, '%s')",
        doc->document_id,
        doc->process_number,
        doc->act_type,
        meta->generation_time,
        meta->generation_user_cpf,
        meta->has_anomalies,
        meta->anomaly_report
    );

    sqlite3_exec(db, sql, NULL, NULL, NULL);
    sqlite3_close(db);
}
```

---

## 🔑 Configuração de APIs de IA

### Arquivo de Configuração (siicaf_config.ini)

```ini
[IA]
provider = openai
api_key = sk-sua-chave-aqui
model = gpt-4
temperatura = 0.7
max_tokens = 4096

[SIICAF]
banco_dados = siicaf.db
log_nivel = INFO
detectar_anomalias = true
validar_assinaturas = true

[CERTIFICADOS]
validar_icp_brasil = true
verificar_revogacao = true
tolerancia_temporal_horas = 24
```

### Lendo Configuração

```c
#include <ini.h> // biblioteca inih

typedef struct {
    char api_key[256];
    char model[64];
    char db_path[512];
} SiicafConfig;

SiicafConfig config;

int handler(void* user, const char* section, const char* name,
            const char* value) {
    SiicafConfig* cfg = (SiicafConfig*)user;

    if (strcmp(section, "IA") == 0) {
        if (strcmp(name, "api_key") == 0) {
            strcpy(cfg->api_key, value);
        } else if (strcmp(name, "model") == 0) {
            strcpy(cfg->model, value);
        }
    } else if (strcmp(section, "SIICAF") == 0) {
        if (strcmp(name, "banco_dados") == 0) {
            strcpy(cfg->db_path, value);
        }
    }
    return 1;
}

void carregar_config() {
    ini_parse("siicaf_config.ini", handler, &config);
}
```

---

## 🖥️ Interface Gráfica (Opcional)

Se seu SIICAF tem interface gráfica (GTK, Qt, web), integre assim:

### Exemplo com GTK

```c
#include <gtk/gtk.h>

void on_analisar_clicked(GtkButton *button, gpointer user_data) {
    GtkEntry *entry = GTK_ENTRY(user_data);
    const char *path = gtk_entry_get_text(entry);

    DocumentMetadata metadata;
    extract_metadata_from_file(path, &metadata);

    // Atualiza interface
    char info[1024];
    snprintf(info, sizeof(info),
             "Processo: %s\nAssinaturas: %zu\nAnomalias: %s",
             metadata.process_number,
             metadata.signature_count,
             metadata.has_anomalies ? "SIM" : "NÃO");

    GtkTextBuffer *buffer = gtk_text_buffer_new(NULL);
    gtk_text_buffer_set_text(buffer, info, -1);
    // ... atualizar TextView ...
}
```

### Exemplo Web (servidor HTTP)

```c
#include <microhttpd.h>

int processar_request(void *cls, struct MHD_Connection *connection,
                     const char *url, const char *method) {
    if (strcmp(url, "/api/analisar") == 0) {
        // Recebe JSON com path do documento
        // Processa
        // Retorna JSON com metadados e sugestões
    }
    return MHD_YES;
}
```

---

## 🧪 Testes

### Teste Unitário Simples

```c
#include "metadata_extractor.h"
#include <assert.h>

void test_extracao_cpf() {
    const char *texto = "495.***.***-34";
    char cpf[15];

    assert(extract_cpf(texto, cpf) == true);
    printf("✓ Test CPF extraction passed\n");
}

void test_extracao_timestamp() {
    time_t ts = parse_timestamp("05/11/2025 16:20:49");
    assert(ts > 0);
    printf("✓ Test timestamp parsing passed\n");
}

int main() {
    test_extracao_cpf();
    test_extracao_timestamp();
    printf("\n✓ All tests passed!\n");
    return 0;
}
```

Compile e execute:
```bash
gcc test.c -Iinclude -lsiicaf -o test_siicaf
./test_siicaf
```

---

## 📊 Monitoramento e Logs

```c
#include <syslog.h>

void log_siicaf(int nivel, const char *msg) {
    openlog("SIICAF", LOG_PID, LOG_USER);
    syslog(nivel, "%s", msg);
    closelog();
}

// Uso
log_siicaf(LOG_INFO, "Documento processado com sucesso");
log_siicaf(LOG_WARNING, "Anomalia detectada em assinatura");
log_siicaf(LOG_ERR, "Falha ao validar certificado");
```

---

## 🚀 Próximos Passos

1. **Compilar módulos**: `cd siicaf-modules && make all`
2. **Executar exemplos**: `make run`
3. **Integrar ao SIICAF**: Escolher opção de integração
4. **Configurar API IA**: Adicionar chave no config
5. **Testar com documentos reais**
6. **Ajustar prompts** conforme necessidade
7. **Implementar persistência** (banco de dados)
8. **Criar interface** (CLI, GUI, ou Web)

---

## 📞 Suporte

Dúvidas sobre integração? Consulte:
- `README.md` - Documentação geral
- `docs/GUIA_PROMPTS.md` - Guia de prompts
- `examples/exemplo_completo.c` - Exemplo funcional

---

**SIICAF** - Integrando inteligência artificial à análise jurídica 🚀⚖️
