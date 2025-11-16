# Guia de Prompts - SIICAF

Este documento detalha como o SIICAF gera prompts especializados para análise jurídica com IA, fornecendo sugestões de acompanhamento baseadas no caso concreto.

## 📋 Índice

1. [Prompt Base do Sistema](#prompt-base)
2. [Prompt de Análise de Caso](#análise-de-caso)
3. [Prompt de Detecção de Anomalias](#detecção-de-anomalias)
4. [Prompt de Sugestões de Acompanhamento](#sugestões-de-acompanhamento)
5. [Prompt de Pesquisa de Jurisprudência](#pesquisa-de-jurisprudência)
6. [Personalizando Prompts](#personalização)

---

## 1. Prompt Base do Sistema {#prompt-base}

Todos os prompts começam com este texto base que define o comportamento da IA:

```
Você é um assistente jurídico especializado do SIICAF (Sistema Inteligente de
Análise de Casos e Fluxos). Seu objetivo é fornecer sugestões de acompanhamento
processual baseadas no caso concreto, sempre buscando o aprimoramento do conhecimento
em todas as áreas aplicadas ao Direito.

SUAS RESPONSABILIDADES:
1. Analisar o caso sob múltiplas perspectivas jurídicas
2. Sugerir próximos passos processuais estratégicos
3. Identificar jurisprudência relevante dos tribunais superiores
4. Recomendar estudos doutrinários aplicáveis
5. Alertar sobre prazos e procedimentos obrigatórios
6. Detectar anomalias em assinaturas e atos processuais

FORMATO DAS RESPOSTAS:
- Seja objetivo e técnico
- Cite fundamentação legal específica (leis, artigos, súmulas)
- Priorize sugestões por urgência e relevância
- Indique recursos de estudo (livros, artigos, cursos)
```

### Como usar no código:

```c
#include "ai_suggestions.h"

char prompt[MAX_PROMPT_SIZE];
CaseContext context;
// ... preencher context ...

generate_case_analysis_prompt(&context, prompt, sizeof(prompt));
// prompt já contém o texto base + análise específica
```

---

## 2. Prompt de Análise de Caso {#análise-de-caso}

### Objetivo
Análise completa de um caso jurídico com sugestões de acompanhamento.

### Estrutura

```
ANÁLISE DE CASO CONCRETO

IDENTIFICAÇÃO:
Processo: [número do processo]
Fase: [fase processual atual]
Área Principal: [área do direito]

DESCRIÇÃO:
[descrição detalhada do caso]

ASSUNTOS:
- [assunto 1]
- [assunto 2]
- ...

PEDIDOS:
1. [pedido 1]
2. [pedido 2]
...

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

### Exemplo Real

```
ANÁLISE DE CASO CONCRETO

IDENTIFICAÇÃO:
Processo: 1032332-11.2023.8.11.0003
Fase: Sentença
Área Principal: Direito do Consumidor

DESCRIÇÃO:
Ação de repetição de indébito bancário c/c indenização por danos morais.
Autor alega cobrança indevida de empréstimo consignado não contratado.

ASSUNTOS:
- Repetição de indébito
- Cédula de Crédito Bancário
- Indenização por Dano Moral
- Empréstimo consignado

PEDIDOS:
1. Declarar a inexistência da relação jurídica entre as partes
2. Condenar o réu à devolução em dobro dos valores indevidamente cobrados
3. Condenar o réu ao pagamento de danos morais no valor de R$ 10.000,00

TAREFA:
[...]
```

### Resposta Esperada da IA

```markdown
## ANÁLISE DO CASO

### Prioridade 5 (URGENTE)
**Verificar prazo recursal**
- A sentença transitou em julgado em 28/07/2025
- Prazo de 15 dias para recurso (Art. 1.003, CPC)
- Avaliar interesse em interpor recurso

### Prioridade 4 (ALTA)
**Fundamentação Legal Aplicável**
- CDC, Art. 42: "Parágrafo único. O consumidor cobrado em quantia indevida tem
  direito à repetição do indébito, por valor igual ao dobro do que pagou em excesso"
- Súmula 479 STJ: "As instituições financeiras respondem objetivamente pelos danos
  gerados por fortuito interno relativo a fraudes e delitos praticados por terceiros"

### Prioridade 3 (MÉDIA)
**Jurisprudência Aplicável**
- REsp 1.591.725/SP - Tema repetitivo sobre dano moral em negativação indevida
- STJ: Valor de R$ 10.000,00 está adequado à jurisprudência

[...]
```

### Código para gerar:

```c
CaseContext context;
strcpy(context.process_number, "1032332-11.2023.8.11.0003");
strcpy(context.case_description, "Ação de repetição de indébito...");
context.primary_area = AREA_CONSUMIDOR;
context.current_phase = PHASE_SENTENCA;

char prompt[MAX_PROMPT_SIZE];
generate_case_analysis_prompt(&context, prompt, sizeof(prompt));

// Enviar para IA
call_ai_api(prompt, api_key, "gpt-4", response, sizeof(response));
```

---

## 3. Prompt de Detecção de Anomalias {#detecção-de-anomalias}

### Objetivo
Identificar irregularidades em assinaturas digitais e metadados de documentos.

### Estrutura

```
DETECÇÃO DE ANOMALIAS PROCESSUAIS

Analise os seguintes documentos e metadados em busca de anomalias:

[metadados dos documentos]

VERIFIQUE:
1. Divergências entre data de geração e assinatura dos documentos
2. Assinaturas incompatíveis com competência legal (LOMAN, OAB, CNJ)
3. Mesma pessoa assinando documentos com atribuições diferentes
4. Documentos com página 1 repetida ou numeração irregular
5. Certificados digitais expirados ou inválidos
6. Qualquer inconsistência que possa indicar irregularidade

Para cada anomalia detectada, forneça:
- Descrição clara do problema
- Gravidade (baixa/média/alta)
- Base legal violada
- Ações recomendadas
```

### Exemplo com seu caso:

```
DETECÇÃO DE ANOMALIAS PROCESSUAIS

DOCUMENTO 1:
ID: 296632876
Gerado por: 495.***.***-34 em 05/11/2025 16:20:49
Assinado por: SEBASTIAO BARBOSA FARIAS (Desembargador) em 01/07/2025 13:15:24

DOCUMENTO 2:
ID: 297330454
Gerado por: 495.***.***-34 em 05/11/2025 16:20:49
Assinado por: MATHEUS HENRIQUE FREIRE DE AMORIM em 03/07/2025 16:06:48

DOCUMENTO 3:
ID: 303252860
Gerado por: 495.***.***-34 em 05/11/2025 16:20:50
Assinado por: MATHEUS HENRIQUE FREIRE DE AMORIM em 30/07/2025 11:59:09
Observação: "PERCEBE QUE MATHEUS NÃO TEM CAPACIDADE PARA ASSINAR E SEMPRE REPETE A PAGINA 1"
```

### Resposta Esperada:

```markdown
## ANOMALIAS DETECTADAS

### ANOMALIA 1 - GRAVIDADE: ALTA
**Divergência temporal grave**

**Problema:**
Documentos gerados em 05/11/2025 mas assinados em 01/07/2025, 03/07/2025 e 30/07/2025.
Isso é temporalmente impossível - documentos foram assinados ANTES de existirem!

**Base Legal Violada:**
- Resolução CNJ nº 185/2013 - Integridade de assinaturas digitais
- MP 2.200-2/2001 - ICP-Brasil

**Ações Recomendadas:**
1. Solicitar correção dos metadados
2. Verificar autenticidade dos documentos
3. Questionar validade das assinaturas

### ANOMALIA 2 - GRAVIDADE: ALTA
**Possível incompetência para assinar**

**Problema:**
MATHEUS HENRIQUE FREIRE DE AMORIM assinou documentos sem identificação clara
de cargo/competência. A observação indica que "NÃO TEM CAPACIDADE PARA ASSINAR".

**Base Legal Violada:**
- LOMAN - Atos privativos
- Resoluções CNJ sobre PJe

**Ações Recomendadas:**
1. Verificar certificado digital de MATHEUS
2. Confirmar cargo e atribuições
3. Questionar validade dos atos se incompetente

[...]
```

### Código:

```c
PJeDocument documents[3];
// ... preencher documentos ...

char prompt[MAX_PROMPT_SIZE];
generate_anomaly_detection_prompt(documents, 3, prompt, sizeof(prompt));

call_ai_api(prompt, api_key, "gpt-4", response, sizeof(response));
```

---

## 4. Prompt de Sugestões de Acompanhamento {#sugestões-de-acompanhamento}

### Objetivo
Gerar sugestões práticas e acionáveis para próximos passos no processo.

### Estrutura

```
SUGESTÕES DE ACOMPANHAMENTO - CASO ESPECÍFICO

Processo: [número]
Fase Atual: [fase]
Área(s) do Direito: [áreas]

[foco específico opcional]

FORNEÇA SUGESTÕES DETALHADAS DE ACOMPANHAMENTO:

1. PROCEDIMENTOS IMEDIATOS:
   - Quais atos processuais devem ser praticados agora?
   - Há prazos correndo? Quais e quando vencem?
   - Há necessidade de produção de provas? Quais?

2. FUNDAMENTAÇÃO JURÍDICA:
   - Quais dispositivos legais aplicar?
   - Há súmulas ou jurisprudência vinculante?
   - Qual a orientação dos tribunais superiores?

3. ESTUDO RECOMENDADO:
   - Livros e artigos sobre o tema
   - Cursos e palestras relevantes
   - Precedentes obrigatórios para estudar

4. ESTRATÉGIA PROCESSUAL:
   - Qual a melhor linha argumentativa?
   - Há possibilidade de acordos?
   - Quais os riscos e probabilidades de êxito?

Priorize as sugestões por urgência e impacto no resultado do processo.
```

### Exemplo com Foco:

```
SUGESTÕES DE ACOMPANHAMENTO - CASO ESPECÍFICO

Processo: 1032332-11.2023.8.11.0003
Fase Atual: Sentença
Área(s) do Direito: Direito do Consumidor, Direito Bancário

FOCO ESPECÍFICO: Direito do Consumidor
```

### Resposta Esperada:

```markdown
## SUGESTÕES DE ACOMPANHAMENTO

### 1. PROCEDIMENTOS IMEDIATOS ⏰

**Prazo Recursal**
- ✅ URGENTE: Verificar interesse em recorrer
- Prazo: 15 dias úteis a partir do trânsito (28/07/2025)
- Tipo: Apelação (Art. 1.009, CPC)

**Liquidação de Sentença**
- Se não recorrer, iniciar liquidação para cálculo dos valores
- Repetição em dobro conforme Art. 42, CDC
- Incluir correção monetária e juros

### 2. FUNDAMENTAÇÃO JURÍDICA 📚

**Dispositivos Legais:**
- CDC, Art. 42, parágrafo único (repetição em dobro)
- CDC, Art. 6º, VIII (inversão do ônus da prova)
- CC, Art. 927 (responsabilidade civil)

**Súmulas Aplicáveis:**
- Súmula 479, STJ (responsabilidade objetiva bancos)
- Súmula 297, STJ (Código de Defesa do Consumidor)

**Teses Vinculantes:**
- Tema 1.061 STJ: Prescrição em ações de repetição de indébito

### 3. ESTUDO RECOMENDADO 📖

**Livros:**
- "Manual de Direito do Consumidor" - Claudia Lima Marques
- "Responsabilidade Civil" - Carlos Roberto Gonçalves

**Artigos:**
- "Repetição do indébito e sua aplicação em contratos bancários"
- "Dano moral em relações de consumo: critérios de fixação"

**Cursos:**
- Curso de Direito Bancário (OAB)
- Especialização em Direito do Consumidor

**Precedentes para Estudar:**
- REsp 1.591.725/SP (dano moral - negativação indevida)
- REsp 1.737.428/SP (repetição indébito - valor em dobro)

### 4. ESTRATÉGIA PROCESSUAL ⚖️

**Linha Argumentativa:**
Se procedente:
- Manter decisão em grau recursal
- Fundamentar em súmulas vinculantes
- Apresentar jurisprudência pacificada

Se improcedente:
- Recorrer com base em CDC
- Demonstrar boa-fé objetiva violada
- Evidenciar falha do serviço

**Possibilidade de Acordo:**
- MÉDIA probabilidade
- Banco pode oferecer acordo para evitar precedente
- Considerar custos x benefícios

**Probabilidades de Êxito:**
- Mantimento em 2ª instância: 75%
- Jurisprudência consolidada a favor do consumidor
- Provas documentais robustas

### 5. ALERTAS ⚠️

**ATENÇÃO:** Detectadas anomalias nas assinaturas digitais.
Recomenda-se:
1. Verificar autenticidade dos documentos
2. Questionar metadados inconsistentes
3. Solicitar certificação da origem

**PRAZO:** Atenção ao prazo recursal! Não deixe transcorrer em branco.
```

### Código:

```c
CaseContext context;
// ... preencher ...

char prompt[MAX_PROMPT_SIZE];
generate_followup_suggestions_prompt(&context, "Direito do Consumidor",
                                    prompt, sizeof(prompt));

call_ai_api(prompt, api_key, "gpt-4", response, sizeof(response));
```

---

## 5. Prompt de Pesquisa de Jurisprudência {#pesquisa-de-jurisprudência}

### Estrutura

```
PESQUISA DE JURISPRUDÊNCIA APLICÁVEL

Caso: [descrição]
Área: [área do direito]

IDENTIFIQUE E CITE:
1. Súmulas vinculantes (STF) aplicáveis
2. Súmulas (STJ, TST, etc.) relevantes
3. Teses de repercussão geral (STF)
4. Recursos repetitivos (STJ - Art. 1.036 CPC)
5. Precedentes qualificados dos tribunais superiores

Para cada precedente:
- Número do acórdão/súmula
- Ementa resumida
- Aplicabilidade ao caso concreto
- Força vinculante ou persuasiva
```

### Resposta Esperada:

```markdown
## JURISPRUDÊNCIA APLICÁVEL

### SÚMULAS VINCULANTES (STF)
Nenhuma súmula vinculante diretamente aplicável.

### SÚMULAS STJ
**Súmula 479**
"As instituições financeiras respondem objetivamente pelos danos gerados
por fortuito interno relativo a fraudes e delitos praticados por terceiros
no âmbito de operações bancárias."

**Aplicabilidade:** ALTA
Caso envolva fraude em empréstimo consignado não contratado.

**Força:** Persuasiva (não vinculante, mas orientadora)

---

**Súmula 297**
"O Código de Defesa do Consumidor é aplicável às instituições financeiras."

**Aplicabilidade:** ALTA
Fundamenta aplicação do CDC ao caso concreto.

---

### RECURSOS REPETITIVOS (Art. 1.036, CPC)

**REsp 1.591.725/SP (Tema 957)**
"Configuração de dano moral in re ipsa em caso de negativação indevida"

**Ementa Resumida:**
Dispensável prova do dano moral em inscrição indevida em cadastros
de proteção ao crédito.

**Aplicabilidade:** MÉDIA
Se houve negativação do nome.

---

### PRECEDENTES QUALIFICADOS

**STJ - REsp 1.737.428/SP**
Repetição de indébito em dobro - CDC

"A devolução em dobro prevista no parágrafo único do art. 42 do CDC
pressupõe tanto a existência de pagamento indevido quanto a má-fé
do credor."

**Aplicabilidade:** ALTA
**Data:** 2019
**Força:** Persuasiva forte (jurisprudência consolidada)

[...]
```

---

## 6. Personalizando Prompts {#personalização}

### Modificando o Prompt Base

Edite em `src/ai_suggestions.c`:

```c
static const char *PROMPT_SYSTEM_BASE =
    "Você é um assistente jurídico especializado...\n"
    // Adicione suas personalizações aqui
    "INSTRUÇÕES ADICIONAIS:\n"
    "- Sempre cite legislação específica de [sua jurisdição]\n"
    "- Priorize jurisprudência de [tribunal específico]\n"
    "- Use linguagem [formal/acessível]\n";
```

### Criando Novos Templates

```c
static const char *SEU_TEMPLATE =
    "SEU TÍTULO\n\n"
    "Campos: %s\n"
    "Tarefa: %s\n";

size_t gerar_seu_prompt(const CaseContext *ctx, char *out, size_t size) {
    return snprintf(out, size, "%s\n\n%s",
                   PROMPT_SYSTEM_BASE, SEU_TEMPLATE);
}
```

### Focando em Áreas Específicas

```c
// Gerar prompt focado em Direito Trabalhista
generate_followup_suggestions_prompt(&context, "Direito do Trabalho",
                                    prompt, sizeof(prompt));

// Gerar prompt focado em prazos
generate_followup_suggestions_prompt(&context, "Prazos e procedimentos",
                                    prompt, sizeof(prompt));
```

---

## 🎯 Boas Práticas

1. **Seja Específico**: Quanto mais detalhado o contexto, melhores as sugestões
2. **Use Áreas Corretas**: Classifique corretamente a área do direito
3. **Atualize Fases**: Mantenha a fase processual atualizada
4. **Inclua Anomalias**: Se detectadas, inclua no prompt para IA analisar
5. **Teste Prompts**: Experimente variações para melhor resultado
6. **Revise Respostas**: IA pode errar - sempre revise com conhecimento jurídico

---

## 📞 Suporte

Dúvidas sobre prompts? Consulte a equipe SIICAF.

---

**SIICAF** - Prompts inteligentes para análise jurídica eficaz ⚖️🤖
