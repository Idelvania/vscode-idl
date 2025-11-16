/**
 * @file metadata_extractor.h
 * @brief Extrator de Metadados de Documentos PJe
 * @author SIICAF
 *
 * Extrai e valida metadados de documentos do PJe:
 * - Data/hora de geração: "Este documento foi gerado pelo usuário X em DD/MM/YYYY HH:MM:SS"
 * - Assinaturas digitais: "Assinado eletronicamente por: NOME - DD/MM/YYYY HH:MM:SS"
 * - Número do documento e processo
 * - Validação de competências conforme LOMAN/CNJ/OAB
 */

#ifndef METADATA_EXTRACTOR_H
#define METADATA_EXTRACTOR_H

#include <stdint.h>
#include <stdbool.h>
#include <time.h>

#define MAX_METADATA_FIELDS 50
#define MAX_FIELD_VALUE 512

/**
 * Tipo de metadado extraído
 */
typedef enum {
    METADATA_DOCUMENT_ID,
    METADATA_PROCESS_NUMBER,
    METADATA_GENERATION_USER,
    METADATA_GENERATION_TIMESTAMP,
    METADATA_SIGNATURE_NAME,
    METADATA_SIGNATURE_TIMESTAMP,
    METADATA_DOCUMENT_URL,
    METADATA_PAGE_NUMBER,
    METADATA_UNKNOWN
} MetadataType;

/**
 * Campo de metadado extraído
 */
typedef struct {
    MetadataType type;
    char key[128];
    char value[MAX_FIELD_VALUE];
    size_t line_number;      // Linha onde foi encontrado
    bool is_validated;
} MetadataField;

/**
 * Coleção de metadados de um documento
 */
typedef struct {
    char file_path[512];

    // Metadados principais
    char document_number[64];
    char process_number[32];
    char generation_user_cpf[15];
    time_t generation_time;

    // URL do documento
    char document_url[512];

    // Assinaturas encontradas
    struct {
        char signer_name[256];
        time_t timestamp;
        size_t line_number;
    } signatures[10];
    size_t signature_count;

    // Todos os campos extraídos
    MetadataField fields[MAX_METADATA_FIELDS];
    size_t field_count;

    // Anomalias detectadas
    bool has_anomalies;
    char anomaly_report[2048];
} DocumentMetadata;

/* ========== FUNÇÕES DE EXTRAÇÃO ========== */

/**
 * Extrai metadados de um arquivo de documento PJe
 * @param file_path Caminho do arquivo (PDF, HTML, XML)
 * @param metadata Estrutura para armazenar metadados extraídos
 * @return true se extração bem-sucedida
 */
bool extract_metadata_from_file(const char *file_path, DocumentMetadata *metadata);

/**
 * Extrai metadados de texto bruto (já extraído de PDF/HTML)
 * @param text Texto do documento
 * @param metadata Estrutura para armazenar metadados
 * @return true se extração bem-sucedida
 */
bool extract_metadata_from_text(const char *text, DocumentMetadata *metadata);

/**
 * Extrai timestamp de string formatada
 * Formatos aceitos: "DD/MM/YYYY HH:MM:SS", "DD/MM/YYYY HH:MM"
 * @param timestamp_str String com timestamp
 * @return time_t ou 0 se falha
 */
time_t parse_timestamp(const char *timestamp_str);

/**
 * Extrai CPF de string
 * Formatos: XXX.XXX.XXX-XX ou apenas números
 * @param text Texto contendo CPF
 * @param output Buffer para CPF extraído
 * @return true se CPF encontrado
 */
bool extract_cpf(const char *text, char *output);

/**
 * Detecta padrão: "Este documento foi gerado pelo usuário XXX.*XXX-XX em DD/MM/YYYY HH:MM:SS"
 * @param text Texto a analisar
 * @param metadata Estrutura para armazenar dados extraídos
 * @return true se padrão encontrado
 */
bool extract_generation_info(const char *text, DocumentMetadata *metadata);

/**
 * Detecta padrão: "Assinado eletronicamente por: NOME - DD/MM/YYYY HH:MM:SS"
 * @param text Texto a analisar
 * @param metadata Estrutura para armazenar assinaturas
 * @return Número de assinaturas encontradas
 */
size_t extract_signatures(const char *text, DocumentMetadata *metadata);

/**
 * Detecta padrão: "Número do documento: XXXXXXXXXXXXXXXXXXXXXXXXXX"
 * @param text Texto a analisar
 * @param output Buffer para número do documento
 * @return true se encontrado
 */
bool extract_document_number(const char *text, char *output);

/**
 * Detecta padrão: "Número Único: XXXXXXX-XX.XXXX.X.XX.XXXX"
 * @param text Texto a analisar
 * @param output Buffer para número do processo
 * @return true se encontrado
 */
bool extract_process_number(const char *text, char *output);

/**
 * Detecta anomalias comuns:
 * - Mesma pessoa assinando documentos como juiz e depois como servidor
 * - Documento gerado depois de assinado
 * - Página 1 repetida com assinaturas diferentes
 * - "Num. XXXXX - Pág. 1" aparecendo múltiplas vezes
 *
 * @param metadata Metadados a analisar
 * @return Número de anomalias detectadas
 */
size_t detect_anomalies(DocumentMetadata *metadata);

/**
 * Gera relatório de metadados em formato JSON
 * @param metadata Metadados extraídos
 * @param output Buffer de saída
 * @param output_size Tamanho do buffer
 * @return Número de bytes escritos
 */
size_t generate_metadata_report(const DocumentMetadata *metadata, char *output, size_t output_size);

/**
 * Libera recursos de metadados
 */
void free_metadata(DocumentMetadata *metadata);

/* ========== FUNÇÕES AUXILIARES DE PARSING ========== */

/**
 * Remove espaços em branco extras e normaliza texto
 */
void normalize_text(char *text);

/**
 * Busca padrão regex em texto
 * @param text Texto
 * @param pattern Padrão regex
 * @param matches Array para armazenar matches
 * @param max_matches Número máximo de matches
 * @return Número de matches encontrados
 */
size_t regex_search(const char *text, const char *pattern, char **matches, size_t max_matches);

#endif /* METADATA_EXTRACTOR_H */
