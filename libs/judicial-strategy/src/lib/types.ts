/**
 * Tipos e interfaces para Teoria de Nash aplicada a estratégias judiciais
 */

/**
 * Representa um jogador no jogo judicial
 */
export interface Player {
  /** Nome do jogador (ex: "Autor", "Réu", "Ministério Público") */
  name: string;
  /** Tipo de jogador */
  type: PlayerType;
  /** Recursos disponíveis (financeiros, tempo, etc.) */
  resources?: number;
}

/**
 * Tipos de jogadores no sistema judicial
 */
export enum PlayerType {
  PLAINTIFF = 'plaintiff',      // Autor/Requerente
  DEFENDANT = 'defendant',      // Réu/Requerido
  PROSECUTOR = 'prosecutor',    // Promotor/Acusação
  JUDGE = 'judge',              // Juiz/Árbitro
  MEDIATOR = 'mediator',        // Mediador
}

/**
 * Representa uma estratégia judicial disponível para um jogador
 */
export interface Strategy {
  /** Nome da estratégia */
  name: string;
  /** Descrição da estratégia */
  description: string;
  /** Custo de implementar a estratégia */
  cost: number;
  /** Probabilidade estimada de sucesso (0-1) */
  successProbability?: number;
  /** Tempo estimado (em dias) */
  duration?: number;
}

/**
 * Estratégias judiciais comuns
 */
export enum JudicialStrategy {
  SETTLEMENT = 'settlement',              // Acordo/Conciliação
  LITIGATION = 'litigation',              // Litigância total
  MEDIATION = 'mediation',                // Mediação
  ARBITRATION = 'arbitration',            // Arbitragem
  APPEAL = 'appeal',                      // Recurso/Apelação
  MOTION_TO_DISMISS = 'motion_to_dismiss', // Moção de arquivamento
  SUMMARY_JUDGMENT = 'summary_judgment',   // Julgamento sumário
  PLEA_BARGAIN = 'plea_bargain',          // Delação/Acordo de colaboração
  DISCOVERY = 'discovery',                // Fase de descoberta de provas
  COUNTERCLAIM = 'counterclaim',          // Reconvenção
}

/**
 * Resultado de um jogo (payoff)
 */
export interface Payoff {
  /** Payoff para cada jogador */
  values: number[];
  /** Descrição do resultado */
  description?: string;
}

/**
 * Matriz de payoffs para um jogo normal-form
 */
export interface PayoffMatrix {
  /** Nomes dos jogadores */
  players: string[];
  /** Estratégias disponíveis para cada jogador */
  strategies: Strategy[][];
  /** Matriz de payoffs [estratégia_jogador1][estratégia_jogador2]...[estratégia_jogadorN] */
  matrix: number[][][];
}

/**
 * Representa um perfil de estratégias (uma estratégia para cada jogador)
 */
export interface StrategyProfile {
  /** Índices das estratégias escolhidas por cada jogador */
  strategies: number[];
  /** Payoffs resultantes */
  payoffs: number[];
  /** Se este perfil é um equilíbrio de Nash */
  isNashEquilibrium?: boolean;
}

/**
 * Estratégia mista (distribuição de probabilidade sobre estratégias puras)
 */
export interface MixedStrategy {
  /** Jogador */
  player: number;
  /** Probabilidades para cada estratégia pura */
  probabilities: number[];
}

/**
 * Equilíbrio de Nash encontrado
 */
export interface NashEquilibrium {
  /** Tipo de equilíbrio */
  type: 'pure' | 'mixed';
  /** Perfil de estratégias (para equilíbrio puro) */
  profile?: StrategyProfile;
  /** Estratégias mistas (para equilíbrio misto) */
  mixedStrategies?: MixedStrategy[];
  /** Payoffs esperados */
  expectedPayoffs: number[];
  /** Estabilidade do equilíbrio (0-1) */
  stability?: number;
}

/**
 * Configuração de um jogo judicial
 */
export interface JudicialGameConfig {
  /** Jogadores no jogo */
  players: Player[];
  /** Estratégias disponíveis para cada jogador */
  strategies: Strategy[][];
  /** Função de utilidade customizada (opcional) */
  utilityFunction?: (profile: number[], context: GameContext) => number[];
  /** Contexto do jogo */
  context?: GameContext;
}

/**
 * Contexto do jogo judicial
 */
export interface GameContext {
  /** Tipo de caso */
  caseType: CaseType;
  /** Valor da causa */
  claimValue?: number;
  /** Evidências disponíveis (força de 0-1) */
  evidence?: number;
  /** Precedentes favoráveis (0-1) */
  precedents?: number;
  /** Custos fixos do processo */
  litigationCosts?: number;
  /** Taxa de desconto temporal */
  discountRate?: number;
}

/**
 * Tipos de casos judiciais
 */
export enum CaseType {
  CIVIL = 'civil',
  CRIMINAL = 'criminal',
  LABOR = 'labor',
  FAMILY = 'family',
  ADMINISTRATIVE = 'administrative',
  CONSTITUTIONAL = 'constitutional',
  COMMERCIAL = 'commercial',
}

/**
 * Resultado da análise de um jogo
 */
export interface GameAnalysis {
  /** Equilíbrios de Nash encontrados */
  equilibria: NashEquilibrium[];
  /** Estratégias dominantes, se houver */
  dominantStrategies?: number[][];
  /** Estratégias dominadas, se houver */
  dominatedStrategies?: number[][];
  /** Recomendações estratégicas */
  recommendations?: string[];
  /** Árvore de decisão (para jogos sequenciais) */
  decisionTree?: DecisionNode;
}

/**
 * Nó de árvore de decisão (para jogos em forma extensiva)
 */
export interface DecisionNode {
  /** Jogador que toma decisão neste nó */
  player: number;
  /** Estratégias disponíveis */
  actions: Strategy[];
  /** Nós filhos */
  children?: DecisionNode[];
  /** Payoffs (se for nó terminal) */
  payoffs?: number[];
  /** Probabilidade de chegar a este nó */
  probability?: number;
}
