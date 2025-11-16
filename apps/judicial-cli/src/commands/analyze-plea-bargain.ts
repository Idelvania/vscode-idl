/**
 * Comando para analisar delação premiada
 */

import { JudicialGameFactory } from '../../../../libs/judicial-strategy/src';
import { saveReport } from '../utils/report-generator';
import { formatOutput } from '../utils/formatters';

interface PleaBargainOptions {
  maxSentence?: number;
  output?: string;
  format?: string;
}

export async function analyzePleaBargain(options: PleaBargainOptions) {
  console.log('\n⚖️  SIICAF - Análise de Delação Premiada\n');

  const maxSentence = options.maxSentence || 10;

  console.log('Parâmetros da Análise:');
  console.log(`  Pena Máxima: ${maxSentence} anos\n`);

  // Criar e analisar jogo
  const game = JudicialGameFactory.createPleaBargainDilemma(maxSentence);
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
