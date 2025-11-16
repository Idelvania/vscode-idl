/**
 * EXEMPLO REAL: Caso de Improbidade Administrativa
 *
 * Demonstra como o SIICAF analisa um caso real e gera sugestões proativas
 * para DEMOCRATIZAR conhecimento jurídico e criar TRANSPARÊNCIA
 */

import { Caso, Documento, Parte } from '../core/types';
import { StrategicAdvisor } from '../strategy-engine/strategic-advisor';

/**
 * CASO BASEADO EM EXEMPLO REAL:
 * - R$ 5,9 bilhões em prejuízo
 * - 16 agentes identificados
 * - Hierarquia complexa (Presidente, Ministros, Diretores)
 * - Múltiplos documentos (petições, pareceres, provas)
 */
export async function exemploAnaliseCasoReal() {
  console.log('\n🔍 INICIANDO ANÁLISE DE CASO REAL...\n');

  // 1. CRIAR O CASO
  const caso: Caso = criarCasoExemplo();

  // 2. INICIALIZAR O SIICAF
  const siicaf = new StrategicAdvisor();

  // 3. ANÁLISE AUTOMÁTICA PROATIVA
  const resultado = await siicaf.analisarCasoCompleto(caso);

  // 4. APRESENTAR RESULTADOS
  const relatorio = siicaf.formatarRelatorio(resultado);
  console.log(relatorio);

  // 5. DETALHAR SUGESTÕES PROATIVAS
  console.log('\n📋 DETALHAMENTO DAS SUGESTÕES PROATIVAS:\n');
  console.log('='.repeat(80) + '\n');

  resultado.sugestoesImediatas.forEach((sugestao, index) => {
    console.log(`\n${index + 1}. [${sugestao.prioridade.toUpperCase()}] ${sugestao.titulo}`);
    console.log(`   Tipo: ${sugestao.tipo}`);
    console.log(`\n   📝 Descrição:`);
    console.log(`   ${sugestao.descricao}\n`);
    console.log(`   ⚖️ Fundamentação:`);
    console.log(`   ${sugestao.fundamentacao}\n`);

    if (sugestao.acoes && sugestao.acoes.length > 0) {
      console.log(`   ✅ Ações Sugeridas:`);
      sugestao.acoes.forEach((acao, i) => {
        console.log(`      ${i + 1}. [${acao.tipo}] ${acao.descricao}`);
        console.log(`         Impacto: ${acao.impacto}`);
      });
      console.log('');
    }

    if (sugestao.novosConhecimentos && sugestao.novosConhecimentos.length > 0) {
      console.log(`   🎓 APRENDA ALGO NOVO:`);
      sugestao.novosConhecimentos.forEach(conhecimento => {
        console.log(`      📚 ${conhecimento.titulo}`);
        console.log(`         ${conhecimento.descricao}`);
        console.log(`         💡 Aplicação: ${conhecimento.aplicabilidade}\n`);
      });
    }

    console.log('-'.repeat(80));
  });

  // 6. APRESENTAR ESTRATÉGIA PRINCIPAL
  if (resultado.estrategias.length > 0) {
    const estrategia = resultado.estrategias[0];
    console.log('\n\n🎯 ESTRATÉGIA JURÍDICA PRINCIPAL:\n');
    console.log('='.repeat(80));
    console.log(`\n📌 ${estrategia.titulo}\n`);
    console.log(`🎯 Objetivo: ${estrategia.objetivo}\n`);
    console.log(`⚖️ Fundamentação: ${estrategia.fundamentacao}\n`);

    console.log(`\n📋 PLANO DE AÇÃO (${estrategia.passos.length} passos):\n`);
    estrategia.passos.forEach(passo => {
      console.log(`   ${passo.ordem}. ${passo.descricao}`);
      console.log(`      ⏱️ Prazo: ${passo.prazo}`);
      console.log(`      Status: ${passo.status}\n`);
    });

    console.log('\n⚠️ RISCOS E OPORTUNIDADES:\n');
    estrategia.riscosOportunidades.forEach(ro => {
      const emoji = ro.tipo === 'risco' ? '🚨' : '🌟';
      console.log(`   ${emoji} [${ro.tipo.toUpperCase()}] ${ro.descricao}`);
      console.log(`      Probabilidade: ${ro.probabilidade} | Impacto: ${ro.impacto}`);
      if (ro.mitigacao) {
        console.log(`      ✅ Mitigação: ${ro.mitigacao}`);
      }
      console.log('');
    });

    console.log('\n🔮 PREVISÃO DE RESULTADOS:\n');
    estrategia.previsaoResultado.cenarios.forEach(cenario => {
      console.log(`   📊 ${cenario.nome} (${cenario.probabilidade}% de probabilidade)`);
      console.log(`      ${cenario.descricao}`);
      console.log(`      Impactos:`);
      cenario.impactos.forEach(imp => console.log(`         • ${imp}`));
      console.log('');
    });

    console.log(`   💡 RECOMENDAÇÃO DO SIICAF:`);
    console.log(`   ${estrategia.previsaoResultado.recomendacao}\n`);
  }

  // 7. CONHECIMENTOS PARA APRENDER
  console.log('\n🎓 CONHECIMENTOS PARA VOCÊ APRENDER:\n');
  console.log('='.repeat(80) + '\n');

  resultado.conhecimentosNovos.forEach((conhecimento, index) => {
    console.log(`${index + 1}. 📚 ${conhecimento.titulo}`);
    console.log(`   Categoria: ${conhecimento.categoria}`);
    console.log(`   ${conhecimento.descricao}\n`);
    console.log(`   💡 Quando aplicar: ${conhecimento.aplicabilidade}\n`);

    if (conhecimento.exemplos && conhecimento.exemplos.length > 0) {
      console.log(`   📖 Exemplos práticos:`);
      conhecimento.exemplos.forEach(ex => console.log(`      • ${ex}`));
      console.log('');
    }

    console.log('-'.repeat(80) + '\n');
  });

  console.log('\n✅ ANÁLISE CONCLUÍDA!\n');
  console.log('💡 O SIICAF gerou sugestões que você pode usar IMEDIATAMENTE.');
  console.log('📚 Você aprendeu conceitos que grandes escritórios usam.');
  console.log('🎯 Agora você tem uma ESTRATÉGIA COMPLETA para o caso.\n');
}

/**
 * Cria caso de exemplo baseado em situação real
 */
function criarCasoExemplo(): Caso {
  // DOCUMENTOS DO CASO
  const documentos: Documento[] = [
    {
      id: 'doc-001',
      tipo: 'peticao',
      titulo: 'Petição Inicial - Ação de Improbidade Administrativa',
      conteudo: `
        EXCELENTÍSSIMO SENHOR DOUTOR JUIZ FEDERAL DA __ VARA FEDERAL

        O MINISTÉRIO PÚBLICO FEDERAL, por meio do Procurador que esta subscreve,
        com fundamento na Lei 8.429/92, vem propor

        AÇÃO CIVIL PÚBLICA POR ATO DE IMPROBIDADE ADMINISTRATIVA

        em face de:

        1. JOÃO DA SILVA SOUZA, Presidente da Empresa Pública XYZ
        2. MARIA OLIVEIRA SANTOS, Ministra de Estado
        3. CARLOS PEREIRA LIMA, Diretor Financeiro
        4. [... mais 13 réus ...]

        pelos fatos e fundamentos a seguir expostos:

        DOS FATOS

        A presente ação decorre de extensa investigação que identificou esquema
        de superfaturamento em contratos públicos, causando prejuízo estimado em
        R$ 5,9 bilhões aos cofres públicos.

        As investigações revelaram que:

        1. Foram realizadas licitações fraudulentas no período de 2015 a 2020
        2. Contratos foram direcionados para empresas específicas
        3. Preços praticados eram até 300% superiores ao valor de mercado
        4. O Presidente João da Silva tinha conhecimento e aprovava os contratos
        5. A Ministra Maria Oliveira nomeou os diretores envolvidos
        6. Houve pagamento de propinas aos agentes públicos

        DO DIREITO

        Os atos praticados configuram improbidade administrativa nos termos do
        Art. 10 da Lei 8.429/92 (dano ao erário) e Art. 11 (violação aos princípios).

        DOS PEDIDOS

        Requer-se:
        a) Condenação dos réus ao ressarcimento integral do dano (R$ 5,9 bilhões)
        b) Aplicação de multa civil
        c) Suspensão dos direitos políticos
        d) Proibição de contratar com o Poder Público
      `,
      metadados: {
        data: new Date('2023-01-15'),
        autor: 'Ministério Público Federal',
        tags: ['improbidade', 'licitação', 'superfaturamento']
      }
    },
    {
      id: 'doc-002',
      tipo: 'prova',
      titulo: 'Relatório de Auditoria do Tribunal de Contas',
      conteudo: `
        TRIBUNAL DE CONTAS DA UNIÃO
        RELATÓRIO DE AUDITORIA N° 12345/2022

        ACHADOS DE AUDITORIA:

        1. SUPERFATURAMENTO IDENTIFICADO: R$ 5,9 bilhões
           - Contrato A: sobrepreço de 280% (R$ 2,1 bi)
           - Contrato B: sobrepreço de 310% (R$ 1,8 bi)
           - Contrato C: sobrepreço de 250% (R$ 2,0 bi)

        2. RESPONSÁVEIS IDENTIFICADOS:
           - Presidente João da Silva: aprovação de todos os contratos
           - Ministro de Estado: nomeação dos diretores
           - Diretoria Financeira: execução dos pagamentos
           - Comissão de Licitação: direcionamento das licitações

        3. DOCUMENTOS ANALISADOS:
           - 450 contratos
           - 1.200 processos licitatórios
           - Comunicações internas (e-mails)
           - Atas de reuniões

        CONCLUSÃO: Há indícios robustos de fraude sistêmica com participação
        de autoridades em diferentes níveis hierárquicos.
      `,
      metadados: {
        data: new Date('2022-11-20'),
        fonte: 'TCU',
        tags: ['auditoria', 'superfaturamento', 'contratos']
      }
    },
    {
      id: 'doc-003',
      tipo: 'parecer',
      titulo: 'Parecer Jurídico - Responsabilidade do Presidente',
      conteudo: `
        PARECER JURÍDICO

        Consulta: É possível responsabilizar o Presidente da empresa pública pelos
        atos de superfaturamento praticados por seus subordinados?

        RESPOSTA:

        SIM. Com fundamento na teoria do domínio do fato e na jurisprudência do STJ
        (REsp 1.297.797/SP), autoridades que ocupam posição de comando respondem
        por atos de subordinados quando:

        1. Tinham conhecimento dos atos (ou deveriam ter)
        2. Tinham poder de impedir os atos
        3. Omitiram-se deliberadamente

        No caso concreto:
        - O Presidente aprovava TODOS os contratos (poder decisório)
        - Recebia relatórios mensais da diretoria (conhecimento)
        - Tinha competência legal para fiscalizar (dever)

        Logo, responde solidariamente pelos danos causados.

        Art. 3º da Lei 8.429/92: "As disposições desta lei são aplicáveis àquele
        que, mesmo não sendo agente público, induza ou concorra para a prática
        do ato de improbidade ou dele se beneficie sob qualquer forma direta ou indireta."
      `,
      metadados: {
        data: new Date('2023-02-10'),
        autor: 'Dr. Pedro Advocacia',
        tags: ['responsabilidade', 'dominio-do-fato', 'presidente']
      }
    }
  ];

  // PARTES ENVOLVIDAS (16 agentes)
  const partes: Parte[] = [
    {
      id: 'p001',
      nome: 'João da Silva Souza',
      tipo: 'reu',
      cargo: 'Presidente da Empresa Pública XYZ',
      responsabilidade: 'Aprovação de contratos fraudulentos',
      provasContra: ['doc-002', 'doc-003']
    },
    {
      id: 'p002',
      nome: 'Maria Oliveira Santos',
      tipo: 'reu',
      cargo: 'Ministra de Estado',
      responsabilidade: 'Nomeação de diretores envolvidos no esquema',
      provasContra: ['doc-002']
    },
    {
      id: 'p003',
      nome: 'Carlos Pereira Lima',
      tipo: 'reu',
      cargo: 'Diretor Financeiro',
      responsabilidade: 'Execução dos pagamentos superfaturados',
      provasContra: ['doc-001', 'doc-002']
    },
    // Adicionar mais 13 agentes...
    {
      id: 'p004',
      nome: 'Ana Paula Costa',
      tipo: 'reu',
      cargo: 'Diretora de Contratos',
      responsabilidade: 'Elaboração de contratos direcionados'
    },
    {
      id: 'p005',
      nome: 'Roberto Alves',
      tipo: 'reu',
      cargo: 'Membro da Comissão de Licitação',
      responsabilidade: 'Direcionamento de licitações'
    },
    // ... (mais 11 agentes para completar 16)
  ];

  // CRIAR O CASO
  const caso: Caso = {
    id: 'caso-001',
    titulo: 'Operação Superfaturamento Bilionário - Ação de Improbidade',
    descricao: 'Investigação de esquema de superfaturamento que causou prejuízo de R$ 5,9 bilhões aos cofres públicos',
    documentos,
    timeline: [
      {
        id: 'ev001',
        data: new Date('2015-01-01'),
        tipo: 'inicio_esquema',
        descricao: 'Início do período investigado - primeiros contratos suspeitos',
        documentosRelacionados: []
      },
      {
        id: 'ev002',
        data: new Date('2020-12-31'),
        tipo: 'fim_esquema',
        descricao: 'Fim do período investigado',
        documentosRelacionados: []
      },
      {
        id: 'ev003',
        data: new Date('2022-11-20'),
        tipo: 'auditoria',
        descricao: 'TCU conclui auditoria e identifica superfaturamento',
        documentosRelacionados: ['doc-002']
      },
      {
        id: 'ev004',
        data: new Date('2023-01-15'),
        tipo: 'ajuizamento',
        descricao: 'MPF ajuíza ação de improbidade',
        documentosRelacionados: ['doc-001']
      }
    ],
    partes,
    temas: ['Improbidade Administrativa', 'Licitações e Contratos', 'Dano ao Erário', 'Responsabilização'],
    objetivos: [
      'Ressarcimento integral de R$ 5,9 bilhões',
      'Responsabilização de TODOS os envolvidos',
      'Evitar prescrição',
      'Criar precedente'
    ]
  };

  return caso;
}

// EXECUTAR O EXEMPLO
exemploAnaliseCasoReal().catch(console.error);
