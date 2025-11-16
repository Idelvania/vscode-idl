/**
 * @file ai_suggestions.h
 * @brief Sistema de Sugestões Inteligentes com IA para Acompanhamento de Casos
 * @author SIICAF
 *
 * Gera sugestões de acompanhamento baseadas em:
 * - Análise do caso concreto
 * - Jurisprudência aplicável
 * - Áreas do direito envolvidas
 * - Prazos e procedimentos
 * - Aprimoramento contínuo de conhecimento jurídico
 */

#ifndef AI_SUGGESTIONS_H
#define AI_SUGGESTIONS_H

#include <stdint.h>
#include <stdbool.h>
#include "digital_signature.h"
#include "metadata_extractor.h"

#define MAX_PROMPT_SIZE 16384
#define MAX_SUGGESTION_SIZE 8192
#define MAX_LEGAL_AREAS 10

/**
 * Áreas do direito identificadas
 */
typedef enum {
    AREA_CIVIL = 1,
    AREA_CONSUMIDOR,
    AREA_BANCARIO,
    AREA_TRIBUTARIO,
    AREA_TRABALHO,
    AREA_PENAL,
    AREA_ADMINISTRATIVO,
    AREA_PREVIDENCIARIO,
    AREA_FAMILIA,
    AREA_CONSTITUCIONAL,
    AREA_AMBIENTAL,
    AREA_EMPRESARIAL,
    AREA_UNKNOWN
} LegalArea;

/**
 * Fase processual
 */
typedef enum {
    PHASE_INICIAL = 1,
    PHASE_CONTESTACAO,
    PHASE_INSTRUCAO,
    PHASE_SENTENCA,
    PHASE_RECURSAL,
    PHASE_EXECUCAO,
    PHASE_UNKNOWN
} ProcessPhase;

/**
 * Tipo de sugestão
 */
typedef enum {
    SUGGESTION_PROCEDURAL,      // Próximos passos processuais
    SUGGESTION_JURISPRUDENCE,   // Pesquisa de jurisprudência
    SUGGESTION_DOCTRINE,        // Estudo doutrinário
    SUGGESTION_DEADLINE,        // Prazos a observar
    SUGGESTION_EVIDENCE,        // Provas a produzir
    SUGGESTION_LEGAL_BASIS,     // Fundamentação legal
    SUGGESTION_STRATEGY,        // Estratégia processual
    SUGGESTION_ANOMALY_ALERT    // Alerta sobre anomalias
} SuggestionType;

/**
 * Contexto do caso para análise
 */
typedef struct {
    // Identificação
    char process_number[32];
    char case_description[2048];

    // Classificação
    LegalArea primary_area;
    LegalArea secondary_areas[MAX_LEGAL_AREAS];
    size_t secondary_area_count;
    ProcessPhase current_phase;

    // Partes
    char plaintiff[256];
    char defendant[256];

    // Assuntos
    char subjects[10][256];
    size_t subject_count;

    // Pedidos
    char requests[10][512];
    size_t request_count;

    // Documentos analisados
    PJeDocument *documents;
    size_t document_count;

    // Metadados extraídos
    DocumentMetadata *metadata;
    size_t metadata_count;

    // Anomalias detectadas
    bool has_anomalies;
    char anomaly_summary[2048];
} CaseContext;

/**
 * Sugestão gerada pela IA
 */
typedef struct {
    SuggestionType type;
    char title[256];
    char description[1024];
    char action_items[10][512];
    size_t action_count;
    int priority;  // 1-5, sendo 5 mais urgente
    bool is_urgent;
} Suggestion;

/**
 * Resultado da análise com IA
 */
typedef struct {
    CaseContext *context;

    Suggestion suggestions[20];
    size_t suggestion_count;

    char ai_analysis[4096];
    char recommended_readings[2048];
    char legal_precedents[2048];

    float confidence_score;  // 0.0 - 1.0
} AIAnalysisResult;

/* ========== FUNÇÕES DE GERAÇÃO DE PROMPTS ========== */

/**
 * Gera prompt completo para análise de caso pela IA
 * @param context Contexto do caso
 * @param output Buffer para prompt gerado
 * @param output_size Tamanho do buffer
 * @return Tamanho do prompt gerado
 */
size_t generate_case_analysis_prompt(const CaseContext *context, char *output, size_t output_size);

/**
 * Gera prompt específico para detectar anomalias
 * @param documents Documentos a analisar
 * @param doc_count Número de documentos
 * @param output Buffer para prompt
 * @param output_size Tamanho do buffer
 * @return Tamanho do prompt gerado
 */
size_t generate_anomaly_detection_prompt(const PJeDocument *documents, size_t doc_count,
                                         char *output, size_t output_size);

/**
 * Gera prompt para sugestões de acompanhamento
 * @param context Contexto do caso
 * @param focus_area Área de foco (NULL para todas)
 * @param output Buffer para prompt
 * @param output_size Tamanho do buffer
 * @return Tamanho do prompt gerado
 */
size_t generate_followup_suggestions_prompt(const CaseContext *context, const char *focus_area,
                                            char *output, size_t output_size);

/**
 * Gera prompt para análise de jurisprudência aplicável
 * @param context Contexto do caso
 * @param output Buffer para prompt
 * @param output_size Tamanho do buffer
 * @return Tamanho do prompt gerado
 */
size_t generate_jurisprudence_prompt(const CaseContext *context, char *output, size_t output_size);

/* ========== FUNÇÕES DE ANÁLISE COM IA ========== */

/**
 * Chama API de IA (OpenAI, Claude, local LLM)
 * @param prompt Prompt a enviar
 * @param api_key Chave de API (NULL para modelos locais)
 * @param model Nome do modelo (ex: "gpt-4", "claude-3-opus")
 * @param response Buffer para resposta
 * @param response_size Tamanho do buffer
 * @return true se chamada bem-sucedida
 */
bool call_ai_api(const char *prompt, const char *api_key, const char *model,
                char *response, size_t response_size);

/**
 * Analisa caso completo com IA
 * @param context Contexto do caso
 * @param api_key Chave de API
 * @param result Resultado da análise
 * @return true se análise bem-sucedida
 */
bool analyze_case_with_ai(const CaseContext *context, const char *api_key, AIAnalysisResult *result);

/**
 * Gera sugestões de acompanhamento
 * @param context Contexto do caso
 * @param api_key Chave de API
 * @param suggestions Array para armazenar sugestões
 * @param max_suggestions Número máximo de sugestões
 * @return Número de sugestões geradas
 */
size_t generate_followup_suggestions(const CaseContext *context, const char *api_key,
                                     Suggestion *suggestions, size_t max_suggestions);

/**
 * Detecta área(s) do direito aplicável(is)
 * @param case_description Descrição do caso
 * @param subjects Assuntos processuais
 * @param subject_count Número de assuntos
 * @param areas Array para armazenar áreas detectadas
 * @param max_areas Número máximo de áreas
 * @return Número de áreas detectadas
 */
size_t detect_legal_areas(const char *case_description, const char **subjects, size_t subject_count,
                         LegalArea *areas, size_t max_areas);

/**
 * Identifica fase processual atual
 * @param documents Documentos do processo
 * @param doc_count Número de documentos
 * @return Fase processual identificada
 */
ProcessPhase identify_process_phase(const PJeDocument *documents, size_t doc_count);

/* ========== FUNÇÕES DE FORMATAÇÃO ========== */

/**
 * Formata sugestões em HTML para exibição
 * @param suggestions Array de sugestões
 * @param count Número de sugestões
 * @param output Buffer de saída
 * @param output_size Tamanho do buffer
 * @return Tamanho do HTML gerado
 */
size_t format_suggestions_html(const Suggestion *suggestions, size_t count,
                               char *output, size_t output_size);

/**
 * Formata análise em Markdown
 * @param result Resultado da análise
 * @param output Buffer de saída
 * @param output_size Tamanho do buffer
 * @return Tamanho do Markdown gerado
 */
size_t format_analysis_markdown(const AIAnalysisResult *result, char *output, size_t output_size);

/**
 * Libera recursos de análise
 */
void free_analysis_result(AIAnalysisResult *result);

/**
 * Libera recursos de contexto
 */
void free_case_context(CaseContext *context);

#endif /* AI_SUGGESTIONS_H */
