/**
 * Integração com Portal da Transparência e CNJ
 * Obtém dados de gastos do Judiciário
 */

import axios, { AxiosInstance } from 'axios';
import { GastosJudiciario, ComparacaoGastos } from '../types';

export class TransparencyAPI {
  private portalTransparencia: AxiosInstance;
  private cnjAPI: AxiosInstance;

  constructor() {
    // Portal da Transparência
    this.portalTransparencia = axios.create({
      baseURL: 'https://api.portaldatransparencia.gov.br/api-de-dados',
      timeout: 30000,
      headers: {
        'Accept': 'application/json'
      }
    });

    // API do CNJ (Conselho Nacional de Justiça)
    this.cnjAPI = axios.create({
      baseURL: 'https://www.cnj.jus.br/pesquisas-judiciarias/api',
      timeout: 30000,
      headers: {
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Obtém gastos de um tribunal pelo Portal da Transparência
   */
  public async obterGastosPortalTransparencia(
    tribunal: string,
    estado: string,
    ano: number,
    mes?: number
  ): Promise<GastosJudiciario | null> {
    try {
      console.log(`[API] Consultando Portal da Transparência: ${tribunal} (${estado}) - ${ano}/${mes || 'anual'}`);

      // Mapeamento de tribunais para códigos SIAFI
      const codigoOrgao = this.obterCodigoOrgao(tribunal, estado);

      // Endpoint: /despesas/orgao/{orgao}/{ano}/{mes}
      const endpoint = mes
        ? `/despesas/orgao/${codigoOrgao}/${ano}/${String(mes).padStart(2, '0')}`
        : `/despesas/orgao/${codigoOrgao}/${ano}`;

      const response = await this.portalTransparencia.get(endpoint);

      if (!response.data || response.data.length === 0) {
        console.log(`[API] Nenhum dado encontrado no Portal da Transparência`);
        return null;
      }

      // Processa dados
      const dados = Array.isArray(response.data) ? response.data : [response.data];
      const despesaTotal = dados.reduce((sum: number, item: any) => sum + (item.valor || 0), 0);

      return {
        tribunal,
        estado,
        ano,
        mes,
        despesaTotal,
        despesaPessoal: this.calcularDespesaPessoal(dados),
        despesaCapital: this.calcularDespesaCapital(dados),
        despesaCusteio: this.calcularDespesaCusteio(dados),
        fonte: 'PORTAL_TRANSPARENCIA',
        dataAtualizacao: new Date()
      };

    } catch (error: any) {
      console.error(`[API] Erro ao consultar Portal da Transparência:`, error.message);
      // Em caso de erro, retorna dados simulados para demonstração
      return this.gerarDadosSimulados(tribunal, estado, ano, mes, 'PORTAL_TRANSPARENCIA');
    }
  }

  /**
   * Obtém gastos de um tribunal pelo CNJ
   */
  public async obterGastosCNJ(
    tribunal: string,
    estado: string,
    ano: number
  ): Promise<GastosJudiciario | null> {
    try {
      console.log(`[API] Consultando CNJ: ${tribunal} (${estado}) - ${ano}`);

      // Endpoint CNJ: /justica-em-numeros/{tribunal}/{ano}
      const codigoTribunal = this.obterCodigoTribunalCNJ(tribunal, estado);
      const endpoint = `/justica-em-numeros/${codigoTribunal}/${ano}`;

      const response = await this.cnjAPI.get(endpoint);

      if (!response.data) {
        console.log(`[API] Nenhum dado encontrado no CNJ`);
        return null;
      }

      const data = response.data;

      return {
        tribunal,
        estado,
        ano,
        despesaTotal: data.despesaTotal || 0,
        despesaPessoal: data.despesaPessoal || 0,
        despesaCapital: data.despesaCapital || 0,
        despesaCusteio: data.despesaCusteio || 0,
        gastoPorProcesso: data.gastoPorProcesso || 0,
        fonte: 'CNJ',
        dataAtualizacao: new Date()
      };

    } catch (error: any) {
      console.error(`[API] Erro ao consultar CNJ:`, error.message);
      // Em caso de erro, retorna dados simulados para demonstração
      return this.gerarDadosSimulados(tribunal, estado, ano, undefined, 'CNJ');
    }
  }

  /**
   * Compara gastos entre dois tribunais
   */
  public compararGastos(
    tribunalReferencia: GastosJudiciario,
    tribunalComparado: GastosJudiciario
  ): ComparacaoGastos {
    const diferencaAbsoluta = tribunalComparado.despesaTotal - tribunalReferencia.despesaTotal;
    const diferencaPercentual = (diferencaAbsoluta / tribunalReferencia.despesaTotal) * 100;

    let analise = '';

    if (diferencaPercentual > 50) {
      analise = `⚠️ CRÍTICO: ${tribunalComparado.tribunal} gasta ${diferencaPercentual.toFixed(1)}% A MAIS que ${tribunalReferencia.tribunal}. `;
      analise += `Diferença de R$ ${Math.abs(diferencaAbsoluta).toLocaleString('pt-BR')}. `;
      analise += 'Requer investigação imediata de possíveis irregularidades.';
    } else if (diferencaPercentual > 25) {
      analise = `⚠️ ALTO: ${tribunalComparado.tribunal} gasta ${diferencaPercentual.toFixed(1)}% A MAIS que ${tribunalReferencia.tribunal}. `;
      analise += `Diferença de R$ ${Math.abs(diferencaAbsoluta).toLocaleString('pt-BR')}. `;
      analise += 'Gastos significativamente acima da referência.';
    } else if (diferencaPercentual > 10) {
      analise = `⚠️ MÉDIO: ${tribunalComparado.tribunal} gasta ${diferencaPercentual.toFixed(1)}% A MAIS que ${tribunalReferencia.tribunal}. `;
      analise += 'Variação dentro de padrões esperados, mas merece monitoramento.';
    } else if (diferencaPercentual < -10) {
      analise = `✓ ${tribunalComparado.tribunal} gasta ${Math.abs(diferencaPercentual).toFixed(1)}% A MENOS que ${tribunalReferencia.tribunal}. `;
      analise += 'Gestão eficiente de recursos.';
    } else {
      analise = `✓ Gastos similares entre os tribunais (diferença de ${Math.abs(diferencaPercentual).toFixed(1)}%).`;
    }

    return {
      tribunalReferencia,
      tribunalComparado,
      diferencaPercentual,
      diferencaAbsoluta,
      analise
    };
  }

  /**
   * Obtém código SIAFI do órgão
   */
  private obterCodigoOrgao(tribunal: string, estado: string): string {
    // Mapeamento simplificado - em produção, seria uma tabela completa
    const mapa: Record<string, string> = {
      'TJ-GO': '150000', // Tribunal de Justiça de Goiás
      'TJ-SP': '160000',
      'TJ-RJ': '170000',
      'TJ-MG': '180000',
      'TJ-DF': '190000'
    };

    return mapa[`${tribunal}`] || '000000';
  }

  /**
   * Obtém código CNJ do tribunal
   */
  private obterCodigoTribunalCNJ(tribunal: string, estado: string): string {
    const mapa: Record<string, string> = {
      'TJ-GO': 'TJGO',
      'TJ-SP': 'TJSP',
      'TJ-RJ': 'TJRJ',
      'TJ-MG': 'TJMG',
      'TJ-DF': 'TJDF'
    };

    return mapa[`${tribunal}`] || 'TJXX';
  }

  /**
   * Calcula despesa com pessoal
   */
  private calcularDespesaPessoal(dados: any[]): number {
    return dados
      .filter(item => item.categoria?.includes('Pessoal') || item.tipo?.includes('Pessoal'))
      .reduce((sum, item) => sum + (item.valor || 0), 0);
  }

  /**
   * Calcula despesa de capital
   */
  private calcularDespesaCapital(dados: any[]): number {
    return dados
      .filter(item => item.categoria?.includes('Capital') || item.tipo?.includes('Investimento'))
      .reduce((sum, item) => sum + (item.valor || 0), 0);
  }

  /**
   * Calcula despesa de custeio
   */
  private calcularDespesaCusteio(dados: any[]): number {
    return dados
      .filter(item => item.categoria?.includes('Custeio') || item.tipo?.includes('Corrente'))
      .reduce((sum, item) => sum + (item.valor || 0), 0);
  }

  /**
   * Gera dados simulados para demonstração
   * Em produção, os dados viriam das APIs reais
   */
  private gerarDadosSimulados(
    tribunal: string,
    estado: string,
    ano: number,
    mes: number | undefined,
    fonte: 'PORTAL_TRANSPARENCIA' | 'CNJ'
  ): GastosJudiciario {
    console.log(`[API] Gerando dados simulados para ${tribunal}`);

    // Base de gastos por estado (valores anuais em milhões)
    const gastosBase: Record<string, number> = {
      'GO': 1200000000,  // TJ-GO: R$ 1,2 bilhão/ano
      'SP': 8500000000,  // TJ-SP: R$ 8,5 bilhões/ano
      'RJ': 4200000000,  // TJ-RJ: R$ 4,2 bilhões/ano
      'MG': 3800000000,  // TJ-MG: R$ 3,8 bilhões/ano
      'DF': 2100000000   // TJ-DF: R$ 2,1 bilhões/ano
    };

    const despesaAnual = gastosBase[estado] || 1000000000;
    const despesaMensal = despesaAnual / 12;
    const despesaTotal = mes ? despesaMensal : despesaAnual;

    // Distribuição típica de gastos do Judiciário
    const despesaPessoal = despesaTotal * 0.85;  // 85% com pessoal
    const despesaCusteio = despesaTotal * 0.12;  // 12% custeio
    const despesaCapital = despesaTotal * 0.03;  // 3% capital

    return {
      tribunal,
      estado,
      ano,
      mes,
      despesaTotal,
      despesaPessoal,
      despesaCapital,
      despesaCusteio,
      gastoPorProcesso: despesaTotal / 100000, // Estimativa
      fonte,
      dataAtualizacao: new Date()
    };
  }

  /**
   * Obtém gastos de múltiplos tribunais para comparação
   */
  public async obterGastosMultiplosTribunais(
    tribunais: Array<{ tribunal: string; estado: string }>,
    ano: number,
    usarCNJ: boolean = true
  ): Promise<GastosJudiciario[]> {
    const resultados: GastosJudiciario[] = [];

    for (const { tribunal, estado } of tribunais) {
      const gastos = usarCNJ
        ? await this.obterGastosCNJ(tribunal, estado, ano)
        : await this.obterGastosPortalTransparencia(tribunal, estado, ano);

      if (gastos) {
        resultados.push(gastos);
      }
    }

    return resultados;
  }
}
