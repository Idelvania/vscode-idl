/**
 * SIICAF Legal AI - Sistema Inteligente de Análise de Casos e Aprendizado Forense
 *
 * Sistema que APRENDE com o caso E ENSINA o usuário através de sugestões proativas
 */

export interface Documento {
  id: string;
  tipo: 'peticao' | 'sentenca' | 'prova' | 'parecer' | 'lei' | 'precedente' | 'outro';
  titulo: string;
  conteudo: string;
  metadados: {
    data?: Date;
    autor?: string;
    fonte?: string;
    tags?: string[];
  };
}

export interface Caso {
  id: string;
  titulo: string;
  descricao: string;
  documentos: Documento[];
  timeline: EventoCaso[];
  partes: Parte[];
  temas: string[];
  objetivos: string[];
}

export interface EventoCaso {
  id: string;
  data: Date;
  tipo: string;
  descricao: string;
  documentosRelacionados: string[];
}

export interface Parte {
  id: string;
  nome: string;
  tipo: 'autor' | 'reu' | 'testemunha' | 'perito' | 'autoridade' | 'outro';
  cargo?: string;
  responsabilidade?: string;
  provasContra?: string[];
}

export interface SugestaoProativa {
  id: string;
  tipo: 'estrategia' | 'investigacao' | 'juridica' | 'processual' | 'aprendizado';
  prioridade: 'critica' | 'alta' | 'media' | 'baixa';
  titulo: string;
  descricao: string;
  fundamentacao: string;
  acoes: AcaoSugerida[];
  fontesConsultadas: FonteJuridica[];
  novosConhecimentos: Conhecimento[];
  timestamp: Date;
}

export interface AcaoSugerida {
  id: string;
  descricao: string;
  tipo: 'imediata' | 'curto_prazo' | 'medio_prazo' | 'longo_prazo';
  impacto: 'alto' | 'medio' | 'baixo';
  recursosNecessarios?: string[];
}

export interface FonteJuridica {
  tipo: 'lei' | 'jurisprudencia' | 'doutrina' | 'sumula' | 'regulamento';
  identificacao: string;
  titulo: string;
  ementa?: string;
  url?: string;
  relevancia: number; // 0-100
}

export interface Conhecimento {
  id: string;
  titulo: string;
  descricao: string;
  categoria: 'conceito' | 'precedente' | 'estrategia' | 'tese' | 'procedimento';
  aplicabilidade: string;
  exemplos?: string[];
  referencias?: FonteJuridica[];
}

export interface AnaliseDocumento {
  documentoId: string;
  entidadesIdentificadas: Entidade[];
  temasExtraidos: string[];
  relacoesEncontradas: Relacao[];
  inconsistencias: Inconsistencia[];
  sugestoesAnalise: SugestaoProativa[];
}

export interface Entidade {
  texto: string;
  tipo: 'pessoa' | 'organizacao' | 'lei' | 'data' | 'valor' | 'local' | 'cargo';
  contexto: string;
  relevancia: number;
}

export interface Relacao {
  origem: string;
  destino: string;
  tipo: string;
  confianca: number;
  evidencias: string[];
}

export interface Inconsistencia {
  tipo: 'temporal' | 'factual' | 'juridica' | 'documental';
  descricao: string;
  documentosEnvolvidos: string[];
  sugestaoResolucao: string;
}

export interface EstrategiaJuridica {
  id: string;
  titulo: string;
  objetivo: string;
  fundamentacao: string;
  passos: PassoEstrategico[];
  riscosOportunidades: RiscoOportunidade[];
  previsaoResultado: PrevisaoResultado;
  alternativas: EstrategiaAlternativa[];
}

export interface PassoEstrategico {
  ordem: number;
  descricao: string;
  prazo: string;
  responsavel?: string;
  dependencias?: number[];
  status: 'pendente' | 'em_andamento' | 'concluido';
}

export interface RiscoOportunidade {
  tipo: 'risco' | 'oportunidade';
  descricao: string;
  probabilidade: 'alta' | 'media' | 'baixa';
  impacto: 'alto' | 'medio' | 'baixo';
  mitigacao?: string;
}

export interface PrevisaoResultado {
  cenarios: Cenario[];
  recomendacao: string;
}

export interface Cenario {
  nome: string;
  probabilidade: number;
  descricao: string;
  impactos: string[];
}

export interface EstrategiaAlternativa {
  titulo: string;
  descricao: string;
  vantagens: string[];
  desvantagens: string[];
}

export interface AprendizadoCaso {
  casoId: string;
  conhecimentosAdquiridos: Conhecimento[];
  padroesDetetados: Padrao[];
  licoesAprendidas: LicaoAprendida[];
  sugestoesAprimoramento: SugestaoProativa[];
}

export interface Padrao {
  id: string;
  tipo: string;
  descricao: string;
  ocorrencias: number;
  confiabilidade: number;
  aplicacoes: string[];
}

export interface LicaoAprendida {
  id: string;
  titulo: string;
  descricao: string;
  contexto: string;
  aplicabilidadeFutura: string;
  categoria: string;
}
