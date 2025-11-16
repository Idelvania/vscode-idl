/**
 * Modelagem de jogos judiciais usando Teoria de Nash
 */

import {
  JudicialGameConfig,
  GameAnalysis,
  Player,
  Strategy,
  GameContext,
  CaseType,
} from './types';
import { PayoffMatrix } from './types';
import { PayoffMatrixBuilder, PayoffMatrixUtils } from './payoff-matrix';
import { NashSolver } from './nash-solver';

/**
 * Classe principal para modelar e analisar jogos judiciais
 */
export class JudicialGame {
  private config: JudicialGameConfig;
  private payoffMatrix?: PayoffMatrix;

  constructor(config: JudicialGameConfig) {
    this.config = config;
  }

  /**
   * Constrói a matriz de payoff baseada na configuração
   */
  buildPayoffMatrix(): PayoffMatrix {
    const builder = new PayoffMatrixBuilder()
      .setPlayers(this.config.players.map((p) => p.name))
      .setAllStrategies(this.config.strategies);

    // Se há função de utilidade customizada, usa ela
    if (this.config.utilityFunction) {
      const profiles = this.generateAllProfiles();
      for (const profile of profiles) {
        const payoffs = this.config.utilityFunction(
          profile,
          this.config.context || {}
        );
        builder.setPayoff(profile, payoffs);
      }
    } else {
      // Usa função de utilidade padrão
      const profiles = this.generateAllProfiles();
      for (const profile of profiles) {
        const payoffs = this.calculateDefaultPayoffs(profile);
        builder.setPayoff(profile, payoffs);
      }
    }

    this.payoffMatrix = builder.build();
    return this.payoffMatrix;
  }

  /**
   * Gera todos os perfis de estratégias possíveis
   */
  private generateAllProfiles(): number[][] {
    const dimensions = this.config.strategies.map((s) => s.length);
    const profiles: number[][] = [];

    const generate = (current: number[], depth: number) => {
      if (depth === dimensions.length) {
        profiles.push([...current]);
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
   * Calcula payoffs usando função de utilidade padrão
   */
  private calculateDefaultPayoffs(profile: number[]): number[] {
    const context = this.config.context || {};
    const payoffs: number[] = [];

    for (let player = 0; player < this.config.players.length; player++) {
      const strategy = this.config.strategies[player][profile[player]];
      let payoff = 0;

      // Base: probabilidade de sucesso * valor da causa - custo
      const claimValue = context.claimValue || 100;
      const successProb = strategy.successProbability || 0.5;
      payoff = successProb * claimValue - strategy.cost;

      // Ajustes baseados no tipo de estratégia
      const strategyName = strategy.name.toLowerCase();

      // Acordos são mais rápidos e têm custos menores
      if (strategyName.includes('acordo') || strategyName.includes('settlement')) {
        payoff += 10; // Bônus por resolver rápido
      }

      // Litigância é mais cara e demorada
      if (strategyName.includes('litig')) {
        const litigationCost = context.litigationCosts || 20;
        payoff -= litigationCost;
      }

      // Recursos/Apelações têm custo adicional e tempo
      if (strategyName.includes('recurso') || strategyName.includes('appeal')) {
        payoff -= 15;
      }

      // Mediação tem custo moderado
      if (strategyName.includes('media')) {
        payoff -= 5;
      }

      // Ajuste baseado em evidências
      if (context.evidence !== undefined) {
        payoff *= 1 + context.evidence * 0.2; // Até 20% de bônus
      }

      payoffs.push(Math.round(payoff));
    }

    return payoffs;
  }

  /**
   * Analisa o jogo e encontra equilíbrios de Nash
   */
  analyze(): GameAnalysis {
    if (!this.payoffMatrix) {
      this.buildPayoffMatrix();
    }

    const matrix = this.payoffMatrix!;

    // Encontra equilíbrios
    const equilibria = NashSolver.findAllEquilibria(matrix);

    // Encontra estratégias dominantes
    const dominantStrategies = NashSolver.findDominantStrategies(matrix);

    // Encontra estratégias dominadas
    const dominatedStrategies = PayoffMatrixUtils.findDominatedStrategies(matrix);

    // Gera recomendações
    const recommendations = NashSolver.generateRecommendations(matrix, equilibria);

    return {
      equilibria,
      dominantStrategies,
      dominatedStrategies,
      recommendations,
    };
  }

  /**
   * Obtém a matriz de payoff
   */
  getPayoffMatrix(): PayoffMatrix | undefined {
    return this.payoffMatrix;
  }

  /**
   * Imprime análise de forma legível
   */
  printAnalysis(): string {
    const analysis = this.analyze();
    let output = '\n=== ANÁLISE DO JOGO JUDICIAL ===\n\n';

    // Informações do jogo
    output += `Jogadores: ${this.config.players.map((p) => p.name).join(', ')}\n`;
    output += `Tipo de Caso: ${this.config.context?.caseType || 'N/A'}\n`;
    output += `Valor da Causa: ${this.config.context?.claimValue || 'N/A'}\n\n`;

    // Matriz de payoff (se for 2 jogadores)
    if (this.payoffMatrix && this.config.players.length === 2) {
      output += '=== MATRIZ DE PAYOFFS ===\n';
      output += PayoffMatrixUtils.printMatrix(this.payoffMatrix);
      output += '\n';
    }

    // Equilíbrios
    output += '=== EQUILÍBRIOS DE NASH ===\n';
    if (analysis.equilibria.length === 0) {
      output += 'Nenhum equilíbrio encontrado.\n\n';
    } else {
      analysis.equilibria.forEach((eq, i) => {
        output += `\nEquilíbrio ${i + 1} (${eq.type}):\n`;
        if (eq.type === 'pure' && eq.profile) {
          eq.profile.strategies.forEach((stratIndex, player) => {
            const stratName = this.config.strategies[player][stratIndex].name;
            output += `  ${this.config.players[player].name}: ${stratName}\n`;
          });
        } else if (eq.type === 'mixed' && eq.mixedStrategies) {
          eq.mixedStrategies.forEach((ms) => {
            output += `  ${this.config.players[ms.player].name}:\n`;
            ms.probabilities.forEach((prob, stratIndex) => {
              const stratName = this.config.strategies[ms.player][stratIndex].name;
              output += `    ${stratName}: ${(prob * 100).toFixed(1)}%\n`;
            });
          });
        }
        output += `  Payoffs: ${eq.expectedPayoffs.map((p, idx) => `${this.config.players[idx].name}: ${p.toFixed(2)}`).join(', ')}\n`;
        output += `  Estabilidade: ${((eq.stability || 0) * 100).toFixed(1)}%\n`;
      });
    }

    // Recomendações
    output += '\n=== RECOMENDAÇÕES ESTRATÉGICAS ===\n';
    analysis.recommendations?.forEach((rec) => {
      output += `• ${rec}\n`;
    });

    return output;
  }
}

/**
 * Factory para criar jogos judiciais comuns
 */
export class JudicialGameFactory {
  /**
   * Cria um jogo de negociação de acordo (Plaintiff vs Defendant)
   */
  static createSettlementNegotiation(
    claimValue: number,
    plaintiffEvidence: number,
    litigationCosts: number
  ): JudicialGame {
    const players: Player[] = [
      { name: 'Autor', type: 0 },
      { name: 'Réu', type: 1 },
    ];

    const strategies: Strategy[][] = [
      [
        {
          name: 'Aceitar Acordo (50%)',
          description: 'Aceitar acordo de 50% do valor',
          cost: 5,
          successProbability: 1.0,
        },
        {
          name: 'Litigar',
          description: 'Prosseguir com litígio completo',
          cost: 20,
          successProbability: plaintiffEvidence,
        },
      ],
      [
        {
          name: 'Oferecer Acordo (50%)',
          description: 'Oferecer acordo de 50% do valor',
          cost: 5,
          successProbability: 0.5,
        },
        {
          name: 'Resistir',
          description: 'Resistir e litigar',
          cost: 20,
          successProbability: 1 - plaintiffEvidence,
        },
      ],
    ];

    const context: GameContext = {
      caseType: CaseType.CIVIL,
      claimValue,
      evidence: plaintiffEvidence,
      litigationCosts,
    };

    // Função de utilidade customizada
    const utilityFunction = (profile: number[], ctx: GameContext) => {
      const [plaintiffStrategy, defendantStrategy] = profile;

      // Ambos aceitam acordo
      if (plaintiffStrategy === 0 && defendantStrategy === 0) {
        return [
          claimValue * 0.5 - 5, // Autor recebe 50% - custo
          -claimValue * 0.5 - 5, // Réu paga 50% + custo
        ];
      }

      // Autor aceita, Réu resiste
      if (plaintiffStrategy === 0 && defendantStrategy === 1) {
        return [
          -5, // Autor perde custo, não recebe nada
          -20, // Réu paga custo de litigação
        ];
      }

      // Autor litiga, Réu oferece acordo
      if (plaintiffStrategy === 1 && defendantStrategy === 0) {
        return [
          claimValue * 0.5 - 5, // Autor aceita acordo
          -claimValue * 0.5 - 5, // Réu paga acordo
        ];
      }

      // Ambos litigam
      if (plaintiffStrategy === 1 && defendantStrategy === 1) {
        const plaintiffWinProb = ctx.evidence || 0.5;
        return [
          plaintiffWinProb * claimValue - litigationCosts,
          -plaintiffWinProb * claimValue - litigationCosts,
        ];
      }

      return [0, 0];
    };

    return new JudicialGame({
      players,
      strategies,
      context,
      utilityFunction,
    });
  }

  /**
   * Cria um jogo de dilema do prisioneiro (Plea Bargain)
   */
  static createPleaBargainDilemma(
    maxSentence: number
  ): JudicialGame {
    const players: Player[] = [
      { name: 'Suspeito 1', type: 2 },
      { name: 'Suspeito 2', type: 2 },
    ];

    const strategies: Strategy[][] = [
      [
        {
          name: 'Cooperar (Silêncio)',
          description: 'Permanecer em silêncio',
          cost: 0,
          successProbability: 0.5,
        },
        {
          name: 'Delatar',
          description: 'Fazer delação premiada',
          cost: 0,
          successProbability: 1.0,
        },
      ],
      [
        {
          name: 'Cooperar (Silêncio)',
          description: 'Permanecer em silêncio',
          cost: 0,
          successProbability: 0.5,
        },
        {
          name: 'Delatar',
          description: 'Fazer delação premiada',
          cost: 0,
          successProbability: 1.0,
        },
      ],
    ];

    const utilityFunction = (profile: number[]) => {
      const [s1, s2] = profile;

      // Ambos cooperam (silêncio)
      if (s1 === 0 && s2 === 0) {
        return [-1, -1]; // Pena leve para ambos
      }

      // S1 delata, S2 coopera
      if (s1 === 1 && s2 === 0) {
        return [0, -maxSentence]; // S1 livre, S2 pena máxima
      }

      // S1 coopera, S2 delata
      if (s1 === 0 && s2 === 1) {
        return [-maxSentence, 0]; // S1 pena máxima, S2 livre
      }

      // Ambos delatam
      if (s1 === 1 && s2 === 1) {
        return [-5, -5]; // Pena moderada para ambos
      }

      return [0, 0];
    };

    return new JudicialGame({
      players,
      strategies,
      context: { caseType: CaseType.CRIMINAL },
      utilityFunction,
    });
  }

  /**
   * Cria jogo de recurso/apelação
   */
  static createAppealGame(
    judgmentValue: number,
    appealCost: number,
    reversalProbability: number
  ): JudicialGame {
    const players: Player[] = [
      { name: 'Parte Perdedora', type: 0 },
      { name: 'Parte Vencedora', type: 1 },
    ];

    const strategies: Strategy[][] = [
      [
        {
          name: 'Aceitar Sentença',
          description: 'Aceitar sentença de primeira instância',
          cost: 0,
          successProbability: 0,
        },
        {
          name: 'Apelar',
          description: 'Interpor recurso de apelação',
          cost: appealCost,
          successProbability: reversalProbability,
        },
      ],
      [
        {
          name: 'Oferecer Acordo',
          description: 'Oferecer acordo antes do recurso',
          cost: 5,
          successProbability: 0.5,
        },
        {
          name: 'Manter Vitória',
          description: 'Defender sentença favorável',
          cost: appealCost * 0.5,
          successProbability: 1 - reversalProbability,
        },
      ],
    ];

    const utilityFunction = (profile: number[]) => {
      const [loserStrategy, winnerStrategy] = profile;

      // Perdedor aceita, vencedor oferece acordo
      if (loserStrategy === 0 && winnerStrategy === 0) {
        return [-judgmentValue * 0.7, judgmentValue * 0.7 - 5];
      }

      // Perdedor aceita, vencedor mantém
      if (loserStrategy === 0 && winnerStrategy === 1) {
        return [-judgmentValue, judgmentValue];
      }

      // Perdedor apela, vencedor oferece acordo
      if (loserStrategy === 1 && winnerStrategy === 0) {
        return [-judgmentValue * 0.7 - appealCost * 0.5, judgmentValue * 0.7 - 5];
      }

      // Ambos litigam no recurso
      if (loserStrategy === 1 && winnerStrategy === 1) {
        const expectedValue =
          reversalProbability * 0 +
          (1 - reversalProbability) * -judgmentValue;
        return [
          expectedValue - appealCost,
          -expectedValue - appealCost * 0.5,
        ];
      }

      return [0, 0];
    };

    return new JudicialGame({
      players,
      strategies,
      context: { caseType: CaseType.CIVIL, claimValue: judgmentValue },
      utilityFunction,
    });
  }
}
