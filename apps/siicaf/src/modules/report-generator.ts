/**
 * Gerador de Relatórios com Visualizações
 * Cria relatórios completos com gráficos, tabelas e organogramas
 */

import {
  ProcessoInvestigado,
  RelatorioAnalise,
  Grafico,
  Tabela,
  ComparacaoGastos,
  ViolacaoDetectada,
  AnaliseCuiBono,
  GravidadeViolacao,
  CORES_GRAVIDADE
} from '../types';
import { nanoid } from 'nanoid';
import * as fs from 'fs';
import * as path from 'path';

export class ReportGenerator {
  /**
   * Gera relatório completo de análise
   */
  public gerarRelatorioCompleto(
    processo: ProcessoInvestigado,
    violacoes: ViolacaoDetectada[],
    cuiBono: AnaliseCuiBono,
    comparacoesGastos: ComparacaoGastos[]
  ): RelatorioAnalise {
    console.log(`[RELATORIO] Gerando relatório para processo ${processo.numero}...`);

    const graficos = this.gerarGraficos(processo, violacoes, cuiBono, comparacoesGastos);
    const tabelas = this.gerarTabelas(processo, violacoes, cuiBono, comparacoesGastos);
    const organograma = this.gerarOrganograma(cuiBono);
    const conclusoes = this.gerarConclusoes(processo, violacoes, cuiBono, comparacoesGastos);
    const recomendacoes = this.gerarRecomendacoes(violacoes, cuiBono);

    return {
      id: nanoid(),
      dataGeracao: new Date(),
      processo,
      violacoes,
      analiseCuiBono: cuiBono,
      comparacaoGastos: comparacoesGastos,
      organograma,
      graficos,
      tabelas,
      conclusoes,
      recomendacoes
    };
  }

  /**
   * Gera gráficos para visualização
   */
  private gerarGraficos(
    processo: ProcessoInvestigado,
    violacoes: ViolacaoDetectada[],
    cuiBono: AnaliseCuiBono,
    comparacoesGastos: ComparacaoGastos[]
  ): Grafico[] {
    const graficos: Grafico[] = [];

    // Gráfico 1: Violações por Gravidade
    graficos.push(this.graficoViolacoesPorGravidade(violacoes));

    // Gráfico 2: Beneficiários por Valor
    graficos.push(this.graficoBeneficiarios(cuiBono));

    // Gráfico 3: Comparação de Gastos
    if (comparacoesGastos.length > 0) {
      graficos.push(this.graficoComparacaoGastos(comparacoesGastos));
    }

    // Gráfico 4: Timeline de Violações
    graficos.push(this.graficoTimelineViolacoes(violacoes));

    // Gráfico 5: Rede de Relacionamentos
    graficos.push(this.graficoRedeRelacionamentos(cuiBono));

    return graficos;
  }

  /**
   * Gráfico de violações por gravidade
   */
  private graficoViolacoesPorGravidade(violacoes: ViolacaoDetectada[]): Grafico {
    const contagem: Record<number, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
    };

    violacoes.forEach(v => {
      contagem[v.gravidade]++;
    });

    const labels = [
      'Muito Baixa',
      'Baixa',
      'Média',
      'Alta',
      'Muito Alta',
      'Crítica'
    ];

    const cores = Object.keys(CORES_GRAVIDADE).map(k => CORES_GRAVIDADE[parseInt(k) as GravidadeViolacao]);

    return {
      tipo: 'BARRA',
      titulo: 'Violações por Nível de Gravidade',
      dados: {
        labels,
        datasets: [{
          label: 'Número de Violações',
          data: Object.values(contagem),
          backgroundColor: cores,
          borderColor: cores.map(c => c.replace('0.8', '1')),
          borderWidth: 2
        }]
      },
      configuracao: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Distribuição de Violações por Gravidade'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantidade'
            }
          }
        }
      }
    };
  }

  /**
   * Gráfico de beneficiários
   */
  private graficoBeneficiarios(cuiBono: AnaliseCuiBono): Grafico {
    const top5 = cuiBono.beneficiarios.slice(0, 5);

    return {
      tipo: 'PIZZA',
      titulo: 'Top 5 Beneficiários por Valor',
      dados: {
        labels: top5.map(b => b.nome),
        datasets: [{
          data: top5.map(b => b.beneficioEstimado),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }]
      },
      configuracao: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: {
            display: true,
            text: 'Distribuição de Benefícios Estimados'
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: R$ ${value.toLocaleString('pt-BR')}`;
              }
            }
          }
        }
      }
    };
  }

  /**
   * Gráfico de comparação de gastos
   */
  private graficoComparacaoGastos(comparacoes: ComparacaoGastos[]): Grafico {
    const labels = comparacoes.map(c => c.tribunalComparado.tribunal);
    const gastos = comparacoes.map(c => c.tribunalComparado.despesaTotal);
    const referencia = comparacoes[0].tribunalReferencia.despesaTotal;

    // Cores baseadas na diferença percentual
    const cores = comparacoes.map(c => {
      if (c.diferencaPercentual > 50) return '#DC3545'; // Vermelho
      if (c.diferencaPercentual > 25) return '#FD7E14'; // Laranja
      if (c.diferencaPercentual > 10) return '#FFC107'; // Amarelo
      return '#28A745'; // Verde
    });

    return {
      tipo: 'BARRA',
      titulo: 'Comparação de Gastos entre Tribunais',
      dados: {
        labels,
        datasets: [
          {
            label: 'Gasto Total',
            data: gastos,
            backgroundColor: cores,
            borderColor: cores,
            borderWidth: 2
          },
          {
            label: `Referência (${comparacoes[0].tribunalReferencia.tribunal})`,
            data: Array(gastos.length).fill(referencia),
            type: 'line',
            borderColor: '#000000',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false
          }
        ]
      },
      configuracao: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Comparativo de Despesas Totais'
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const value = context.parsed.y || 0;
                return `${context.dataset.label}: R$ ${value.toLocaleString('pt-BR')}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Valor (R$)'
            },
            ticks: {
              callback: function(value: any) {
                return 'R$ ' + (value / 1000000).toFixed(1) + 'M';
              }
            }
          }
        }
      }
    };
  }

  /**
   * Gráfico timeline de violações
   */
  private graficoTimelineViolacoes(violacoes: ViolacaoDetectada[]): Grafico {
    // Agrupa violações por mês
    const porMes: Record<string, number> = {};

    violacoes.forEach(v => {
      const mes = v.dataDeteccao.toISOString().substring(0, 7);
      porMes[mes] = (porMes[mes] || 0) + 1;
    });

    const meses = Object.keys(porMes).sort();
    const contagens = meses.map(m => porMes[m]);

    return {
      tipo: 'LINHA',
      titulo: 'Timeline de Detecção de Violações',
      dados: {
        labels: meses,
        datasets: [{
          label: 'Violações Detectadas',
          data: contagens,
          borderColor: '#DC3545',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      configuracao: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: {
            display: true,
            text: 'Evolução Temporal das Violações'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantidade'
            }
          }
        }
      }
    };
  }

  /**
   * Gráfico de rede de relacionamentos
   */
  private graficoRedeRelacionamentos(cuiBono: AnaliseCuiBono): Grafico {
    return {
      tipo: 'REDE',
      titulo: 'Rede de Relacionamentos - Análise Cui Bono',
      dados: cuiBono.rede,
      configuracao: {
        layout: 'force-directed',
        nodeSize: 'beneficio',
        edgeWidth: 'forca',
        colorScheme: 'category10'
      }
    };
  }

  /**
   * Gera tabelas para o relatório
   */
  private gerarTabelas(
    processo: ProcessoInvestigado,
    violacoes: ViolacaoDetectada[],
    cuiBono: AnaliseCuiBono,
    comparacoesGastos: ComparacaoGastos[]
  ): Tabela[] {
    const tabelas: Tabela[] = [];

    // Tabela 1: Resumo de Violações
    tabelas.push(this.tabelaResumoViolacoes(violacoes));

    // Tabela 2: Beneficiários
    tabelas.push(this.tabelaBeneficiarios(cuiBono));

    // Tabela 3: Comparação de Gastos
    if (comparacoesGastos.length > 0) {
      tabelas.push(this.tabelaComparacaoGastos(comparacoesGastos));
    }

    // Tabela 4: Códigos de Ética Violados
    tabelas.push(this.tabelaCodigosEtica(violacoes));

    return tabelas;
  }

  /**
   * Tabela resumo de violações
   */
  private tabelaResumoViolacoes(violacoes: ViolacaoDetectada[]): Tabela {
    const colunas = ['ID', 'Tipo', 'Gravidade', 'Responsável', 'Custo Estimado', 'Status'];
    const linhas = violacoes.map(v => [
      v.id.substring(0, 8),
      v.tipo.replace(/_/g, ' '),
      this.obterTextoGravidade(v.gravidade),
      v.responsavel || 'N/A',
      v.custoEstimado ? `R$ ${v.custoEstimado.toLocaleString('pt-BR')}` : 'N/A',
      '🔍 Em Análise'
    ]);

    return {
      titulo: 'Resumo de Violações Detectadas',
      colunas,
      linhas,
      formatacao: {
        coresGravidade: true,
        ordenacao: 'gravidade'
      }
    };
  }

  /**
   * Tabela de beneficiários
   */
  private tabelaBeneficiarios(cuiBono: AnaliseCuiBono): Tabela {
    const colunas = ['Nome', 'Tipo', 'Cargo', 'Benefício Estimado', 'Relacionamentos'];
    const linhas = cuiBono.beneficiarios.map(b => [
      b.nome,
      b.tipo.replace(/_/g, ' '),
      b.cargo || 'N/A',
      `R$ ${b.beneficioEstimado.toLocaleString('pt-BR')}`,
      b.relacionamentos.slice(0, 2).join(', ')
    ]);

    return {
      titulo: 'Beneficiários Identificados (Análise Cui Bono)',
      colunas,
      linhas
    };
  }

  /**
   * Tabela de comparação de gastos
   */
  private tabelaComparacaoGastos(comparacoes: ComparacaoGastos[]): Tabela {
    const colunas = ['Tribunal', 'Despesa Total', 'Dif. % vs TJ-GO', 'Dif. Absoluta', 'Análise'];
    const linhas = comparacoes.map(c => [
      c.tribunalComparado.tribunal,
      `R$ ${c.tribunalComparado.despesaTotal.toLocaleString('pt-BR')}`,
      `${c.diferencaPercentual > 0 ? '+' : ''}${c.diferencaPercentual.toFixed(1)}%`,
      `R$ ${Math.abs(c.diferencaAbsoluta).toLocaleString('pt-BR')}`,
      c.analise.substring(0, 50) + '...'
    ]);

    return {
      titulo: 'Comparação de Gastos: TJ-GO vs Outros Tribunais',
      colunas,
      linhas,
      formatacao: {
        coresGravidade: true
      }
    };
  }

  /**
   * Tabela de códigos de ética violados
   */
  private tabelaCodigosEtica(violacoes: ViolacaoDetectada[]): Tabela {
    const codigosUnicos = new Map<string, any>();

    violacoes.forEach(v => {
      v.codigosEticaViolados.forEach(codigo => {
        if (!codigosUnicos.has(codigo.codigo)) {
          codigosUnicos.set(codigo.codigo, codigo);
        }
      });
    });

    const colunas = ['Código', 'Órgão', 'Artigo', 'Descrição', 'Penalidade'];
    const linhas = Array.from(codigosUnicos.values()).map(c => [
      c.codigo,
      c.orgao,
      c.artigo,
      c.descricao.substring(0, 80) + '...',
      c.penalidadePrevista
    ]);

    return {
      titulo: 'Códigos de Ética Violados',
      colunas,
      linhas
    };
  }

  /**
   * Gera organograma de relacionamentos
   */
  private gerarOrganograma(cuiBono: AnaliseCuiBono): any {
    return {
      name: 'Análise Cui Bono',
      children: cuiBono.beneficiarios.slice(0, 5).map(b => ({
        name: b.nome,
        value: b.beneficioEstimado,
        children: b.relacionamentos.map(r => ({
          name: r,
          value: b.beneficioEstimado / b.relacionamentos.length
        }))
      }))
    };
  }

  /**
   * Gera conclusões do relatório
   */
  private gerarConclusoes(
    processo: ProcessoInvestigado,
    violacoes: ViolacaoDetectada[],
    cuiBono: AnaliseCuiBono,
    comparacoesGastos: ComparacaoGastos[]
  ): string {
    const conclusoes: string[] = [];

    conclusoes.push('═══════════════════════════════════════════════════');
    conclusoes.push('   CONCLUSÕES DA ANÁLISE SIICAF - CUI BONO');
    conclusoes.push('═══════════════════════════════════════════════════\n');

    conclusoes.push(`Processo: ${processo.numero}`);
    conclusoes.push(`Tribunal: ${processo.tribunal} - ${processo.estado}`);
    conclusoes.push(`Data da Análise: ${new Date().toLocaleDateString('pt-BR')}\n`);

    conclusoes.push('1. RESUMO EXECUTIVO:');
    conclusoes.push(`   • Total de Violações: ${violacoes.length}`);
    conclusoes.push(`   • Violações Críticas: ${violacoes.filter(v => v.gravidade === GravidadeViolacao.CRITICA).length}`);
    conclusoes.push(`   • Beneficiários Identificados: ${cuiBono.beneficiarios.length}`);
    conclusoes.push(`   • Score Cui Bono: ${cuiBono.score}/100`);
    conclusoes.push(`   • Valor Total em Jogo: R$ ${cuiBono.valorBeneficio.toLocaleString('pt-BR')}\n`);

    conclusoes.push('2. ANÁLISE DE GASTOS:');
    if (comparacoesGastos.length > 0) {
      const mediaExcesso = comparacoesGastos.reduce((sum, c) => sum + c.diferencaPercentual, 0) / comparacoesGastos.length;
      conclusoes.push(`   • Média de Excesso vs TJ-GO: ${mediaExcesso.toFixed(1)}%`);
      const maisExcesso = comparacoesGastos.sort((a, b) => b.diferencaPercentual - a.diferencaPercentual)[0];
      conclusoes.push(`   • Maior Excesso: ${maisExcesso.tribunalComparado.tribunal} (+${maisExcesso.diferencaPercentual.toFixed(1)}%)\n`);
    }

    conclusoes.push('3. AVALIAÇÃO DE RISCO:');
    const nivelRisco = this.calcularNivelRisco(violacoes, cuiBono);
    conclusoes.push(`   ${nivelRisco}\n`);

    conclusoes.push('4. PRINCIPAIS ACHADOS:');
    violacoes.slice(0, 3).forEach((v, idx) => {
      conclusoes.push(`   ${idx + 1}. ${v.descricao}`);
    });

    return conclusoes.join('\n');
  }

  /**
   * Gera recomendações
   */
  private gerarRecomendacoes(violacoes: ViolacaoDetectada[], cuiBono: AnaliseCuiBono): string[] {
    const recomendacoes: string[] = [];

    if (violacoes.some(v => v.gravidade >= GravidadeViolacao.CRITICA)) {
      recomendacoes.push('🚨 URGENTE: Encaminhar imediatamente ao Ministério Público para apuração de crimes');
    }

    if (cuiBono.score >= 70) {
      recomendacoes.push('⚠️  Iniciar investigação aprofundada dos beneficiários identificados');
      recomendacoes.push('⚠️  Solicitar quebra de sigilo bancário e fiscal dos envolvidos');
    }

    if (violacoes.some(v => v.tipo === 'CORRUPCAO')) {
      recomendacoes.push('⚠️  Notificar CNJ e órgãos de controle interno');
      recomendacoes.push('⚠️  Avaliar afastamento preventivo dos responsáveis');
    }

    recomendacoes.push('📋 Documentar todas as evidências para eventual ação judicial');
    recomendacoes.push('📋 Manter monitoramento contínuo do processo');
    recomendacoes.push('📋 Realizar auditoria completa dos gastos identificados');

    return recomendacoes;
  }

  /**
   * Calcula nível de risco
   */
  private calcularNivelRisco(violacoes: ViolacaoDetectada[], cuiBono: AnaliseCuiBono): string {
    const score = cuiBono.score;
    const violacoesCriticas = violacoes.filter(v => v.gravidade >= GravidadeViolacao.CRITICA).length;

    if (score >= 80 || violacoesCriticas >= 3) {
      return '🔴 RISCO CRÍTICO - Evidências substanciais de irregularidades graves';
    } else if (score >= 60 || violacoesCriticas >= 1) {
      return '🟠 RISCO ALTO - Múltiplos indicadores de possíveis ilícitos';
    } else if (score >= 40) {
      return '🟡 RISCO MÉDIO - Requer investigação adicional';
    } else {
      return '🟢 RISCO BAIXO - Poucas irregularidades detectadas';
    }
  }

  /**
   * Obtém texto da gravidade
   */
  private obterTextoGravidade(gravidade: GravidadeViolacao): string {
    const textos = {
      [GravidadeViolacao.MUITO_BAIXA]: 'Muito Baixa',
      [GravidadeViolacao.BAIXA]: 'Baixa',
      [GravidadeViolacao.MEDIA]: 'Média',
      [GravidadeViolacao.ALTA]: 'Alta',
      [GravidadeViolacao.MUITO_ALTA]: 'Muito Alta',
      [GravidadeViolacao.CRITICA]: 'CRÍTICA'
    };
    return textos[gravidade];
  }

  /**
   * Exporta relatório para HTML
   */
  public exportarHTML(relatorio: RelatorioAnalise, caminhoSaida: string): void {
    const html = this.gerarHTML(relatorio);
    fs.writeFileSync(caminhoSaida, html, 'utf-8');
    console.log(`[RELATORIO] HTML gerado: ${caminhoSaida}`);
  }

  /**
   * Exporta relatório para JSON
   */
  public exportarJSON(relatorio: RelatorioAnalise, caminhoSaida: string): void {
    fs.writeFileSync(caminhoSaida, JSON.stringify(relatorio, null, 2), 'utf-8');
    console.log(`[RELATORIO] JSON gerado: ${caminhoSaida}`);
  }

  /**
   * Gera HTML do relatório
   */
  private gerarHTML(relatorio: RelatorioAnalise): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório SIICAF - ${relatorio.processo.numero}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; }
        .info-box { background: #ecf0f1; padding: 15px; border-radius: 5px; margin: 15px 0; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #3498db; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        tr:hover { background: #f8f9fa; }
        .grafico { margin: 30px 0; }
        canvas { max-height: 400px; }
        .recomendacao { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
        .conclusao { background: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; margin: 20px 0; white-space: pre-line; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 RELATÓRIO SIICAF - ANÁLISE CUI BONO</h1>

        <div class="info-box">
            <strong>Processo:</strong> ${relatorio.processo.numero}<br>
            <strong>Tribunal:</strong> ${relatorio.processo.tribunal} - ${relatorio.processo.estado}<br>
            <strong>Data:</strong> ${relatorio.dataGeracao.toLocaleDateString('pt-BR')}<br>
            <strong>Score Cui Bono:</strong> ${relatorio.analiseCuiBono.score}/100
        </div>

        <h2>📊 Violações Detectadas</h2>
        <p><strong>Total:</strong> ${relatorio.violacoes.length}</p>

        <h2>💰 Beneficiários Identificados</h2>
        <p><strong>Total:</strong> ${relatorio.analiseCuiBono.beneficiarios.length}</p>
        <p><strong>Valor em jogo:</strong> R$ ${relatorio.analiseCuiBono.valorBeneficio.toLocaleString('pt-BR')}</p>

        <div class="conclusao">
            <h2>📋 Conclusões</h2>
            ${relatorio.conclusoes}
        </div>

        <h2>✅ Recomendações</h2>
        ${relatorio.recomendacoes.map(r => `<div class="recomendacao">${r}</div>`).join('')}
    </div>
</body>
</html>`;
  }
}
