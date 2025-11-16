/**
 * @file digital_signature.c
 * @brief Implementação do validador de assinaturas digitais
 */

#include "../include/digital_signature.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <openssl/x509.h>
#include <openssl/pem.h>
#include <openssl/bio.h>

/**
 * Matriz de competências: [SignatoryType][ProcessActType]
 * Baseado em: LOMAN, CPC, Resoluções CNJ, Código de Ética OAB
 */
static const bool COMPETENCE_MATRIX[7][9] = {
    // SENTENCE, DECISION, DISPATCH, RULING, CERT, PETITION, OPINION, REPORT, UNKNOWN
    {true,  true,  true,  true,  false, false, false, false, false}, // JUDGE
    {false, false, false, false, true,  false, false, true,  false}, // CLERK
    {false, false, false, false, false, true,  true,  false, false}, // LAWYER
    {false, false, false, false, false, true,  true,  true,  false}, // PROSECUTOR
    {false, false, false, false, false, false, true,  true,  false}, // EXPERT
    {false, false, false, false, false, true,  false, false, false}, // PARTY
    {false, false, false, false, false, false, false, false, false}  // UNKNOWN
};

ValidationResult validate_digital_signature(DigitalSignature *signature) {
    if (!signature) {
        return VALIDATION_MISSING_DATA;
    }

    // 1. Validar certificado digital
    if (!validate_certificate(signature->certificate_data, strlen(signature->certificate_data))) {
        snprintf(signature->validation_message, sizeof(signature->validation_message),
                "Certificado digital inválido ou não conforma ICP-Brasil");
        return VALIDATION_INVALID_SIGNATURE;
    }

    // 2. Verificar validade temporal do certificado
    time_t now = time(NULL);
    if (now < signature->certificate_valid_from || now > signature->certificate_valid_until) {
        snprintf(signature->validation_message, sizeof(signature->validation_message),
                "Certificado expirado ou ainda não válido");
        return VALIDATION_EXPIRED_CERTIFICATE;
    }

    // 3. Verificar anomalias de timestamp
    if (has_timestamp_anomaly(signature->document_generation_time,
                             signature->signature_timestamp, 86400)) {
        snprintf(signature->validation_message, sizeof(signature->validation_message),
                "ALERTA: Divergência entre data de geração e assinatura > 24h. "
                "Geração: %ld | Assinatura: %ld",
                signature->document_generation_time, signature->signature_timestamp);
        return VALIDATION_TIMESTAMP_MISMATCH;
    }

    signature->is_valid = true;
    snprintf(signature->validation_message, sizeof(signature->validation_message),
            "Assinatura válida");
    return VALIDATION_OK;
}

bool is_authorized_for_act(SignatoryType signatory_type, ProcessActType act_type) {
    if (signatory_type >= SIGNATORY_UNKNOWN || act_type >= ACT_UNKNOWN) {
        return false;
    }
    return COMPETENCE_MATRIX[signatory_type][act_type];
}

bool validate_certificate(const char *cert_data, size_t cert_length) {
    if (!cert_data || cert_length == 0) {
        return false;
    }

    BIO *bio = BIO_new_mem_buf(cert_data, cert_length);
    if (!bio) {
        return false;
    }

    X509 *cert = PEM_read_bio_X509(bio, NULL, NULL, NULL);
    BIO_free(bio);

    if (!cert) {
        return false;
    }

    // Verificar se é certificado ICP-Brasil
    X509_NAME *issuer = X509_get_issuer_name(cert);
    char issuer_str[256];
    X509_NAME_oneline(issuer, issuer_str, sizeof(issuer_str));

    bool is_icp_brasil = (strstr(issuer_str, "ICP-Brasil") != NULL ||
                          strstr(issuer_str, "Autoridade Certificadora") != NULL);

    X509_free(cert);
    return is_icp_brasil;
}

bool has_timestamp_anomaly(time_t gen_time, time_t sig_time, int tolerance_seconds) {
    // Assinatura deve ser posterior ou próxima à geração
    long diff = (long)(sig_time - gen_time);

    // Anomalia se:
    // 1. Assinatura muito antes da geração (impossível)
    // 2. Assinatura muito depois da geração (suspeito)
    if (diff < -3600) { // Assinado 1h antes de ser gerado?!
        return true;
    }

    if (diff > tolerance_seconds) { // Assinado muito tempo depois?
        return true;
    }

    return false;
}

SignatoryType extract_signatory_type(const char *cert_data) {
    if (!cert_data) {
        return SIGNATORY_UNKNOWN;
    }

    // Analisa OID e campos do certificado para determinar tipo
    // ICP-Brasil usa OIDs específicos para cada tipo

    if (strstr(cert_data, "OAB") || strstr(cert_data, "Advogado")) {
        return SIGNATORY_LAWYER;
    }
    if (strstr(cert_data, "Magistrado") || strstr(cert_data, "Juiz")) {
        return SIGNATORY_JUDGE;
    }
    if (strstr(cert_data, "Servidor") || strstr(cert_data, "Escrivao")) {
        return SIGNATORY_CLERK;
    }
    if (strstr(cert_data, "Promotor") || strstr(cert_data, "Procurador")) {
        return SIGNATORY_PROSECUTOR;
    }

    return SIGNATORY_UNKNOWN;
}

bool validate_pje_document(PJeDocument *document) {
    if (!document || !document->signatures) {
        return false;
    }

    bool all_valid = true;
    char errors[1024] = {0};

    for (size_t i = 0; i < document->signature_count; i++) {
        DigitalSignature *sig = &document->signatures[i];

        // Validar assinatura
        ValidationResult result = validate_digital_signature(sig);

        if (result != VALIDATION_OK) {
            all_valid = false;
            char error_line[256];
            snprintf(error_line, sizeof(error_line),
                    "\n[Assinatura %zu] %s - %s",
                    i + 1, sig->signer_name, sig->validation_message);
            strncat(errors, error_line, sizeof(errors) - strlen(errors) - 1);
        }

        // Validar competência
        if (!is_authorized_for_act(sig->signatory_type, document->act_type)) {
            all_valid = false;
            char error_line[256];
            snprintf(error_line, sizeof(error_line),
                    "\n[ALERTA GRAVE] %s (%s) NÃO tem competência legal para assinar este tipo de ato!",
                    sig->signer_name, sig->signer_role);
            strncat(errors, error_line, sizeof(errors) - strlen(errors) - 1);

            sig->validation_result = VALIDATION_UNAUTHORIZED_SIGNATORY;
        }

        // Verificar timestamp do documento
        if (has_timestamp_anomaly(document->generation_timestamp,
                                 sig->signature_timestamp, 86400)) {
            char error_line[256];
            snprintf(error_line, sizeof(error_line),
                    "\n[ANOMALIA] Documento gerado em um momento, assinado em outro!");
            strncat(errors, error_line, sizeof(errors) - strlen(errors) - 1);
        }
    }

    document->has_validation_errors = !all_valid;
    strncpy(document->error_summary, errors, sizeof(document->error_summary) - 1);

    return all_valid;
}

size_t generate_validation_report(const PJeDocument *document, char *output, size_t output_size) {
    if (!document || !output) {
        return 0;
    }

    size_t written = snprintf(output, output_size,
        "{\n"
        "  \"document_id\": \"%s\",\n"
        "  \"process_number\": \"%s\",\n"
        "  \"validation_status\": \"%s\",\n"
        "  \"signatures\": [\n",
        document->document_id,
        document->process_number,
        document->has_validation_errors ? "INVALID" : "VALID"
    );

    for (size_t i = 0; i < document->signature_count; i++) {
        const DigitalSignature *sig = &document->signatures[i];
        written += snprintf(output + written, output_size - written,
            "    {\n"
            "      \"signer\": \"%s\",\n"
            "      \"cpf\": \"%s\",\n"
            "      \"role\": \"%s\",\n"
            "      \"is_valid\": %s,\n"
            "      \"validation_message\": \"%s\"\n"
            "    }%s\n",
            sig->signer_name,
            sig->signer_cpf,
            sig->signer_role,
            sig->is_valid ? "true" : "false",
            sig->validation_message,
            (i < document->signature_count - 1) ? "," : ""
        );
    }

    written += snprintf(output + written, output_size - written,
        "  ],\n"
        "  \"errors\": \"%s\"\n"
        "}\n",
        document->error_summary
    );

    return written;
}

void free_pje_document(PJeDocument *document) {
    if (document && document->signatures) {
        free(document->signatures);
        document->signatures = NULL;
    }
}
