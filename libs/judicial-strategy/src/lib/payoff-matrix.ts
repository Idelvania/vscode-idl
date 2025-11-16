/**
 * Construtor e manipulador de matrizes de payoff
 */

import { PayoffMatrix, Strategy, StrategyProfile } from './types';

/**
 * Classe para construir e manipular matrizes de payoff
 */
export class PayoffMatrixBuilder {
  private players: string[] = [];
  private strategies: Strategy[][] = [];
  private matrix: number[][][] = [];

  /**
   * Define os jogadores
   */
  setPlayers(players: string[]): this {
    this.players = players;
    return this;
  }

  /**
   * Define as estratégias para um jogador específico
   */
  setStrategies(playerIndex: number, strategies: Strategy[]): this {
    this.strategies[playerIndex] = strategies;
    return this;
  }

  /**
   * Define todas as estratégias de uma vez
   */
  setAllStrategies(strategies: Strategy[][]): this {
    this.strategies = strategies;
    return this;
  }

  /**
   * Define um payoff específico para um perfil de estratégias
   */
  setPayoff(strategyIndices: number[], payoffs: number[]): this {
    if (strategyIndices.length !== this.players.length) {
      throw new Error(
        'Strategy indices must match number of players'
      );
    }

    if (payoffs.length !== this.players.length) {
      throw new Error('Payoffs must match number of players');
    }

    // Inicializa a matriz se necessário
    if (this.matrix.length === 0) {
      this.initializeMatrix();
    }

    // Navega pela matriz multidimensional
    let current: any = this.matrix;
    for (let i = 0; i < strategyIndices.length - 1; i++) {
      current = current[strategyIndices[i]];
    }
    current[strategyIndices[strategyIndices.length - 1]] = payoffs;

    return this;
  }

  /**
   * Constrói a matriz de payoff
   */
  build(): PayoffMatrix {
    if (this.players.length === 0) {
      throw new Error('No players defined');
    }

    if (this.strategies.length !== this.players.length) {
      throw new Error('Strategies not defined for all players');
    }

    if (this.matrix.length === 0) {
      this.initializeMatrix();
    }

    return {
      players: this.players,
      strategies: this.strategies,
      matrix: this.matrix,
    };
  }

  /**
   * Inicializa a matriz com zeros
   */
  private initializeMatrix(): void {
    const dimensions = this.strategies.map((s) => s.length);
    this.matrix = this.createMultiDimensionalArray(dimensions, this.players.length);
  }

  /**
   * Cria array multidimensional recursivamente
   */
  private createMultiDimensionalArray(
    dimensions: number[],
    payoffSize: number,
    currentDim = 0
  ): any {
    if (currentDim === dimensions.length) {
      return new Array(payoffSize).fill(0);
    }

    const arr = [];
    for (let i = 0; i < dimensions[currentDim]; i++) {
      arr.push(
        this.createMultiDimensionalArray(dimensions, payoffSize, currentDim + 1)
      );
    }
    return arr;
  }
}

/**
 * Utilitários para trabalhar com matrizes de payoff
 */
export class PayoffMatrixUtils {
  /**
   * Obtém o payoff para um perfil de estratégias específico
   */
  static getPayoff(
    matrix: PayoffMatrix,
    strategyIndices: number[]
  ): number[] {
    let current: any = matrix.matrix;
    for (const index of strategyIndices) {
      current = current[index];
    }
    return current;
  }

  /**
   * Gera todos os perfis de estratégias possíveis
   */
  static getAllStrategyProfiles(matrix: PayoffMatrix): StrategyProfile[] {
    const profiles: StrategyProfile[] = [];
    const dimensions = matrix.strategies.map((s) => s.length);

    const generate = (current: number[], depth: number) => {
      if (depth === dimensions.length) {
        profiles.push({
          strategies: [...current],
          payoffs: this.getPayoff(matrix, current),
        });
        return;
      }

      for (let i = 0; i < dimensions[depth]; i++) {
        current[depth] = i;
        generate(current, depth + 1);
      }
    };

    generate(new Array(dimensions.length), 0);
    return profiles;
  }

  /**
   * Verifica se uma estratégia domina estritamente outra
   */
  static strictlyDominates(
    matrix: PayoffMatrix,
    player: number,
    strategy1: number,
    strategy2: number
  ): boolean {
    const profiles = this.getAllStrategyProfiles(matrix);

    for (const profile of profiles) {
      // Compara payoffs quando player usa strategy1 vs strategy2
      const profile1 = [...profile.strategies];
      const profile2 = [...profile.strategies];
      profile1[player] = strategy1;
      profile2[player] = strategy2;

      const payoff1 = this.getPayoff(matrix, profile1)[player];
      const payoff2 = this.getPayoff(matrix, profile2)[player];

      if (payoff1 <= payoff2) {
        return false;
      }
    }

    return true;
  }

  /**
   * Verifica se uma estratégia domina fracamente outra
   */
  static weaklyDominates(
    matrix: PayoffMatrix,
    player: number,
    strategy1: number,
    strategy2: number
  ): boolean {
    const profiles = this.getAllStrategyProfiles(matrix);
    let hasStrictlyGreater = false;

    for (const profile of profiles) {
      const profile1 = [...profile.strategies];
      const profile2 = [...profile.strategies];
      profile1[player] = strategy1;
      profile2[player] = strategy2;

      const payoff1 = this.getPayoff(matrix, profile1)[player];
      const payoff2 = this.getPayoff(matrix, profile2)[player];

      if (payoff1 < payoff2) {
        return false;
      }
      if (payoff1 > payoff2) {
        hasStrictlyGreater = true;
      }
    }

    return hasStrictlyGreater;
  }

  /**
   * Encontra estratégias dominadas para cada jogador
   */
  static findDominatedStrategies(
    matrix: PayoffMatrix
  ): number[][] {
    const dominated: number[][] = [];

    for (let player = 0; player < matrix.players.length; player++) {
      dominated[player] = [];
      const numStrategies = matrix.strategies[player].length;

      for (let i = 0; i < numStrategies; i++) {
        for (let j = 0; j < numStrategies; j++) {
          if (i !== j && this.weaklyDominates(matrix, player, j, i)) {
            if (!dominated[player].includes(i)) {
              dominated[player].push(i);
            }
            break;
          }
        }
      }
    }

    return dominated;
  }

  /**
   * Imprime a matriz de payoff de forma legível (para jogos de 2 jogadores)
   */
  static printMatrix(matrix: PayoffMatrix): string {
    if (matrix.players.length !== 2) {
      return 'Print only supported for 2-player games';
    }

    let output = '\n';
    const p1 = matrix.players[0];
    const p2 = matrix.players[1];

    // Cabeçalho
    output += `${p1} \\ ${p2}`;
    for (const strat of matrix.strategies[1]) {
      output += `\t${strat.name}`;
    }
    output += '\n';

    // Linhas
    for (let i = 0; i < matrix.strategies[0].length; i++) {
      output += matrix.strategies[0][i].name;
      for (let j = 0; j < matrix.strategies[1].length; j++) {
        const payoffs = this.getPayoff(matrix, [i, j]);
        output += `\t(${payoffs[0]}, ${payoffs[1]})`;
      }
      output += '\n';
    }

    return output;
  }
}
