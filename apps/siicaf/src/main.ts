#!/usr/bin/env node
/**
 * SIICAF - Sistema de Inteligência e Investigação de Condutas Antijurídicas e Fraudes
 * Análise CUI BONO integrada ao código fonte
 *
 * Uso:
 *   node main.js --analyze --processo <numero> --tribunal <sigla> --estado <uf>
 *   node main.js --report --id <relatorio-id>
 *   powershell -File siicaf-cui-bono.ps1 -Processo "XXXXX" -Tribunal "TJ-GO" -Estado "GO"
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { ProcessoInvestigado, MovimentacaoProcessual, ConfiguracaoAnalise } from './types';
import { ViolationDetector } from './modules/violation-detector';
import { CuiBonoAnalyzer } from './modules/cui-bono-analyzer';
import { TransparencyAPI } from './modules/transparency-api';
import { ReportGenerator } from './modules/report-generator';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

class SIICAFEngine {
  private violationDetector: ViolationDetector;
  private cuiBonoAnalyzer: CuiBonoAnalyzer;
  private transparencyAPI: TransparencyAPI;
  private reportGenerator: ReportGenerator;

  constructor() {
    this.violationDetector = new ViolationDetector();
    this.cuiBonoAnalyzer = new CuiBonoAnalyzer();
    this.transparencyAPI = new TransparencyAPI();
    this.reportGenerator = new ReportGenerator();
  }

  /**
   * Executa análise completa de um processo
   */
  public async analisarProcesso(
    numeroProcesso: string,
    tribunal: string,
    estado: string,
    config?: ConfiguracaoAnalise
  ): Promise<void> {
    console.log(chalk.blue.bold('\n╔═══════════════════════════════════════════════════════════╗'));
    console.log(chalk.blue.bold('║  SIICAF - ANÁLISE CUI BONO                                ║'));
    console.log(chalk.blue.bold('║  Sistema de Inteligência e Investigação                   ║'));
    console.log(chalk.blue.bold('║  de Condutas Antijurídicas e Fraudes                      ║'));
    console.log(chalk.blue.bold('╚═══════════════════════════════════════════════════════════╝\n'));

    try {
      // Carrega dados do processo
      console.log(chalk.yellow('⚙️  Carregando dados do processo...'));
      const processo = await this.carregarProcesso(numeroProcesso, tribunal, estado);

      // Detecta violações
      console.log(chalk.yellow('\n🔍 Detectando violações processuais...'));
      const violacoes = await this.violationDetector.detectarViolacoes(processo);
      processo.violacoesDetectadas = violacoes;

      console.log(chalk.green(`✓ ${violacoes.length} violações detectadas`));

      // Análise Cui Bono
      console.log(chalk.yellow('\n💰 Executando análise CUI BONO...'));
      const cuiBono = await this.cuiBonoAnalyzer.analisarProcesso(processo);

      console.log(chalk.green(`✓ ${cuiBono.beneficiarios.length} beneficiários identificados`));
      console.log(chalk.green(`✓ Score: ${cuiBono.score}/100`));

      // Obtém dados de gastos
      console.log(chalk.yellow('\n📊 Obtendo dados de gastos do Judiciário...'));
      const gastosTJGO = await this.transparencyAPI.obterGastosCNJ('TJ-GO', 'GO', 2024);
      const gastosEstado = await this.transparencyAPI.obterGastosCNJ(tribunal, estado, 2024);

      // Compara gastos
      const comparacoes = [];
      if (gastosTJGO && gastosEstado && tribunal !== 'TJ-GO') {
        const comparacao = this.transparencyAPI.compararGastos(gastosTJGO, gastosEstado);
        comparacoes.push(comparacao);
        console.log(chalk.green(`✓ Comparação de gastos realizada`));
      }

      // Busca gastos de outros tribunais para comparação
      const tribunaisComparacao = [
        { tribunal: 'TJ-SP', estado: 'SP' },
        { tribunal: 'TJ-RJ', estado: 'RJ' },
        { tribunal: 'TJ-MG', estado: 'MG' },
        { tribunal: 'TJ-DF', estado: 'DF' }
      ].filter(t => t.tribunal !== tribunal);

      if (gastosTJGO) {
        for (const { tribunal: trib, estado: est } of tribunaisComparacao.slice(0, 3)) {
          const gastos = await this.transparencyAPI.obterGastosCNJ(trib, est, 2024);
          if (gastos) {
            comparacoes.push(this.transparencyAPI.compararGastos(gastosTJGO, gastos));
          }
        }
      }

      // Gera relatório
      console.log(chalk.yellow('\n📄 Gerando relatório completo...'));
      const relatorio = this.reportGenerator.gerarRelatorioCompleto(
        processo,
        violacoes,
        cuiBono,
        comparacoes
      );

      // Salva relatório
      const dataHora = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const nomeArquivo = `SIICAF_${numeroProcesso.replace(/\D/g, '')}_${dataHora}`;
      const diretorioSaida = path.join(process.cwd(), 'relatorios-siicaf');

      if (!fs.existsSync(diretorioSaida)) {
        fs.mkdirSync(diretorioSaida, { recursive: true });
      }

      // Exporta relatórios
      const caminhoHTML = path.join(diretorioSaida, `${nomeArquivo}.html`);
      const caminhoJSON = path.join(diretorioSaida, `${nomeArquivo}.json`);
      const caminhoTXT = path.join(diretorioSaida, `${nomeArquivo}.txt`);

      this.reportGenerator.exportarHTML(relatorio, caminhoHTML);
      this.reportGenerator.exportarJSON(relatorio, caminhoJSON);
      fs.writeFileSync(caminhoTXT, relatorio.conclusoes, 'utf-8');

      // Exibe resumo
      console.log(chalk.green.bold('\n✅ ANÁLISE CONCLUÍDA COM SUCESSO!\n'));
      console.log(chalk.cyan('═══════════════════════════════════════════════════════'));
      console.log(chalk.white(relatorio.conclusoes));
      console.log(chalk.cyan('═══════════════════════════════════════════════════════\n'));

      console.log(chalk.yellow('📁 Relatórios gerados:'));
      console.log(chalk.white(`   • HTML: ${caminhoHTML}`));
      console.log(chalk.white(`   • JSON: ${caminhoJSON}`));
      console.log(chalk.white(`   • TXT:  ${caminhoTXT}\n`));

      console.log(chalk.yellow('📋 Recomendações:'));
      relatorio.recomendacoes.forEach(rec => {
        console.log(chalk.white(`   ${rec}`));
      });
      console.log('');

      // Exibe score com cor
      this.exibirScore(cuiBono.score);

    } catch (error: any) {
      console.error(chalk.red.bold('\n❌ ERRO NA ANÁLISE:'), error.message);
      process.exit(1);
    }
  }

  /**
   * Carrega dados do processo (simulado - em produção viria de API/banco)
   */
  private async carregarProcesso(
    numero: string,
    tribunal: string,
    estado: string
  ): Promise<ProcessoInvestigado> {
    // Em produção, isso consultaria uma API real ou banco de dados
    // Para demonstração, retorna dados simulados

    const movimentacoes: MovimentacaoProcessual[] = [
      {
        data: new Date('2023-01-15'),
        tipo: 'Distribuição',
        descricao: 'Processo distribuído para a 1ª Vara Cível',
        responsavel: 'Sistema'
      },
      {
        data: new Date('2023-02-10'),
        tipo: 'Despacho',
        descricao: 'Cite-se',
        responsavel: 'Juiz Dr. João Silva'
      },
      {
        data: new Date('2023-03-05'),
        tipo: 'Decisão Interlocutória',
        descricao: 'Defiro liminar',
        responsavel: 'Juiz Dr. João Silva'
      },
      {
        data: new Date('2023-04-20'),
        tipo: 'Sentença',
        descricao: 'Julgo procedente',
        responsavel: 'Juiz Dr. João Silva'
      },
      {
        data: new Date('2023-05-15'),
        tipo: 'Apelação',
        descricao: 'Apela da decisão interlocutória',
        responsavel: 'Advogado Dr. Pedro Santos'
      },
      {
        data: new Date('2023-07-10'),
        tipo: 'Acórdão',
        descricao: 'Negado provimento',
        responsavel: 'Desembargador Dr. Carlos Oliveira'
      }
    ];

    return {
      numero,
      tribunal,
      estado,
      comarca: 'Goiânia',
      instancia: 'SEGUNDA',
      dataDistribuicao: new Date('2023-01-15'),
      valor: 500000,
      partes: {
        autor: 'João da Silva',
        reu: 'Empresa XYZ Ltda',
        advogados: ['Dr. Pedro Santos', 'Dra. Maria Oliveira'],
        juiz: 'Juiz Dr. João Silva',
        promotor: 'Dr. Roberto Almeida'
      },
      movimentacoes,
      violacoesDetectadas: [],
      custoEstimado: 25000
    };
  }

  /**
   * Exibe score com cores
   */
  private exibirScore(score: number): void {
    console.log(chalk.cyan('═══════════════════════════════════════════════════════'));
    console.log(chalk.white.bold('SCORE CUI BONO:'));

    let cor = chalk.green;
    let nivel = 'BAIXO';

    if (score >= 80) {
      cor = chalk.red.bold;
      nivel = 'CRÍTICO';
    } else if (score >= 60) {
      cor = chalk.red;
      nivel = 'ALTO';
    } else if (score >= 40) {
      cor = chalk.yellow;
      nivel = 'MÉDIO';
    }

    const barra = '█'.repeat(Math.floor(score / 5));
    console.log(cor(`\n   ${barra} ${score}/100 - RISCO ${nivel}\n`));
    console.log(chalk.cyan('═══════════════════════════════════════════════════════\n'));
  }
}

// CLI
program
  .name('siicaf')
  .description('SIICAF - Sistema de Inteligência e Investigação de Condutas Antijurídicas e Fraudes')
  .version('1.0.0');

program
  .command('analyze')
  .description('Analisa um processo judicial com Cui Bono')
  .requiredOption('-p, --processo <numero>', 'Número do processo')
  .requiredOption('-t, --tribunal <sigla>', 'Tribunal (ex: TJ-GO)')
  .requiredOption('-e, --estado <uf>', 'Estado (ex: GO)')
  .action(async (options) => {
    const engine = new SIICAFEngine();
    await engine.analisarProcesso(options.processo, options.tribunal, options.estado);
  });

program
  .command('demo')
  .description('Executa análise de demonstração')
  .action(async () => {
    console.log(chalk.blue('\n🔍 Executando análise de demonstração...\n'));
    const engine = new SIICAFEngine();
    await engine.analisarProcesso('0123456-78.2023.8.09.0051', 'TJ-GO', 'GO');
  });

// Executa CLI
if (require.main === module) {
  program.parse(process.argv);

  // Se nenhum comando foi fornecido, executa demo
  if (!process.argv.slice(2).length) {
    console.log(chalk.yellow('ℹ️  Nenhum comando fornecido. Executando demonstração...\n'));
    const engine = new SIICAFEngine();
    engine.analisarProcesso('0123456-78.2023.8.09.0051', 'TJ-GO', 'GO').catch(console.error);
  }
}

export { SIICAFEngine };
