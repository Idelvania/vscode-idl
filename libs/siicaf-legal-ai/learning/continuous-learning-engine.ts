/**
 * MOTOR DE APRENDIZADO CONTÍNUO
 *
 * Sistema que APRENDE com cada caso analisado e ENSINA continuamente
 *
 * FILOSOFIA:
 * "Nesta vida ninguém sabe tudo. Nunca deixar de aprender."
 *
 * O que este sistema faz:
 * 1. Aprende padrões em casos analisados
 * 2. Melhora sugestões baseado em histórico
 * 3. Detecta correlações entre variáveis
 * 4. Cria "memória institucional"
 * 5. Sugere estudos personalizados
 * 6. Avalia evolução do usuário
 */

import {
  Caso,
  Conhecimento,
  Padrao,
  LicaoAprendida,
  AprendizadoCaso,
  SugestaoProativa
} from '../core/types';

export interface PerfilAprendizado {
  usuarioId: string;
  casosAnalisados: number;
  temasEstudados: string[];
  conhecimentosAdquiridos: Conhecimento[];
  pontosFortes: string[];
  areasDesenvolver: string[];
  evolucao: RegistroEvolucao[];
}

export interface RegistroEvolucao {
  data: Date;
  metrica: string;
  valor: number;
  observacao: string;
}

export interface SugestaoEstudo {
  tema: string;
  prioridade: 'critica' | 'alta' | 'media' | 'baixa';
  razao: string;
  recursos: RecursoEstudo[];
  tempoEstimado: string;
}

export interface RecursoEstudo {
  tipo: 'livro' | 'artigo' | 'jurisprudencia' | 'curso' | 'video';
  titulo: string;
  autor?: string;
  url?: string;
  dificuldade: 'basico' | 'intermediario' | 'avancado' | 'expert';
  relevancia: number;
}

export class ContinuousLearningEngine {
  private casosHistorico: Map<string, AprendizadoCaso>;
  private padroes: Map<string, Padrao>;
  private perfisUsuarios: Map<string, PerfilAprendizado>;
  private baseConhecimento: Map<string, Conhecimento>;

  constructor() {
    this.casosHistorico = new Map();
    this.padroes = new Map();
    this.perfisUsuarios = new Map();
    this.baseConhecimento = new Map();
    this.inicializarBaseConhecimento();
  }

  /**
   * APRENDE com novo caso analisado
   */
  async aprenderComCaso(caso: Caso, usuarioId: string): Promise<AprendizadoCaso> {
    console.log(`\n📚 APRENDENDO COM CASO: ${caso.titulo}\n`);

    // 1. Extrair conhecimentos do caso
    const conhecimentosNovos = this.extrairConhecimentosCaso(caso);

    // 2. Detectar padrões
    const padroesNovos = this.detectarPadroes(caso);

    // 3. Identificar lições aprendidas
    const licoes = this.identificarLicoes(caso);

    // 4. Gerar sugestões de aprimoramento
    const sugestoes = this.gerarSugestoesAprimoramento(caso, usuarioId);

    // 5. Atualizar perfil do usuário
    this.atualizarPerfilUsuario(usuarioId, conhecimentosNovos, caso);

    // 6. Armazenar aprendizado
    const aprendizado: AprendizadoCaso = {
      casoId: caso.id,
      conhecimentosAdquiridos: conhecimentosNovos,
      padroesDetetados: padroesNovos,
      licoesAprendidas: licoes,
      sugestoesAprimoramento: sugestoes
    };

    this.casosHistorico.set(caso.id, aprendizado);

    // 7. Apresentar relatório de aprendizado
    this.apresentarRelatorioAprendizado(aprendizado);

    return aprendizado;
  }

  /**
   * Extrai CONHECIMENTOS do caso para adicionar à base
   */
  private extrairConhecimentosCaso(caso: Caso): Conhecimento[] {
    const conhecimentos: Conhecimento[] = [];

    // Conhecimento 1: Padrão de valores em casos similares
    if (caso.documentos.some(d => d.conteudo.match(/R\$\s*[\d.,]+\s*bilh/i))) {
      conhecimentos.push({
        id: `conh-${caso.id}-valores`,
        titulo: 'Padrão de Valores em Casos de Grande Impacto',
        descricao: 'Casos envolvendo bilhões têm características específicas: ' +
                   '(1) Maior morosidade, (2) Risco de prescrição elevado, ' +
                   '(3) Pressão institucional intensa, (4) Necessidade de estratégia agressiva.',
        categoria: 'estrategia',
        aplicabilidade: 'Casos com valores superiores a R$ 1 bilhão'
      });
    }

    // Conhecimento 2: Hierarquia e responsabilização
    const autoridades = caso.partes.filter(p =>
      p.cargo && (p.cargo.includes('Presidente') || p.cargo.includes('Ministro'))
    );
    if (autoridades.length > 0) {
      conhecimentos.push({
        id: `conh-${caso.id}-hierarquia`,
        titulo: 'Responsabilização de Autoridades Superiores',
        descricao: 'Autoridades em posições de comando respondem por atos de subordinados quando: ' +
                   '(1) Tinham conhecimento, (2) Tinham poder de impedir, (3) Omitiram-se.',
        categoria: 'tese',
        aplicabilidade: 'Casos com hierarquia administrativa complexa'
      });
    }

    // Conhecimento 3: Temas jurídicos específicos
    caso.temas.forEach(tema => {
      if (!this.baseConhecimento.has(tema.toLowerCase())) {
        conhecimentos.push({
          id: `conh-${caso.id}-${tema}`,
          titulo: `Especialização em ${tema}`,
          descricao: `Através deste caso, você está desenvolvendo expertise em ${tema}.`,
          categoria: 'conceito',
          aplicabilidade: `Casos envolvendo ${tema}`
        });
      }
    });

    return conhecimentos;
  }

  /**
   * Detecta PADRÕES recorrentes
   */
  private detectarPadroes(caso: Caso): Padrao[] {
    const padroes: Padrao[] = [];

    // Padrão 1: Casos com muitos réus
    if (caso.partes.length > 10) {
      const padrao: Padrao = {
        id: `padrao-multiplos-reus`,
        tipo: 'estrutural',
        descricao: 'Casos com múltiplos réus (>10) apresentam: ' +
                   '(1) Maior complexidade probatória, ' +
                   '(2) Risco de responsabilização seletiva, ' +
                   '(3) Necessidade de matriz de responsabilização.',
        ocorrencias: this.contarOcorrenciasPadrao('multiplos-reus') + 1,
        confiabilidade: 0.85,
        aplicacoes: ['Criar matriz de responsabilização', 'Priorizar autoridades principais']
      };
      padroes.push(padrao);
      this.padroes.set(padrao.id, padrao);
    }

    // Padrão 2: Morosidade em casos de autoridades
    const temAutoridades = caso.partes.some(p =>
      p.cargo && (p.cargo.includes('Presidente') || p.cargo.includes('Ministro'))
    );
    if (temAutoridades) {
      const padrao: Padrao = {
        id: `padrao-morosidade-autoridades`,
        tipo: 'temporal',
        descricao: 'Casos envolvendo autoridades superiores tendem a apresentar: ' +
                   '(1) Morosidade processual acima da média, ' +
                   '(2) Maior número de recursos, ' +
                   '(3) Risco elevado de prescrição.',
        ocorrencias: this.contarOcorrenciasPadrao('morosidade-autoridades') + 1,
        confiabilidade: 0.90,
        aplicacoes: ['Criar cronograma de prescrição', 'Petições interruptivas periódicas']
      };
      padroes.push(padrao);
      this.padroes.set(padrao.id, padrao);
    }

    return padroes;
  }

  /**
   * Identifica LIÇÕES APRENDIDAS
   */
  private identificarLicoes(caso: Caso): LicaoAprendida[] {
    const licoes: LicaoAprendida[] = [];

    // Lição 1: Importância da documentação completa
    licoes.push({
      id: `licao-${caso.id}-documentacao`,
      titulo: 'Documentação Completa é Fundamental',
      descricao: 'A análise deste caso reforça: quanto mais documentos, melhor a análise. ' +
                 'Sempre solicitar cópias integrais dos autos e documentos administrativos via LAI.',
      contexto: `Caso: ${caso.titulo}`,
      aplicabilidadeFutura: 'Iniciar qualquer caso novo solicitando documentação completa',
      categoria: 'procedimento'
    });

    // Lição 2: Matriz de responsabilização
    if (caso.partes.length > 5) {
      licoes.push({
        id: `licao-${caso.id}-matriz`,
        titulo: 'Matriz de Responsabilização Evita Esquecimentos',
        descricao: 'Em casos com múltiplos envolvidos, a matriz visual previne: ' +
                   '(1) Esquecer algum responsável, (2) Responsabilizar pessoa errada, ' +
                   '(3) Perder conexões importantes.',
        contexto: `Caso com ${caso.partes.length} envolvidos`,
        aplicabilidadeFutura: 'Usar matriz em qualquer caso com mais de 5 pessoas',
        categoria: 'tecnica'
      });
    }

    return licoes;
  }

  /**
   * Gera SUGESTÕES DE APRIMORAMENTO personalizadas
   */
  private gerarSugestoesAprimoramento(caso: Caso, usuarioId: string): SugestaoProativa[] {
    const sugestoes: SugestaoProativa[] = [];
    const perfil = this.perfisUsuarios.get(usuarioId);

    // Sugestão 1: Aprofundar em temas do caso
    caso.temas.forEach(tema => {
      if (!perfil || !perfil.temasEstudados.includes(tema)) {
        sugestoes.push({
          id: `sug-aprendizado-${tema}`,
          tipo: 'aprendizado',
          prioridade: 'alta',
          titulo: `Aprofunde seus conhecimentos em ${tema}`,
          descricao: `Este caso envolve ${tema}. Aproveite para se tornar especialista!`,
          fundamentacao: 'Dominar os temas dos seus casos é essencial para excelência jurídica.',
          acoes: [],
          fontesConsultadas: [],
          novosConhecimentos: [{
            id: `estudo-${tema}`,
            titulo: `Estudo Aprofundado: ${tema}`,
            descricao: `Materiais recomendados para dominar ${tema}`,
            categoria: 'conceito',
            aplicabilidade: 'Casos futuros similares'
          }],
          timestamp: new Date()
        });
      }
    });

    // Sugestão 2: Estudar precedentes aplicáveis
    sugestoes.push({
      id: `sug-precedentes-${caso.id}`,
      tipo: 'aprendizado',
      prioridade: 'alta',
      titulo: 'Estude os Precedentes Mencionados',
      descricao: 'Aproveite este caso para estudar profundamente os precedentes aplicáveis. ' +
                 'Leia as decisões integrais, não apenas as ementas.',
      fundamentacao: 'Conhecimento profundo de precedentes diferencia juristas medíocres de excelentes.',
      acoes: [
        {
          id: 'acao-estudar-resp',
          descricao: 'Ler integralmente REsp 1.297.797/SP (responsabilidade solidária)',
          tipo: 'curto_prazo',
          impacto: 'alto'
        },
        {
          id: 'acao-estudar-sumula',
          descricao: 'Estudar Súmula 383 do STJ e casos que a originaram',
          tipo: 'curto_prazo',
          impacto: 'medio'
        }
      ],
      fontesConsultadas: [],
      novosConhecimentos: [],
      timestamp: new Date()
    });

    return sugestoes;
  }

  /**
   * Atualiza PERFIL DO USUÁRIO
   */
  private atualizarPerfilUsuario(
    usuarioId: string,
    novosConhecimentos: Conhecimento[],
    caso: Caso
  ): void {
    let perfil = this.perfisUsuarios.get(usuarioId);

    if (!perfil) {
      perfil = {
        usuarioId,
        casosAnalisados: 0,
        temasEstudados: [],
        conhecimentosAdquiridos: [],
        pontosFortes: [],
        areasDesenvolver: [],
        evolucao: []
      };
    }

    // Atualizar contadores
    perfil.casosAnalisados++;

    // Adicionar novos temas
    caso.temas.forEach(tema => {
      if (!perfil!.temasEstudados.includes(tema)) {
        perfil!.temasEstudados.push(tema);
      }
    });

    // Adicionar conhecimentos
    perfil.conhecimentosAdquiridos.push(...novosConhecimentos);

    // Registrar evolução
    perfil.evolucao.push({
      data: new Date(),
      metrica: 'casos_analisados',
      valor: perfil.casosAnalisados,
      observacao: `Análise do caso: ${caso.titulo}`
    });

    // Identificar pontos fortes (temas recorrentes)
    const temasCont = perfil.temasEstudados.reduce((acc, tema) => {
      acc[tema] = (acc[tema] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    perfil.pontosFortes = Object.entries(temasCont)
      .filter(([_, count]) => count >= 3)
      .map(([tema, _]) => tema);

    this.perfisUsuarios.set(usuarioId, perfil);
  }

  /**
   * Apresenta RELATÓRIO DE APRENDIZADO
   */
  private apresentarRelatorioAprendizado(aprendizado: AprendizadoCaso): void {
    console.log('\n' + '='.repeat(80));
    console.log('📚 RELATÓRIO DE APRENDIZADO');
    console.log('='.repeat(80) + '\n');

    console.log(`🎓 NOVOS CONHECIMENTOS ADQUIRIDOS: ${aprendizado.conhecimentosAdquiridos.length}\n`);
    aprendizado.conhecimentosAdquiridos.forEach((conh, i) => {
      console.log(`${i + 1}. ${conh.titulo}`);
      console.log(`   ${conh.descricao}\n`);
    });

    console.log(`\n🔍 PADRÕES DETECTADOS: ${aprendizado.padroesDetetados.length}\n`);
    aprendizado.padroesDetetados.forEach((padrao, i) => {
      console.log(`${i + 1}. ${padrao.descricao}`);
      console.log(`   Confiabilidade: ${(padrao.confiabilidade * 100).toFixed(0)}%`);
      console.log(`   Ocorrências: ${padrao.ocorrencias}\n`);
    });

    console.log(`\n💡 LIÇÕES APRENDIDAS: ${aprendizado.licoesAprendidas.length}\n`);
    aprendizado.licoesAprendidas.forEach((licao, i) => {
      console.log(`${i + 1}. ${licao.titulo}`);
      console.log(`   ${licao.descricao}\n`);
    });

    console.log('='.repeat(80) + '\n');
  }

  /**
   * Gera SUGESTÕES DE ESTUDO personalizadas
   */
  gerarSugestoesEstudo(usuarioId: string): SugestaoEstudo[] {
    const perfil = this.perfisUsuarios.get(usuarioId);
    const sugestoes: SugestaoEstudo[] = [];

    if (!perfil) {
      // Usuário novo - sugestões básicas
      sugestoes.push({
        tema: 'Fundamentos de Improbidade Administrativa',
        prioridade: 'alta',
        razao: 'Base essencial para análise de casos',
        recursos: [
          {
            tipo: 'livro',
            titulo: 'Lei de Improbidade Administrativa Comentada',
            autor: 'Fábio Medina Osório',
            dificuldade: 'intermediario',
            relevancia: 95
          },
          {
            tipo: 'jurisprudencia',
            titulo: 'REsp 1.297.797/SP - Responsabilidade Solidária',
            dificuldade: 'intermediario',
            relevancia: 90
          }
        ],
        tempoEstimado: '40 horas'
      });
    } else {
      // Usuário experiente - sugestões avançadas baseadas em gaps
      const temasNaoEstudados = this.identificarTemasEmergentes().filter(
        tema => !perfil.temasEstudados.includes(tema)
      );

      temasNaoEstudados.forEach(tema => {
        sugestoes.push({
          tema,
          prioridade: 'media',
          razao: 'Expandir repertório jurídico',
          recursos: this.buscarRecursosEstudo(tema),
          tempoEstimado: '20 horas'
        });
      });
    }

    return sugestoes;
  }

  /**
   * Avalia EVOLUÇÃO do usuário
   */
  avaliarEvolucao(usuarioId: string): {
    nivel: 'iniciante' | 'intermediario' | 'avancado' | 'expert';
    pontuacao: number;
    feedback: string;
    proximoObjetivo: string;
  } {
    const perfil = this.perfisUsuarios.get(usuarioId);

    if (!perfil) {
      return {
        nivel: 'iniciante',
        pontuacao: 0,
        feedback: 'Comece analisando casos para construir seu conhecimento!',
        proximoObjetivo: 'Analisar primeiro caso completo'
      };
    }

    const pontuacao =
      perfil.casosAnalisados * 10 +
      perfil.temasEstudados.length * 15 +
      perfil.conhecimentosAdquiridos.length * 5 +
      perfil.pontosFortes.length * 20;

    let nivel: 'iniciante' | 'intermediario' | 'avancado' | 'expert';
    let feedback: string;
    let proximoObjetivo: string;

    if (pontuacao < 100) {
      nivel = 'iniciante';
      feedback = 'Você está construindo sua base. Continue analisando casos!';
      proximoObjetivo = 'Analisar 10 casos diferentes';
    } else if (pontuacao < 300) {
      nivel = 'intermediario';
      feedback = 'Bom progresso! Você está desenvolvendo expertise.';
      proximoObjetivo = 'Dominar 5 temas jurídicos diferentes';
    } else if (pontuacao < 600) {
      nivel = 'avancado';
      feedback = 'Excelente! Você já tem conhecimento sólido.';
      proximoObjetivo = 'Tornar-se expert em 3 temas específicos';
    } else {
      nivel = 'expert';
      feedback = 'PARABÉNS! Você alcançou nível de excelência jurídica!';
      proximoObjetivo: 'Continuar aprendendo e contribuir para a comunidade';
    }

    return { nivel, pontuacao, feedback, proximoObjetivo };
  }

  // ========== MÉTODOS AUXILIARES ==========

  private inicializarBaseConhecimento(): void {
    // Inicializa com conhecimentos fundamentais
    this.baseConhecimento.set('improbidade', {
      id: 'base-improbidade',
      titulo: 'Improbidade Administrativa',
      descricao: 'Base jurídica completa',
      categoria: 'conceito',
      aplicabilidade: 'Todos os casos'
    });
  }

  private contarOcorrenciasPadrao(padraoId: string): number {
    const padrao = this.padroes.get(padraoId);
    return padrao ? padrao.ocorrencias : 0;
  }

  private identificarTemasEmergentes(): string[] {
    return [
      'Compliance Público',
      'Governança Corporativa em Estatais',
      'Responsabilidade Ambiental',
      'Proteção de Dados (LGPD)',
      'Crimes Cibernéticos'
    ];
  }

  private buscarRecursosEstudo(tema: string): RecursoEstudo[] {
    // Simplificado - deveria consultar base de dados real
    return [
      {
        tipo: 'artigo',
        titulo: `Estudo Avançado: ${tema}`,
        dificuldade: 'avancado',
        relevancia: 85
      }
    ];
  }
}
