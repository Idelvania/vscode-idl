/**
 * Módulo de Análise CUI BONO
 * Analisa quem se beneficia de violações processuais e atos de corrupção
 */

import {
  ProcessoInvestigado,
  ViolacaoDetectada,
  AnaliseCuiBono,
  Beneficiario,
  RedeRelacionamentos,
  GravidadeViolacao
} from '../types';

export class CuiBonoAnalyzer {
  /**
   * Realiza análise completa Cui Bono de um processo
   */
  public async analisarProcesso(processo: ProcessoInvestigado): Promise<AnaliseCuiBono> {
    console.log(`[CUI BONO] Iniciando análise do processo ${processo.numero}...`);

    const beneficiarios = await this.identificarBeneficiarios(processo);
    const rede = await this.construirRedeRelacionamentos(processo, beneficiarios);
    const valorBeneficio = this.calcularValorTotalBeneficios(beneficiarios);
    const tiposBeneficios = this.identificarTiposBeneficios(processo);
    const score = this.calcularScoreCuiBono(processo, beneficiarios, rede);
    const analiseDetalhada = this.gerarAnaliseDetalhada(processo, beneficiarios, rede, score);

    console.log(`[CUI BONO] Análise concluída. Score: ${score}/100`);

    return {
      beneficiarios,
      valorBeneficio,
      tiposBeneficios,
      rede,
      score,
      analiseDetalhada
    };
  }

  /**
   * Identifica beneficiários diretos e indiretos
   */
  private async identificarBeneficiarios(processo: ProcessoInvestigado): Promise<Beneficiario[]> {
    const beneficiarios: Beneficiario[] = [];

    // Analisa violações para identificar beneficiários
    for (const violacao of processo.violacoesDetectadas) {
      const beneficiariosViolacao = this.analisarBeneficiariosViolacao(violacao, processo);
      beneficiarios.push(...beneficiariosViolacao);
    }

    // Analisa partes do processo
    const beneficiariosPartes = this.analisarBeneficiariosPartes(processo);
    beneficiarios.push(...beneficiariosPartes);

    // Analisa gastos excessivos
    if (processo.custoEstimado && processo.custoEstimado > 0) {
      const beneficiariosGastos = this.analisarBeneficiariosGastos(processo);
      beneficiarios.push(...beneficiariosGastos);
    }

    // Remove duplicatas e consolida
    return this.consolidarBeneficiarios(beneficiarios);
  }

  /**
   * Analisa beneficiários de uma violação específica
   */
  private analisarBeneficiariosViolacao(
    violacao: ViolacaoDetectada,
    processo: ProcessoInvestigado
  ): Beneficiario[] {
    const beneficiarios: Beneficiario[] = [];

    switch (violacao.tipo) {
      case 'DECISAO_INTERLOCUTORIA_ERRADA':
      case 'APELACAO_INDEVIDA':
      case 'SENTENCA_INCOMPLETA':
      case 'ACORDAO_OMISSO':
        // Parte que se beneficiou da decisão
        beneficiarios.push({
          nome: processo.partes.reu,
          tipo: 'PESSOA_FISICA',
          relacionamentos: [processo.partes.juiz || 'Desconhecido'],
          beneficioEstimado: violacao.custoEstimado || processo.valor || 0,
          evidencias: violacao.evidencias
        });
        break;

      case 'CORRUPCAO':
      case 'FAVORECIMENTO_ILICITO':
        // Múltiplos beneficiários possíveis
        if (violacao.responsavel) {
          beneficiarios.push({
            nome: violacao.responsavel,
            tipo: 'PESSOA_FISICA',
            relacionamentos: [processo.partes.reu, ...processo.partes.advogados],
            beneficioEstimado: violacao.custoEstimado || 0,
            evidencias: violacao.evidencias
          });
        }
        break;

      case 'GASTOS_EXCESSIVOS':
        // Tribunal/Servidores
        beneficiarios.push({
          nome: processo.tribunal,
          tipo: 'ORGAO_PUBLICO',
          relacionamentos: [],
          beneficioEstimado: violacao.custoEstimado || 0,
          evidencias: violacao.evidencias
        });
        break;

      case 'NEPOTISMO':
        // Familiar beneficiado
        if (violacao.responsavel) {
          beneficiarios.push({
            nome: `Familiar de ${violacao.responsavel}`,
            tipo: 'PESSOA_FISICA',
            cargo: 'Nomeado',
            relacionamentos: [violacao.responsavel],
            beneficioEstimado: violacao.custoEstimado || 0,
            evidencias: violacao.evidencias
          });
        }
        break;
    }

    return beneficiarios;
  }

  /**
   * Analisa beneficiários entre as partes do processo
   */
  private analisarBeneficiariosPartes(processo: ProcessoInvestigado): Beneficiario[] {
    const beneficiarios: Beneficiario[] = [];

    // Analisa se há viés nas decisões
    const violacoesGraves = processo.violacoesDetectadas.filter(
      v => v.gravidade >= GravidadeViolacao.ALTA
    );

    if (violacoesGraves.length > 0) {
      // Réu como possível beneficiário
      beneficiarios.push({
        nome: processo.partes.reu,
        tipo: 'PESSOA_FISICA',
        relacionamentos: [
          ...processo.partes.advogados,
          processo.partes.juiz || 'Desconhecido'
        ],
        beneficioEstimado: processo.valor || 0,
        evidencias: violacoesGraves.map(v => v.descricao)
      });
    }

    return beneficiarios;
  }

  /**
   * Analisa beneficiários de gastos excessivos
   */
  private analisarBeneficiariosGastos(processo: ProcessoInvestigado): Beneficiario[] {
    const beneficiarios: Beneficiario[] = [];

    if (processo.custoEstimado && processo.custoEstimado > 0) {
      beneficiarios.push({
        nome: processo.tribunal,
        tipo: 'ORGAO_PUBLICO',
        relacionamentos: [],
        beneficioEstimado: processo.custoEstimado,
        evidencias: [`Custo estimado: R$ ${processo.custoEstimado.toLocaleString('pt-BR')}`]
      });
    }

    return beneficiarios;
  }

  /**
   * Consolida beneficiários removendo duplicatas
   */
  private consolidarBeneficiarios(beneficiarios: Beneficiario[]): Beneficiario[] {
    const map = new Map<string, Beneficiario>();

    for (const beneficiario of beneficiarios) {
      const key = beneficiario.nome;
      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.beneficioEstimado += beneficiario.beneficioEstimado;
        existing.relacionamentos.push(...beneficiario.relacionamentos);
        existing.evidencias.push(...beneficiario.evidencias);
      } else {
        map.set(key, { ...beneficiario });
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => b.beneficioEstimado - a.beneficioEstimado
    );
  }

  /**
   * Constrói rede de relacionamentos entre beneficiários
   */
  private async construirRedeRelacionamentos(
    processo: ProcessoInvestigado,
    beneficiarios: Beneficiario[]
  ): Promise<RedeRelacionamentos> {
    const nos: RedeRelacionamentos['nos'] = [];
    const conexoes: RedeRelacionamentos['conexoes'] = [];

    // Adiciona nós (pessoas/entidades)
    nos.push(
      { id: 'autor', nome: processo.partes.autor, tipo: 'autor' },
      { id: 'reu', nome: processo.partes.reu, tipo: 'reu' }
    );

    if (processo.partes.juiz) {
      nos.push({ id: 'juiz', nome: processo.partes.juiz, tipo: 'juiz' });
    }

    processo.partes.advogados.forEach((adv, idx) => {
      nos.push({ id: `adv${idx}`, nome: adv, tipo: 'advogado' });
    });

    beneficiarios.forEach((ben, idx) => {
      if (!nos.find(n => n.nome === ben.nome)) {
        nos.push({ id: `ben${idx}`, nome: ben.nome, tipo: 'beneficiario' });
      }
    });

    // Adiciona conexões
    beneficiarios.forEach((ben, idx) => {
      const benId = nos.find(n => n.nome === ben.nome)?.id || `ben${idx}`;

      ben.relacionamentos.forEach(rel => {
        const relId = nos.find(n => n.nome === rel)?.id;
        if (relId) {
          conexoes.push({
            origem: benId,
            destino: relId,
            tipo: 'relacionamento',
            forca: Math.min(ben.beneficioEstimado / 100000, 1) // Normalizado 0-1
          });
        }
      });
    });

    // Conecta advogados com partes
    processo.partes.advogados.forEach((_, idx) => {
      conexoes.push({
        origem: `adv${idx}`,
        destino: 'reu',
        tipo: 'representacao',
        forca: 0.8
      });
    });

    // Conecta juiz com o processo
    if (processo.partes.juiz) {
      conexoes.push(
        {
          origem: 'juiz',
          destino: 'autor',
          tipo: 'decisao',
          forca: 0.5
        },
        {
          origem: 'juiz',
          destino: 'reu',
          tipo: 'decisao',
          forca: 0.5
        }
      );
    }

    return { nos, conexoes };
  }

  /**
   * Calcula valor total de benefícios
   */
  private calcularValorTotalBeneficios(beneficiarios: Beneficiario[]): number {
    return beneficiarios.reduce((total, b) => total + b.beneficioEstimado, 0);
  }

  /**
   * Identifica tipos de benefícios
   */
  private identificarTiposBeneficios(processo: ProcessoInvestigado): string[] {
    const tipos = new Set<string>();

    processo.violacoesDetectadas.forEach(v => {
      switch (v.tipo) {
        case 'CORRUPCAO':
          tipos.add('Benefício financeiro direto');
          tipos.add('Vantagem indevida');
          break;
        case 'NEPOTISMO':
          tipos.add('Nomeação irregular');
          tipos.add('Benefício a familiar');
          break;
        case 'FAVORECIMENTO_ILICITO':
          tipos.add('Favorecimento processual');
          tipos.add('Vantagem competitiva');
          break;
        case 'GASTOS_EXCESSIVOS':
          tipos.add('Superfaturamento');
          tipos.add('Uso indevido de recursos');
          break;
        case 'DECISAO_INTERLOCUTORIA_ERRADA':
        case 'APELACAO_INDEVIDA':
        case 'SENTENCA_INCOMPLETA':
        case 'ACORDAO_OMISSO':
          tipos.add('Decisão favorável indevida');
          tipos.add('Violação do devido processo');
          break;
      }
    });

    return Array.from(tipos);
  }

  /**
   * Calcula score Cui Bono (0-100)
   */
  private calcularScoreCuiBono(
    processo: ProcessoInvestigado,
    beneficiarios: Beneficiario[],
    rede: RedeRelacionamentos
  ): number {
    let score = 0;

    // Número de beneficiários (0-20 pontos)
    score += Math.min(beneficiarios.length * 5, 20);

    // Valor total de benefícios (0-25 pontos)
    const valorTotal = this.calcularValorTotalBeneficios(beneficiarios);
    if (valorTotal > 1000000) score += 25;
    else if (valorTotal > 500000) score += 20;
    else if (valorTotal > 100000) score += 15;
    else if (valorTotal > 50000) score += 10;
    else score += 5;

    // Gravidade das violações (0-30 pontos)
    const violacoesGraves = processo.violacoesDetectadas.filter(
      v => v.gravidade >= GravidadeViolacao.ALTA
    ).length;
    score += Math.min(violacoesGraves * 10, 30);

    // Complexidade da rede de relacionamentos (0-15 pontos)
    const densidadeRede = rede.conexoes.length / Math.max(rede.nos.length, 1);
    score += Math.min(densidadeRede * 5, 15);

    // Evidências documentadas (0-10 pontos)
    const totalEvidencias = beneficiarios.reduce((total, b) => total + b.evidencias.length, 0);
    score += Math.min(totalEvidencias * 2, 10);

    return Math.min(Math.round(score), 100);
  }

  /**
   * Gera análise detalhada
   */
  private gerarAnaliseDetalhada(
    processo: ProcessoInvestigado,
    beneficiarios: Beneficiario[],
    rede: RedeRelacionamentos,
    score: number
  ): string {
    const analise: string[] = [];

    analise.push('=== ANÁLISE CUI BONO (QUEM SE BENEFICIA) ===\n');

    // Resumo
    analise.push(`Processo: ${processo.numero}`);
    analise.push(`Tribunal: ${processo.tribunal} - ${processo.estado}`);
    analise.push(`Score Cui Bono: ${score}/100`);
    analise.push(`Total de Beneficiários: ${beneficiarios.length}`);
    analise.push(
      `Valor Total Estimado: R$ ${this.calcularValorTotalBeneficios(beneficiarios).toLocaleString('pt-BR')}\n`
    );

    // Beneficiários principais
    analise.push('BENEFICIÁRIOS IDENTIFICADOS:');
    beneficiarios.slice(0, 5).forEach((ben, idx) => {
      analise.push(`\n${idx + 1}. ${ben.nome} (${ben.tipo})`);
      analise.push(`   Benefício Estimado: R$ ${ben.beneficioEstimado.toLocaleString('pt-BR')}`);
      if (ben.cargo) analise.push(`   Cargo: ${ben.cargo}`);
      if (ben.relacionamentos.length > 0) {
        analise.push(`   Relacionamentos: ${ben.relacionamentos.slice(0, 3).join(', ')}`);
      }
      analise.push(`   Evidências: ${ben.evidencias.length} documento(s)`);
    });

    // Rede de relacionamentos
    analise.push(`\nREDE DE RELACIONAMENTOS:`);
    analise.push(`Total de Entidades: ${rede.nos.length}`);
    analise.push(`Total de Conexões: ${rede.conexoes.length}`);
    analise.push(`Densidade da Rede: ${(rede.conexoes.length / rede.nos.length).toFixed(2)}`);

    // Conclusão
    analise.push('\nCONCLUSÃO:');
    if (score >= 80) {
      analise.push('⚠️  RISCO CRÍTICO - Evidências substanciais de benefícios indevidos');
    } else if (score >= 60) {
      analise.push('⚠️  RISCO ALTO - Múltiplos indicadores de beneficiários suspeitos');
    } else if (score >= 40) {
      analise.push('⚠️  RISCO MÉDIO - Presença de beneficiários que requerem investigação');
    } else {
      analise.push('ℹ️  RISCO BAIXO - Poucos indicadores de benefícios indevidos');
    }

    return analise.join('\n');
  }

  /**
   * Gera relatório simplificado em texto
   */
  public gerarRelatorioTexto(cuiBono: AnaliseCuiBono): string {
    return cuiBono.analiseDetalhada;
  }

  /**
   * Exporta dados para JSON
   */
  public exportarJSON(cuiBono: AnaliseCuiBono): string {
    return JSON.stringify(cuiBono, null, 2);
  }
}
