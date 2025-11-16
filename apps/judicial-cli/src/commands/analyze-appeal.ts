/**
 * Comando para analisar recurso/apelação
 */

import { JudicialGameFactory } from '../../../../libs/judicial-strategy/src';
import { saveReport } from '../utils/report-generator';
import { formatOutput } from '../utils/formatters';

interface AppealOptions {
  julgamento?: number;
  custo?: number;
  reversao?: number;
  output?: string;
  format?: string;
}

export async function analyzeAppeal(options: AppealOptions) {
  console.log('\n📑 SIICAF - Análise de Recurso/Apelação\n');

  const judgmentValue = options.julgamento || 80000;
  const appealCost = options.custo || 20000;
  const reversalProb = options.reversao || 0.3;

  console.log('Parâmetros da Análise:');
  console.log(`  Valor da Sentença: R$ ${judgmentValue.toLocaleString('pt-BR')}`);
  console.log(`  Custo do Recurso: R$ ${appealCost.toLocaleString('pt-BR')}`);
  console.log(`  Probabilidade de Reversão: ${(reversalProb * 100).toFixed(0)}%\n`);

  // Criar e analisar jogo
  const game = JudicialGameFactory.createAppealGame(
    judgmentValue,
    appealCost,
    reversalProb
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

  console.log('\n' + '─'.repeat(60));
  console.log('SIICAF - Sistema de Inteligência e Investigação');
  console.log('© Dra. Idelvânia Menezes de Araújo - OAB/GO 64.265-A');
  console.log('─'.repeat(60) + '\n');

  return analysis;
}
