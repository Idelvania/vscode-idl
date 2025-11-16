/**
 * SIICAF - Sistema de Inteligência e Investigação de Condutas Antijurídicas e Fraudes
 * Tipos e Interfaces TypeScript
 */

/**
 * Níveis de gravidade para violações
 */
export enum GravidadeViolacao {
  MUITO_BAIXA = 1,
  BAIXA = 2,
  MEDIA = 3,
  ALTA = 4,
  MUITO_ALTA = 5,
  CRITICA = 6
}

/**
 * Cores para gradação de gravidade
 */
export const CORES_GRAVIDADE = {
  [GravidadeViolacao.MUITO_BAIXA]: '#28A745', // Verde
  [GravidadeViolacao.BAIXA]: '#17A2B8',       // Azul
  [GravidadeViolacao.MEDIA]: '#FFC107',       // Amarelo
  [GravidadeViolacao.ALTA]: '#FD7E14',        // Laranja
  [GravidadeViolacao.MUITO_ALTA]: '#DC3545',  // Vermelho
  [GravidadeViolacao.CRITICA]: '#8B0000'      // Vermelho escuro
};

/**
 * Tipos de violações processuais
 */
export enum TipoViolacao {
  DECISAO_INTERLOCUTORIA_ERRADA = 'DECISAO_INTERLOCUTORIA_ERRADA',
  APELACAO_INDEVIDA = 'APELACAO_INDEVIDA',
  SENTENCA_INCOMPLETA = 'SENTENCA_INCOMPLETA',
  ACORDAO_OMISSO = 'ACORDAO_OMISSO',
  CORRUPCAO = 'CORRUPCAO',
  VIOLACAO_ETICA_OAB = 'VIOLACAO_ETICA_OAB',
  VIOLACAO_ETICA_MAGISTRATURA = 'VIOLACAO_ETICA_MAGISTRATURA',
  VIOLACAO_ETICA_PROCURADORIA = 'VIOLACAO_ETICA_PROCURADORIA',
  VIOLACAO_ETICA_PROMOTORIA = 'VIOLACAO_ETICA_PROMOTORIA',
  VIOLACAO_DEVIDO_PROCESSO = 'VIOLACAO_DEVIDO_PROCESSO',
  GASTOS_EXCESSIVOS = 'GASTOS_EXCESSIVOS',
  NEPOTISMO = 'NEPOTISMO',
  FAVORECIMENTO_ILICITO = 'FAVORECIMENTO_ILICITO'
}

/**
 * Código de ética profissional
 */
export interface CodigoEtica {
  codigo: string;
  orgao: 'OAB' | 'MAGISTRATURA' | 'PROCURADORIA' | 'PROMOTORIA' | 'SERVENTUARIOS' | 'TI';
  artigo: string;
  descricao: string;
  penalidadePrevista: string;
}

/**
 * Processo investigado
 */
export interface ProcessoInvestigado {
  numero: string;
  tribunal: string;
  estado: string;
  comarca: string;
  instancia: 'PRIMEIRA' | 'SEGUNDA' | 'SUPERIOR';
  dataDistribuicao: Date;
  valor?: number;
  partes: {
    autor: string;
    reu: string;
    advogados: string[];
    juiz?: string;
    promotor?: string;
  };
  movimentacoes: MovimentacaoProcessual[];
  violacoesDetectadas: ViolacaoDetectada[];
  custoEstimado?: number;
}

/**
 * Movimentação processual
 */
export interface MovimentacaoProcessual {
  data: Date;
  tipo: string;
  descricao: string;
  responsavel: string;
  documentos?: string[];
}

/**
 * Violação detectada
 */
export interface ViolacaoDetectada {
  id: string;
  tipo: TipoViolacao;
  gravidade: GravidadeViolacao;
  descricao: string;
  fundamentacao: string;
  codigosEticaViolados: CodigoEtica[];
  responsavel?: string;
  dataDeteccao: Date;
  evidencias: string[];
  custoEstimado?: number;
  cuiBono?: AnaliseCuiBono;
}

/**
 * Análise Cui Bono (Quem se beneficia)
 */
export interface AnaliseCuiBono {
  beneficiarios: Beneficiario[];
  valorBeneficio: number;
  tiposBeneficios: string[];
  rede: RedeRelacionamentos;
  score: number; // 0-100
  analiseDetalhada: string;
}

/**
 * Beneficiário identificado
 */
export interface Beneficiario {
  nome: string;
  cpfCnpj?: string;
  tipo: 'PESSOA_FISICA' | 'PESSOA_JURIDICA' | 'ORGAO_PUBLICO';
  cargo?: string;
  relacionamentos: string[];
  beneficioEstimado: number;
  evidencias: string[];
}

/**
 * Rede de relacionamentos
 */
export interface RedeRelacionamentos {
  nos: {
    id: string;
    nome: string;
    tipo: string;
  }[];
  conexoes: {
    origem: string;
    destino: string;
    tipo: string;
    forca: number; // 0-1
  }[];
}

/**
 * Dados de gastos do Judiciário
 */
export interface GastosJudiciario {
  tribunal: string;
  estado: string;
  ano: number;
  mes?: number;
  despesaTotal: number;
  despesaPessoal: number;
  despesaCapital: number;
  despesaCusteio: number;
  gastoPorProcesso?: number;
  fonte: 'PORTAL_TRANSPARENCIA' | 'CNJ';
  dataAtualizacao: Date;
}

/**
 * Comparação de gastos entre tribunais
 */
export interface ComparacaoGastos {
  tribunalReferencia: GastosJudiciario; // TJ-GO
  tribunalComparado: GastosJudiciario;
  diferencaPercentual: number;
  diferencaAbsoluta: number;
  analise: string;
}

/**
 * Relatório de análise
 */
export interface RelatorioAnalise {
  id: string;
  dataGeracao: Date;
  processo: ProcessoInvestigado;
  violacoes: ViolacaoDetectada[];
  analiseCuiBono: AnaliseCuiBono;
  comparacaoGastos: ComparacaoGastos[];
  organograma?: any; // Estrutura do organograma
  graficos: Grafico[];
  tabelas: Tabela[];
  conclusoes: string;
  recomendacoes: string[];
}

/**
 * Gráfico para visualização
 */
export interface Grafico {
  tipo: 'BARRA' | 'LINHA' | 'PIZZA' | 'DISPERSAO' | 'REDE';
  titulo: string;
  dados: any;
  configuracao: any;
}

/**
 * Tabela para visualização
 */
export interface Tabela {
  titulo: string;
  colunas: string[];
  linhas: any[][];
  formatacao?: {
    coresGravidade?: boolean;
    ordenacao?: string;
  };
}

/**
 * Configuração de análise
 */
export interface ConfiguracaoAnalise {
  tribunalReferencia: string; // 'TJ-GO'
  estadoReferencia: string;   // 'GO'
  ano: number;
  incluirPortalTransparencia: boolean;
  incluirCNJ: boolean;
  nivelMinimoGravidade: GravidadeViolacao;
  gerarOrganograma: boolean;
  gerarGraficos: boolean;
  formatoRelatorio: 'PDF' | 'HTML' | 'JSON' | 'MARKDOWN';
}
