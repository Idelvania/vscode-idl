/**
 * @file digital_signature.h
 * @brief Validador de Assinaturas Digitais para documentos PJe
 * @author SIICAF - Sistema Inteligente de Análise de Casos e Fluxos
 *
 * Valida assinaturas digitais conforme:
 * - ICP-Brasil
 * - Resoluções CNJ para processos digitais
 * - LOMAN (atos privativos de magistrados)
 * - Código de Ética da OAB
 */

#ifndef DIGITAL_SIGNATURE_H
#define DIGITAL_SIGNATURE_H

#include <stdint.h>
#include <stdbool.h>
#include <time.h>

#define MAX_NAME_LENGTH 256
#define MAX_ROLE_LENGTH 128
#define MAX_CERT_LENGTH 4096

/**
 * Tipos de signatários conforme competência legal
 */
typedef enum {
    SIGNATORY_JUDGE = 1,        // Magistrado (LOMAN)
    SIGNATORY_CLERK,            // Servidor/Escrivão
    SIGNATORY_LAWYER,           // Advogado (OAB)
    SIGNATORY_PROSECUTOR,       // Promotor/Procurador
    SIGNATORY_EXPERT,           // Perito
    SIGNATORY_PARTY,            // Parte (cidadão)
    SIGNATORY_UNKNOWN
} SignatoryType;

/**
 * Tipos de atos processuais conforme CPC
 */
typedef enum {
    ACT_SENTENCE = 1,           // Sentença (privativo de juiz)
    ACT_DECISION,               // Decisão interlocutória (privativo de juiz)
    ACT_DISPATCH,               // Despacho (privativo de juiz)
    ACT_RULING,                 // Acórdão (colegiado)
    ACT_CERTIFICATION,          // Certidão (servidor)
    ACT_PETITION,               // Petição (advogado/parte)
    ACT_OPINION,                // Parecer
    ACT_REPORT,                 // Relatório
    ACT_UNKNOWN
} ProcessActType;

/**
 * Resultado da validação
 */
typedef enum {
    VALIDATION_OK = 0,
    VALIDATION_INVALID_SIGNATURE,
    VALIDATION_EXPIRED_CERTIFICATE,
    VALIDATION_UNAUTHORIZED_SIGNATORY,  // Pessoa sem competência para o ato
    VALIDATION_INCOMPATIBLE_ACT,        // Ato incompatível com o cargo
    VALIDATION_TIMESTAMP_MISMATCH,      // Data de geração != data de assinatura
    VALIDATION_CERTIFICATE_REVOKED,
    VALIDATION_MISSING_DATA,
    VALIDATION_ERROR
} ValidationResult;

/**
 * Estrutura de assinatura digital
 */
typedef struct {
    char signer_name[MAX_NAME_LENGTH];
    char signer_cpf[15];
    char signer_role[MAX_ROLE_LENGTH];
    SignatoryType signatory_type;

    time_t signature_timestamp;
    time_t document_generation_time;

    char certificate_data[MAX_CERT_LENGTH];
    char certificate_issuer[MAX_NAME_LENGTH];
    time_t certificate_valid_from;
    time_t certificate_valid_until;

    bool is_valid;
    ValidationResult validation_result;
    char validation_message[512];
} DigitalSignature;

/**
 * Estrutura de documento PJe
 */
typedef struct {
    char document_id[64];
    char process_number[32];
    ProcessActType act_type;

    time_t generation_timestamp;
    char generated_by_user[64];

    DigitalSignature *signatures;
    size_t signature_count;

    bool has_validation_errors;
    char error_summary[1024];
} PJeDocument;

/* ========== FUNÇÕES DE VALIDAÇÃO ========== */

/**
 * Valida uma assinatura digital completa
 * @param signature Estrutura de assinatura a validar
 * @return Resultado da validação
 */
ValidationResult validate_digital_signature(DigitalSignature *signature);

/**
 * Verifica se o signatário tem competência para o ato
 * @param signatory_type Tipo de signatário
 * @param act_type Tipo de ato processual
 * @return true se autorizado conforme LOMAN/OAB/CNJ
 */
bool is_authorized_for_act(SignatoryType signatory_type, ProcessActType act_type);

/**
 * Valida certificado digital ICP-Brasil
 * @param cert_data Dados do certificado
 * @param cert_length Tamanho dos dados
 * @return true se válido
 */
bool validate_certificate(const char *cert_data, size_t cert_length);

/**
 * Verifica se há divergência entre data de geração e assinatura
 * @param gen_time Timestamp de geração do documento
 * @param sig_time Timestamp da assinatura
 * @param tolerance_seconds Tolerância em segundos (padrão: 86400 = 24h)
 * @return true se divergência suspeita
 */
bool has_timestamp_anomaly(time_t gen_time, time_t sig_time, int tolerance_seconds);

/**
 * Extrai tipo de signatário do certificado digital
 * @param cert_data Dados do certificado
 * @return Tipo de signatário identificado
 */
SignatoryType extract_signatory_type(const char *cert_data);

/**
 * Valida documento PJe completo (todas as assinaturas)
 * @param document Documento a validar
 * @return true se todas as assinaturas válidas
 */
bool validate_pje_document(PJeDocument *document);

/**
 * Gera relatório de validação em formato JSON
 * @param document Documento validado
 * @param output Buffer de saída
 * @param output_size Tamanho do buffer
 * @return Número de bytes escritos
 */
size_t generate_validation_report(const PJeDocument *document, char *output, size_t output_size);

/**
 * Libera memória de documento
 */
void free_pje_document(PJeDocument *document);

#endif /* DIGITAL_SIGNATURE_H */
