/**
 * GERADOR DE DOCUMENTOS JURÍDICOS PROFISSIONAIS
 *
 * Gera documentos de alta qualidade técnica:
 * - Petições (inicial, contestação, recursos)
 * - Representações (OAB, CNJ, MPF, CNMP)
 * - Pareceres jurídicos
 * - Tabelas de responsabilização
 * - Cronologias detalhadas
 *
 * Foco: EXCELÊNCIA TÉCNICA e RIGOR JURÍDICO
 */

import { Caso, Parte, Documento, SugestaoProativa, EstrategiaJuridica } from '../core/types';

export interface DocumentoGerado {
  tipo: 'peticao' | 'representacao' | 'parecer' | 'tabela' | 'cronologia';
  titulo: string;
  conteudo: string;
  formato: 'markdown' | 'html' | 'latex';
  metadados: {
    geradoEm: Date;
    caso: string;
    fundamentacao: string[];
    revisadoPor?: string;
  };
}

export interface RepresentacaoOrgao {
  orgao: 'OAB' | 'CNJ' | 'MPF' | 'CNMP';
  titulo: string;
  conteudo: string;
  fundamentacaoEspecifica: string[];
  competencia: string;
  pedidos: string[];
}

export class LegalDocumentGenerator {

  /**
   * Gera representação para OAB
   * Foco: Ética profissional e conduta de advogados
   */
  gerarRepresentacaoOAB(caso: Caso, fatos: string[], agentes: Parte[]): RepresentacaoOrgao {
    const conteudo = `
EXCELENTÍSSIMO SENHOR PRESIDENTE DA ORDEM DOS ADVOGADOS DO BRASIL
SECCIONAL [ESTADO]

${this.gerarCabecalho('REPRESENTAÇÃO', 'OAB')}

O(A) REPRESENTANTE, por meio de seu advogado que esta subscreve, com fundamento
no Código de Ética e Disciplina da OAB (Resolução 02/2015) e no Estatuto da OAB
(Lei 8.906/94), vem apresentar

REPRESENTAÇÃO

em face de:

${this.formatarListaRepresentados(agentes)}

pelos fatos e fundamentos jurídicos a seguir expostos:

I. DOS FATOS

${this.formatarFatos(fatos)}

II. DA COMPETÊNCIA DA OAB

A Ordem dos Advogados do Brasil, nos termos do art. 54, V, da Lei 8.906/94,
tem competência para apurar infrações e aplicar sanções disciplinares.

O Código de Ética e Disciplina da OAB estabelece:

Art. 2º O advogado, indispensável à administração da Justiça, é defensor
do estado democrático de direito, da cidadania, da moralidade pública,
da Justiça e da paz social, subordinando a atividade do seu Ministério
Privado à elevada função pública que exerce.

III. DAS INFRAÇÕES ÉTICAS IDENTIFICADAS

${this.identificarInfracoesEticas(caso)}

IV. DA FUNDAMENTAÇÃO LEGAL

1. Estatuto da OAB (Lei 8.906/94):
   - Art. 34: Constitui infração disciplinar...
   - Art. 35: Aplicação de sanções

2. Código de Ética e Disciplina:
   - Art. 2º: Função pública do advogado
   - Art. 6º: Dever de probidade

V. DOS PEDIDOS

Diante do exposto, requer-se:

a) O recebimento e processamento da presente representação;
b) A instauração de procedimento disciplinar;
c) A aplicação das sanções cabíveis;
d) A notificação do representante sobre o andamento.

${this.gerarRodape()}
`;

    return {
      orgao: 'OAB',
      titulo: 'Representação por Infração Ética',
      conteudo,
      fundamentacaoEspecifica: [
        'Lei 8.906/94 (Estatuto da OAB)',
        'Resolução 02/2015 (Código de Ética)'
      ],
      competencia: 'Apuração de infrações ético-disciplinares de advogados',
      pedidos: [
        'Instauração de procedimento disciplinar',
        'Aplicação de sanções cabíveis'
      ]
    };
  }

  /**
   * Gera representação para CNJ
   * Foco: Conduta de magistrados e eficiência do Judiciário
   */
  gerarRepresentacaoCNJ(caso: Caso, fatos: string[]): RepresentacaoOrgao {
    const conteudo = `
EXCELENTÍSSIMO SENHOR PRESIDENTE DO CONSELHO NACIONAL DE JUSTIÇA

${this.gerarCabecalho('REPRESENTAÇÃO', 'CNJ')}

O(A) REPRESENTANTE vem, respeitosamente, apresentar

REPRESENTAÇÃO

com fundamento no art. 103-B, § 4º, da Constituição Federal e na
Resolução CNJ nº 135/2011, pelos fatos a seguir:

I. DOS FATOS

${this.formatarFatos(fatos)}

II. DA COMPETÊNCIA DO CNJ

O Conselho Nacional de Justiça, nos termos do art. 103-B da CF/88,
exerce o controle da atuação administrativa e financeira do Poder
Judiciário e do cumprimento dos deveres funcionais dos juízes.

Resolução CNJ 135/2011:
"Art. 1º - O CNJ, no exercício de suas atribuições constitucionais
e legais, receberá e processará representações contra magistrados."

III. DAS IRREGULARIDADES IDENTIFICADAS

${this.identificarIrregularidadesJudiciais(caso)}

IV. DA FUNDAMENTAÇÃO

1. Violação aos deveres do magistrado (LOMAN - LC 35/79):
   - Art. 35: Deveres do magistrado
   - Art. 56: Infrações disciplinares

2. Princípios constitucionais violados:
   - Eficiência (CF, art. 37, caput)
   - Razoável duração do processo (CF, art. 5º, LXXVIII)
   - Moralidade administrativa (CF, art. 37, caput)

3. Código de Ética da Magistratura (CNJ):
   - Art. 8º: Prudência
   - Art. 19: Integridade
   - Art. 24: Diligência

V. DOS PEDIDOS

Requer-se:

a) Instauração de procedimento de controle administrativo;
b) Apuração rigorosa dos fatos narrados;
c) Adoção de providências para garantir celeridade processual;
d) Aplicação das sanções cabíveis, se confirmadas as irregularidades;
e) Comunicação ao representante sobre as medidas adotadas.

${this.gerarRodape()}
`;

    return {
      orgao: 'CNJ',
      titulo: 'Representação por Irregularidade Judicial',
      conteudo,
      fundamentacaoEspecifica: [
        'CF/88, Art. 103-B',
        'Resolução CNJ 135/2011',
        'LOMAN (LC 35/79)',
        'Código de Ética da Magistratura'
      ],
      competencia: 'Controle da atuação administrativa do Judiciário',
      pedidos: [
        'Instauração de procedimento administrativo',
        'Apuração rigorosa',
        'Medidas para celeridade'
      ]
    };
  }

  /**
   * Gera representação para MPF
   * Foco: Crimes e improbidade administrativa
   */
  gerarRepresentacaoMPF(caso: Caso, fatos: string[], valorDano?: number): RepresentacaoOrgao {
    const conteudo = `
EXCELENTÍSSIMO SENHOR PROCURADOR-GERAL DA REPÚBLICA

${this.gerarCabecalho('REPRESENTAÇÃO CRIMINAL E DE IMPROBIDADE', 'MPF')}

O(A) REPRESENTANTE vem apresentar

REPRESENTAÇÃO

para fins de:
a) Instauração de Inquérito Civil Público (Lei 7.347/85);
b) Oferecimento de Ação Civil Pública por Improbidade Administrativa (Lei 8.429/92);
c) Instauração de Inquérito Policial para apuração de crimes.

I. DOS FATOS

${this.formatarFatos(fatos)}

II. DA COMPETÊNCIA DO MINISTÉRIO PÚBLICO FEDERAL

CF/88, Art. 129: São funções institucionais do Ministério Público:
III - promover o inquérito civil e a ação civil pública, para a proteção
do patrimônio público e social, do meio ambiente e de outros interesses
difusos e coletivos;

Lei 8.429/92, Art. 22: Para apurar qualquer ilícito previsto nesta lei,
o Ministério Público, de ofício, a requerimento de autoridade administrativa
ou mediante representação formulada de acordo com o disposto no art. 14,
poderá requisitar a instauração de inquérito policial ou procedimento
administrativo.

III. DOS ATOS DE IMPROBIDADE ADMINISTRATIVA

${this.identificarAtosImprobidade(caso, valorDano)}

IV. DOS CRIMES IDENTIFICADOS

${this.identificarCrimesAdministracao(caso)}

V. DO DANO AO ERÁRIO

${valorDano ? this.calcularDanoErario(valorDano) : 'A quantificar por meio de perícia.'}

VI. DA FUNDAMENTAÇÃO LEGAL

A. IMPROBIDADE ADMINISTRATIVA (Lei 8.429/92):
   - Art. 9º: Atos que importam enriquecimento ilícito
   - Art. 10: Atos que causam prejuízo ao erário
   - Art. 11: Atos que atentam contra os princípios

B. CRIMES CONTRA A ADMINISTRAÇÃO PÚBLICA (CP):
   - Art. 312: Peculato
   - Art. 317: Corrupção passiva
   - Art. 319: Prevaricação
   - Art. 90 da Lei 8.666/93: Crimes em licitações

VII. DOS PEDIDOS

Requer-se:

a) Instauração de INQUÉRITO CIVIL PÚBLICO para apuração dos atos de improbidade;
b) Requisição de INQUÉRITO POLICIAL para apuração dos crimes;
c) Ajuizamento de AÇÃO CIVIL PÚBLICA nos termos da Lei 8.429/92;
d) Oferecimento de DENÚNCIA CRIMINAL contra os responsáveis;
e) Adoção de medidas cautelares:
   - Sequestro de bens (Lei 8.429/92, art. 16)
   - Indisponibilidade de bens (Lei 8.429/92, art. 7º)
   - Afastamento cautelar dos agentes públicos
f) Requisição de documentos e informações;
g) Realização de perícia para quantificação do dano;
h) Comunicação ao representante sobre as providências adotadas.

${this.gerarRodape()}
`;

    return {
      orgao: 'MPF',
      titulo: 'Representação Criminal e de Improbidade Administrativa',
      conteudo,
      fundamentacaoEspecifica: [
        'CF/88, Art. 129, III',
        'Lei 8.429/92 (Improbidade Administrativa)',
        'Código Penal (Crimes contra Administração)',
        'Lei 8.666/93 (Crimes em Licitações)'
      ],
      competencia: 'Defesa da ordem jurídica, do regime democrático e dos interesses sociais',
      pedidos: [
        'Inquérito Civil Público',
        'Inquérito Policial',
        'Ação Civil Pública',
        'Denúncia Criminal',
        'Medidas cautelares'
      ]
    };
  }

  /**
   * Gera representação para CNMP
   * Foco: Conduta de membros do Ministério Público
   */
  gerarRepresentacaoCNMP(caso: Caso, fatos: string[]): RepresentacaoOrgao {
    const conteudo = `
EXCELENTÍSSIMO SENHOR PRESIDENTE DO CONSELHO NACIONAL DO MINISTÉRIO PÚBLICO

${this.gerarCabecalho('REPRESENTAÇÃO', 'CNMP')}

O(A) REPRESENTANTE vem apresentar

REPRESENTAÇÃO

com fundamento no art. 130-A, § 2º, III, da CF/88 e na Resolução CNMP
nº 89/2012, pelos fatos a seguir:

I. DOS FATOS

${this.formatarFatos(fatos)}

II. DA COMPETÊNCIA DO CNMP

CF/88, Art. 130-A, § 2º: Compete ao Conselho Nacional do Ministério Público:
III - receber e conhecer das reclamações contra membros ou órgãos do
Ministério Público da União ou dos Estados, inclusive contra seus serviços
auxiliares, sem prejuízo da competência disciplinar e correicional da
instituição, podendo avocar processos disciplinares em curso, determinar
a remoção, a disponibilidade ou a aposentadoria com subsídios ou proventos
proporcionais ao tempo de serviço e aplicar outras sanções administrativas.

III. DAS IRREGULARIDADES FUNCIONAIS

${this.identificarIrregularidadesMP(caso)}

IV. DA FUNDAMENTAÇÃO

1. Lei Orgânica do Ministério Público (Lei 8.625/93):
   - Art. 43: Deveres do membro do MP
   - Art. 44: Vedações

2. Resolução CNMP 89/2012:
   Disciplina o processo administrativo disciplinar

3. Princípios institucionais violados:
   - Unidade (CF, art. 127, § 1º)
   - Independência funcional
   - Indivisibilidade

V. DOS PEDIDOS

Requer-se:

a) Instauração de procedimento administrativo disciplinar;
b) Apuração rigorosa dos fatos;
c) Garantia de transparência no processo;
d) Aplicação das sanções cabíveis;
e) Comunicação das providências adotadas.

${this.gerarRodape()}
`;

    return {
      orgao: 'CNMP',
      titulo: 'Representação contra Membro do Ministério Público',
      conteudo,
      fundamentacaoEspecifica: [
        'CF/88, Art. 130-A',
        'Lei 8.625/93 (Lei Orgânica do MP)',
        'Resolução CNMP 89/2012'
      ],
      competencia: 'Controle da atuação administrativa e financeira do MP',
      pedidos: [
        'Procedimento administrativo disciplinar',
        'Apuração dos fatos',
        'Aplicação de sanções'
      ]
    };
  }

  /**
   * Gera TABELA DE RESPONSABILIZAÇÃO (16 agentes)
   * Técnica usada em Lava Jato e Mensalão
   */
  gerarTabelaResponsabilizacao(agentes: Parte[]): DocumentoGerado {
    let tabela = `
# MATRIZ DE RESPONSABILIZAÇÃO

> **Técnica profissional para casos com múltiplos réus**
> Utilizada em: Operação Lava Jato, Mensalão, grandes casos de corrupção

## METODOLOGIA

Esta matriz identifica:
1. **PRINCIPAL**: Quem tinha poder decisório (domínio do fato)
2. **SECUNDÁRIA**: Quem executou materialmente os atos
3. **OMISSIVA**: Quem deveria fiscalizar e omitiu-se

---

## TABELA COMPLETA

| # | NOME | CARGO/FUNÇÃO | COMPETÊNCIA LEGAL | ATO PRATICADO | PROVA NOS AUTOS | GRAU DE RESPONSABILIDADE |
|---|------|--------------|-------------------|---------------|-----------------|--------------------------|
`;

    agentes.forEach((agente, index) => {
      const grau = this.classificarGrauResponsabilidade(agente);
      const competencia = this.identificarCompetenciaLegal(agente);
      const atos = this.identificarAtosPraticados(agente);
      const provas = agente.provasContra?.join(', ') || 'A especificar';

      tabela += `| ${index + 1} | **${agente.nome}** | ${agente.cargo || 'N/A'} | ${competencia} | ${atos} | ${provas} | **${grau}** |\n`;
    });

    tabela += `\n---\n\n`;
    tabela += `## ANÁLISE POR GRAU DE RESPONSABILIDADE\n\n`;
    tabela += this.gerarAnaliseGraus(agentes);

    tabela += `\n## FUNDAMENTAÇÃO JURÍDICA\n\n`;
    tabela += this.gerarFundamentacaoTabela();

    tabela += `\n## ESTRATÉGIA DE RESPONSABILIZAÇÃO\n\n`;
    tabela += this.gerarEstrategiaResponsabilizacao(agentes);

    return {
      tipo: 'tabela',
      titulo: 'Matriz de Responsabilização - 16 Agentes',
      conteudo: tabela,
      formato: 'markdown',
      metadados: {
        geradoEm: new Date(),
        caso: 'Análise completa',
        fundamentacao: [
          'Teoria do Domínio do Fato',
          'REsp 1.297.797/SP (STJ)',
          'Lei 8.429/92'
        ]
      }
    };
  }

  // ========== MÉTODOS AUXILIARES ==========

  private gerarCabecalho(tipo: string, orgao: string): string {
    return `
**${tipo}**

Representante: [NOME DO REPRESENTANTE]
CPF: [CPF]
Endereço: [ENDEREÇO]

${orgao === 'OAB' ? 'Advogado(a): [NOME]\nOAB/[UF]: [NÚMERO]' : ''}
`;
  }

  private formatarListaRepresentados(agentes: Parte[]): string {
    return agentes
      .map((a, i) => `${i + 1}. **${a.nome}**, ${a.cargo || 'qualificação a incluir'}`)
      .join('\n');
  }

  private formatarFatos(fatos: string[]): string {
    return fatos
      .map((fato, i) => `${i + 1}. ${fato}`)
      .join('\n\n');
  }

  private identificarInfracoesEticas(caso: Caso): string {
    return `
As condutas identificadas configuram violação aos seguintes dispositivos
do Código de Ética:

1. **Art. 2º** - Violação à função pública do advogado
2. **Art. 6º** - Falta de probidade profissional
3. **Art. 34** - Infração disciplinar
`;
  }

  private identificarIrregularidadesJudiciais(caso: Caso): string {
    return `
Foram identificadas as seguintes irregularidades:

1. **Morosidade excessiva**: Processo paralisado por [X] meses sem justificativa
2. **Violação ao princípio da eficiência**: Descumprimento de prazos processuais
3. **Falta de fundamentação**: Decisões sem motivação adequada
`;
  }

  private identificarAtosImprobidade(caso: Caso, valorDano?: number): string {
    let texto = `
Os fatos narrados configuram os seguintes atos de improbidade:

**Art. 10 da Lei 8.429/92 - Atos que causam prejuízo ao erário:**
`;

    if (valorDano) {
      texto += `
- Dano ao erário quantificado em **R$ ${valorDano.toLocaleString('pt-BR')}**
- Superfaturamento em contratos públicos
- Direcionamento de licitações
`;
    }

    texto += `
**Art. 11 da Lei 8.429/92 - Atos que atentam contra os princípios:**
- Violação aos princípios da legalidade, impessoalidade e moralidade
- Descumprimento de normas legais e regulamentares
`;

    return texto;
  }

  private identificarCrimesAdministracao(caso: Caso): string {
    return `
Os fatos configuram, em tese, os seguintes crimes:

1. **PECULATO (CP, art. 312)**
   - Apropriação de valores públicos
   - Pena: 2 a 12 anos

2. **CORRUPÇÃO PASSIVA (CP, art. 317)**
   - Solicitação ou recebimento de vantagem indevida
   - Pena: 2 a 12 anos

3. **FRAUDE EM LICITAÇÃO (Lei 8.666/93, art. 90)**
   - Frustração do caráter competitivo
   - Pena: 2 a 4 anos
`;
  }

  private calcularDanoErario(valor: number): string {
    const corrigido = valor * 1.15; // Exemplo: 15% de correção
    const juros = valor * 0.05; // Exemplo: 5% de juros
    const total = corrigido + juros;

    return `
**CÁLCULO DO DANO AO ERÁRIO**

| Item | Valor |
|------|-------|
| Prejuízo principal | R$ ${valor.toLocaleString('pt-BR')} |
| Correção monetária (estimada) | R$ ${(corrigido - valor).toLocaleString('pt-BR')} |
| Juros (estimados) | R$ ${juros.toLocaleString('pt-BR')} |
| **TOTAL ATUALIZADO** | **R$ ${total.toLocaleString('pt-BR')}** |

*Valores sujeitos a atualização por perícia contábil.*
`;
  }

  private identificarIrregularidadesMP(caso: Caso): string {
    return `
1. **Inércia funcional**: Não adoção de providências cabíveis
2. **Falta de fiscalização**: Omissão no cumprimento de deveres funcionais
3. **Violação à independência funcional**: Subordinação a interesses externos
`;
  }

  private classificarGrauResponsabilidade(agente: Parte): string {
    if (agente.cargo?.match(/Presidente|Ministro|Diretor-Geral/i)) {
      return 'PRINCIPAL';
    } else if (agente.cargo?.match(/Diretor|Coordenador/i)) {
      return 'PRINCIPAL/SECUNDÁRIA';
    } else if (agente.cargo?.match(/Assessor|Secretário|Técnico/i)) {
      return 'SECUNDÁRIA';
    }
    return 'A DEFINIR';
  }

  private identificarCompetenciaLegal(agente: Parte): string {
    // Simplificado - deveria consultar legislação específica
    if (agente.cargo?.includes('Presidente')) {
      return 'Gestão superior (Lei Orgânica)';
    } else if (agente.cargo?.includes('Diretor')) {
      return 'Gestão setorial (Regimento Interno)';
    }
    return 'A identificar';
  }

  private identificarAtosPraticados(agente: Parte): string {
    return agente.responsabilidade || 'A especificar';
  }

  private gerarAnaliseGraus(agentes: Parte[]): string {
    const principais = agentes.filter(a => this.classificarGrauResponsabilidade(a) === 'PRINCIPAL');
    const secundarias = agentes.filter(a => this.classificarGrauResponsabilidade(a) === 'SECUNDÁRIA');

    return `
### RESPONSABILIDADE PRINCIPAL (${principais.length} agentes)
Autoridades com poder decisório. Respondem por **domínio do fato**.

${principais.map(a => `- **${a.nome}** (${a.cargo})`).join('\n')}

### RESPONSABILIDADE SECUNDÁRIA (${secundarias.length} agentes)
Executores materiais. Respondem por **concurso de agentes**.

${secundarias.map(a => `- **${a.nome}** (${a.cargo})`).join('\n')}
`;
  }

  private gerarFundamentacaoTabela(): string {
    return `
### Teoria do Domínio do Fato
Autoridades com poder de decisão e controle respondem como autores principais,
mesmo sem execução material (STJ, REsp 1.297.797/SP).

### Responsabilidade Solidária
Todos os que concorrem para o ato ímprobo respondem solidariamente pelo
ressarcimento (Lei 8.429/92, art. 3º).

### Responsabilidade por Omissão
Autoridades que, podendo e devendo agir, omitiram-se, respondem se
comprovado dolo ou culpa grave (STJ).
`;
  }

  private gerarEstrategiaResponsabilizacao(agentes: Parte[]): string {
    return `
1. **Priorizar autoridades principais**: Foco em quem tinha poder decisório
2. **Demonstrar cadeia de comando**: Organograma + fluxo de decisões
3. **Provar conhecimento**: E-mails, atas, relatórios
4. **Comprovar competência legal**: Lei orgânica + regimentos
5. **Evitar inversão de responsabilização**: Não permitir que subordinados sejam os únicos punidos
`;
  }

  private gerarRodape(): string {
    return `
---

Nestes termos, pede deferimento.

[LOCAL], [DATA]

_____________________________
[NOME DO REPRESENTANTE]
[QUALIFICAÇÃO]
`;
  }
}
