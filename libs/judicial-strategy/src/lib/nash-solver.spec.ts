/**
 * Testes para o Nash Solver
 */

import { NashSolver } from './nash-solver';
import { PayoffMatrixBuilder } from './payoff-matrix';
import { Strategy } from './types';

describe('NashSolver', () => {
  describe('Dilema do Prisioneiro', () => {
    it('deve encontrar equilíbrio de Nash único (Delatar, Delatar)', () => {
      const strategies: Strategy[][] = [
        [
          { name: 'Cooperar', description: 'Silêncio', cost: 0 },
          { name: 'Delatar', description: 'Testemunhar', cost: 0 },
        ],
        [
          { name: 'Cooperar', description: 'Silêncio', cost: 0 },
          { name: 'Delatar', description: 'Testemunhar', cost: 0 },
        ],
      ];

      const matrix = new PayoffMatrixBuilder()
        .setPlayers(['Prisioneiro 1', 'Prisioneiro 2'])
        .setAllStrategies(strategies)
        .setPayoff([0, 0], [-1, -1]) // Ambos cooperam
        .setPayoff([0, 1], [-10, 0]) // P1 coopera, P2 delata
        .setPayoff([1, 0], [0, -10]) // P1 delata, P2 coopera
        .setPayoff([1, 1], [-5, -5]) // Ambos delatam
        .build();

      const equilibria = NashSolver.findPureStrategyEquilibria(matrix);

      expect(equilibria).toHaveLength(1);
      expect(equilibria[0].profile?.strategies).toEqual([1, 1]);
      expect(equilibria[0].expectedPayoffs).toEqual([-5, -5]);
    });
  });

  describe('Battle of the Sexes', () => {
    it('deve encontrar dois equilíbrios de Nash', () => {
      const strategies: Strategy[][] = [
        [
          { name: 'Ópera', description: 'Ir à ópera', cost: 0 },
          { name: 'Futebol', description: 'Ir ao futebol', cost: 0 },
        ],
        [
          { name: 'Ópera', description: 'Ir à ópera', cost: 0 },
          { name: 'Futebol', description: 'Ir ao futebol', cost: 0 },
        ],
      ];

      const matrix = new PayoffMatrixBuilder()
        .setPlayers(['Marido', 'Esposa'])
        .setAllStrategies(strategies)
        .setPayoff([0, 0], [2, 1]) // Ambos na ópera
        .setPayoff([0, 1], [0, 0]) // Marido ópera, Esposa futebol
        .setPayoff([1, 0], [0, 0]) // Marido futebol, Esposa ópera
        .setPayoff([1, 1], [1, 2]) // Ambos no futebol
        .build();

      const equilibria = NashSolver.findPureStrategyEquilibria(matrix);

      expect(equilibria).toHaveLength(2);

      // Ordena para garantir ordem consistente
      const sorted = equilibria.sort(
        (a, b) => (a.profile?.strategies[0] || 0) - (b.profile?.strategies[0] || 0)
      );

      expect(sorted[0].profile?.strategies).toEqual([0, 0]);
      expect(sorted[1].profile?.strategies).toEqual([1, 1]);
    });
  });

  describe('Estratégias Dominantes', () => {
    it('deve identificar estratégias estritamente dominantes', () => {
      const strategies: Strategy[][] = [
        [
          { name: 'Alto', description: 'Preço Alto', cost: 0 },
          { name: 'Baixo', description: 'Preço Baixo', cost: 0 },
        ],
        [
          { name: 'Alto', description: 'Preço Alto', cost: 0 },
          { name: 'Baixo', description: 'Preço Baixo', cost: 0 },
        ],
      ];

      // Jogo onde "Baixo" domina "Alto" para ambos
      const matrix = new PayoffMatrixBuilder()
        .setPlayers(['Empresa 1', 'Empresa 2'])
        .setAllStrategies(strategies)
        .setPayoff([0, 0], [3, 3])
        .setPayoff([0, 1], [1, 5])
        .setPayoff([1, 0], [5, 1])
        .setPayoff([1, 1], [4, 4])
        .build();

      const dominant = NashSolver.findDominantStrategies(matrix);

      expect(dominant[0]).toContain(1); // Baixo é dominante para P1
      expect(dominant[1]).toContain(1); // Baixo é dominante para P2
    });
  });

  describe('Equilíbrio Misto', () => {
    it('deve encontrar equilíbrio misto em jogo 2x2 (Matching Pennies)', () => {
      const strategies: Strategy[][] = [
        [
          { name: 'Cara', description: 'Mostrar cara', cost: 0 },
          { name: 'Coroa', description: 'Mostrar coroa', cost: 0 },
        ],
        [
          { name: 'Cara', description: 'Mostrar cara', cost: 0 },
          { name: 'Coroa', description: 'Mostrar coroa', cost: 0 },
        ],
      ];

      const matrix = new PayoffMatrixBuilder()
        .setPlayers(['Jogador 1', 'Jogador 2'])
        .setAllStrategies(strategies)
        .setPayoff([0, 0], [1, -1])
        .setPayoff([0, 1], [-1, 1])
        .setPayoff([1, 0], [-1, 1])
        .setPayoff([1, 1], [1, -1])
        .build();

      const mixed = NashSolver.findMixedStrategyEquilibrium2x2(matrix);

      expect(mixed).not.toBeNull();
      expect(mixed?.type).toBe('mixed');

      // No matching pennies, equilíbrio é (0.5, 0.5) para cada jogador
      expect(mixed?.mixedStrategies?.[0].probabilities[0]).toBeCloseTo(0.5, 1);
      expect(mixed?.mixedStrategies?.[0].probabilities[1]).toBeCloseTo(0.5, 1);
      expect(mixed?.mixedStrategies?.[1].probabilities[0]).toBeCloseTo(0.5, 1);
      expect(mixed?.mixedStrategies?.[1].probabilities[1]).toBeCloseTo(0.5, 1);
    });
  });

  describe('Recomendações', () => {
    it('deve gerar recomendações apropriadas', () => {
      const strategies: Strategy[][] = [
        [
          { name: 'Acordo', description: 'Aceitar acordo', cost: 5 },
          { name: 'Litigar', description: 'Prosseguir com processo', cost: 20 },
        ],
        [
          { name: 'Acordo', description: 'Oferecer acordo', cost: 5 },
          { name: 'Resistir', description: 'Resistir ao processo', cost: 20 },
        ],
      ];

      const matrix = new PayoffMatrixBuilder()
        .setPlayers(['Autor', 'Réu'])
        .setAllStrategies(strategies)
        .setPayoff([0, 0], [45, -45])
        .setPayoff([0, 1], [-5, -20])
        .setPayoff([1, 0], [45, -45])
        .setPayoff([1, 1], [30, -50])
        .build();

      const equilibria = NashSolver.findPureStrategyEquilibria(matrix);
      const recommendations = NashSolver.generateRecommendations(
        matrix,
        equilibria
      );

      expect(recommendations).toBeDefined();
      expect(recommendations.length).toBeGreaterThan(0);
    });
  });
});
