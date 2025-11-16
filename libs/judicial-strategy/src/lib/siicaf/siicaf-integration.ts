/**
 * Módulo de Integração SIICAF
 * Sistema de Inteligência e Investigação de Condutas Antijurídicas e Fraudes
 *
 * © Dra. Idelvânia Menezes de Araújo - OAB/GO 64.265-A
 * Licenciado pelo INPI - Todos os direitos reservados
 */

import {
  JudicialGame,
  JudicialGameFactory,
  GameAnalysis,
  Player,
  Strategy,
  CaseType,
  PlayerType,
} from '../types';

/**
 * Dados de um processo no SIICAF
 */
export interface SIICAFProcesso {
  /** Número único do processo */
  numeroProcesso: string;

  /** Tipo de processo */
  tipo: 'civil' | 'criminal' | 'trabalhista' | 'administrativo';

  /** Partes envolvidas */
  partes: SIICAFParte[];

  /** Valor da causa */
  valorCausa?: number;

  /** Descrição do caso */
  descricao?: string;

  /** Status do processo */
  status: 'ativo' | 'arquivado' | 'suspenso' | 'em_recurso';

  /** Data de abertura */
  dataAbertura: Date;

  /** Evidências e documentos */
  evidencias?: SIICAFEvidencia[];

  /** Análises anteriores */
  analises?: SIICAFAnalise[];

  /** Metadados customizados */
  metadata?: Record<string, any>;
}

/**
 * Parte envolvida no processo
 */
export interface SIICAFParte {
  /** Nome da parte */
  nome: string;

  /** Tipo (autor, réu, testemunha, etc.) */
  tipo: PlayerType | string;

  /** CPF/CNPJ */
  documento?: string;

  /** OAB do advogado */
  advogado?: string;

  /** Recursos disponíveis */
  recursos?: number;
}

/**
 * Evidência do processo
 */
export interface SIICAFEvidencia {
  /** Tipo de evidência */
  tipo: 'documento' | 'testemunho' | 'pericia' | 'laudo' | 'outro';

  /** Descrição */
  descricao: string;

  /** Força/relevância (0-1) */
  forca: number;

  /** Data */
  data: Date;

  /** Arquivo associado */
  arquivo?: string;
}

/**
 * Análise estratégica salva
 */
export interface SIICAFAnalise {
  /** ID da análise */
  id: string;

  /** Data da análise */
  data: Date;

  /** Tipo de análise */
  tipoAnalise: 'acordo' | 'delacao' | 'recurso' | 'customizada';

  /** Resultado da análise */
  resultado: GameAnalysis;

  /** Parâmetros utilizados */
  parametros: Record<string, any>;

  /** Analista responsável */
  analista?: string;

  /** Observações */
  observacoes?: string;
}

/**
 * Classe principal de integração com SIICAF
 */
export class SIICAFIntegration {
  /**
   * Cria jogo a partir de processo SIICAF
   */
  static createGameFromProcesso(processo: SIICAFProcesso): JudicialGame {
    // Converte partes para jogadores
    const players: Player[] = processo.partes.map((parte) => ({
      name: parte.nome,
      type: this.mapPlayerType(parte.tipo),
      resources: parte.recursos,
    }));

    // Determina estratégias baseado no tipo de processo
    const strategies = this.determineStrategies(processo);

    // Calcula força das evidências
    const evidenceStrength = this.calculateEvidenceStrength(processo.evidencias);

    // Cria jogo
    return new JudicialGame({
      players,
      strategies,
      context: {
        caseType: this.mapCaseType(processo.tipo),
        claimValue: processo.valorCausa,
        evidence: evidenceStrength,
      },
    });
  }

  /**
   * Analisa processo e salva resultado
   */
  static async analyzeProcesso(
    processo: SIICAFProcesso,
    tipoAnalise: 'acordo' | 'delacao' | 'recurso' | 'customizada' = 'acordo',
    parametros?: Record<string, any>
  ): Promise<SIICAFAnalise> {
    let game: JudicialGame;

    // Cria jogo baseado no tipo de análise
    switch (tipoAnalise) {
      case 'acordo':
        game = JudicialGameFactory.createSettlementNegotiation(
          parametros?.valorCausa || processo.valorCausa || 100000,
          parametros?.evidencia || this.calculateEvidenceStrength(processo.evidencias),
          parametros?.custoLitigacao || 20000
        );
        break;

      case 'delacao':
        game = JudicialGameFactory.createPleaBargainDilemma(
          parametros?.penaMaxima || 10
        );
        break;

      case 'recurso':
        game = JudicialGameFactory.createAppealGame(
          parametros?.valorSentenca || processo.valorCausa || 100000,
          parametros?.custoRecurso || 20000,
          parametros?.probabilidadeReversao || 0.3
        );
        break;

      case 'customizada':
        game = this.createGameFromProcesso(processo);
        break;

      default:
        game = this.createGameFromProcesso(processo);
    }

    // Executa análise
    const resultado = game.analyze();

    // Cria registro de análise
    const analise: SIICAFAnalise = {
      id: this.generateAnaliseId(),
      data: new Date(),
      tipoAnalise,
      resultado,
      parametros: parametros || {},
      analista: parametros?.analista,
    };

    return analise;
  }

  /**
   * Gera relatório completo do processo
   */
  static generateRelatorio(
    processo: SIICAFProcesso,
    analise: SIICAFAnalise
  ): string {
    let relatorio = '';

    // Cabeçalho
    relatorio += '═'.repeat(80) + '\n';
    relatorio += '  SIICAF - RELATÓRIO DE ANÁLISE ESTRATÉGICA\n';
    relatorio += '  Sistema de Inteligência e Investigação de Condutas\n';
    relatorio += '  Antijurídicas e Fraudes\n';
    relatorio += '═'.repeat(80) + '\n\n';

    // Informações do Processo
    relatorio += '1. IDENTIFICAÇÃO DO PROCESSO\n';
    relatorio += '─'.repeat(80) + '\n';
    relatorio += `Número: ${processo.numeroProcesso}\n`;
    relatorio += `Tipo: ${processo.tipo.toUpperCase()}\n`;
    relatorio += `Status: ${processo.status}\n`;
    relatorio += `Data de Abertura: ${processo.dataAbertura.toLocaleDateString('pt-BR')}\n`;
    if (processo.valorCausa) {
      relatorio += `Valor da Causa: R$ ${processo.valorCausa.toLocaleString('pt-BR')}\n`;
    }
    relatorio += '\n';

    // Partes
    relatorio += '2. PARTES ENVOLVIDAS\n';
    relatorio += '─'.repeat(80) + '\n';
    processo.partes.forEach((parte, i) => {
      relatorio += `${i + 1}. ${parte.nome} (${parte.tipo})\n`;
      if (parte.advogado) {
        relatorio += `   Advogado: ${parte.advogado}\n`;
      }
    });
    relatorio += '\n';

    // Evidências
    if (processo.evidencias && processo.evidencias.length > 0) {
      relatorio += '3. EVIDÊNCIAS DISPONÍVEIS\n';
      relatorio += '─'.repeat(80) + '\n';
      processo.evidencias.forEach((ev, i) => {
        relatorio += `${i + 1}. ${ev.tipo.toUpperCase()} - Força: ${(ev.forca * 100).toFixed(0)}%\n`;
        relatorio += `   ${ev.descricao}\n`;
      });
      relatorio += '\n';
    }

    // Análise Estratégica
    relatorio += '4. ANÁLISE ESTRATÉGICA (TEORIA DE NASH)\n';
    relatorio += '─'.repeat(80) + '\n';
    relatorio += `Tipo de Análise: ${analise.tipoAnalise.toUpperCase()}\n`;
    relatorio += `Data da Análise: ${analise.data.toLocaleString('pt-BR')}\n`;
    if (analise.analista) {
      relatorio += `Analista: ${analise.analista}\n`;
    }
    relatorio += '\n';

    // Equilíbrios
    relatorio += '4.1. EQUILÍBRIOS DE NASH IDENTIFICADOS\n';
    if (analise.resultado.equilibria.length === 0) {
      relatorio += 'Nenhum equilíbrio de Nash encontrado.\n';
    } else {
      analise.resultado.equilibria.forEach((eq, i) => {
        relatorio += `\nEquilíbrio ${i + 1} (${eq.type === 'pure' ? 'PURO' : 'MISTO'}):\n`;
        relatorio += `  Payoffs Esperados: ${eq.expectedPayoffs.map(p => p.toFixed(2)).join(', ')}\n`;
        relatorio += `  Estabilidade: ${((eq.stability || 0) * 100).toFixed(1)}%\n`;
      });
    }
    relatorio += '\n';

    // Recomendações
    relatorio += '5. RECOMENDAÇÕES ESTRATÉGICAS\n';
    relatorio += '─'.repeat(80) + '\n';
    if (analise.resultado.recommendations) {
      analise.resultado.recommendations.forEach((rec, i) => {
        relatorio += `${i + 1}. ${rec}\n`;
      });
    }
    relatorio += '\n';

    // Observações
    if (analise.observacoes) {
      relatorio += '6. OBSERVAÇÕES\n';
      relatorio += '─'.repeat(80) + '\n';
      relatorio += analise.observacoes + '\n\n';
    }

    // Rodapé
    relatorio += '═'.repeat(80) + '\n';
    relatorio += '© Dra. Idelvânia Menezes de Araújo - OAB/GO 64.265-A\n';
    relatorio += 'Licenciado pelo INPI - Propriedade Intelectual Protegida\n';
    relatorio += 'Gerado em: ' + new Date().toLocaleString('pt-BR') + '\n';
    relatorio += '═'.repeat(80) + '\n';

    return relatorio;
  }

  /**
   * Calcula força total das evidências
   */
  private static calculateEvidenceStrength(
    evidencias?: SIICAFEvidencia[]
  ): number {
    if (!evidencias || evidencias.length === 0) {
      return 0.5; // Neutro
    }

    // Média ponderada
    const totalForca = evidencias.reduce((sum, ev) => sum + ev.forca, 0);
    return Math.min(1.0, totalForca / evidencias.length);
  }

  /**
   * Mapeia tipo de jogador
   */
  private static mapPlayerType(tipo: string): PlayerType {
    const mapping: Record<string, PlayerType> = {
      autor: PlayerType.PLAINTIFF,
      reu: PlayerType.DEFENDANT,
      requerente: PlayerType.PLAINTIFF,
      requerido: PlayerType.DEFENDANT,
      promotor: PlayerType.PROSECUTOR,
      acusacao: PlayerType.PROSECUTOR,
      juiz: PlayerType.JUDGE,
      mediador: PlayerType.MEDIATOR,
    };

    return mapping[tipo.toLowerCase()] || PlayerType.PLAINTIFF;
  }

  /**
   * Mapeia tipo de caso
   */
  private static mapCaseType(tipo: string): CaseType {
    const mapping: Record<string, CaseType> = {
      civil: CaseType.CIVIL,
      criminal: CaseType.CRIMINAL,
      trabalhista: CaseType.LABOR,
      administrativo: CaseType.ADMINISTRATIVE,
    };

    return mapping[tipo.toLowerCase()] || CaseType.CIVIL;
  }

  /**
   * Determina estratégias baseado no tipo de processo
   */
  private static determineStrategies(
    processo: SIICAFProcesso
  ): Strategy[][] {
    // Estratégias padrão para cada tipo de parte
    const estrategiasAutor: Strategy[] = [
      {
        name: 'Aceitar Acordo',
        description: 'Aceitar proposta de acordo',
        cost: 5000,
        successProbability: 1.0,
      },
      {
        name: 'Litigar',
        description: 'Prosseguir com litígio completo',
        cost: 20000,
        successProbability: 0.7,
      },
    ];

    const estrategiasReu: Strategy[] = [
      {
        name: 'Oferecer Acordo',
        description: 'Propor acordo extrajudicial',
        cost: 5000,
        successProbability: 0.7,
      },
      {
        name: 'Resistir',
        description: 'Contestar e resistir ao processo',
        cost: 20000,
        successProbability: 0.3,
      },
    ];

    // Retorna estratégias para cada parte
    return processo.partes.map((parte) => {
      if (parte.tipo === 'autor' || parte.tipo === 'requerente') {
        return estrategiasAutor;
      } else {
        return estrategiasReu;
      }
    });
  }

  /**
   * Gera ID único para análise
   */
  private static generateAnaliseId(): string {
    return `SIICAF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
