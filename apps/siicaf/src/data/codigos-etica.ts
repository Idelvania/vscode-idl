/**
 * Base de dados de Códigos de Ética
 * Fundamentação legal para análise de violações
 */

import { CodigoEtica } from '../types';

/**
 * Código de Ética da OAB
 * Estatuto da Advocacia e da OAB (Lei 8.906/94)
 * Código de Ética e Disciplina da OAB (Resolução 02/2015)
 */
export const CODIGO_ETICA_OAB: CodigoEtica[] = [
  {
    codigo: 'OAB-ART-2',
    orgao: 'OAB',
    artigo: 'Art. 2º',
    descricao: 'O advogado deve atuar com destemor, independência, honestidade, decoro, veracidade, lealdade, dignidade e boa-fé.',
    penalidadePrevista: 'Censura, suspensão ou exclusão'
  },
  {
    codigo: 'OAB-ART-6',
    orgao: 'OAB',
    artigo: 'Art. 6º',
    descricao: 'É defeso ao advogado expor os fatos em juízo falseando deliberadamente a verdade ou estribando-se na má-fé.',
    penalidadePrevista: 'Suspensão ou exclusão'
  },
  {
    codigo: 'OAB-ART-20',
    orgao: 'OAB',
    artigo: 'Art. 20',
    descricao: 'O advogado deve abster-se de patrocinar causa contrária à ética, à moral ou à validade de ato jurídico em que tenha colaborado.',
    penalidadePrevista: 'Censura ou suspensão'
  },
  {
    codigo: 'OAB-ART-34-IV',
    orgao: 'OAB',
    artigo: 'Art. 34, IV',
    descricao: 'Constitui infração disciplinar: lançar mão de meios ou expedientes ilícitos para obtenção de resultado.',
    penalidadePrevista: 'Suspensão ou exclusão'
  }
];

/**
 * Código de Ética da Magistratura
 * Resolução CNJ nº 60/2008 - LOMAN (Lei Complementar 35/1979)
 */
export const CODIGO_ETICA_MAGISTRATURA: CodigoEtica[] = [
  {
    codigo: 'MAG-ART-8',
    orgao: 'MAGISTRATURA',
    artigo: 'Art. 8º',
    descricao: 'O magistrado deve manter conduta irrepreensível, atuando com serenidade, fundamentação adequada e proferindo decisões em prazo razoável.',
    penalidadePrevista: 'Advertência, censura, remoção, disponibilidade ou aposentadoria compulsória'
  },
  {
    codigo: 'MAG-ART-35-I',
    orgao: 'MAGISTRATURA',
    artigo: 'Art. 35, I (LOMAN)',
    descricao: 'São deveres do magistrado: cumprir e fazer cumprir, com independência, serenidade e exatidão, as disposições legais.',
    penalidadePrevista: 'Advertência, censura, remoção compulsória, disponibilidade ou aposentadoria compulsória'
  },
  {
    codigo: 'MAG-ART-93-IX-CF',
    orgao: 'MAGISTRATURA',
    artigo: 'Art. 93, IX, CF',
    descricao: 'Todas as decisões judiciais serão fundamentadas, sob pena de nulidade.',
    penalidadePrevista: 'Nulidade do ato e sanção disciplinar'
  },
  {
    codigo: 'MAG-RES-CNJ-60-ART-4',
    orgao: 'MAGISTRATURA',
    artigo: 'Art. 4º (Res. CNJ 60/2008)',
    descricao: 'Imparcialidade - O magistrado deve exercer suas funções sem favorecer ou prejudicar qualquer das partes.',
    penalidadePrevista: 'Advertência, censura ou remoção'
  },
  {
    codigo: 'MAG-RES-CNJ-60-ART-8',
    orgao: 'MAGISTRATURA',
    artigo: 'Art. 8º (Res. CNJ 60/2008)',
    descricao: 'Conhecimento e Capacitação - O magistrado deve manter-se informado sobre as questões de direito.',
    penalidadePrevista: 'Advertência ou censura'
  },
  {
    codigo: 'MAG-RES-CNJ-60-ART-19',
    orgao: 'MAGISTRATURA',
    artigo: 'Art. 19 (Res. CNJ 60/2008)',
    descricao: 'O magistrado deve proferir suas decisões em prazo razoável, evitando demora desnecessária.',
    penalidadePrevista: 'Advertência, censura ou disponibilidade'
  }
];

/**
 * Código de Ética do Ministério Público
 * Resolução CNMP nº 204/2016
 */
export const CODIGO_ETICA_PROCURADORIA: CodigoEtica[] = [
  {
    codigo: 'MP-ART-3',
    orgao: 'PROCURADORIA',
    artigo: 'Art. 3º',
    descricao: 'O membro do Ministério Público deve pautar sua conduta funcional pelos princípios da impessoalidade, moralidade e eficiência.',
    penalidadePrevista: 'Advertência, censura, remoção, disponibilidade ou aposentadoria compulsória'
  },
  {
    codigo: 'MP-ART-127-CF',
    orgao: 'PROCURADORIA',
    artigo: 'Art. 127, CF',
    descricao: 'O Ministério Público é instituição permanente, essencial à função jurisdicional do Estado.',
    penalidadePrevista: 'Advertência, censura, remoção ou aposentadoria compulsória'
  },
  {
    codigo: 'MP-ART-4-CNMP',
    orgao: 'PROCURADORIA',
    artigo: 'Art. 4º (Res. CNMP 204/2016)',
    descricao: 'O membro do Ministério Público deve ser probo, justo e independente, agindo com retidão e honestidade.',
    penalidadePrevista: 'Advertência, censura, remoção ou disponibilidade'
  }
];

/**
 * Código de Ética dos Serventuários da Justiça
 */
export const CODIGO_ETICA_SERVENTUARIOS: CodigoEtica[] = [
  {
    codigo: 'SERV-ART-116-LEI-8112',
    orgao: 'SERVENTUARIOS',
    artigo: 'Art. 116, Lei 8.112/90',
    descricao: 'São deveres do servidor: exercer com zelo e dedicação as atribuições do cargo; observar normas legais e regulamentares.',
    penalidadePrevista: 'Advertência, suspensão, demissão, cassação de aposentadoria ou destituição de cargo'
  },
  {
    codigo: 'SERV-ART-117-LEI-8112',
    orgao: 'SERVENTUARIOS',
    artigo: 'Art. 117, Lei 8.112/90',
    descricao: 'Ao servidor é proibido: valer-se do cargo para lograr proveito pessoal ou de outrem, em detrimento da dignidade da função pública.',
    penalidadePrevista: 'Suspensão, demissão ou destituição'
  }
];

/**
 * Código de Ética em TI Judiciário
 */
export const CODIGO_ETICA_TI: CodigoEtica[] = [
  {
    codigo: 'TI-LGPD-ART-6',
    orgao: 'TI',
    artigo: 'Art. 6º, LGPD',
    descricao: 'As atividades de tratamento de dados pessoais devem observar a boa-fé e princípios como finalidade, adequação, necessidade e segurança.',
    penalidadePrevista: 'Advertência, multa, suspensão ou eliminação dos dados'
  },
  {
    codigo: 'TI-RES-CNJ-335',
    orgao: 'TI',
    artigo: 'Res. CNJ 335/2020',
    descricao: 'Política de Segurança da Informação no âmbito do Poder Judiciário - proteção de dados processuais.',
    penalidadePrevista: 'Advertência, suspensão ou demissão'
  }
];

/**
 * Mapeamento de violações para códigos de ética
 */
export const VIOLACOES_CODIGO_ETICA = {
  DECISAO_INTERLOCUTORIA_ERRADA: [
    CODIGO_ETICA_MAGISTRATURA.find(c => c.codigo === 'MAG-ART-8'),
    CODIGO_ETICA_MAGISTRATURA.find(c => c.codigo === 'MAG-ART-93-IX-CF')
  ],
  APELACAO_INDEVIDA: [
    CODIGO_ETICA_OAB.find(c => c.codigo === 'OAB-ART-34-IV'),
    CODIGO_ETICA_MAGISTRATURA.find(c => c.codigo === 'MAG-RES-CNJ-60-ART-4')
  ],
  SENTENCA_INCOMPLETA: [
    CODIGO_ETICA_MAGISTRATURA.find(c => c.codigo === 'MAG-ART-93-IX-CF'),
    CODIGO_ETICA_MAGISTRATURA.find(c => c.codigo === 'MAG-ART-35-I')
  ],
  ACORDAO_OMISSO: [
    CODIGO_ETICA_MAGISTRATURA.find(c => c.codigo === 'MAG-ART-93-IX-CF'),
    CODIGO_ETICA_MAGISTRATURA.find(c => c.codigo === 'MAG-RES-CNJ-60-ART-8')
  ],
  CORRUPCAO: [
    CODIGO_ETICA_MAGISTRATURA.find(c => c.codigo === 'MAG-RES-CNJ-60-ART-4'),
    CODIGO_ETICA_OAB.find(c => c.codigo === 'OAB-ART-2'),
    CODIGO_ETICA_PROCURADORIA.find(c => c.codigo === 'MP-ART-4-CNMP'),
    CODIGO_ETICA_SERVENTUARIOS.find(c => c.codigo === 'SERV-ART-117-LEI-8112')
  ],
  VIOLACAO_ETICA_OAB: CODIGO_ETICA_OAB,
  VIOLACAO_ETICA_MAGISTRATURA: CODIGO_ETICA_MAGISTRATURA,
  VIOLACAO_ETICA_PROCURADORIA: CODIGO_ETICA_PROCURADORIA,
  VIOLACAO_DEVIDO_PROCESSO: [
    CODIGO_ETICA_MAGISTRATURA.find(c => c.codigo === 'MAG-ART-93-IX-CF'),
    CODIGO_ETICA_MAGISTRATURA.find(c => c.codigo === 'MAG-RES-CNJ-60-ART-4')
  ],
  GASTOS_EXCESSIVOS: [
    CODIGO_ETICA_PROCURADORIA.find(c => c.codigo === 'MP-ART-3')
  ],
  NEPOTISMO: [
    CODIGO_ETICA_MAGISTRATURA.find(c => c.codigo === 'MAG-RES-CNJ-60-ART-4'),
    CODIGO_ETICA_SERVENTUARIOS.find(c => c.codigo === 'SERV-ART-117-LEI-8112')
  ],
  FAVORECIMENTO_ILICITO: [
    CODIGO_ETICA_MAGISTRATURA.find(c => c.codigo === 'MAG-RES-CNJ-60-ART-4'),
    CODIGO_ETICA_OAB.find(c => c.codigo === 'OAB-ART-34-IV'),
    CODIGO_ETICA_PROCURADORIA.find(c => c.codigo === 'MP-ART-4-CNMP')
  ]
};

/**
 * Obtém códigos de ética relevantes para um tipo de violação
 */
export function obterCodigosEtica(tipoViolacao: string): CodigoEtica[] {
  const codigos = (VIOLACOES_CODIGO_ETICA as any)[tipoViolacao];
  return codigos ? codigos.filter((c: CodigoEtica | undefined) => c !== undefined) : [];
}

/**
 * Obtém todos os códigos de ética
 */
export function obterTodosCodigosEtica(): CodigoEtica[] {
  return [
    ...CODIGO_ETICA_OAB,
    ...CODIGO_ETICA_MAGISTRATURA,
    ...CODIGO_ETICA_PROCURADORIA,
    ...CODIGO_ETICA_SERVENTUARIOS,
    ...CODIGO_ETICA_TI
  ];
}
