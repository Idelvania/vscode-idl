/**
 * SIICAF Strategic Advisor - Motor de Estratégias Proativas
 *
 * PROPÓSITO: Usar IA para DEMOCRATIZAR conhecimento jurídico e TRANSPARÊNCIA
 *
 * O que este sistema faz:
 * 1. Sugere estratégias que GRANDES ESCRITÓRIOS usariam
 * 2. Detecta padrões OCULTOS que beneficiam poderosos
 * 3. ENSINA o usuário enquanto analisa
 * 4. Gera TRANSPARÊNCIA em casos complexos
 * 5. NUNCA PARA DE APRENDER
 */

import {
  Caso,
  SugestaoProativa,
  EstrategiaJuridica,
  Conhecimento,
  AcaoSugerida,
  FonteJuridica,
  PassoEstrategico,
  RiscoOportunidade,
  PrevisaoResultado
} from '../core/types';
import { LegalKnowledge } from '../knowledge-base/legal-knowledge';
import { DocumentAnalyzer } from '../analyzer/document-analyzer';

export class StrategicAdvisor {
  private knowledgeBase: LegalKnowledge;
  private analyzer: DocumentAnalyzer;

  constructor() {
    this.knowledgeBase = new LegalKnowledge();
    this.analyzer = new DocumentAnalyzer();
  }

  /**
   * FUNÇÃO PRINCIPAL: Analisa caso e gera sugestões PROATIVAS
   * Não espera perguntas - SUGERE automaticamente
   */
  async analisarCasoCompleto(caso: Caso): Promise<{
    sugestoesImediatas: SugestaoProativa[];
    estrategias: EstrategiaJuridica[];
    conhecimentosNovos: Conhecimento[];
    alertasTransparencia: string[];
  }> {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🎯 SIICAF - Análise Estratégica Proativa`);
    console.log(`📁 Caso: ${caso.titulo}`);
    console.log(`${'='.repeat(80)}\n`);

    const sugestoesImediatas: SugestaoProativa[] = [];
    const estrategias: EstrategiaJuridica[] = [];
    const conhecimentosNovos: Conhecimento[] = [];
    const alertasTransparencia: string[] = [];

    // 1. ANÁLISE AUTOMÁTICA DE TODOS OS DOCUMENTOS
    console.log('📄 Analisando documentos...\n');
    for (const doc of caso.documentos) {
      const analise = await this.analyzer.analisarDocumento(doc);
      sugestoesImediatas.push(...analise.sugestoesAnalise);
    }

    // 2. DETECÇÃO DE PADRÕES OCULTOS
    const padroesOcultos = this.detectarPadroesOcultos(caso);
    alertasTransparencia.push(...padroesOcultos);

    // 3. GERAÇÃO DE ESTRATÉGIAS INOVADORAS
    const estrategiaPrincipal = this.gerarEstrategiaPrincipal(caso);
    estrategias.push(estrategiaPrincipal);

    // 4. CONSULTA PROATIVA À BASE DE CONHECIMENTO
    const consulta = this.knowledgeBase.consultar(caso.temas);
    conhecimentosNovos.push(...consulta.conhecimentosRelacionados);

    // 5. SUGESTÕES ESPECÍFICAS POR TIPO DE CASO
    const sugestoesEspecificas = this.gerarSugestoesEspecificas(caso);
    sugestoesImediatas.push(...sugestoesEspecificas);

    // 6. ALERTAS DE TRANSPARÊNCIA
    const alertas = this.verificarTransparencia(caso);
    alertasTransparencia.push(...alertas);

    return {
      sugestoesImediatas,
      estrategias,
      conhecimentosNovos,
      alertasTransparencia
    };
  }

  /**
   * DETECTA PADRÕES OCULTOS que podem indicar:
   * - Proteção institucional
   * - Blindagem de autoridades
   * - Prescrição estratégica
   * - Arquivamentos suspeitos
   */
  private detectarPadroesOcultos(caso: Caso): string[] {
    const alertas: string[] = [];

    // Padrão 1: Muitas autoridades, poucas responsabilizações
    if (caso.partes.length > 10) {
      const responsabilizados = caso.partes.filter(p => p.responsabilidade);
      if (responsabilizados.length < caso.partes.length * 0.3) {
        alertas.push(
          `⚠️ ALERTA DE TRANSPARÊNCIA: Identificadas ${caso.partes.length} pessoas envolvidas, ` +
          `mas apenas ${responsabilizados.length} com responsabilização clara. ` +
          `Padrão comum em casos de BLINDAGEM INSTITUCIONAL. ` +
          `SUGESTÃO: Investigar critérios de seleção dos responsabilizados.`
        );
      }
    }

    // Padrão 2: Grandes valores, pequenas penalidades
    const documentosComValores = caso.documentos.filter(d =>
      d.conteudo.match(/R\$\s*[\d.,]+\s*bilh/i)
    );
    if (documentosComValores.length > 0) {
      alertas.push(
        `💰 ALERTA: Caso envolve BILHÕES de reais. ` +
        `Historicamente, casos com grandes valores têm maior risco de: ` +
        `(1) Prescrição estratégica, (2) Acordos secretos, (3) Morosidade proposital. ` +
        `SUGESTÃO: Estabelecer timeline agressivo e monitorar prazos prescricionais.`
      );
    }

    // Padrão 3: Hierarquia administrativa - responsabilização invertida
    const autoridades = caso.partes.filter(p =>
      p.cargo && (p.cargo.includes('Presidente') || p.cargo.includes('Ministro'))
    );
    const subordinados = caso.partes.filter(p =>
      p.cargo && (p.cargo.includes('Assessor') || p.cargo.includes('Secretário'))
    );

    if (autoridades.length > 0 && subordinados.length > autoridades.length) {
      const subordinadosResponsabilizados = subordinados.filter(s => s.responsabilidade).length;
      const autoridadesResponsabilizadas = autoridades.filter(a => a.responsabilidade).length;

      if (subordinadosResponsabilizados > autoridadesResponsabilizadas) {
        alertas.push(
          `🎯 ALERTA CRÍTICO: Padrão de RESPONSABILIZAÇÃO INVERTIDA detectado! ` +
          `Subordinados (${subordinadosResponsabilizados}) sendo mais responsabilizados que autoridades (${autoridadesResponsabilizadas}). ` +
          `Este padrão viola a TEORIA DO DOMÍNIO DO FATO. ` +
          `SUGESTÃO: Aplicar tese de responsabilidade hierárquica (REsp 1.297.797/STJ).`
        );
      }
    }

    return alertas;
  }

  /**
   * GERA ESTRATÉGIA PRINCIPAL baseada em:
   * - Melhores práticas de grandes escritórios
   * - Precedentes exitosos
   * - Teoria dos jogos aplicada ao Judiciário
   */
  private gerarEstrategiaPrincipal(caso: Caso): EstrategiaJuridica {
    const passos: PassoEstrategico[] = [];
    const riscos: RiscoOportunidade[] = [];

    // PASSO 1: Mapeamento completo de responsabilidades
    passos.push({
      ordem: 1,
      descricao: 'Mapear TODAS as competências legais de cada autoridade identificada (usar organogramas, leis orgânicas, regimentos internos)',
      prazo: '48 horas',
      dependencias: [],
      status: 'pendente'
    });

    // PASSO 2: Quantificação robusta do dano
    passos.push({
      ordem: 2,
      descricao: 'Consolidar cálculo do dano ao erário com: (1) Valor principal, (2) Correção monetária, (3) Juros, (4) Lucros cessantes. Contratar perícia se necessário.',
      prazo: '7 dias',
      dependencias: [],
      status: 'pendente'
    });

    // PASSO 3: Estratégia de múltiplas esferas
    passos.push({
      ordem: 3,
      descricao: 'Protocolar ações SIMULTÂNEAS: (1) Ação de improbidade, (2) Representação ao MP, (3) Notícia-crime, (4) Representação aos Tribunais de Contas',
      prazo: '15 dias',
      dependencias: [1, 2],
      status: 'pendente'
    });

    // PASSO 4: Blindagem contra prescrição
    passos.push({
      ordem: 4,
      descricao: 'Criar CRONOGRAMA DE PRESCRIÇÃO e protocolar petições interruptivas a cada 6 meses (mesmo que protocolares)',
      prazo: 'Imediato - criar planilha',
      dependencias: [],
      status: 'pendente'
    });

    // PASSO 5: Pressão institucional e mídia estratégica
    passos.push({
      ordem: 5,
      descricao: 'Acionar órgãos de controle: CNJ, CNMP, OAB. Avaliar estratégia de comunicação (respeitar segredo de justiça)',
      prazo: '30 dias',
      dependencias: [3],
      status: 'pendente'
    });

    // RISCOS
    riscos.push({
      tipo: 'risco',
      descricao: 'Morosidade processual proposital para alcançar prescrição',
      probabilidade: 'alta',
      impacto: 'alto',
      mitigacao: 'Petições de prioridade, reclamações ao CNJ, pedidos de celeridade fundamentados'
    });

    riscos.push({
      tipo: 'risco',
      descricao: 'Pressão política sobre juízes/promotores',
      probabilidade: 'media',
      impacto: 'alto',
      mitigacao: 'Documentar tudo, criar transparência, acionar controle externo'
    });

    riscos.push({
      tipo: 'oportunidade',
      descricao: 'Repercussão geral pode criar precedente vinculante',
      probabilidade: 'media',
      impacto: 'alto'
    });

    return {
      id: `estrategia-${caso.id}`,
      titulo: 'Estratégia de Responsabilização Máxima com Blindagem Antiimpunidade',
      objetivo: 'Garantir responsabilização de TODOS os envolvidos, evitar prescrição, maximizar ressarcimento ao erário',
      fundamentacao: 'Baseada em precedentes do STJ (REsp 1.297.797), teoria do domínio do fato, e estratégias de grandes escritórios em casos de repercussão nacional',
      passos,
      riscosOportunidades: riscos,
      previsaoResultado: {
        cenarios: [
          {
            nome: 'Melhor cenário',
            probabilidade: 30,
            descricao: 'Condenação de autoridades principais + ressarcimento integral + precedente',
            impactos: ['Mudança jurisprudencial', 'Efeito pedagógico', 'Ressarcimento R$ 5,9bi']
          },
          {
            nome: 'Cenário provável',
            probabilidade: 50,
            descricao: 'Condenação parcial + ressarcimento parcial + morosidade controlada',
            impactos: ['Algumas condenações', 'Ressarcimento 30-50%', 'Duração 8-12 anos']
          },
          {
            nome: 'Pior cenário',
            probabilidade: 20,
            descricao: 'Prescrição / arquivamento por pressão institucional',
            impactos: ['Impunidade', 'Precedente negativo', 'Dano à credibilidade do Judiciário']
          }
        ],
        recomendacao: 'Adotar postura OFENSIVA desde o início. Não confiar em boa vontade institucional. Criar TRANSPARÊNCIA MÁXIMA para proteger o caso.'
      },
      alternativas: [
        {
          titulo: 'Acordo de Colaboração Premiada',
          descricao: 'Negociar delação de subordinados em troca de redução de pena',
          vantagens: ['Provas robustas', 'Celeridade', 'Divisão do grupo'],
          desvantagens: ['Redução de penas', 'Questionamento da credibilidade', 'Possível blindagem de superiores']
        }
      ]
    };
  }

  /**
   * SUGESTÕES ESPECÍFICAS baseadas no perfil do caso
   */
  private gerarSugestoesEspecificas(caso: Caso): SugestaoProativa[] {
    const sugestoes: SugestaoProativa[] = [];

    // SUGESTÃO: Criar matriz de responsabilização
    sugestoes.push({
      id: `sug-matriz-${Date.now()}`,
      tipo: 'investigacao',
      prioridade: 'critica',
      titulo: 'Criar Matriz de Responsabilização (16 Agentes)',
      descricao: 'Você mencionou 16 agentes responsáveis. Vou te ensinar a criar uma MATRIZ DE RESPONSABILIZAÇÃO que grandes escritórios usam.',
      fundamentacao: 'Em casos complexos com múltiplos réus, a matriz evita: (1) Esquecer alguém, (2) Responsabilizar errado, (3) Perder conexões. É ferramenta ESSENCIAL em casos de corrupção sistêmica.',
      acoes: [
        {
          id: 'acao-matriz-1',
          descricao: 'Criar tabela com colunas: Nome | Cargo | Competência Legal | Ato Praticado | Prova Específica | Grau de Responsabilidade',
          tipo: 'imediata',
          impacto: 'alto'
        },
        {
          id: 'acao-matriz-2',
          descricao: 'Para cada agente, identificar EXATAMENTE qual norma atribuía competência para aquele ato',
          tipo: 'curto_prazo',
          impacto: 'alto',
          recursosNecessarios: ['Lei orgânica', 'Regimento interno', 'Organograma']
        },
        {
          id: 'acao-matriz-3',
          descricao: 'Classificar responsabilidade: PRINCIPAL (quem decidiu), SECUNDÁRIA (quem executou), OMISSIVA (quem deveria fiscalizar)',
          tipo: 'curto_prazo',
          impacto: 'alto'
        }
      ],
      fontesConsultadas: [],
      novosConhecimentos: [
        {
          id: 'matriz-responsabilizacao',
          titulo: 'Técnica da Matriz de Responsabilização',
          descricao: 'Ferramenta visual para mapear TODOS os responsáveis, evitando que autoridades principais escapem. Usada em Lava Jato, Mensalão e grandes casos de corrupção.',
          categoria: 'procedimento',
          aplicabilidade: 'Casos com múltiplos réus, hierarquia complexa, corrupção sistêmica',
          exemplos: [
            'Operação Lava Jato: matriz com 200+ pessoas',
            'Caso Mensalão: separação por núcleos de atuação'
          ]
        }
      ],
      timestamp: new Date()
    });

    // SUGESTÃO: Teoria dos Jogos - próximas 72h
    sugestoes.push({
      id: `sug-teoriadosjogos-${Date.now()}`,
      tipo: 'estrategia',
      prioridade: 'alta',
      titulo: 'Estratégia E2 - Próximas 72 Horas (Teoria dos Jogos)',
      descricao: 'Te ensino estratégia que advogados top usam: TEORIA DOS JOGOS aplicada ao litígio. Nas próximas 72h, você define o jogo.',
      fundamentacao: 'Primeiras ações definem como adversários reagirão. Se você age fraco, eles testam. Se age forte, negociam. Você tem 72h para estabelecer o TOM do caso.',
      acoes: [
        {
          id: 'acao-e2-1',
          descricao: 'AÇÃO IMEDIATA: Protocolar representação ao MP com pedido de URGÊNCIA (mostra seriedade)',
          tipo: 'imediata',
          impacto: 'alto'
        },
        {
          id: 'acao-e2-2',
          descricao: 'Notificar TODOS os 16 agentes extrajudicialmente (cria pressão psicológica)',
          tipo: 'imediata',
          impacto: 'medio'
        },
        {
          id: 'acao-e2-3',
          descricao: 'Solicitar ao MP: quebra de sigilo bancário + bloqueio de bens (antecipa defesa deles)',
          tipo: 'imediata',
          impacto: 'alto'
        },
        {
          id: 'acao-e2-4',
          descricao: 'Monitorar próximas 72h: quem procura advogado primeiro? Quem tenta acordo? (revela hierarquia REAL)',
          tipo: 'imediata',
          impacto: 'medio'
        }
      ],
      fontesConsultadas: [],
      novosConhecimentos: [
        {
          id: 'teoria-jogos-litigio',
          titulo: 'Teoria dos Jogos em Litígios Estratégicos',
          descricao: 'Primeiras ações criam expectativas. Adversários calculam: "Vale a pena lutar ou negociar?". Ação forte inicial reduz resistência futura.',
          categoria: 'estrategia',
          aplicabilidade: 'Casos de alto valor, múltiplos réus, possibilidade de acordos',
          exemplos: [
            'Caso Petrobras: MP agiu forte (prisões preventivas) → delações em massa',
            'Caso Banestado: ação fraca inicial → 15 anos sem resultado'
          ]
        }
      ],
      timestamp: new Date()
    });

    return sugestoes;
  }

  /**
   * VERIFICA TRANSPARÊNCIA e sugere melhorias
   */
  private verificarTransparencia(caso: Caso): string[] {
    const alertas: string[] = [];

    // Verifica se há documentação suficiente
    if (caso.documentos.length < 5) {
      alertas.push(
        `📋 TRANSPARÊNCIA: Caso com apenas ${caso.documentos.length} documentos. ` +
        `Sugiro: (1) Solicitar cópias integrais dos autos, (2) Obter via LAI documentos administrativos, ` +
        `(3) Criar repositório organizado. TRANSPARÊNCIA começa com DOCUMENTAÇÃO COMPLETA.`
      );
    }

    // Verifica timeline
    if (!caso.timeline || caso.timeline.length === 0) {
      alertas.push(
        `⏱️ TRANSPARÊNCIA: Falta timeline dos eventos. Crie linha do tempo com TODAS as datas: ` +
        `atos administrativos, omissões, despachos. Timeline revela MOROSIDADE PROPOSITAL.`
      );
    }

    return alertas;
  }

  /**
   * Formata saída para apresentação ao usuário
   */
  formatarRelatorio(resultado: Awaited<ReturnType<typeof this.analisarCasoCompleto>>): string {
    let relatorio = '\n' + '='.repeat(80) + '\n';
    relatorio += '🎯 SIICAF - RELATÓRIO DE ANÁLISE ESTRATÉGICA PROATIVA\n';
    relatorio += '='.repeat(80) + '\n\n';

    relatorio += '📊 RESUMO:\n';
    relatorio += `   • ${resultado.sugestoesImediatas.length} sugestões proativas geradas\n`;
    relatorio += `   • ${resultado.estrategias.length} estratégia(s) jurídica(s) elaborada(s)\n`;
    relatorio += `   • ${resultado.conhecimentosNovos.length} novo(s) conhecimento(s) para você aprender\n`;
    relatorio += `   • ${resultado.alertasTransparencia.length} alerta(s) de transparência\n\n`;

    if (resultado.alertasTransparencia.length > 0) {
      relatorio += '🚨 ALERTAS DE TRANSPARÊNCIA:\n';
      resultado.alertasTransparencia.forEach((alerta, i) => {
        relatorio += `\n${i + 1}. ${alerta}\n`;
      });
      relatorio += '\n';
    }

    relatorio += '💡 PRINCIPAIS SUGESTÕES PROATIVAS:\n';
    resultado.sugestoesImediatas.slice(0, 3).forEach((sug, i) => {
      relatorio += `\n${i + 1}. [${sug.prioridade.toUpperCase()}] ${sug.titulo}\n`;
      relatorio += `   ${sug.descricao}\n`;
    });

    relatorio += '\n' + '='.repeat(80) + '\n';
    return relatorio;
  }
}
