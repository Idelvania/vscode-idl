/**
 * ANALISADOR DE PRAZOS E PRESCRIÇÃO
 *
 * Sistema CRÍTICO para evitar prescrição - maior causa de impunidade
 *
 * IMPORTÂNCIA:
 * - Casos bilionários têm risco ELEVADO de prescrição proposital
 * - Morosidade é estratégia comum de defesa
 * - Um erro de cálculo = perda total do caso
 *
 * O que este sistema faz:
 * 1. Calcula TODOS os prazos prescricionais
 * 2. Cria alertas automáticos
 * 3. Gera cronograma de petições interruptivas
 * 4. Simula cenários de prescrição
 * 5. Monitora andamento processual
 */

import { Caso, EventoCaso } from '../core/types';

export interface PrazoPrescrição {
  tipo: 'penal' | 'civil' | 'administrativa';
  prazoTotal: number; // em anos
  dataInicio: Date;
  dataFim: Date;
  atosInterruptivos: AtoInterruptivo[];
  status: 'seguro' | 'atencao' | 'critico' | 'prescrito';
  diasRestantes: number;
  risco: 'baixo' | 'medio' | 'alto' | 'critico';
}

export interface AtoInterruptivo {
  data: Date;
  tipo: string;
  descricao: string;
  efeito: 'interrompe' | 'suspende';
  prazoReiniciado?: Date;
}

export interface AlertaPrazo {
  id: string;
  prioridade: 'critica' | 'alta' | 'media';
  tipo: PrazoPrescrição['tipo'];
  mensagem: string;
  acaoRequerida: string;
  prazoLimite: Date;
  geradoEm: Date;
}

export interface CronogramaPeticoes {
  objetivo: string;
  peticoes: PeticaoAgendada[];
  justificativa: string;
}

export interface PeticaoAgendada {
  ordem: number;
  dataRecomendada: Date;
  tipo: string;
  objetivo: string;
  prioridade: 'critica' | 'alta' | 'media';
  modeloSugerido?: string;
}

export class PrescriptionAnalyzer {

  /**
   * Analisa TODOS os prazos prescricionais do caso
   */
  analisarPrazos(caso: Caso): {
    prazos: PrazoPrescrição[];
    alertas: AlertaPrazo[];
    cronograma: CronogramaPeticoes;
    riscoGeral: 'baixo' | 'medio' | 'alto' | 'critico';
  } {
    console.log('\n⏱️ ANALISANDO PRAZOS PRESCRICIONAIS...\n');

    const prazos: PrazoPrescrição[] = [];
    const alertas: AlertaPrazo[] = [];

    // 1. Prescrição PENAL
    const prazoPenal = this.calcularPrescricaoPenal(caso);
    prazos.push(prazoPenal);
    if (prazoPenal.status === 'critico' || prazoPenal.status === 'atencao') {
      alertas.push(this.gerarAlertaPenal(prazoPenal));
    }

    // 2. Prescrição CIVIL (Improbidade)
    const prazoCivil = this.calcularPrescricaoCivil(caso);
    prazos.push(prazoCivil);
    if (prazoCivil.status === 'critico' || prazoCivil.status === 'atencao') {
      alertas.push(this.gerarAlertaCivil(prazoCivil));
    }

    // 3. Prescrição ADMINISTRATIVA
    const prazoAdm = this.calcularPrescricaoAdministrativa(caso);
    prazos.push(prazoAdm);

    // 4. Gerar cronograma de petições interruptivas
    const cronograma = this.gerarCronogramaPeticoes(prazos);

    // 5. Calcular risco geral
    const riscoGeral = this.calcularRiscoGeral(prazos);

    this.apresentarRelatorioPrazos(prazos, alertas, cronograma, riscoGeral);

    return { prazos, alertas, cronograma, riscoGeral };
  }

  /**
   * Calcula prescrição PENAL
   * Base: Código Penal, arts. 109 a 117
   */
  private calcularPrescricaoPenal(caso: Caso): PrazoPrescrição {
    // Prescrição penal depende da pena máxima do crime
    // Exemplo: Peculato (CP 312) = 2 a 12 anos → prescrição em 16 anos
    const dataInicio = this.identificarDataInicioPenal(caso);
    const prazoPenal = 16; // anos (exemplo - deveria calcular por crime específico)
    const dataFim = new Date(dataInicio);
    dataFim.setFullYear(dataFim.getFullYear() + prazoPenal);

    const atosInterruptivos = this.identificarAtosInterruptivos(caso, 'penal');
    const diasRestantes = this.calcularDiasRestantes(dataFim);
    const status = this.determinarStatus(diasRestantes);
    const risco = this.calcularRisco(diasRestantes, 'penal');

    return {
      tipo: 'penal',
      prazoTotal: prazoPenal,
      dataInicio,
      dataFim,
      atosInterruptivos,
      status,
      diasRestantes,
      risco
    };
  }

  /**
   * Calcula prescrição CIVIL (Improbidade)
   * Base: Lei 8.429/92, art. 23
   */
  private calcularPrescricaoCivil(caso: Caso): PrazoPrescrição {
    // Improbidade: 5 anos após término do mandato/vínculo
    // OU 5 anos após descoberta dos fatos
    const dataInicio = this.identificarDataInicioCivil(caso);
    const prazoCivil = 5; // anos
    const dataFim = new Date(dataInicio);
    dataFim.setFullYear(dataFim.getFullYear() + prazoCivil);

    const atosInterruptivos = this.identificarAtosInterruptivos(caso, 'civil');
    const diasRestantes = this.calcularDiasRestantes(dataFim);
    const status = this.determinarStatus(diasRestantes);
    const risco = this.calcularRisco(diasRestantes, 'civil');

    return {
      tipo: 'civil',
      prazoTotal: prazoCivil,
      dataInicio,
      dataFim,
      atosInterruptivos,
      status,
      diasRestantes,
      risco
    };
  }

  /**
   * Calcula prescrição ADMINISTRATIVA
   * Base: Lei 8.112/90, art. 142
   */
  private calcularPrescricaoAdministrativa(caso: Caso): PrazoPrescrição {
    // Administrativa: 5 anos da ocorrência ou ciência
    const dataInicio = this.identificarDataInicioAdministrativa(caso);
    const prazoAdm = 5; // anos
    const dataFim = new Date(dataInicio);
    dataFim.setFullYear(dataFim.getFullYear() + prazoAdm);

    const atosInterruptivos = this.identificarAtosInterruptivos(caso, 'administrativa');
    const diasRestantes = this.calcularDiasRestantes(dataFim);
    const status = this.determinarStatus(diasRestantes);
    const risco = this.calcularRisco(diasRestantes, 'administrativa');

    return {
      tipo: 'administrativa',
      prazoTotal: prazoAdm,
      dataInicio,
      dataFim,
      atosInterruptivos,
      status,
      diasRestantes,
      risco
    };
  }

  /**
   * Gera CRONOGRAMA DE PETIÇÕES INTERRUPTIVAS
   * Estratégia: petição a cada 6 meses para garantir interrupção
   */
  private gerarCronogramaPeticoes(prazos: PrazoPrescrição[]): CronogramaPeticoes {
    const peticoes: PeticaoAgendada[] = [];
    const hoje = new Date();

    prazos.forEach(prazo => {
      if (prazo.status === 'critico' || prazo.risco === 'alto' || prazo.risco === 'critico') {
        // Gerar petições a cada 6 meses até o fim do prazo
        let proximaData = new Date(hoje);
        proximaData.setMonth(proximaData.getMonth() + 6);
        let ordem = 1;

        while (proximaData < prazo.dataFim) {
          peticoes.push({
            ordem,
            dataRecomendada: new Date(proximaData),
            tipo: `Petição Interruptiva - ${prazo.tipo}`,
            objetivo: `Interromper prescrição ${prazo.tipo}`,
            prioridade: prazo.risco === 'critico' ? 'critica' : 'alta',
            modeloSugerido: this.sugerirModeloPeticao(prazo.tipo)
          });

          proximaData = new Date(proximaData);
          proximaData.setMonth(proximaData.getMonth() + 6);
          ordem++;
        }
      }
    });

    // Ordenar por data
    peticoes.sort((a, b) => a.dataRecomendada.getTime() - b.dataRecomendada.getTime());

    return {
      objetivo: 'Garantir interrupção contínua de prescrição e evitar impunidade',
      peticoes,
      justificativa: 'Estratégia defensiva contra morosidade proposital. ' +
                     'Casos bilionários têm alto risco de prescrição por delonga processual. ' +
                     'Petições periódicas criam barreira temporal.'
    };
  }

  /**
   * Simula CENÁRIOS DE PRESCRIÇÃO
   */
  simularCenarios(prazo: PrazoPrescrição, cenarios: {
    nome: string;
    diasAtraso: number;
  }[]): {
    cenario: string;
    prescrito: boolean;
    margem: number;
    recomendacao: string;
  }[] {
    const resultados = [];

    for (const cenario of cenarios) {
      const dataFimSimulada = new Date(prazo.dataFim);
      dataFimSimulada.setDate(dataFimSimulada.getDate() - cenario.diasAtraso);

      const diasRestantesSimulados = this.calcularDiasRestantes(dataFimSimulada);
      const prescrito = diasRestantesSimulados <= 0;

      resultados.push({
        cenario: cenario.nome,
        prescrito,
        margem: diasRestantesSimulados,
        recomendacao: prescrito
          ? '⚠️ PRESCRIÇÃO! Agir IMEDIATAMENTE!'
          : `✅ Seguro. Margem: ${diasRestantesSimulados} dias`
      });
    }

    return resultados;
  }

  // ========== MÉTODOS AUXILIARES ==========

  private identificarDataInicioPenal(caso: Caso): Date {
    // Data do fato criminoso (simplificado)
    const eventosRelevantes = caso.timeline?.filter(e =>
      e.tipo.includes('inicio') || e.tipo.includes('crime')
    );
    if (eventosRelevantes && eventosRelevantes.length > 0) {
      return eventosRelevantes[0].data;
    }
    return new Date('2015-01-01'); // Fallback
  }

  private identificarDataInicioCivil(caso: Caso): Date {
    // Data do término do mandato ou descoberta dos fatos
    const eventosRelevantes = caso.timeline?.filter(e =>
      e.tipo.includes('auditoria') || e.tipo.includes('descoberta')
    );
    if (eventosRelevantes && eventosRelevantes.length > 0) {
      return eventosRelevantes[0].data;
    }
    return new Date('2022-01-01'); // Fallback
  }

  private identificarDataInicioAdministrativa(caso: Caso): Date {
    return this.identificarDataInicioCivil(caso);
  }

  private identificarAtosInterruptivos(
    caso: Caso,
    tipo: PrazoPrescrição['tipo']
  ): AtoInterruptivo[] {
    const atos: AtoInterruptivo[] = [];

    caso.timeline?.forEach(evento => {
      if (evento.tipo.includes('ajuizamento') || evento.tipo.includes('citacao')) {
        atos.push({
          data: evento.data,
          tipo: evento.tipo,
          descricao: evento.descricao,
          efeito: 'interrompe',
          prazoReiniciado: new Date(evento.data)
        });
      }
    });

    return atos;
  }

  private calcularDiasRestantes(dataFim: Date): number {
    const hoje = new Date();
    const diff = dataFim.getTime() - hoje.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  private determinarStatus(diasRestantes: number): PrazoPrescrição['status'] {
    if (diasRestantes <= 0) return 'prescrito';
    if (diasRestantes <= 365) return 'critico'; // Menos de 1 ano
    if (diasRestantes <= 730) return 'atencao'; // Menos de 2 anos
    return 'seguro';
  }

  private calcularRisco(
    diasRestantes: number,
    tipo: PrazoPrescrição['tipo']
  ): PrazoPrescrição['risco'] {
    // Casos bilionários têm risco elevado de morosidade
    if (diasRestantes <= 180) return 'critico'; // 6 meses
    if (diasRestantes <= 365) return 'alto';    // 1 ano
    if (diasRestantes <= 730) return 'medio';   // 2 anos
    return 'baixo';
  }

  private calcularRiscoGeral(prazos: PrazoPrescrição[]): 'baixo' | 'medio' | 'alto' | 'critico' {
    const riscos = prazos.map(p => p.risco);
    if (riscos.includes('critico')) return 'critico';
    if (riscos.includes('alto')) return 'alto';
    if (riscos.includes('medio')) return 'medio';
    return 'baixo';
  }

  private gerarAlertaPenal(prazo: PrazoPrescrição): AlertaPrazo {
    return {
      id: `alerta-penal-${Date.now()}`,
      prioridade: prazo.risco === 'critico' ? 'critica' : 'alta',
      tipo: 'penal',
      mensagem: `⚠️ ATENÇÃO: Prescrição penal em ${prazo.diasRestantes} dias!`,
      acaoRequerida: 'Protocolar denúncia criminal IMEDIATAMENTE ou petição interruptiva',
      prazoLimite: prazo.dataFim,
      geradoEm: new Date()
    };
  }

  private gerarAlertaCivil(prazo: PrazoPrescrição): AlertaPrazo {
    return {
      id: `alerta-civil-${Date.now()}`,
      prioridade: prazo.risco === 'critico' ? 'critica' : 'alta',
      tipo: 'civil',
      mensagem: `⚠️ ATENÇÃO: Prescrição civil em ${prazo.diasRestantes} dias!`,
      acaoRequerida: 'Protocolar ação de improbidade ou petição nos autos',
      prazoLimite: prazo.dataFim,
      geradoEm: new Date()
    };
  }

  private sugerirModeloPeticao(tipo: PrazoPrescrição['tipo']): string {
    switch (tipo) {
      case 'penal':
        return 'Petição solicitando celeridade + juntada de novos documentos';
      case 'civil':
        return 'Petição de manifestação nos autos + pedido de andamento';
      case 'administrativa':
        return 'Requerimento de informações ao processo administrativo';
      default:
        return 'Petição genérica';
    }
  }

  private apresentarRelatorioPrazos(
    prazos: PrazoPrescrição[],
    alertas: AlertaPrazo[],
    cronograma: CronogramaPeticoes,
    riscoGeral: string
  ): void {
    console.log('\n' + '='.repeat(80));
    console.log('⏱️ RELATÓRIO DE ANÁLISE DE PRAZOS E PRESCRIÇÃO');
    console.log('='.repeat(80) + '\n');

    console.log(`🎯 RISCO GERAL: ${riscoGeral.toUpperCase()}\n`);

    console.log('📊 PRAZOS PRESCRICIONAIS:\n');
    prazos.forEach(prazo => {
      const emoji = prazo.status === 'critico' ? '🚨' :
                    prazo.status === 'atencao' ? '⚠️' : '✅';
      console.log(`${emoji} ${prazo.tipo.toUpperCase()}`);
      console.log(`   Status: ${prazo.status.toUpperCase()}`);
      console.log(`   Dias restantes: ${prazo.diasRestantes}`);
      console.log(`   Risco: ${prazo.risco.toUpperCase()}`);
      console.log(`   Data fim: ${prazo.dataFim.toISOString().split('T')[0]}`);
      console.log(`   Atos interruptivos: ${prazo.atosInterruptivos.length}\n`);
    });

    if (alertas.length > 0) {
      console.log('\n🚨 ALERTAS CRÍTICOS:\n');
      alertas.forEach((alerta, i) => {
        console.log(`${i + 1}. [${alerta.prioridade.toUpperCase()}] ${alerta.mensagem}`);
        console.log(`   Ação: ${alerta.acaoRequerida}`);
        console.log(`   Limite: ${alerta.prazoLimite.toISOString().split('T')[0]}\n`);
      });
    }

    console.log('\n📅 CRONOGRAMA DE PETIÇÕES INTERRUPTIVAS:\n');
    console.log(`Objetivo: ${cronograma.objetivo}\n`);
    console.log(`Justificativa: ${cronograma.justificativa}\n`);
    console.log('Petições agendadas:\n');
    cronograma.peticoes.slice(0, 5).forEach(pet => {
      console.log(`${pet.ordem}. [${pet.dataRecomendada.toISOString().split('T')[0]}] ${pet.tipo}`);
      console.log(`   Objetivo: ${pet.objetivo}`);
      console.log(`   Prioridade: ${pet.prioridade}\n`);
    });

    if (cronograma.peticoes.length > 5) {
      console.log(`... e mais ${cronograma.peticoes.length - 5} petições agendadas.\n`);
    }

    console.log('='.repeat(80) + '\n');
  }
}
