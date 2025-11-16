#!/usr/bin/env node

/**
 * SIICAF - Nash CLI
 * Sistema de Inteligência e Investigação de Condutas Antijurídicas e Fraudes
 * CLI para Análise de Estratégias Judiciais usando Teoria de Nash
 *
 * © Dra. Idelvânia Menezes de Araújo - OAB/GO 64.265-A
 * INPI - Todos os direitos reservados
 */

import { Command } from 'commander';
import { analyzeSettlement } from './commands/analyze-settlement';
import { analyzePleaBargain } from './commands/analyze-plea-bargain';
import { analyzeAppeal } from './commands/analyze-appeal';
import { analyzeCustom } from './commands/analyze-custom';
import { interactiveMode } from './commands/interactive';
import { generateReport } from './commands/generate-report';

const program = new Command();

program
  .name('siicaf-nash')
  .description('CLI para análise de estratégias judiciais usando Teoria de Nash - SIICAF')
  .version('1.0.0')
  .option('-v, --verbose', 'Modo verboso')
  .option('--no-color', 'Desabilitar cores');

// Comando: Analisar Negociação de Acordo
program
  .command('settlement')
  .alias('acordo')
  .description('Analisar negociação de acordo judicial')
  .option('-v, --valor <valor>', 'Valor da causa (R$)', parseFloat)
  .option('-e, --evidencia <probabilidade>', 'Força das evidências (0-1)', parseFloat)
  .option('-c, --custo <custo>', 'Custos de litigação (R$)', parseFloat)
  .option('-o, --output <arquivo>', 'Salvar relatório em arquivo')
  .option('-f, --format <formato>', 'Formato do relatório (txt, json, html)', 'txt')
  .action(analyzeSettlement);

// Comando: Analisar Delação Premiada
program
  .command('plea-bargain')
  .alias('delacao')
  .description('Analisar dilema de delação premiada')
  .option('-m, --max-sentence <anos>', 'Pena máxima (anos)', parseFloat)
  .option('-o, --output <arquivo>', 'Salvar relatório em arquivo')
  .option('-f, --format <formato>', 'Formato do relatório (txt, json, html)', 'txt')
  .action(analyzePleaBargain);

// Comando: Analisar Recurso/Apelação
program
  .command('appeal')
  .alias('recurso')
  .description('Analisar decisão de recurso/apelação')
  .option('-j, --julgamento <valor>', 'Valor da sentença (R$)', parseFloat)
  .option('-c, --custo <custo>', 'Custo do recurso (R$)', parseFloat)
  .option('-r, --reversao <probabilidade>', 'Probabilidade de reversão (0-1)', parseFloat)
  .option('-o, --output <arquivo>', 'Salvar relatório em arquivo')
  .option('-f, --format <formato>', 'Formato do relatório (txt, json, html)', 'txt')
  .action(analyzeAppeal);

// Comando: Análise Customizada
program
  .command('custom')
  .alias('personalizado')
  .description('Analisar caso customizado')
  .option('-i, --input <arquivo>', 'Arquivo JSON com configuração do jogo')
  .option('-o, --output <arquivo>', 'Salvar relatório em arquivo')
  .option('-f, --format <formato>', 'Formato do relatório (txt, json, html)', 'txt')
  .action(analyzeCustom);

// Comando: Modo Interativo
program
  .command('interactive')
  .alias('i')
  .description('Modo interativo com assistente')
  .action(interactiveMode);

// Comando: Gerar Relatório
program
  .command('report')
  .alias('relatorio')
  .description('Gerar relatório de processo do SIICAF')
  .requiredOption('-p, --processo <numero>', 'Número do processo')
  .option('-t, --tipo <tipo>', 'Tipo de análise (settlement, plea-bargain, appeal, custom)')
  .option('-o, --output <arquivo>', 'Salvar relatório em arquivo')
  .option('-f, --format <formato>', 'Formato do relatório (txt, json, html, pdf)', 'txt')
  .action(generateReport);

// Comando: Batch Processing
program
  .command('batch')
  .alias('lote')
  .description('Processar múltiplos casos em lote')
  .requiredOption('-i, --input <arquivo>', 'Arquivo CSV ou JSON com casos')
  .option('-o, --output <diretorio>', 'Diretório para salvar relatórios', './reports')
  .action(async (options) => {
    console.log('Processamento em lote:', options);
    // TODO: Implementar batch processing
  });

// Parse dos argumentos
program.parse(process.argv);

// Se nenhum comando foi fornecido, mostrar help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
