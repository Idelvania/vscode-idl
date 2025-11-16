/**
 * Testes para Jogos Judiciais
 */

import { JudicialGameFactory } from './judicial-game';

describe('JudicialGame', () => {
  describe('Settlement Negotiation', () => {
    it('deve criar e analisar jogo de negociação de acordo', () => {
      const game = JudicialGameFactory.createSettlementNegotiation(
        100, // valor da causa
        0.7, // evidências do autor (70%)
        20   // custos de litigação
      );

      const analysis = game.analyze();

      expect(analysis).toBeDefined();
      expect(analysis.equilibria.length).toBeGreaterThan(0);
    });

    it('deve recomendar acordo quando ambos concordam', () => {
      const game = JudicialGameFactory.createSettlementNegotiation(
        100,
        0.6,
        25
      );

      const matrix = game.buildPayoffMatrix();
      expect(matrix).toBeDefined();
      expect(matrix.players).toHaveLength(2);
      expect(matrix.strategies).toHaveLength(2);
    });

    it('deve gerar análise textual completa', () => {
      const game = JudicialGameFactory.createSettlementNegotiation(
        100,
        0.7,
        20
      );

      const output = game.printAnalysis();

      expect(output).toContain('ANÁLISE DO JOGO JUDICIAL');
      expect(output).toContain('EQUILÍBRIOS DE NASH');
      expect(output).toContain('RECOMENDAÇÕES');
    });
  });

  describe('Plea Bargain Dilemma', () => {
    it('deve criar dilema do prisioneiro clássico', () => {
      const game = JudicialGameFactory.createPleaBargainDilemma(10);

      const analysis = game.analyze();

      expect(analysis.equilibria).toHaveLength(1);

      // Equilíbrio deve ser ambos delatando
      const eq = analysis.equilibria[0];
      expect(eq.profile?.strategies).toEqual([1, 1]);
    });

    it('deve mostrar dilema: cooperação mútua melhor que delação mútua', () => {
      const game = JudicialGameFactory.createPleaBargainDilemma(10);
      const matrix = game.buildPayoffMatrix();

      // Payoff de (Cooperar, Cooperar)
      const bothCooperate = matrix.matrix[0][0];

      // Payoff de (Delatar, Delatar)
      const bothDefect = matrix.matrix[1][1];

      // Cooperação mútua deve ser melhor que delação mútua
      expect(bothCooperate[0]).toBeGreaterThan(bothDefect[0]);
      expect(bothCooperate[1]).toBeGreaterThan(bothDefect[1]);
    });
  });

  describe('Appeal Game', () => {
    it('deve criar jogo de recurso/apelação', () => {
      const game = JudicialGameFactory.createAppealGame(
        100,  // valor da sentença
        30,   // custo do recurso
        0.3   // probabilidade de reversão
      );

      const analysis = game.analyze();

      expect(analysis).toBeDefined();
      expect(analysis.equilibria.length).toBeGreaterThan(0);
    });

    it('deve considerar custos de apelação nas recomendações', () => {
      const game = JudicialGameFactory.createAppealGame(100, 30, 0.3);

      const output = game.printAnalysis();

      expect(output).toContain('RECOMENDAÇÕES');
    });
  });
});

describe('JudicialGameFactory', () => {
  it('deve criar diferentes tipos de jogos judiciais', () => {
    const settlement = JudicialGameFactory.createSettlementNegotiation(
      100,
      0.7,
      20
    );
    const plea = JudicialGameFactory.createPleaBargainDilemma(10);
    const appeal = JudicialGameFactory.createAppealGame(100, 30, 0.3);

    expect(settlement).toBeDefined();
    expect(plea).toBeDefined();
    expect(appeal).toBeDefined();

    expect(settlement.getPayoffMatrix()?.players).toContain('Autor');
    expect(plea.getPayoffMatrix()?.players).toContain('Suspeito 1');
    expect(appeal.getPayoffMatrix()?.players).toContain('Parte Perdedora');
  });
});
