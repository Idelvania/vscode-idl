/**
 * @file exemplo_completo.c
 * @brief Exemplo completo de uso do SIICAF
 *
 * Este exemplo demonstra como:
 * 1. Extrair metadados de documentos PJe
 * 2. Validar assinaturas digitais
 * 3. Detectar anomalias
 * 4. Gerar sugestões com IA
 */

#include "../include/digital_signature.h"
#include "../include/metadata_extractor.h"
#include "../include/ai_suggestions.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void exemplo_extracao_metadados() {
    printf("=== EXEMPLO 1: EXTRAÇÃO DE METADADOS ===\n\n");

    // Texto de exemplo de documento PJe
    const char *texto_documento =
        "Número Único: 1032332-11.2023.8.11.0003\n"
        "Este documento foi gerado pelo usuário 495.***.***-34 em 05/11/2025 16:20:49\n"
        "Número do documento: 25070113152376900000292616808\n"
        "Assinado eletronicamente por: SEBASTIAO BARBOSA FARIAS - 01/07/2025 13:15:24\n"
        "Num. 296632876 - Pág. 1\n";

    DocumentMetadata metadata;
    if (extract_metadata_from_text(texto_documento, &metadata)) {
        printf("✓ Metadados extraídos com sucesso!\n\n");
        printf("Processo: %s\n", metadata.process_number);
        printf("Documento: %s\n", metadata.document_number);
        printf("Gerado por (CPF): %s\n", metadata.generation_user_cpf);
        printf("Data de geração: %ld\n", metadata.generation_time);
        printf("\nAssinaturas encontradas: %zu\n", metadata.signature_count);

        for (size_t i = 0; i < metadata.signature_count; i++) {
            printf("  %zu. %s - %ld\n",
                   i + 1,
                   metadata.signatures[i].signer_name,
                   metadata.signatures[i].timestamp);
        }

        if (metadata.has_anomalies) {
            printf("\n⚠️ ANOMALIAS DETECTADAS:\n%s\n", metadata.anomaly_report);
        }

        // Gera relatório JSON
        char relatorio[4096];
        generate_metadata_report(&metadata, relatorio, sizeof(relatorio));
        printf("\n--- RELATÓRIO JSON ---\n%s\n", relatorio);

        free_metadata(&metadata);
    }

    printf("\n");
}

void exemplo_validacao_assinatura() {
    printf("=== EXEMPLO 2: VALIDAÇÃO DE ASSINATURA DIGITAL ===\n\n");

    // Cria documento de exemplo
    PJeDocument documento;
    memset(&documento, 0, sizeof(PJeDocument));

    strcpy(documento.document_id, "25070113152376900000292616808");
    strcpy(documento.process_number, "1032332-11.2023.8.11.0003");
    documento.act_type = ACT_DECISION;
    documento.generation_timestamp = 1730822449; // 05/11/2025 16:20:49

    // Cria assinatura
    documento.signature_count = 1;
    documento.signatures = malloc(sizeof(DigitalSignature));

    DigitalSignature *sig = &documento.signatures[0];
    memset(sig, 0, sizeof(DigitalSignature));

    strcpy(sig->signer_name, "SEBASTIAO BARBOSA FARIAS");
    strcpy(sig->signer_cpf, "000.000.000-00");
    strcpy(sig->signer_role, "Desembargador");
    sig->signatory_type = SIGNATORY_JUDGE;
    sig->signature_timestamp = 1719842124; // 01/07/2025 13:15:24
    sig->document_generation_time = documento.generation_timestamp;

    // Simula certificado (normalmente viria do documento)
    strcpy(sig->certificate_data, "-----BEGIN CERTIFICATE-----\n"
                                  "ICP-Brasil Autoridade Certificadora\n"
                                  "-----END CERTIFICATE-----");

    // Valida
    if (validate_pje_document(&documento)) {
        printf("✓ Documento validado com sucesso!\n");
    } else {
        printf("✗ Documento com problemas:\n%s\n", documento.error_summary);
    }

    // Verifica competência
    if (is_authorized_for_act(sig->signatory_type, documento.act_type)) {
        printf("✓ Signatário autorizado para este tipo de ato\n");
    } else {
        printf("✗ ALERTA: Signatário NÃO autorizado para este ato!\n");
    }

    free_pje_document(&documento);
    printf("\n");
}

void exemplo_deteccao_anomalia() {
    printf("=== EXEMPLO 3: DETECÇÃO DE ANOMALIAS ===\n\n");

    // Simula caso problemático: advogado assinando sentença
    PJeDocument doc_problema;
    memset(&doc_problema, 0, sizeof(PJeDocument));

    strcpy(doc_problema.document_id, "XXXXX");
    strcpy(doc_problema.process_number, "0000000-00.0000.0.00.0000");
    doc_problema.act_type = ACT_SENTENCE; // Sentença - privativo de juiz!
    doc_problema.generation_timestamp = time(NULL);

    doc_problema.signature_count = 1;
    doc_problema.signatures = malloc(sizeof(DigitalSignature));

    DigitalSignature *sig = &doc_problema.signatures[0];
    strcpy(sig->signer_name, "JOAO SILVA");
    strcpy(sig->signer_role, "Advogado");
    sig->signatory_type = SIGNATORY_LAWYER; // Advogado assinando sentença!
    sig->signature_timestamp = time(NULL);
    sig->document_generation_time = doc_problema.generation_timestamp;

    printf("Validando documento suspeito...\n");

    if (!validate_pje_document(&doc_problema)) {
        printf("\n🚨 ANOMALIA GRAVE DETECTADA!\n");
        printf("%s\n", doc_problema.error_summary);
    }

    free_pje_document(&doc_problema);
    printf("\n");
}

void exemplo_sugestoes_ia() {
    printf("=== EXEMPLO 4: GERAÇÃO DE SUGESTÕES COM IA ===\n\n");

    // Cria contexto do caso
    CaseContext contexto;
    memset(&contexto, 0, sizeof(CaseContext));

    strcpy(contexto.process_number, "1032332-11.2023.8.11.0003");
    strcpy(contexto.case_description,
           "Ação de repetição de indébito bancário c/c indenização por danos morais. "
           "Autor alega cobrança indevida de empréstimo consignado não contratado.");

    contexto.primary_area = AREA_CONSUMIDOR;
    contexto.secondary_areas[0] = AREA_BANCARIO;
    contexto.secondary_area_count = 1;
    contexto.current_phase = PHASE_SENTENCA;

    strcpy(contexto.plaintiff, "José da Silva");
    strcpy(contexto.defendant, "Banco XYZ S/A");

    // Assuntos
    strcpy(contexto.subjects[0], "Repetição de indébito");
    strcpy(contexto.subjects[1], "Cédula de Crédito Bancário");
    strcpy(contexto.subjects[2], "Indenização por Dano Moral");
    strcpy(contexto.subjects[3], "Empréstimo consignado");
    contexto.subject_count = 4;

    // Pedidos
    strcpy(contexto.requests[0],
           "Declarar a inexistência da relação jurídica entre as partes");
    strcpy(contexto.requests[1],
           "Condenar o réu à devolução em dobro dos valores indevidamente cobrados");
    strcpy(contexto.requests[2],
           "Condenar o réu ao pagamento de danos morais no valor de R$ 10.000,00");
    contexto.request_count = 3;

    // Gera prompt para análise
    char prompt[MAX_PROMPT_SIZE];
    size_t prompt_size = generate_case_analysis_prompt(&contexto, prompt, sizeof(prompt));

    printf("📝 Prompt gerado para IA (%zu bytes):\n", prompt_size);
    printf("─────────────────────────────────────────────\n");
    printf("%s\n", prompt);
    printf("─────────────────────────────────────────────\n\n");

    // Gera prompt para sugestões de acompanhamento
    char prompt_followup[MAX_PROMPT_SIZE];
    generate_followup_suggestions_prompt(&contexto, "Direito do Consumidor",
                                        prompt_followup, sizeof(prompt_followup));

    printf("📋 Prompt de sugestões de acompanhamento:\n");
    printf("─────────────────────────────────────────────\n");
    printf("%s\n", prompt_followup);
    printf("─────────────────────────────────────────────\n\n");

    // NOTA: Para chamar a API real, você precisa de uma chave API
    // Exemplo (descomentado quando tiver chave):
    /*
    const char *api_key = "sua-chave-api-aqui";
    AIAnalysisResult resultado;
    if (analyze_case_with_ai(&contexto, api_key, &resultado)) {
        printf("✓ Análise recebida da IA:\n%s\n", resultado.ai_analysis);
        free_analysis_result(&resultado);
    }
    */

    free_case_context(&contexto);
    printf("\n");
}

int main(int argc, char *argv[]) {
    printf("╔══════════════════════════════════════════════════════╗\n");
    printf("║  SIICAF - Sistema Inteligente de Análise de Casos   ║\n");
    printf("║          Exemplo Completo de Utilização             ║\n");
    printf("╚══════════════════════════════════════════════════════╝\n\n");

    exemplo_extracao_metadados();
    exemplo_validacao_assinatura();
    exemplo_deteccao_anomalia();
    exemplo_sugestoes_ia();

    printf("╔══════════════════════════════════════════════════════╗\n");
    printf("║                Exemplos Concluídos                   ║\n");
    printf("╚══════════════════════════════════════════════════════╝\n");

    return 0;
}
