/**
 * @file metadata_extractor.c
 * @brief Implementação do extrator de metadados PJe
 */

#include "../include/metadata_extractor.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <regex.h>

// Padrões regex para extração
#define PATTERN_GENERATION "Este documento foi gerado pelo usuário ([0-9]{3}[.*]{3}[*]{3}-[0-9]{2}) em ([0-9]{2}/[0-9]{2}/[0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2})"
#define PATTERN_SIGNATURE "Assinado eletronicamente por: ([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ ]+) - ([0-9]{2}/[0-9]{2}/[0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2})"
#define PATTERN_DOC_NUMBER "Número do documento: ([0-9]+)"
#define PATTERN_PROCESS_NUMBER "Número Único: ([0-9]{7}-[0-9]{2}\\.[0-9]{4}\\.[0-9]\\.[0-9]{2}\\.[0-9]{4})"
#define PATTERN_CPF "([0-9]{3}[\\.*]{0,3}[0-9]{3}[\\.*]{0,3}[0-9]{3}[-]{0,1}[0-9]{2})"
#define PATTERN_PAGE "Num\\. ([0-9]+) - Pág\\. ([0-9]+)"

time_t parse_timestamp(const char *timestamp_str) {
    if (!timestamp_str) return 0;

    struct tm tm = {0};
    int day, month, year, hour, min, sec = 0;

    // Tenta formato completo: DD/MM/YYYY HH:MM:SS
    if (sscanf(timestamp_str, "%d/%d/%d %d:%d:%d", &day, &month, &year, &hour, &min, &sec) >= 5) {
        tm.tm_mday = day;
        tm.tm_mon = month - 1;
        tm.tm_year = year - 1900;
        tm.tm_hour = hour;
        tm.tm_min = min;
        tm.tm_sec = sec;
        return mktime(&tm);
    }

    return 0;
}

bool extract_cpf(const char *text, char *output) {
    if (!text || !output) return false;

    regex_t regex;
    regmatch_t matches[2];

    if (regcomp(&regex, PATTERN_CPF, REG_EXTENDED) != 0) {
        return false;
    }

    if (regexec(&regex, text, 2, matches, 0) == 0) {
        size_t len = matches[1].rm_eo - matches[1].rm_so;
        strncpy(output, text + matches[1].rm_so, len);
        output[len] = '\0';

        // Normaliza CPF removendo pontos e mantendo traço
        char normalized[15] = {0};
        size_t j = 0;
        for (size_t i = 0; i < strlen(output) && j < 14; i++) {
            if (isdigit(output[i]) || output[i] == '-') {
                normalized[j++] = output[i];
            }
        }
        strcpy(output, normalized);

        regfree(&regex);
        return true;
    }

    regfree(&regex);
    return false;
}

bool extract_generation_info(const char *text, DocumentMetadata *metadata) {
    if (!text || !metadata) return false;

    regex_t regex;
    regmatch_t matches[3];

    if (regcomp(&regex, PATTERN_GENERATION, REG_EXTENDED) != 0) {
        return false;
    }

    if (regexec(&regex, text, 3, matches, 0) == 0) {
        // Extrai CPF
        size_t cpf_len = matches[1].rm_eo - matches[1].rm_so;
        strncpy(metadata->generation_user_cpf, text + matches[1].rm_so, cpf_len);
        metadata->generation_user_cpf[cpf_len] = '\0';

        // Extrai timestamp
        char timestamp_str[32];
        size_t ts_len = matches[2].rm_eo - matches[2].rm_so;
        strncpy(timestamp_str, text + matches[2].rm_so, ts_len);
        timestamp_str[ts_len] = '\0';

        metadata->generation_time = parse_timestamp(timestamp_str);

        regfree(&regex);
        return true;
    }

    regfree(&regex);
    return false;
}

size_t extract_signatures(const char *text, DocumentMetadata *metadata) {
    if (!text || !metadata) return 0;

    regex_t regex;
    regmatch_t matches[3];
    const char *cursor = text;
    size_t count = 0;

    if (regcomp(&regex, PATTERN_SIGNATURE, REG_EXTENDED) != 0) {
        return 0;
    }

    while (count < 10 && regexec(&regex, cursor, 3, matches, 0) == 0) {
        // Extrai nome
        size_t name_len = matches[1].rm_eo - matches[1].rm_so;
        strncpy(metadata->signatures[count].signer_name, cursor + matches[1].rm_so, name_len);
        metadata->signatures[count].signer_name[name_len] = '\0';

        // Extrai timestamp
        char timestamp_str[32];
        size_t ts_len = matches[2].rm_eo - matches[2].rm_so;
        strncpy(timestamp_str, cursor + matches[2].rm_so, ts_len);
        timestamp_str[ts_len] = '\0';

        metadata->signatures[count].timestamp = parse_timestamp(timestamp_str);

        count++;
        cursor += matches[0].rm_eo;
    }

    regfree(&regex);
    metadata->signature_count = count;
    return count;
}

bool extract_document_number(const char *text, char *output) {
    if (!text || !output) return false;

    regex_t regex;
    regmatch_t matches[2];

    if (regcomp(&regex, PATTERN_DOC_NUMBER, REG_EXTENDED) != 0) {
        return false;
    }

    if (regexec(&regex, text, 2, matches, 0) == 0) {
        size_t len = matches[1].rm_eo - matches[1].rm_so;
        strncpy(output, text + matches[1].rm_so, len);
        output[len] = '\0';

        regfree(&regex);
        return true;
    }

    regfree(&regex);
    return false;
}

bool extract_process_number(const char *text, char *output) {
    if (!text || !output) return false;

    regex_t regex;
    regmatch_t matches[2];

    if (regcomp(&regex, PATTERN_PROCESS_NUMBER, REG_EXTENDED) != 0) {
        return false;
    }

    if (regexec(&regex, text, 2, matches, 0) == 0) {
        size_t len = matches[1].rm_eo - matches[1].rm_so;
        strncpy(output, text + matches[1].rm_so, len);
        output[len] = '\0';

        regfree(&regex);
        return true;
    }

    regfree(&regex);
    return false;
}

bool extract_metadata_from_text(const char *text, DocumentMetadata *metadata) {
    if (!text || !metadata) return false;

    memset(metadata, 0, sizeof(DocumentMetadata));

    // Extrai informações de geração
    extract_generation_info(text, metadata);

    // Extrai assinaturas
    extract_signatures(text, metadata);

    // Extrai número do documento
    extract_document_number(text, metadata->document_number);

    // Extrai número do processo
    extract_process_number(text, metadata->process_number);

    // Detecta anomalias
    detect_anomalies(metadata);

    return true;
}

bool extract_metadata_from_file(const char *file_path, DocumentMetadata *metadata) {
    if (!file_path || !metadata) return false;

    FILE *file = fopen(file_path, "r");
    if (!file) {
        return false;
    }

    // Lê arquivo completo
    fseek(file, 0, SEEK_END);
    long file_size = ftell(file);
    fseek(file, 0, SEEK_SET);

    char *text = malloc(file_size + 1);
    if (!text) {
        fclose(file);
        return false;
    }

    fread(text, 1, file_size, file);
    text[file_size] = '\0';
    fclose(file);

    strncpy(metadata->file_path, file_path, sizeof(metadata->file_path) - 1);

    bool result = extract_metadata_from_text(text, metadata);
    free(text);

    return result;
}

size_t detect_anomalies(DocumentMetadata *metadata) {
    if (!metadata) return 0;

    size_t anomaly_count = 0;
    char report[2048] = {0};

    // Anomalia 1: Documento gerado depois de assinado
    for (size_t i = 0; i < metadata->signature_count; i++) {
        if (metadata->signatures[i].timestamp < metadata->generation_time) {
            char anomaly[256];
            snprintf(anomaly, sizeof(anomaly),
                    "[ANOMALIA GRAVE] Assinatura de %s é anterior à geração do documento!\n",
                    metadata->signatures[i].signer_name);
            strncat(report, anomaly, sizeof(report) - strlen(report) - 1);
            anomaly_count++;
        }
    }

    // Anomalia 2: Mesma pessoa com funções diferentes
    // (Requer análise cruzada com outros documentos - implementar em nível superior)

    // Anomalia 3: Divergência temporal > 24h
    for (size_t i = 0; i < metadata->signature_count; i++) {
        long diff = (long)(metadata->signatures[i].timestamp - metadata->generation_time);
        if (diff > 86400 || diff < -3600) {
            char anomaly[256];
            snprintf(anomaly, sizeof(anomaly),
                    "[ALERTA] Divergência temporal suspeita: %ld segundos entre geração e assinatura de %s\n",
                    diff, metadata->signatures[i].signer_name);
            strncat(report, anomaly, sizeof(report) - strlen(report) - 1);
            anomaly_count++;
        }
    }

    // Anomalia 4: Múltiplas assinaturas da mesma pessoa
    for (size_t i = 0; i < metadata->signature_count; i++) {
        for (size_t j = i + 1; j < metadata->signature_count; j++) {
            if (strcmp(metadata->signatures[i].signer_name,
                      metadata->signatures[j].signer_name) == 0) {
                char anomaly[256];
                snprintf(anomaly, sizeof(anomaly),
                        "[ALERTA] %s assinou o documento múltiplas vezes\n",
                        metadata->signatures[i].signer_name);
                strncat(report, anomaly, sizeof(report) - strlen(report) - 1);
                anomaly_count++;
                break;
            }
        }
    }

    metadata->has_anomalies = (anomaly_count > 0);
    strncpy(metadata->anomaly_report, report, sizeof(metadata->anomaly_report) - 1);

    return anomaly_count;
}

size_t generate_metadata_report(const DocumentMetadata *metadata, char *output, size_t output_size) {
    if (!metadata || !output) return 0;

    size_t written = snprintf(output, output_size,
        "{\n"
        "  \"file\": \"%s\",\n"
        "  \"document_number\": \"%s\",\n"
        "  \"process_number\": \"%s\",\n"
        "  \"generation\": {\n"
        "    \"user_cpf\": \"%s\",\n"
        "    \"timestamp\": %ld\n"
        "  },\n"
        "  \"signatures\": [\n",
        metadata->file_path,
        metadata->document_number,
        metadata->process_number,
        metadata->generation_user_cpf,
        metadata->generation_time
    );

    for (size_t i = 0; i < metadata->signature_count; i++) {
        written += snprintf(output + written, output_size - written,
            "    {\n"
            "      \"signer\": \"%s\",\n"
            "      \"timestamp\": %ld\n"
            "    }%s\n",
            metadata->signatures[i].signer_name,
            metadata->signatures[i].timestamp,
            (i < metadata->signature_count - 1) ? "," : ""
        );
    }

    written += snprintf(output + written, output_size - written,
        "  ],\n"
        "  \"anomalies\": {\n"
        "    \"detected\": %s,\n"
        "    \"report\": \"%s\"\n"
        "  }\n"
        "}\n",
        metadata->has_anomalies ? "true" : "false",
        metadata->anomaly_report
    );

    return written;
}

void normalize_text(char *text) {
    if (!text) return;

    size_t len = strlen(text);
    size_t j = 0;
    bool last_was_space = false;

    for (size_t i = 0; i < len; i++) {
        if (isspace(text[i])) {
            if (!last_was_space) {
                text[j++] = ' ';
                last_was_space = true;
            }
        } else {
            text[j++] = text[i];
            last_was_space = false;
        }
    }
    text[j] = '\0';
}

void free_metadata(DocumentMetadata *metadata) {
    if (metadata) {
        memset(metadata, 0, sizeof(DocumentMetadata));
    }
}
