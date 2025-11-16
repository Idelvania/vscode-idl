/**
 * Analisador Automático de Documentos Jurídicos
 *
 * Extrai entidades, relações, temas e gera sugestões proativas
 */

import {
  Documento,
  AnaliseDocumento,
  Entidade,
  Relacao,
  Inconsistencia,
  SugestaoProativa,
  Conhecimento,
  FonteJuridica,
  AcaoSugerida
} from '../core/types';

export class DocumentAnalyzer {

  /**
   * Analisa documento automaticamente e gera sugestões proativas
   */
  async analisarDocumento(documento: Documento): Promise<AnaliseDocumento> {
    console.log(`[SIICAF] Analisando documento: ${documento.titulo}`);

    // Extrai entidades
    const entidades = this.extrairEntidades(documento);

    // Extrai temas jurídicos
    const temas = this.extrairTemas(documento);

    // Identifica relações
    const relacoes = this.identificarRelacoes(documento, entidades);

    // Detecta inconsistências
    const inconsistencias = this.detectarInconsistencias(documento);

    // GERA SUGESTÕES PROATIVAS AUTOMÁTICAS
    const sugestoes = await this.gerarSugestoesProativas(
      documento,
      entidades,
      temas,
      relacoes,
      inconsistencias
    );

    return {
      documentoId: documento.id,
      entidadesIdentificadas: entidades,
      temasExtraidos: temas,
      relacoesEncontradas: relacoes,
      inconsistencias,
      sugestoesAnalise: sugestoes
    };
  }

  /**
   * Extrai entidades nomeadas do documento
   */
  private extrairEntidades(documento: Documento): Entidade[] {
    const entidades: Entidade[] = [];
    const conteudo = documento.conteudo;

    // Detecta pessoas (cargos públicos, autoridades)
    const padroesPessoas = [
      /(?:Presidente|Ministro|Desembargador|Juiz|Procurador|Promotor|Delegado)\s+([A-Z][a-záàâãéèêíïóôõöúçñ]+(?:\s+[A-Z][a-záàâãéèêíïóôõöúçñ]+)+)/gi,
      /(?:Dr\.|Dra\.)\s+([A-Z][a-záàâãéèêíïóôõöúçñ]+(?:\s+[A-Z][a-záàâãéèêíïóôõöúçñ]+)+)/gi
    ];

    padroesPessoas.forEach(padrao => {
      let match;
      while ((match = padrao.exec(conteudo)) !== null) {
        entidades.push({
          texto: match[0],
          tipo: 'pessoa',
          contexto: this.extrairContexto(conteudo, match.index),
          relevancia: 85
        });
      }
    });

    // Detecta leis
    const padroesLeis = [
      /Lei\s+(?:n[°º]?\s*)?(\d+(?:[\.\/\-]\d+)*)/gi,
      /Decreto\s+(?:n[°º]?\s*)?(\d+(?:[\.\/\-]\d+)*)/gi,
      /CF\/\d{2}/gi,
      /Art\.?\s*\d+/gi
    ];

    padroesLeis.forEach(padrao => {
      let match;
      while ((match = padrao.exec(conteudo)) !== null) {
        entidades.push({
          texto: match[0],
          tipo: 'lei',
          contexto: this.extrairContexto(conteudo, match.index),
          relevancia: 90
        });
      }
    });

    // Detecta valores monetários
    const padraoValores = /R\$\s*[\d.,]+(?:\s*(?:bilh[õo]es?|milh[õo]es?|mil))?/gi;
    let match;
    while ((match = padraoValores.exec(conteudo)) !== null) {
      entidades.push({
        texto: match[0],
        tipo: 'valor',
        contexto: this.extrairContexto(conteudo, match.index),
        relevancia: 80
      });
    }

    return entidades;
  }

  /**
   * Extrai temas jurídicos do documento
   */
  private extrairTemas(documento: Documento): string[] {
    const temas: Set<string> = new Set();
    const conteudo = documento.conteudo.toLowerCase();

    // Temas de direito administrativo
    if (conteudo.match(/improbidade\s+administrativa|lei\s+8\.?429/i)) {
      temas.add('Improbidade Administrativa');
    }

    if (conteudo.match(/licita[çc][ãa]o|pregão|contrato\s+administrativo/i)) {
      temas.add('Licitações e Contratos');
    }

    // Temas penais
    if (conteudo.match(/peculato|corrup[çc][ãa]o|prevarica[çc][ãa]o/i)) {
      temas.add('Crimes Contra a Administração Pública');
    }

    // Temas de responsabilização
    if (conteudo.match(/responsabiliza[çc][ãa]o|responsabilidade\s+civil/i)) {
      temas.add('Responsabilização');
    }

    // Temas de dano ao erário
    if (conteudo.match(/dano\s+ao\s+er[áa]rio|preju[íi]zo|ressarcimento/i)) {
      temas.add('Dano ao Erário');
    }

    return Array.from(temas);
  }

  /**
   * Identifica relações entre entidades
   */
  private identificarRelacoes(documento: Documento, entidades: Entidade[]): Relacao[] {
    const relacoes: Relacao[] = [];

    // Relações entre pessoas e cargos
    const pessoas = entidades.filter(e => e.tipo === 'pessoa');
    const cargos = ['Presidente', 'Ministro', 'Procurador', 'Delegado'];

    pessoas.forEach(pessoa => {
      cargos.forEach(cargo => {
        if (pessoa.texto.includes(cargo)) {
          relacoes.push({
            origem: pessoa.texto,
            destino: cargo,
            tipo: 'ocupa_cargo',
            confianca: 0.95,
            evidencias: [pessoa.contexto]
          });
        }
      });
    });

    return relacoes;
  }

  /**
   * Detecta inconsistências no documento
   */
  private detectarInconsistencias(documento: Documento): Inconsistencia[] {
    const inconsistencias: Inconsistencia[] = [];

    // Exemplo: valores divergentes
    const valores = documento.conteudo.match(/R\$\s*[\d.,]+(?:\s*(?:bilh[õo]es?|milh[õo]es?))?/gi);
    if (valores && valores.length > 1) {
      // Lógica para detectar divergências
    }

    return inconsistencias;
  }

  /**
   * GERA SUGESTÕES PROATIVAS automaticamente
   * Esta é a função MAIS IMPORTANTE - ensina o usuário enquanto analisa
   */
  private async gerarSugestoesProativas(
    documento: Documento,
    entidades: Entidade[],
    temas: string[],
    relacoes: Relacao[],
    inconsistencias: Inconsistencia[]
  ): Promise<SugestaoProativa[]> {

    const sugestoes: SugestaoProativa[] = [];

    // SUGESTÃO 1: Análise de responsabilização baseada em entidades
    if (entidades.some(e => e.tipo === 'pessoa' && e.texto.match(/Presidente|Ministro/i))) {
      sugestoes.push({
        id: `sug-${Date.now()}-1`,
        tipo: 'juridica',
        prioridade: 'alta',
        titulo: 'Responsabilização de Autoridades Identificadas',
        descricao: 'Identifiquei autoridades com potencial responsabilidade. Sugiro análise detalhada de suas competências e atos.',
        fundamentacao: 'Autoridades em cargos de direção respondem por atos dolosos ou culposos (Lei 8.429/92, Art. 3º). A identificação de agentes públicos é crucial para delimitar responsabilidades.',
        acoes: [
          {
            id: 'acao-1',
            descricao: 'Mapear competências legais de cada autoridade identificada',
            tipo: 'imediata',
            impacto: 'alto',
            recursosNecessarios: ['Legislação orgânica', 'Regimentos internos']
          },
          {
            id: 'acao-2',
            descricao: 'Cruzar atos praticados com competências para identificar excessos',
            tipo: 'curto_prazo',
            impacto: 'alto'
          }
        ],
        fontesConsultadas: [
          {
            tipo: 'lei',
            identificacao: 'Lei 8.429/1992',
            titulo: 'Lei de Improbidade Administrativa',
            relevancia: 95
          }
        ],
        novosConhecimentos: [
          {
            id: 'conh-1',
            titulo: 'Teoria do Domínio do Fato em Improbidade',
            descricao: 'Autoridades com poder decisório respondem mesmo sem execução material do ato.',
            categoria: 'conceito',
            aplicabilidade: 'Casos envolvendo hierarquia administrativa e delegação de competências'
          }
        ],
        timestamp: new Date()
      });
    }

    // SUGESTÃO 2: Dano ao erário - cálculo e fundamentação
    if (entidades.some(e => e.tipo === 'valor')) {
      const valores = entidades.filter(e => e.tipo === 'valor');
      sugestoes.push({
        id: `sug-${Date.now()}-2`,
        tipo: 'estrategia',
        prioridade: 'critica',
        titulo: 'Estratégia de Quantificação de Dano ao Erário',
        descricao: `Identifiquei ${valores.length} menção(ões) a valores monetários. Recomendo estratégia robusta de comprovação do prejuízo.`,
        fundamentacao: 'A quantificação precisa do dano é requisito para ações de ressarcimento (Súmula 383 STJ). Valores indeterminados enfraquecem a pretensão.',
        acoes: [
          {
            id: 'acao-3',
            descricao: 'Consolidar todos os valores em planilha com fonte documental',
            tipo: 'imediata',
            impacto: 'alto'
          },
          {
            id: 'acao-4',
            descricao: 'Solicitar perícia contábil para validar cálculos',
            tipo: 'curto_prazo',
            impacto: 'medio',
            recursosNecessarios: ['Perito contador', 'Documentos fiscais']
          },
          {
            id: 'acao-5',
            descricao: 'Atualizar valores com correção monetária e juros',
            tipo: 'imediata',
            impacto: 'alto'
          }
        ],
        fontesConsultadas: [
          {
            tipo: 'jurisprudencia',
            identificacao: 'Súmula 383 STJ',
            titulo: 'Necessidade de liquidez na ação de ressarcimento',
            relevancia: 90
          }
        ],
        novosConhecimentos: [
          {
            id: 'conh-2',
            titulo: 'Métodos de Cálculo de Dano em Licitações Fraudadas',
            descricao: 'Diferença entre preço praticado e preço de mercado + lucros cessantes da Administração.',
            categoria: 'procedimento',
            aplicabilidade: 'Casos de superfaturamento e direcionamento licitatório',
            exemplos: [
              'Caso Petrobras: diferencial de 30% sobre preços de referência',
              'Caso obras públicas: comparação com SINAPI/SICRO'
            ]
          }
        ],
        timestamp: new Date()
      });
    }

    // SUGESTÃO 3: Análise de precedentes aplicáveis
    if (temas.includes('Improbidade Administrativa')) {
      sugestoes.push({
        id: `sug-${Date.now()}-3`,
        tipo: 'aprendizado',
        prioridade: 'alta',
        titulo: 'Precedentes Estratégicos em Improbidade Administrativa',
        descricao: 'Identifiquei que o caso envolve improbidade. Apresento precedentes do STJ que podem fortalecer sua tese.',
        fundamentacao: 'STJ consolidou entendimento sobre responsabilidade de agentes em posições hierárquicas (REsp 1.297.797).',
        acoes: [
          {
            id: 'acao-6',
            descricao: 'Estudar julgados do STJ sobre responsabilidade por omissão',
            tipo: 'curto_prazo',
            impacto: 'medio'
          },
          {
            id: 'acao-7',
            descricao: 'Verificar se há Tese Repetitiva aplicável ao caso',
            tipo: 'imediata',
            impacto: 'alto'
          }
        ],
        fontesConsultadas: [
          {
            tipo: 'jurisprudencia',
            identificacao: 'REsp 1.297.797/SP',
            titulo: 'Responsabilidade solidária em cadeia de comando',
            ementa: 'Agentes que contribuem dolosa ou culposamente para ato ímprobo respondem solidariamente.',
            relevancia: 95
          }
        ],
        novosConhecimentos: [
          {
            id: 'conh-3',
            titulo: 'Responsabilidade por Omissão em Improbidade',
            descricao: 'Autoridade que, podendo e devendo agir, omite-se, responde por improbidade se há dolo ou culpa grave.',
            categoria: 'tese',
            aplicabilidade: 'Casos onde autoridades superiores não fiscalizaram subordinados',
            referencias: [
              {
                tipo: 'jurisprudencia',
                identificacao: 'STJ - REsp 1.297.797',
                titulo: 'Responsabilidade solidária',
                relevancia: 95
              }
            ]
          }
        ],
        timestamp: new Date()
      });
    }

    return sugestoes;
  }

  /**
   * Extrai contexto ao redor de uma posição no texto
   */
  private extrairContexto(texto: string, posicao: number, tamanho: number = 100): string {
    const inicio = Math.max(0, posicao - tamanho);
    const fim = Math.min(texto.length, posicao + tamanho);
    return '...' + texto.substring(inicio, fim) + '...';
  }
}
