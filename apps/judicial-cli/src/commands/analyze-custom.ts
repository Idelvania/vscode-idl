/**
 * Comando para análise customizada
 */

import * as fs from 'fs';
import { JudicialGame } from '../../../../libs/judicial-strategy/src';
import { saveReport } from '../utils/report-generator';
import { formatOutput } from '../utils/formatters';

interface CustomOptions {
  input?: string;
  output?: string;
  format?: string;
}

export async function analyzeCustom(options: CustomOptions) {
  console.log('\n🎯 SIICAF - Análise Customizada\n');

  if (!options.input) {
    console.error('❌ Erro: Arquivo de entrada não especificado.');
    console.log('Use: siicaf-nash custom -i <arquivo.json>\n');
    process.exit(1);
  }

  // Ler arquivo de configuração
  let config;
  try {
    const fileContent = fs.readFileSync(options.input, 'utf-8');
    config = JSON.parse(fileContent);
    console.log(`✓ Configuração carregada de: ${options.input}\n`);
  } catch (error) {
    console.error(`❌ Erro ao ler arquivo: ${error}`);
    process.exit(1);
  }

  // Criar jogo customizado
  const game = new JudicialGame(config);
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
