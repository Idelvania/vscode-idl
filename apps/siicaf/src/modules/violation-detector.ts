/**
 * Detector de Violações Processuais e Éticas
 * Identifica irregularidades em processos judiciais
 */

import {
  ProcessoInvestigado,
  ViolacaoDetectada,
  TipoViolacao,
  GravidadeViolacao,
  MovimentacaoProcessual
} from '../types';
import { obterCodigosEtica } from '../data/codigos-etica';
import { nanoid } from 'nanoid';

export class ViolationDetector {
  /**
   * Detecta todas as violações em um processo
   */
  public async detectarViolacoes(processo: ProcessoInvestigado): Promise<ViolacaoDetectada[]> {
    console.log(`[DETECTOR] Iniciando detecção de violações no processo ${processo.numero}...`);

    const violacoes: ViolacaoDetectada[] = [];

    // Detecta violações processuais
    violacoes.push(...this.detectarViolacoesProcessuais(processo));

    // Detecta violações de decisões
    violacoes.push(...this.detectarViolacoesDecisoes(processo));

    // Detecta gastos excessivos
    const violacaoGastos = await this.detectarGastosExcessivos(processo);
    if (violacaoGastos) violacoes.push(violacaoGastos);

    // Detecta possível corrupção
    violacoes.push(...this.detectarIndiciosCorrupcao(processo, violacoes));

    console.log(`[DETECTOR] Detectadas ${violacoes.length} violações`);

    return violacoes;
  }

  /**
   * Detecta violações processuais básicas
   */
  private detectarViolacoesProcessuais(processo: ProcessoInvestigado): ViolacaoDetectada[] {
    const violacoes: ViolacaoDetectada[] = [];

    // Verifica decisões interlocutórias erradas (quando deveria ser apelação)
    const decisoesInterlocutorias = processo.movimentacoes.filter(m =>
      m.tipo.toLowerCase().includes('decisão interlocutória') ||
      m.tipo.toLowerCase().includes('despacho')
    );

    decisoesInterlocutorias.forEach(mov => {
      // Se há sentença posterior, a interlocutória pode ser indevida
      const sentencaPosterior = processo.movimentacoes.find(
        m => m.data > mov.data && (
          m.tipo.toLowerCase().includes('sentença') ||
          m.tipo.toLowerCase().includes('acórdão')
        )
      );

      if (sentencaPosterior && mov.descricao.length < 100) {
        violacoes.push({
          id: nanoid(),
          tipo: TipoViolacao.DECISAO_INTERLOCUTORIA_ERRADA,
          gravidade: GravidadeViolacao.MEDIA,
          descricao: `Decisão interlocutória possivelmente inadequada: ${mov.tipo}`,
          fundamentacao: 'Decisão interlocutória sem fundamentação adequada quando caberia sentença definitiva.',
          codigosEticaViolados: obterCodigosEtica('DECISAO_INTERLOCUTORIA_ERRADA'),
          responsavel: mov.responsavel,
          dataDeteccao: new Date(),
          evidencias: [
            `Movimentação em ${mov.data.toISOString()}`,
            `Tipo: ${mov.tipo}`,
            `Responsável: ${mov.responsavel}`
          ]
        });
      }
    });

    // Verifica apelações indevidas (quando deveria ser decisão interlocutória)
    const apelacoes = processo.movimentacoes.filter(m =>
      m.tipo.toLowerCase().includes('apelação')
    );

    apelacoes.forEach(mov => {
      // Apelação só cabe de sentença, não de decisões interlocutórias
      const decisaoAnterior = processo.movimentacoes
        .filter(m => m.data < mov.data)
        .sort((a, b) => b.data.getTime() - a.data.getTime())[0];

      if (decisaoAnterior &&
          decisaoAnterior.tipo.toLowerCase().includes('despacho') &&
          !decisaoAnterior.tipo.toLowerCase().includes('sentença')) {
        violacoes.push({
          id: nanoid(),
          tipo: TipoViolacao.APELACAO_INDEVIDA,
          gravidade: GravidadeViolacao.ALTA,
          descricao: `Apelação indevida contra decisão interlocutória`,
          fundamentacao: 'Apelação cabível apenas contra sentenças definitivas (Art. 1.009, CPC). Contra decisões interlocutórias cabe Agravo de Instrumento.',
          codigosEticaViolados: obterCodigosEtica('APELACAO_INDEVIDA'),
          responsavel: mov.responsavel,
          dataDeteccao: new Date(),
          evidencias: [
            `Apelação em ${mov.data.toISOString()}`,
            `Decisão anterior: ${decisaoAnterior.tipo}`,
            `Responsável: ${mov.responsavel}`
          ],
          custoEstimado: 5000 // Custo estimado do recurso indevido
        });
      }
    });

    // Verifica sentenças incompletas
    const sentencas = processo.movimentacoes.filter(m =>
      m.tipo.toLowerCase().includes('sentença')
    );

    sentencas.forEach(mov => {
      // Sentença deve analisar todos os pedidos
      const descricaoCurta = mov.descricao.length < 500;
      const semFundamentacao = !mov.descricao.toLowerCase().includes('fundamentação') &&
                              !mov.descricao.toLowerCase().includes('razões');

      if (descricaoCurta || semFundamentacao) {
        violacoes.push({
          id: nanoid(),
          tipo: TipoViolacao.SENTENCA_INCOMPLETA,
          gravidade: GravidadeViolacao.MUITO_ALTA,
          descricao: `Sentença possivelmente incompleta ou sem fundamentação adequada`,
          fundamentacao: 'Art. 93, IX, CF/88 - Toda decisão deve ser fundamentada, sob pena de nulidade. Art. 489, CPC - Elementos essenciais da sentença.',
          codigosEticaViolados: obterCodigosEtica('SENTENCA_INCOMPLETA'),
          responsavel: mov.responsavel,
          dataDeteccao: new Date(),
          evidencias: [
            `Sentença em ${mov.data.toISOString()}`,
            `Tamanho da fundamentação: ${mov.descricao.length} caracteres`,
            `Responsável: ${mov.responsavel}`
          ],
          custoEstimado: 10000
        });
      }
    });

    // Verifica acórdãos omissos
    const acordaos = processo.movimentacoes.filter(m =>
      m.tipo.toLowerCase().includes('acórdão')
    );

    acordaos.forEach(mov => {
      // Acórdão deve enfrentar todos os argumentos
      const semAnalise = !mov.descricao.toLowerCase().includes('análise') &&
                        !mov.descricao.toLowerCase().includes('argumentos');

      if (semAnalise || mov.descricao.length < 300) {
        violacoes.push({
          id: nanoid(),
          tipo: TipoViolacao.ACORDAO_OMISSO,
          gravidade: GravidadeViolacao.ALTA,
          descricao: `Acórdão possivelmente omisso - não enfrenta todos os argumentos`,
          fundamentacao: 'Art. 93, IX, CF/88 e Art. 1.022, CPC - Acórdão deve enfrentar todas as questões suscitadas.',
          codigosEticaViolados: obterCodigosEtica('ACORDAO_OMISSO'),
          responsavel: mov.responsavel,
          dataDeteccao: new Date(),
          evidencias: [
            `Acórdão em ${mov.data.toISOString()}`,
            `Fundamentação: ${mov.descricao.length} caracteres`,
            `Responsável: ${mov.responsavel}`
          ],
          custoEstimado: 15000
        });
      }
    });

    return violacoes;
  }

  /**
   * Detecta violações em decisões
   */
  private detectarViolacoesDecisoes(processo: ProcessoInvestigado): ViolacaoDetectada[] {
    const violacoes: ViolacaoDetectada[] = [];

    // Verifica decisões sem fundamentação
    processo.movimentacoes.forEach(mov => {
      if (mov.tipo.toLowerCase().includes('decisão') ||
          mov.tipo.toLowerCase().includes('despacho')) {

        const semFundamentacao = mov.descricao.length < 50;

        if (semFundamentacao) {
          violacoes.push({
            id: nanoid(),
            tipo: TipoViolacao.VIOLACAO_DEVIDO_PROCESSO,
            gravidade: GravidadeViolacao.ALTA,
            descricao: `Decisão sem fundamentação adequada`,
            fundamentacao: 'Art. 93, IX, CF/88 - Todas as decisões judiciais serão fundamentadas.',
            codigosEticaViolados: obterCodigosEtica('VIOLACAO_DEVIDO_PROCESSO'),
            responsavel: mov.responsavel,
            dataDeteccao: new Date(),
            evidencias: [
              `Decisão em ${mov.data.toISOString()}`,
              `Fundamentação insuficiente: ${mov.descricao}`,
              `Responsável: ${mov.responsavel}`
            ],
            custoEstimado: 3000
          });
        }
      }
    });

    return violacoes;
  }

  /**
   * Detecta gastos excessivos no processo
   */
  private async detectarGastosExcessivos(
    processo: ProcessoInvestigado
  ): Promise<ViolacaoDetectada | null> {
    if (!processo.custoEstimado) return null;

    // Calcula custo médio esperado baseado no tipo de processo
    const custoMedioEsperado = this.calcularCustoMedioEsperado(processo);
    const percentualExcesso = ((processo.custoEstimado - custoMedioEsperado) / custoMedioEsperado) * 100;

    if (percentualExcesso > 50) {
      return {
        id: nanoid(),
        tipo: TipoViolacao.GASTOS_EXCESSIVOS,
        gravidade: percentualExcesso > 200 ? GravidadeViolacao.CRITICA : GravidadeViolacao.ALTA,
        descricao: `Gastos excessivos detectados no processo: ${percentualExcesso.toFixed(1)}% acima do esperado`,
        fundamentacao: 'Princípio da Eficiência (Art. 37, CF/88) - Recursos públicos devem ser utilizados com economicidade.',
        codigosEticaViolados: obterCodigosEtica('GASTOS_EXCESSIVOS'),
        responsavel: processo.tribunal,
        dataDeteccao: new Date(),
        evidencias: [
          `Custo estimado: R$ ${processo.custoEstimado.toLocaleString('pt-BR')}`,
          `Custo médio esperado: R$ ${custoMedioEsperado.toLocaleString('pt-BR')}`,
          `Excesso: ${percentualExcesso.toFixed(1)}%`
        ],
        custoEstimado: processo.custoEstimado - custoMedioEsperado
      };
    }

    return null;
  }

  /**
   * Calcula custo médio esperado para um processo
   */
  private calcularCustoMedioEsperado(processo: ProcessoInvestigado): number {
    // Valores base por instância
    const custoBase = {
      PRIMEIRA: 5000,
      SEGUNDA: 8000,
      SUPERIOR: 12000
    };

    let custo = custoBase[processo.instancia];

    // Ajusta por número de movimentações
    custo += processo.movimentacoes.length * 100;

    // Ajusta por valor da causa
    if (processo.valor && processo.valor > 100000) {
      custo *= 1.5;
    }

    return custo;
  }

  /**
   * Detecta indícios de corrupção
   */
  private detectarIndiciosCorrupcao(
    processo: ProcessoInvestigado,
    violacoesExistentes: ViolacaoDetectada[]
  ): ViolacaoDetectada[] {
    const violacoes: ViolacaoDetectada[] = [];

    // Múltiplas violações graves indicam possível corrupção
    const violacoesGraves = violacoesExistentes.filter(
      v => v.gravidade >= GravidadeViolacao.ALTA
    );

    if (violacoesGraves.length >= 3) {
      violacoes.push({
        id: nanoid(),
        tipo: TipoViolacao.CORRUPCAO,
        gravidade: GravidadeViolacao.CRITICA,
        descricao: `Múltiplas violações graves detectadas (${violacoesGraves.length}) - possível corrupção`,
        fundamentacao: 'Lei 8.429/92 (Improbidade Administrativa) - Múltiplas irregularidades caracterizam possível favorecimento ilícito.',
        codigosEticaViolados: obterCodigosEtica('CORRUPCAO'),
        responsavel: processo.partes.juiz || 'Desconhecido',
        dataDeteccao: new Date(),
        evidencias: violacoesGraves.map(v => v.descricao),
        custoEstimado: violacoesGraves.reduce((total, v) => total + (v.custoEstimado || 0), 0)
      });
    }

    // Decisões contraditórias
    const decisoes = processo.movimentacoes.filter(m =>
      m.tipo.toLowerCase().includes('decisão') ||
      m.tipo.toLowerCase().includes('sentença')
    );

    if (decisoes.length > 5) {
      violacoes.push({
        id: nanoid(),
        tipo: TipoViolacao.FAVORECIMENTO_ILICITO,
        gravidade: GravidadeViolacao.ALTA,
        descricao: `Número excessivo de decisões (${decisoes.length}) pode indicar favorecimento`,
        fundamentacao: 'Princípio da Celeridade Processual (Art. 5º, LXXVIII, CF/88) - Processo deve ter duração razoável.',
        codigosEticaViolados: obterCodigosEtica('FAVORECIMENTO_ILICITO'),
        responsavel: processo.partes.juiz || 'Desconhecido',
        dataDeteccao: new Date(),
        evidencias: decisoes.map(d => `${d.tipo} em ${d.data.toISOString()}`),
        custoEstimado: decisoes.length * 1000
      });
    }

    return violacoes;
  }

  /**
   * Calcula gravidade total do processo
   */
  public calcularGravidadeTotal(violacoes: ViolacaoDetectada[]): GravidadeViolacao {
    if (violacoes.length === 0) return GravidadeViolacao.MUITO_BAIXA;

    const gravidadeMedia = violacoes.reduce((sum, v) => sum + v.gravidade, 0) / violacoes.length;
    const maxGravidade = Math.max(...violacoes.map(v => v.gravidade));

    // Retorna a maior gravidade se houver violações críticas
    if (maxGravidade === GravidadeViolacao.CRITICA) return GravidadeViolacao.CRITICA;

    // Caso contrário, retorna a média arredondada
    return Math.round(gravidadeMedia) as GravidadeViolacao;
  }
}
