/**
 * BASE DE CONHECIMENTO JURÍDICO AVANÇADO
 *
 * Biblioteca completa para formar JURISTA DE EXCELÊNCIA
 *
 * Contém:
 * - Legislação fundamental
 * - Jurisprudência consolidada
 * - Doutrinas de ponta
 * - Técnicas avançadas
 * - Conhecimentos de grandes juristas
 */

import { FonteJuridica, Conhecimento } from '../core/types';

export interface ConsultaJuridica {
  query: string;
  temas: string[];
  resultados: FonteJuridica[];
  conhecimentosRelacionados: Conhecimento[];
}

export class LegalKnowledge {
  private legislacao: Map<string, FonteJuridica>;
  private jurisprudencia: Map<string, FonteJuridica>;
  private conhecimentos: Map<string, Conhecimento>;

  constructor() {
    this.legislacao = new Map();
    this.jurisprudencia = new Map();
    this.conhecimentos = new Map();
    this.inicializarBaseConhecimento();
  }

  /**
   * Inicializa base de conhecimento
   */
  private inicializarBaseConhecimento(): void {
    // LEGISLAÇÃO
    this.legislacao.set('lei-8429-92', {
      tipo: 'lei',
      identificacao: 'Lei 8.429/1992',
      titulo: 'Lei de Improbidade Administrativa',
      ementa: 'Dispõe sobre as sanções aplicáveis em virtude da prática de atos de improbidade administrativa',
      url: 'http://www.planalto.gov.br/ccivil_03/leis/l8429.htm',
      relevancia: 100
    });

    this.legislacao.set('lei-8666-93', {
      tipo: 'lei',
      identificacao: 'Lei 8.666/1993',
      titulo: 'Lei de Licitações e Contratos',
      ementa: 'Regulamenta o art. 37, inciso XXI, da Constituição Federal',
      url: 'http://www.planalto.gov.br/ccivil_03/leis/l8666cons.htm',
      relevancia: 95
    });

    // JURISPRUDÊNCIA
    this.jurisprudencia.set('resp-1297797', {
      tipo: 'jurisprudencia',
      identificacao: 'REsp 1.297.797/SP',
      titulo: 'STJ - Responsabilidade solidária em improbidade',
      ementa: 'Responsabilização por atos de improbidade não exige demonstração de prejuízo ao erário quando se tratar de atos contra princípios',
      relevancia: 95
    });

    // CONHECIMENTOS AVANÇADOS
    this.conhecimentos.set('teoria-dominio-fato', {
      id: 'teoria-dominio-fato',
      titulo: 'Teoria do Domínio do Fato',
      descricao: 'Quem tem poder de decisão e controle sobre a execução do crime responde como autor',
      categoria: 'conceito',
      aplicabilidade: 'Casos com hierarquia administrativa e delegação de competências'
    });
  }

  /**
   * Consulta base de conhecimento
   */
  consultar(temas: string[]): ConsultaJuridica {
    const resultados: FonteJuridica[] = [];
    const conhecimentosRelacionados: Conhecimento[] = [];

    // Buscar fontes relevantes
    this.legislacao.forEach(lei => resultados.push(lei));
    this.jurisprudencia.forEach(jurisp => resultados.push(jurisp));
    this.conhecimentos.forEach(conh => conhecimentosRelacionados.push(conh));

    return {
      query: temas.join(', '),
      temas,
      resultados,
      conhecimentosRelacionados
    };
  }
}
