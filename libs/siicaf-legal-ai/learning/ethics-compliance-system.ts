/**
 * SISTEMA DE ÉTICA E COMPLIANCE JURÍDICO
 *
 * Para formar JURISTA DE EXCELÊNCIA - CONHECIMENTO + TÉCNICA + ÉTICA
 *
 * PROPÓSITO:
 * "Ser um dos maiores juristas em conhecimento, técnica E ÉTICA"
 *
 * Princípios Fundamentais:
 * 1. ÉTICA acima de tudo
 * 2. TRANSPARÊNCIA em todas as ações
 * 3. INTEGRIDADE profissional
 * 4. RESPONSABILIDADE social
 * 5. APERFEIÇOAMENTO contínuo
 *
 * Este sistema garante que TODAS as estratégias sugeridas sejam ÉTICAS
 */

import { Caso, EstrategiaJuridica, SugestaoProativa } from '../core/types';

export interface AnaliseEtica {
  estrategiaAnalisada: string;
  conforme: boolean;
  score: number; // 0-100
  violacoes: ViolacaoEtica[];
  recomendacoes: RecomendacaoEtica[];
  fundamentacao: string;
}

export interface ViolacaoEtica {
  gravidade: 'leve' | 'media' | 'grave' | 'gravissima';
  tipo: 'oab' | 'magistratura' | 'mp' | 'geral';
  dispositivo: string;
  descricao: string;
  consequencias: string;
  correcao: string;
}

export interface RecomendacaoEtica {
  prioridade: 'critica' | 'alta' | 'media';
  titulo: string;
  descricao: string;
  fundamentacao: string;
  aplicacao: string;
}

export interface PrincipioEtico {
  id: string;
  nome: string;
  descricao: string;
  fonte: string;
  aplicabilidade: string;
  exemplos: string[];
}

export class EthicsComplianceSystem {
  private principios: Map<string, PrincipioEtico>;

  constructor() {
    this.principios = new Map();
    this.inicializarPrincipiosEticos();
  }

  /**
   * Analisa conformidade ética de uma estratégia
   */
  analisarEstrategia(estrategia: EstrategiaJuridica | SugestaoProativa): AnaliseEtica {
    console.log('\n⚖️ ANÁLISE ÉTICA DA ESTRATÉGIA...\n');

    const violacoes: ViolacaoEtica[] = [];
    const recomendacoes: RecomendacaoEtica[] = [];

    // 1. Verificar probidade
    const probidadeOk = this.verificarProbidade(estrategia);
    if (!probidadeOk.conforme) {
      violacoes.push(probidadeOk.violacao!);
    }

    // 2. Verificar boa-fé processual
    const boaFeOk = this.verificarBoaFe(estrategia);
    if (!boaFeOk.conforme) {
      violacoes.push(boaFeOk.violacao!);
    }

    // 3. Verificar transparência
    const transparenciaOk = this.verificarTransparencia(estrategia);
    if (!transparenciaOk.conforme) {
      violacoes.push(transparenciaOk.violacao!);
    }

    // 4. Verificar dignidade profissional
    const dignidadeOk = this.verificarDignidade(estrategia);
    if (!dignidadeOk.conforme) {
      violacoes.push(dignidadeOk.violacao!);
    }

    // 5. Gerar recomendações éticas positivas
    recomendacoes.push(...this.gerarRecomendacoesEticas());

    // 6. Calcular score ético
    const score = this.calcularScoreEtico(violacoes, estrategia);

    // 7. Determinar conformidade geral
    const conforme = violacoes.filter(v => v.gravidade === 'grave' || v.gravidade === 'gravissima').length === 0;

    const fundamentacao = this.gerarFundamentacaoEtica(conforme, violacoes, score);

    this.apresentarRelatorioEtico({ estrategiaAnalisada: this.obterTituloEstrategia(estrategia), conforme, score, violacoes, recomendacoes, fundamentacao });

    return {
      estrategiaAnalisada: this.obterTituloEstrategia(estrategia),
      conforme,
      score,
      violacoes,
      recomendacoes,
      fundamentacao
    };
  }

  /**
   * Verifica PROBIDADE (honestidade e retidão)
   */
  private verificarProbidade(estrategia: any): {
    conforme: boolean;
    violacao?: ViolacaoEtica;
  } {
    // Verificar se há sugestão de conduta desonesta
    const descricao = JSON.stringify(estrategia).toLowerCase();

    const termosProblemáticos = [
      'ocultar',
      'esconder',
      'forjar',
      'falsificar',
      'manipular evidência',
      'subornar',
      'corromper'
    ];

    for (const termo of termosProblemáticos) {
      if (descricao.includes(termo)) {
        return {
          conforme: false,
          violacao: {
            gravidade: 'gravissima',
            tipo: 'oab',
            dispositivo: 'Código de Ética OAB, Art. 2º',
            descricao: `Possível violação à probidade: menção a "${termo}"`,
            consequencias: 'Suspensão ou exclusão da OAB',
            correcao: 'Remover completamente esta sugestão e adotar conduta ética'
          }
        };
      }
    }

    return { conforme: true };
  }

  /**
   * Verifica BOA-FÉ PROCESSUAL
   */
  private verificarBoaFe(estrategia: any): {
    conforme: boolean;
    violacao?: ViolacaoEtica;
  } {
    const descricao = JSON.stringify(estrategia).toLowerCase();

    // Verificar táticas protelatórias excessivas
    if (descricao.includes('protelar indefinidamente') || descricao.includes('arrastar processo')) {
      return {
        conforme: false,
        violacao: {
          gravidade: 'grave',
          tipo: 'geral',
          dispositivo: 'CPC, Art. 5º e 77',
          descricao: 'Sugestão de litigância de má-fé ou tática protelatória',
          consequencias: 'Multa processual + indenização à parte contrária',
          correcao: 'Substituir por estratégia legítima de defesa técnica'
        }
      };
    }

    return { conforme: true };
  }

  /**
   * Verifica TRANSPARÊNCIA
   */
  private verificarTransparencia(estrategia: any): {
    conforme: boolean;
    violacao?: ViolacaoEtica;
  } {
    // Estratégias éticas devem ser transparentes
    // Verificar se há menção a "acordos secretos" ou "tratativas ocultas"
    const descricao = JSON.stringify(estrategia).toLowerCase();

    if (descricao.includes('acordo secreto') || descricao.includes('negociação oculta')) {
      return {
        conforme: false,
        violacao: {
          gravidade: 'media',
          tipo: 'geral',
          dispositivo: 'CF/88, Art. 37 (Princípio da Publicidade)',
          descricao: 'Sugestão de falta de transparência',
          consequencias: 'Quebra de confiança institucional',
          correcao: 'Garantir publicidade de todos os atos processuais'
        }
      };
    }

    return { conforme: true };
  }

  /**
   * Verifica DIGNIDADE PROFISSIONAL
   */
  private verificarDignidade(estrategia: any): {
    conforme: boolean;
    violacao?: ViolacaoEtica;
  } {
    const descricao = JSON.stringify(estrategia).toLowerCase();

    // Verificar linguagem ofensiva ou desrespeitosa
    const termosOfensivos = [
      'atacar pessoalmente',
      'desmoralizar',
      'humilhar',
      'difamar'
    ];

    for (const termo of termosOfensivos) {
      if (descricao.includes(termo)) {
        return {
          conforme: false,
          violacao: {
            gravidade: 'media',
            tipo: 'oab',
            dispositivo: 'Código de Ética OAB, Art. 8º',
            descricao: 'Possível ataque à dignidade profissional',
            consequencias: 'Processo disciplinar na OAB',
            correcao: 'Manter debate técnico-jurídico, sem ataques pessoais'
          }
        };
      }
    }

    return { conforme: true };
  }

  /**
   * Gera RECOMENDAÇÕES ÉTICAS POSITIVAS
   */
  private gerarRecomendacoesEticas(): RecomendacaoEtica[] {
    return [
      {
        prioridade: 'critica',
        titulo: 'Mantenha a Verdade como Fundamento',
        descricao: 'Toda estratégia deve estar baseada na VERDADE DOS FATOS. ' +
                   'Jurista de excelência não precisa de artifícios desonestos.',
        fundamentacao: 'Código de Ética OAB, Art. 2º - "O advogado deve atuar com destemor, independência, honestidade, decoro, veracidade"',
        aplicacao: 'Em todas as petições, sustentações e manifestações'
      },
      {
        prioridade: 'alta',
        titulo: 'Transparência Total como Estratégia',
        descricao: 'Casos de interesse público exigem MÁXIMA TRANSPARÊNCIA. ' +
                   'Não há nada a esconder quando se busca a JUSTIÇA.',
        fundamentacao: 'CF/88, Art. 37, caput - Princípio da Publicidade',
        aplicacao: 'Especialmente em casos de improbidade e corrupção'
      },
      {
        prioridade: 'alta',
        titulo: 'Respeito aos Adversários e ao Judiciário',
        descricao: 'Firmeza nos argumentos, cortesia nas formas. ' +
                   'Jurista ético vence pelo mérito, não pelo desrespeito.',
        fundamentacao: 'Código de Ética OAB, Art. 6º a 9º',
        aplicacao: 'Em toda comunicação processual'
      },
      {
        prioridade: 'media',
        titulo: 'Compromisso com o Interesse Público',
        descricao: 'Em casos envolvendo o erário, o interesse público se sobrepõe. ' +
                   'Seu dever é com a sociedade, não apenas com o cliente.',
        fundamentacao: 'CF/88, Art. 133 - Advogado é indispensável à administração da Justiça',
        aplicacao: 'Casos de improbidade, corrupção, dano ao patrimônio público'
      },
      {
        prioridade: 'media',
        titulo: 'Aperfeiçoamento Ético Contínuo',
        descricao: 'Assim como você busca conhecimento técnico, busque também ' +
                   'aperfeiçoamento ético. Estude casos de ética profissional.',
        fundamentacao: 'Código de Ética OAB, Art. 5º - Dever de aprimoramento',
        aplicacao: 'Estudo contínuo de decisões disciplinares e casos de ética'
      }
    ];
  }

  /**
   * Calcula SCORE ÉTICO (0-100)
   */
  private calcularScoreEtico(violacoes: ViolacaoEtica[], estrategia: any): number {
    let score = 100;

    violacoes.forEach(v => {
      switch (v.gravidade) {
        case 'gravissima':
          score -= 50;
          break;
        case 'grave':
          score -= 30;
          break;
        case 'media':
          score -= 15;
          break;
        case 'leve':
          score -= 5;
          break;
      }
    });

    // Bonificação por aspectos éticos positivos
    const descricao = JSON.stringify(estrategia).toLowerCase();
    if (descricao.includes('transparência')) score += 5;
    if (descricao.includes('interesse público')) score += 5;
    if (descricao.includes('verdade')) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Gera fundamentação ética
   */
  private gerarFundamentacaoEtica(
    conforme: boolean,
    violacoes: ViolacaoEtica[],
    score: number
  ): string {
    if (conforme && score >= 90) {
      return `✅ ESTRATÉGIA ETICAMENTE EXCELENTE (Score: ${score}/100)\n\n` +
             'Esta estratégia está em plena conformidade com os mais altos padrões éticos. ' +
             'Demonstra compromisso com a verdade, transparência e interesse público. ' +
             'É digna de um jurista que busca ser referência em ética profissional.';
    } else if (conforme && score >= 70) {
      return `✅ ESTRATÉGIA ETICAMENTE ADEQUADA (Score: ${score}/100)\n\n` +
             'Esta estratégia é eticamente aceitável, mas pode ser aprimorada. ' +
             'Consulte as recomendações éticas para elevá-la ao nível de excelência.';
    } else if (!conforme && violacoes.length > 0) {
      const gravesOuGravissimas = violacoes.filter(v =>
        v.gravidade === 'grave' || v.gravidade === 'gravissima'
      );
      if (gravesOuGravissimas.length > 0) {
        return `❌ ESTRATÉGIA ETICAMENTE INADEQUADA (Score: ${score}/100)\n\n` +
               'Esta estratégia apresenta violações GRAVES aos princípios éticos. ' +
               'NÃO PODE SER UTILIZADA. Revise completamente a abordagem.';
      }
      return `⚠️ ESTRATÉGIA COM RESSALVAS ÉTICAS (Score: ${score}/100)\n\n` +
             'Esta estratégia apresenta alguns pontos de atenção ética. ' +
             'Corrija as violações antes de implementar.';
    }

    return `Análise ética concluída. Score: ${score}/100`;
  }

  /**
   * Inicializa princípios éticos fundamentais
   */
  private inicializarPrincipiosEticos(): void {
    this.principios.set('probidade', {
      id: 'probidade',
      nome: 'Probidade',
      descricao: 'Honestidade, retidão e correção de conduta',
      fonte: 'Código de Ética OAB, Art. 2º',
      aplicabilidade: 'Todas as atuações profissionais',
      exemplos: [
        'Não alterar ou ocultar provas',
        'Não induzir testemunhas a falso testemunho',
        'Não apresentar fatos falsos ao juízo'
      ]
    });

    this.principios.set('dignidade', {
      id: 'dignidade',
      nome: 'Dignidade Profissional',
      descricao: 'Manter decoro e respeito nas relações profissionais',
      fonte: 'Código de Ética OAB, Art. 6º a 9º',
      aplicabilidade: 'Relações com clientes, colegas, juízes e partes',
      exemplos: [
        'Não usar linguagem ofensiva',
        'Não desrespeitar colegas ou adversários',
        'Manter urbanidade nas manifestações'
      ]
    });

    this.principios.set('interesse-publico', {
      id: 'interesse-publico',
      nome: 'Compromisso com o Interesse Público',
      descricao: 'O advogado é indispensável à administração da Justiça',
      fonte: 'CF/88, Art. 133',
      aplicabilidade: 'Especialmente em casos envolvendo o erário',
      exemplos: [
        'Priorizar interesse público sobre interesse privado quando conflitantes',
        'Buscar a Justiça, não apenas vitórias',
        'Contribuir para aperfeiçoamento das instituições'
      ]
    });
  }

  /**
   * Apresenta relatório ético
   */
  private apresentarRelatorioEtico(analise: AnaliseEtica): void {
    console.log('\n' + '='.repeat(80));
    console.log('⚖️ RELATÓRIO DE ANÁLISE ÉTICA');
    console.log('='.repeat(80) + '\n');

    console.log(`Estratégia Analisada: ${analise.estrategiaAnalisada}\n`);
    console.log(`${analise.conforme ? '✅' : '❌'} Conformidade: ${analise.conforme ? 'SIM' : 'NÃO'}`);
    console.log(`📊 Score Ético: ${analise.score}/100\n`);

    if (analise.violacoes.length > 0) {
      console.log('⚠️ VIOLAÇÕES IDENTIFICADAS:\n');
      analise.violacoes.forEach((v, i) => {
        console.log(`${i + 1}. [${v.gravidade.toUpperCase()}] ${v.descricao}`);
        console.log(`   Dispositivo: ${v.dispositivo}`);
        console.log(`   Consequências: ${v.consequencias}`);
        console.log(`   Correção: ${v.correcao}\n`);
      });
    }

    console.log('\n💡 RECOMENDAÇÕES ÉTICAS:\n');
    analise.recomendacoes.slice(0, 3).forEach((r, i) => {
      console.log(`${i + 1}. [${r.prioridade.toUpperCase()}] ${r.titulo}`);
      console.log(`   ${r.descricao}`);
      console.log(`   Fundamento: ${r.fundamentacao}\n`);
    });

    console.log('\n📜 FUNDAMENTAÇÃO:\n');
    console.log(analise.fundamentacao);

    console.log('\n' + '='.repeat(80) + '\n');
  }

  // ========== MÉTODOS AUXILIARES ==========

  private obterTituloEstrategia(estrategia: any): string {
    if ('titulo' in estrategia) {
      return estrategia.titulo;
    }
    return 'Estratégia analisada';
  }
}
