/**
 * @file ai_suggestions.c
 * @brief Implementação do sistema de sugestões com IA
 */

#include "../include/ai_suggestions.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>

/* ========== PROMPTS ESPECIALIZADOS ========== */

static const char *PROMPT_SYSTEM_BASE =
    "Você é um assistente jurídico especializado do SIICAF (Sistema Inteligente de "
    "Análise de Casos e Fluxos). Seu objetivo é fornecer sugestões de acompanhamento "
    "processual baseadas no caso concreto, sempre buscando o aprimoramento do conhecimento "
    "em todas as áreas aplicadas ao Direito.\n\n"
    "SUAS RESPONSABILIDADES:\n"
    "1. Analisar o caso sob múltiplas perspectivas jurídicas\n"
    "2. Sugerir próximos passos processuais estratégicos\n"
    "3. Identificar jurisprudência relevante dos tribunais superiores\n"
    "4. Recomendar estudos doutrinários aplicáveis\n"
    "5. Alertar sobre prazos e procedimentos obrigatórios\n"
    "6. Detectar anomalias em assinaturas e atos processuais\n\n"
    "FORMATO DAS RESPOSTAS:\n"
    "- Seja objetivo e técnico\n"
    "- Cite fundamentação legal específica (leis, artigos, súmulas)\n"
    "- Priorize sugestões por urgência e relevância\n"
    "- Indique recursos de estudo (livros, artigos, cursos)\n";

static const char *PROMPT_CASE_ANALYSIS_TEMPLATE =
    "ANÁLISE DE CASO CONCRETO\n\n"
    "IDENTIFICAÇÃO:\n"
    "Processo: %s\n"
    "Fase: %s\n"
    "Área Principal: %s\n\n"
    "DESCRIÇÃO:\n%s\n\n"
    "ASSUNTOS:\n%s\n\n"
    "PEDIDOS:\n%s\n\n"
    "TAREFA:\n"
    "Analise este caso e forneça:\n"
    "1. Sugestões de acompanhamento específicas para esta fase\n"
    "2. Jurisprudência aplicável (STF, STJ, tribunais relevantes)\n"
    "3. Fundamentação legal detalhada\n"
    "4. Recomendações de estudo para aprofundamento\n"
    "5. Alertas sobre prazos e procedimentos obrigatórios\n"
    "6. Estratégias processuais recomendadas\n\n"
    "Organize as sugestões por prioridade (1-5, sendo 5 mais urgente).\n";

static const char *PROMPT_ANOMALY_DETECTION =
    "DETECÇÃO DE ANOMALIAS PROCESSUAIS\n\n"
    "Analise os seguintes documentos e metadados em busca de anomalias:\n\n"
    "%s\n\n"
    "VERIFIQUE:\n"
    "1. Divergências entre data de geração e assinatura dos documentos\n"
    "2. Assinaturas incompatíveis com competência legal (LOMAN, OAB, CNJ)\n"
    "3. Mesma pessoa assinando documentos com atribuições diferentes\n"
    "4. Documentos com página 1 repetida ou numeração irregular\n"
    "5. Certificados digitais expirados ou inválidos\n"
    "6. Qualquer inconsistência que possa indicar irregularidade\n\n"
    "Para cada anomalia detectada, forneça:\n"
    "- Descrição clara do problema\n"
    "- Gravidade (baixa/média/alta)\n"
    "- Base legal violada\n"
    "- Ações recomendadas\n";

static const char *PROMPT_FOLLOWUP_TEMPLATE =
    "SUGESTÕES DE ACOMPANHAMENTO - CASO ESPECÍFICO\n\n"
    "Processo: %s\n"
    "Fase Atual: %s\n"
    "Área(s) do Direito: %s\n\n"
    "%s\n\n"
    "FORNEÇA SUGESTÕES DETALHADAS DE ACOMPANHAMENTO:\n\n"
    "1. PROCEDIMENTOS IMEDIATOS:\n"
    "   - Quais atos processuais devem ser praticados agora?\n"
    "   - Há prazos correndo? Quais e quando vencem?\n"
    "   - Há necessidade de produção de provas? Quais?\n\n"
    "2. FUNDAMENTAÇÃO JURÍDICA:\n"
    "   - Quais dispositivos legais aplicar?\n"
    "   - Há súmulas ou jurisprudência vinculante?\n"
    "   - Qual a orientação dos tribunais superiores?\n\n"
    "3. ESTUDO RECOMENDADO:\n"
    "   - Livros e artigos sobre o tema\n"
    "   - Cursos e palestras relevantes\n"
    "   - Precedentes obrigatórios para estudar\n\n"
    "4. ESTRATÉGIA PROCESSUAL:\n"
    "   - Qual a melhor linha argumentativa?\n"
    "   - Há possibilidade de acordos?\n"
    "   - Quais os riscos e probabilidades de êxito?\n\n"
    "Priorize as sugestões por urgência e impacto no resultado do processo.\n";

static const char *PROMPT_JURISPRUDENCE_SEARCH =
    "PESQUISA DE JURISPRUDÊNCIA APLICÁVEL\n\n"
    "Caso: %s\n"
    "Área: %s\n\n"
    "IDENTIFIQUE E CITE:\n"
    "1. Súmulas vinculantes (STF) aplicáveis\n"
    "2. Súmulas (STJ, TST, etc.) relevantes\n"
    "3. Teses de repercussão geral (STF)\n"
    "4. Recursos repetitivos (STJ - Art. 1.036 CPC)\n"
    "5. Precedentes qualificados dos tribunais superiores\n\n"
    "Para cada precedente:\n"
    "- Número do acórdão/súmula\n"
    "- Ementa resumida\n"
    "- Aplicabilidade ao caso concreto\n"
    "- Força vinculante ou persuasiva\n";

/* ========== FUNÇÕES AUXILIARES ========== */

static const char* get_legal_area_name(LegalArea area) {
    switch (area) {
        case AREA_CIVIL: return "Direito Civil";
        case AREA_CONSUMIDOR: return "Direito do Consumidor";
        case AREA_BANCARIO: return "Direito Bancário";
        case AREA_TRIBUTARIO: return "Direito Tributário";
        case AREA_TRABALHO: return "Direito do Trabalho";
        case AREA_PENAL: return "Direito Penal";
        case AREA_ADMINISTRATIVO: return "Direito Administrativo";
        case AREA_PREVIDENCIARIO: return "Direito Previdenciário";
        case AREA_FAMILIA: return "Direito de Família";
        case AREA_CONSTITUCIONAL: return "Direito Constitucional";
        case AREA_AMBIENTAL: return "Direito Ambiental";
        case AREA_EMPRESARIAL: return "Direito Empresarial";
        default: return "Não identificado";
    }
}

static const char* get_phase_name(ProcessPhase phase) {
    switch (phase) {
        case PHASE_INICIAL: return "Petição Inicial";
        case PHASE_CONTESTACAO: return "Contestação/Resposta";
        case PHASE_INSTRUCAO: return "Instrução Probatória";
        case PHASE_SENTENCA: return "Sentença";
        case PHASE_RECURSAL: return "Fase Recursal";
        case PHASE_EXECUCAO: return "Execução";
        default: return "Fase não identificada";
    }
}

/* ========== GERAÇÃO DE PROMPTS ========== */

size_t generate_case_analysis_prompt(const CaseContext *context, char *output, size_t output_size) {
    if (!context || !output) return 0;

    // Monta lista de assuntos
    char subjects_list[2048] = {0};
    for (size_t i = 0; i < context->subject_count; i++) {
        char line[300];
        snprintf(line, sizeof(line), "- %s\n", context->subjects[i]);
        strncat(subjects_list, line, sizeof(subjects_list) - strlen(subjects_list) - 1);
    }

    // Monta lista de pedidos
    char requests_list[2048] = {0};
    for (size_t i = 0; i < context->request_count; i++) {
        char line[600];
        snprintf(line, sizeof(line), "%zu. %s\n", i + 1, context->requests[i]);
        strncat(requests_list, line, sizeof(requests_list) - strlen(requests_list) - 1);
    }

    size_t written = snprintf(output, output_size, "%s\n\n", PROMPT_SYSTEM_BASE);

    written += snprintf(output + written, output_size - written,
        PROMPT_CASE_ANALYSIS_TEMPLATE,
        context->process_number,
        get_phase_name(context->current_phase),
        get_legal_area_name(context->primary_area),
        context->case_description,
        subjects_list,
        requests_list
    );

    // Adiciona informações sobre anomalias se houver
    if (context->has_anomalies) {
        written += snprintf(output + written, output_size - written,
            "\n\n⚠️ ATENÇÃO: ANOMALIAS DETECTADAS:\n%s\n\n"
            "Inclua na análise sugestões para tratar estas anomalias.\n",
            context->anomaly_summary
        );
    }

    return written;
}

size_t generate_anomaly_detection_prompt(const PJeDocument *documents, size_t doc_count,
                                         char *output, size_t output_size) {
    if (!documents || !output) return 0;

    char docs_info[8192] = {0};

    for (size_t i = 0; i < doc_count; i++) {
        char doc_block[1024];
        snprintf(doc_block, sizeof(doc_block),
            "DOCUMENTO %zu:\n"
            "ID: %s\n"
            "Tipo de ato: %d\n"
            "Assinaturas: %zu\n",
            i + 1,
            documents[i].document_id,
            documents[i].act_type,
            documents[i].signature_count
        );
        strncat(docs_info, doc_block, sizeof(docs_info) - strlen(docs_info) - 1);

        for (size_t j = 0; j < documents[i].signature_count; j++) {
            char sig_info[512];
            snprintf(sig_info, sizeof(sig_info),
                "  - %s (%s) em %ld\n",
                documents[i].signatures[j].signer_name,
                documents[i].signatures[j].signer_role,
                documents[i].signatures[j].signature_timestamp
            );
            strncat(docs_info, sig_info, sizeof(docs_info) - strlen(docs_info) - 1);
        }
        strncat(docs_info, "\n", sizeof(docs_info) - strlen(docs_info) - 1);
    }

    return snprintf(output, output_size, "%s\n\n%s",
                   PROMPT_SYSTEM_BASE,
                   PROMPT_ANOMALY_DETECTION,
                   docs_info);
}

size_t generate_followup_suggestions_prompt(const CaseContext *context, const char *focus_area,
                                            char *output, size_t output_size) {
    if (!context || !output) return 0;

    // Monta lista de áreas
    char areas_list[512] = {0};
    snprintf(areas_list, sizeof(areas_list), "%s", get_legal_area_name(context->primary_area));
    for (size_t i = 0; i < context->secondary_area_count; i++) {
        char area[128];
        snprintf(area, sizeof(area), ", %s", get_legal_area_name(context->secondary_areas[i]));
        strncat(areas_list, area, sizeof(areas_list) - strlen(areas_list) - 1);
    }

    char focus_instruction[512] = {0};
    if (focus_area) {
        snprintf(focus_instruction, sizeof(focus_instruction),
                "FOCO ESPECÍFICO: %s\n", focus_area);
    }

    size_t written = snprintf(output, output_size, "%s\n\n", PROMPT_SYSTEM_BASE);

    written += snprintf(output + written, output_size - written,
        PROMPT_FOLLOWUP_TEMPLATE,
        context->process_number,
        get_phase_name(context->current_phase),
        areas_list,
        focus_instruction
    );

    return written;
}

size_t generate_jurisprudence_prompt(const CaseContext *context, char *output, size_t output_size) {
    if (!context || !output) return 0;

    size_t written = snprintf(output, output_size, "%s\n\n", PROMPT_SYSTEM_BASE);

    written += snprintf(output + written, output_size - written,
        PROMPT_JURISPRUDENCE_SEARCH,
        context->case_description,
        get_legal_area_name(context->primary_area)
    );

    return written;
}

/* ========== CALLBACK PARA CURL ========== */

struct MemoryStruct {
    char *memory;
    size_t size;
};

static size_t write_callback(void *contents, size_t size, size_t nmemb, void *userp) {
    size_t realsize = size * nmemb;
    struct MemoryStruct *mem = (struct MemoryStruct *)userp;

    char *ptr = realloc(mem->memory, mem->size + realsize + 1);
    if (!ptr) {
        return 0;
    }

    mem->memory = ptr;
    memcpy(&(mem->memory[mem->size]), contents, realsize);
    mem->size += realsize;
    mem->memory[mem->size] = 0;

    return realsize;
}

/* ========== CHAMADA À API DE IA ========== */

bool call_ai_api(const char *prompt, const char *api_key, const char *model,
                char *response, size_t response_size) {
    if (!prompt || !response) return false;

    CURL *curl = curl_easy_init();
    if (!curl) return false;

    struct MemoryStruct chunk = {0};
    chunk.memory = malloc(1);
    chunk.size = 0;

    // Monta JSON do request
    char json_data[MAX_PROMPT_SIZE + 1024];
    snprintf(json_data, sizeof(json_data),
        "{\n"
        "  \"model\": \"%s\",\n"
        "  \"messages\": [\n"
        "    {\"role\": \"user\", \"content\": %s}\n"
        "  ],\n"
        "  \"temperature\": 0.7,\n"
        "  \"max_tokens\": 4096\n"
        "}\n",
        model ? model : "gpt-4",
        prompt
    );

    struct curl_slist *headers = NULL;
    char auth_header[512];
    snprintf(auth_header, sizeof(auth_header), "Authorization: Bearer %s",
             api_key ? api_key : "");

    headers = curl_slist_append(headers, "Content-Type: application/json");
    headers = curl_slist_append(headers, auth_header);

    curl_easy_setopt(curl, CURLOPT_URL, "https://api.openai.com/v1/chat/completions");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void *)&chunk);

    CURLcode res = curl_easy_perform(curl);

    bool success = false;
    if (res == CURLE_OK) {
        strncpy(response, chunk.memory, response_size - 1);
        response[response_size - 1] = '\0';
        success = true;
    }

    curl_easy_cleanup(curl);
    curl_slist_free_all(headers);
    free(chunk.memory);

    return success;
}

bool analyze_case_with_ai(const CaseContext *context, const char *api_key, AIAnalysisResult *result) {
    if (!context || !result) return false;

    memset(result, 0, sizeof(AIAnalysisResult));
    result->context = (CaseContext *)context;

    // Gera prompt
    char prompt[MAX_PROMPT_SIZE];
    generate_case_analysis_prompt(context, prompt, sizeof(prompt));

    // Chama IA
    char ai_response[8192];
    if (!call_ai_api(prompt, api_key, "gpt-4", ai_response, sizeof(ai_response))) {
        return false;
    }

    // Armazena análise
    strncpy(result->ai_analysis, ai_response, sizeof(result->ai_analysis) - 1);
    result->confidence_score = 0.85; // Placeholder

    return true;
}

size_t detect_legal_areas(const char *case_description, const char **subjects, size_t subject_count,
                         LegalArea *areas, size_t max_areas) {
    if (!case_description || !areas) return 0;

    size_t detected = 0;

    // Análise simples por palavras-chave (pode ser melhorada com IA)
    if (strstr(case_description, "consumidor") || strstr(case_description, "CDC")) {
        areas[detected++] = AREA_CONSUMIDOR;
    }
    if (strstr(case_description, "banco") || strstr(case_description, "empréstimo")) {
        if (detected < max_areas) areas[detected++] = AREA_BANCARIO;
    }
    if (strstr(case_description, "repetição de indébito") || strstr(case_description, "indenização")) {
        if (detected < max_areas) areas[detected++] = AREA_CIVIL;
    }

    return detected;
}

ProcessPhase identify_process_phase(const PJeDocument *documents, size_t doc_count) {
    if (!documents || doc_count == 0) return PHASE_UNKNOWN;

    // Identifica pela última decisão
    for (size_t i = 0; i < doc_count; i++) {
        if (documents[i].act_type == ACT_SENTENCE) {
            return PHASE_SENTENCA;
        }
        if (documents[i].act_type == ACT_RULING) {
            return PHASE_RECURSAL;
        }
    }

    return PHASE_INICIAL;
}

void free_analysis_result(AIAnalysisResult *result) {
    if (result) {
        memset(result, 0, sizeof(AIAnalysisResult));
    }
}

void free_case_context(CaseContext *context) {
    if (context) {
        if (context->documents) {
            for (size_t i = 0; i < context->document_count; i++) {
                free_pje_document(&context->documents[i]);
            }
            free(context->documents);
        }
        if (context->metadata) {
            free(context->metadata);
        }
        memset(context, 0, sizeof(CaseContext));
    }
}
