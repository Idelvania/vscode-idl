/**
 * Solver de Equilíbrios de Nash
 */

import {
  PayoffMatrix,
  NashEquilibrium,
  StrategyProfile,
  MixedStrategy,
} from './types';
import { PayoffMatrixUtils } from './payoff-matrix';

/**
 * Classe para encontrar equilíbrios de Nash
 */
export class NashSolver {
  /**
   * Encontra todos os equilíbrios de Nash em estratégias puras
   */
  static findPureStrategyEquilibria(
    matrix: PayoffMatrix
  ): NashEquilibrium[] {
    const profiles = PayoffMatrixUtils.getAllStrategyProfiles(matrix);
    const equilibria: NashEquilibrium[] = [];

    for (const profile of profiles) {
      if (this.isPureStrategyNashEquilibrium(matrix, profile)) {
        equilibria.push({
          type: 'pure',
          profile: { ...profile, isNashEquilibrium: true },
          expectedPayoffs: profile.payoffs,
          stability: this.calculateStability(matrix, profile),
        });
      }
    }

    return equilibria;
  }

  /**
   * Verifica se um perfil de estratégias é um equilíbrio de Nash puro
   */
  static isPureStrategyNashEquilibrium(
    matrix: PayoffMatrix,
    profile: StrategyProfile
  ): boolean {
    const { strategies, payoffs } = profile;

    // Para cada jogador
    for (let player = 0; player < matrix.players.length; player++) {
      const currentPayoff = payoffs[player];

      // Verifica se há desvio benéfico
      for (
        let altStrategy = 0;
        altStrategy < matrix.strategies[player].length;
        altStrategy++
      ) {
        if (altStrategy === strategies[player]) {
          continue;
        }

        // Cria perfil alternativo
        const altProfile = [...strategies];
        altProfile[player] = altStrategy;
        const altPayoffs = PayoffMatrixUtils.getPayoff(matrix, altProfile);

        // Se o jogador pode melhorar mudando de estratégia, não é Nash
        if (altPayoffs[player] > currentPayoff) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Calcula a estabilidade de um equilíbrio (quão forte é)
   * Retorna valor de 0 a 1, onde 1 é muito estável
   */
  static calculateStability(
    matrix: PayoffMatrix,
    profile: StrategyProfile
  ): number {
    const { strategies, payoffs } = profile;
    let minDifference = Infinity;

    // Para cada jogador
    for (let player = 0; player < matrix.players.length; player++) {
      const currentPayoff = payoffs[player];

      // Encontra o melhor desvio
      for (
        let altStrategy = 0;
        altStrategy < matrix.strategies[player].length;
        altStrategy++
      ) {
        if (altStrategy === strategies[player]) {
          continue;
        }

        const altProfile = [...strategies];
        altProfile[player] = altStrategy;
        const altPayoffs = PayoffMatrixUtils.getPayoff(matrix, altProfile);

        const difference = currentPayoff - altPayoffs[player];
        minDifference = Math.min(minDifference, difference);
      }
    }

    // Normaliza (valores negativos = não é Nash)
    if (minDifference < 0) {
      return 0;
    }

    // Normaliza para 0-1 (usa função sigmoide)
    return 1 / (1 + Math.exp(-minDifference));
  }

  /**
   * Encontra estratégias dominantes (se existirem)
   */
  static findDominantStrategies(matrix: PayoffMatrix): number[][] {
    const dominant: number[][] = [];

    for (let player = 0; player < matrix.players.length; player++) {
      dominant[player] = [];
      const numStrategies = matrix.strategies[player].length;

      for (let i = 0; i < numStrategies; i++) {
        let isDominant = true;

        // Verifica se i domina todas as outras estratégias
        for (let j = 0; j < numStrategies; j++) {
          if (
            i !== j &&
            !PayoffMatrixUtils.strictlyDominates(matrix, player, i, j)
          ) {
            isDominant = false;
            break;
          }
        }

        if (isDominant && numStrategies > 1) {
          dominant[player].push(i);
        }
      }
    }

    return dominant;
  }

  /**
   * Encontra equilíbrio de Nash misto para jogos 2x2
   * Usa o método de indiferença
   */
  static findMixedStrategyEquilibrium2x2(
    matrix: PayoffMatrix
  ): NashEquilibrium | null {
    if (
      matrix.players.length !== 2 ||
      matrix.strategies[0].length !== 2 ||
      matrix.strategies[1].length !== 2
    ) {
      return null;
    }

    // Obtém payoffs
    const payoffs = [
      [
        PayoffMatrixUtils.getPayoff(matrix, [0, 0]),
        PayoffMatrixUtils.getPayoff(matrix, [0, 1]),
      ],
      [
        PayoffMatrixUtils.getPayoff(matrix, [1, 0]),
        PayoffMatrixUtils.getPayoff(matrix, [1, 1]),
      ],
    ];

    // Calcula probabilidades para jogador 2 que deixam jogador 1 indiferente
    const p1_0_0 = payoffs[0][0][0];
    const p1_0_1 = payoffs[0][1][0];
    const p1_1_0 = payoffs[1][0][0];
    const p1_1_1 = payoffs[1][1][0];

    // p * p1_0_0 + (1-p) * p1_0_1 = p * p1_1_0 + (1-p) * p1_1_1
    const denominator = p1_0_0 - p1_0_1 - p1_1_0 + p1_1_1;
    if (Math.abs(denominator) < 0.0001) {
      return null; // Não há equilíbrio misto
    }

    const p2_prob_0 = (p1_1_1 - p1_0_1) / denominator;

    // Calcula probabilidades para jogador 1 que deixam jogador 2 indiferente
    const p2_0_0 = payoffs[0][0][1];
    const p2_0_1 = payoffs[0][1][1];
    const p2_1_0 = payoffs[1][0][1];
    const p2_1_1 = payoffs[1][1][1];

    const denominator2 = p2_0_0 - p2_1_0 - p2_0_1 + p2_1_1;
    if (Math.abs(denominator2) < 0.0001) {
      return null;
    }

    const p1_prob_0 = (p2_1_1 - p2_1_0) / denominator2;

    // Verifica se as probabilidades são válidas
    if (
      p1_prob_0 < 0 ||
      p1_prob_0 > 1 ||
      p2_prob_0 < 0 ||
      p2_prob_0 > 1
    ) {
      return null;
    }

    const mixedStrategies: MixedStrategy[] = [
      {
        player: 0,
        probabilities: [p1_prob_0, 1 - p1_prob_0],
      },
      {
        player: 1,
        probabilities: [p2_prob_0, 1 - p2_prob_0],
      },
    ];

    // Calcula payoffs esperados
    const expectedPayoffs = this.calculateExpectedPayoffs(
      matrix,
      mixedStrategies
    );

    return {
      type: 'mixed',
      mixedStrategies,
      expectedPayoffs,
      stability: 0.5, // Equilíbrios mistos geralmente têm estabilidade média
    };
  }

  /**
   * Calcula payoffs esperados dado estratégias mistas
   */
  static calculateExpectedPayoffs(
    matrix: PayoffMatrix,
    mixedStrategies: MixedStrategy[]
  ): number[] {
    const expectedPayoffs = new Array(matrix.players.length).fill(0);
    const profiles = PayoffMatrixUtils.getAllStrategyProfiles(matrix);

    for (const profile of profiles) {
      // Calcula probabilidade deste perfil
      let probability = 1;
      for (let player = 0; player < matrix.players.length; player++) {
        const strategyIndex = profile.strategies[player];
        const strategyProb = mixedStrategies[player].probabilities[strategyIndex];
        probability *= strategyProb;
      }

      // Adiciona aos payoffs esperados
      for (let player = 0; player < matrix.players.length; player++) {
        expectedPayoffs[player] += profile.payoffs[player] * probability;
      }
    }

    return expectedPayoffs;
  }

  /**
   * Encontra todos os equilíbrios (puros e mistos)
   */
  static findAllEquilibria(matrix: PayoffMatrix): NashEquilibrium[] {
    const equilibria: NashEquilibrium[] = [];

    // Adiciona equilíbrios puros
    equilibria.push(...this.findPureStrategyEquilibria(matrix));

    // Para jogos 2x2, tenta encontrar equilíbrio misto
    if (
      matrix.players.length === 2 &&
      matrix.strategies[0].length === 2 &&
      matrix.strategies[1].length === 2
    ) {
      const mixed = this.findMixedStrategyEquilibrium2x2(matrix);
      if (mixed) {
        equilibria.push(mixed);
      }
    }

    return equilibria;
  }

  /**
   * Gera recomendações baseadas nos equilíbrios encontrados
   */
  static generateRecommendations(
    matrix: PayoffMatrix,
    equilibria: NashEquilibrium[]
  ): string[] {
    const recommendations: string[] = [];

    if (equilibria.length === 0) {
      recommendations.push(
        'Nenhum equilíbrio de Nash em estratégias puras encontrado.'
      );
      recommendations.push(
        'Considere análise de estratégias mistas ou jogos sequenciais.'
      );
      return recommendations;
    }

    // Analisa equilíbrios puros
    const pureEquilibria = equilibria.filter((e) => e.type === 'pure');
    if (pureEquilibria.length === 1) {
      const eq = pureEquilibria[0];
      recommendations.push(
        `Único equilíbrio de Nash encontrado: ${eq.profile?.strategies
          .map((s, i) => matrix.strategies[i][s].name)
          .join(' vs ')}`
      );
      recommendations.push(
        `Payoffs: ${eq.expectedPayoffs.map((p, i) => `${matrix.players[i]}: ${p}`).join(', ')}`
      );
    } else if (pureEquilibria.length > 1) {
      recommendations.push(
        `${pureEquilibria.length} equilíbrios de Nash encontrados (problema de coordenação).`
      );

      // Identifica equilíbrio Pareto-dominante
      let bestSum = -Infinity;
      let bestIndex = 0;
      pureEquilibria.forEach((eq, i) => {
        const sum = eq.expectedPayoffs.reduce((a, b) => a + b, 0);
        if (sum > bestSum) {
          bestSum = sum;
          bestIndex = i;
        }
      });

      recommendations.push(
        `Equilíbrio Pareto-ótimo recomendado: ${pureEquilibria[bestIndex].profile?.strategies
          .map((s, i) => matrix.strategies[i][s].name)
          .join(' vs ')}`
      );
    }

    // Verifica estratégias dominantes
    const dominant = this.findDominantStrategies(matrix);
    dominant.forEach((strategies, player) => {
      if (strategies.length > 0) {
        recommendations.push(
          `${matrix.players[player]} possui estratégia dominante: ${matrix.strategies[player][strategies[0]].name}`
        );
      }
    });

    // Verifica estratégias dominadas
    const dominated = PayoffMatrixUtils.findDominatedStrategies(matrix);
    dominated.forEach((strategies, player) => {
      if (strategies.length > 0) {
        recommendations.push(
          `${matrix.players[player]} deve evitar estratégias dominadas: ${strategies
            .map((s) => matrix.strategies[player][s].name)
            .join(', ')}`
        );
      }
    });

    return recommendations;
  }
}
