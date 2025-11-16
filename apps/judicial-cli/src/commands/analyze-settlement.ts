/**
 * Comando para analisar negociação de acordo
 */

import { JudicialGameFactory } from '../../../../libs/judicial-strategy/src';
import { saveReport } from '../utils/report-generator';
import { formatOutput } from '../utils/formatters';

interface SettlementOptions {
  valor?: number;
  evidencia?: number;
  custo?: number;
  output?: string;
  format?: string;
}

export async function analyzeSettlement(options: SettlementOptions) {
  console.log('\n🏛️  SIICAF - Análise de Negociação de Acordo\n');

  // Valores padrão ou solicita interativamente
  const claimValue = options.valor || 100000;
  const evidence = options.evidencia || 0.7;
  const costs = options.custo || 20000;

  console.log('Parâmetros da Análise:');
  console.log(`  Valor da Causa: R$ ${claimValue.toLocaleString('pt-BR')}`);
  console.log(`  Força das Evidências: ${(evidence * 100).toFixed(0)}%`);
  console.log(`  Custos de Litigação: R$ ${costs.toLocaleString('pt-BR')}\n`);

  // Criar e analisar jogo
  const game = JudicialGameFactory.createSettlementNegotiation(
    claimValue,
    evidence,
    costs
  );

  const analysis = game.analyze();

  // Formatar output
  const output = formatOutput(game, analysis, options.format || 'txt');

  // Exibir no console
  console.log(output);

  // Salvar em arquivo se solicitado
  if (options.output) {
    await saveReport(options.output, output, options.format || 'txt');
    console.log(`\n✓ Relatório salvo em: ${options.output}`);
  }

  // Conclusão
  console.log('\n' + '─'.repeat(60));
  console.log('SIICAF - Sistema de Inteligência e Investigação');
  console.log('© Dra. Idelvânia Menezes de Araújo - OAB/GO 64.265-A');
  console.log('─'.repeat(60) + '\n');

  return analysis;
}
