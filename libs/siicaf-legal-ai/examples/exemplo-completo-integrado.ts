/**
 * EXEMPLO COMPLETO - SIICAF INTEGRADO
 *
 * Demonstra TODAS as funcionalidades do sistema:
 * ✅ Análise de documentos
 * ✅ Estratégias proativas
 * ✅ Geração de documentos (OAB, CNJ, MPF, CNMP)
 * ✅ Análise de prazos/prescrição
 * ✅ Análise ética
 * ✅ Aprendizado contínuo
 * ✅ Avaliação de evolução
 *
 * CASO: Improbidade Administrativa - R$ 5,9 bilhões
 */

import { SIICAF } from '../siicaf-main';
import { Caso, Documento, Parte } from '../core/types';

async function exemploCompletoSIICAF() {
  console.log('\n🎓 BEM-VINDO AO SIICAF - VERSÃO JURISTA DE EXCELÊNCIA\n');
  console.log('Este exemplo demonstra o sistema COMPLETO de análise jurídica\n');
  console.log('com foco em: CONHECIMENTO + TÉCNICA + ÉTICA + APRENDIZADO PERPÉTUO\n');

  // 1. INICIALIZAR O SIICAF
  const siicaf = new SIICAF();

  // 2. CRIAR O CASO
  const caso = criarCasoExemplo();

  // 3. EXECUTAR ANÁLISE COMPLETA
  console.log('🚀 Iniciando análise completa...\n');
  const resultado = await siicaf.analisarCasoCompleto(caso, 'usuario-phd-001');

  // 4. APRESENTAR RESULTADOS
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESULTADOS DA ANÁLISE COMPLETA');
  console.log('='.repeat(80) + '\n');

  // Relatório Final
  console.log(resultado.relatorioFinal);

  // 5. EXEMPLOS DE USO ESPECÍFICO

  // 5.1 Visualizar documento OAB
  console.log('\n' + '='.repeat(80));
  console.log('📄 EXEMPLO: Representação para OAB (Prévia)');
  console.log('='.repeat(80) + '\n');
  console.log(resultado.documentos.oab.conteudo.substring(0, 800) + '\n... (documento completo disponível)');

  // 5.2 Visualizar matriz de responsabilização
  console.log('\n' + '='.repeat(80));
  console.log('📊 EXEMPLO: Matriz de Responsabilização (Prévia)');
  console.log('='.repeat(80) + '\n');
  console.log(resultado.documentos.tabela.conteudo.substring(0, 1000) + '\n... (tabela completa disponível)');

  // 5.3 Alertas de prescrição
  if (resultado.prazos.alertas.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('⚠️ ALERTAS CRÍTICOS DE PRESCRIÇÃO');
    console.log('='.repeat(80) + '\n');
    resultado.prazos.alertas.forEach(alerta => {
      console.log(`🚨 ${alerta.mensagem}`);
      console.log(`   Ação: ${alerta.acaoRequerida}\n`);
    });
  }

  // 5.4 Análise ética
  console.log('\n' + '='.repeat(80));
  console.log('⚖️ ANÁLISE ÉTICA DA ESTRATÉGIA');
  console.log('='.repeat(80) + '\n');
  console.log(`Score Ético: ${resultado.analiseEtica.score}/100`);
  console.log(`Conforme: ${resultado.analiseEtica.conforme ? '✅ SIM' : '❌ NÃO'}\n`);
  if (resultado.analiseEtica.recomendacoes.length > 0) {
    console.log('Principais Recomendações Éticas:\n');
    resultado.analiseEtica.recomendacoes.slice(0, 2).forEach((rec, i) => {
      console.log(`${i + 1}. ${rec.titulo}`);
      console.log(`   ${rec.descricao}\n`);
    });
  }

  // 5.5 Seu progresso de aprendizado
  console.log('\n' + '='.repeat(80));
  console.log('🎓 SEU PROGRESSO DE APRENDIZADO');
  console.log('='.repeat(80) + '\n');
  const evolucao = siicaf.avaliarEvolucao('usuario-phd-001');
  console.log(`Nível: ${evolucao.nivel.toUpperCase()}`);
  console.log(`Pontuação: ${evolucao.pontuacao}`);
  console.log(`Feedback: ${evolucao.feedback}`);
  console.log(`Próximo Objetivo: ${evolucao.proximoObjetivo}\n`);

  // 5.6 Sugestões de estudo
  console.log('\n' + '='.repeat(80));
  console.log('📚 SUGESTÕES PERSONALIZADAS DE ESTUDO');
  console.log('='.repeat(80) + '\n');
  const sugestoesEstudo = siicaf.gerarSugestoesEstudo('usuario-phd-001');
  sugestoesEstudo.slice(0, 2).forEach((sug, i) => {
    console.log(`${i + 1}. ${sug.tema}`);
    console.log(`   Prioridade: ${sug.prioridade}`);
    console.log(`   Razão: ${sug.razao}`);
    console.log(`   Tempo estimado: ${sug.tempoEstimado}\n`);
  });

  // 6. CONCLUSÃO
  console.log('\n' + '='.repeat(80));
  console.log('✅ ANÁLISE COMPLETA FINALIZADA COM SUCESSO!');
  console.log('='.repeat(80) + '\n');

  console.log('📋 O QUE FOI GERADO:\n');
  console.log('✅ 4 Representações profissionais (OAB, CNJ, MPF, CNMP)');
  console.log('✅ 1 Matriz de Responsabilização (16 agentes)');
  console.log('✅ Análise completa de prazos prescricionais');
  console.log('✅ Cronograma de petições interruptivas');
  console.log('✅ Estratégias jurídicas fundamentadas');
  console.log('✅ Análise ética completa');
  console.log('✅ Relatório de aprendizado\n');

  console.log('💡 PRÓXIMOS PASSOS:\n');
  console.log('1. Revisar os documentos gerados');
  console.log('2. Adaptar conforme especificidades do seu caso');
  console.log('3. Protocolar nos órgãos competentes');
  console.log('4. Estudar os conhecimentos adquiridos');
  console.log('5. Continuar aprendendo sempre!\n');

  console.log('"Nesta vida ninguém sabe tudo. Nunca deixar de aprender."\n');
}

/**
 * Cria caso de exemplo
 */
function criarCasoExemplo(): Caso {
  const documentos: Documento[] = [
    {
      id: 'doc-001',
      tipo: 'peticao',
      titulo: 'Petição Inicial - Ação de Improbidade',
      conteudo: `
        AÇÃO CIVIL PÚBLICA POR ATO DE IMPROBIDADE ADMINISTRATIVA

        O MINISTÉRIO PÚBLICO FEDERAL vem propor ação contra:
        1. JOÃO DA SILVA SOUZA - Presidente da Empresa Pública XYZ
        2. MARIA OLIVEIRA SANTOS - Ministra de Estado
        ... [mais 14 réus]

        DOS FATOS:
        Investigação identificou esquema de superfaturamento em contratos públicos,
        causando prejuízo de R$ 5,9 bilhões aos cofres públicos.

        Licitações fraudulentas no período de 2015 a 2020.
        Contratos direcionados para empresas específicas.
        Preços até 300% superiores ao valor de mercado.

        DO DIREITO:
        Arts. 9º, 10 e 11 da Lei 8.429/92

        DOS PEDIDOS:
        a) Ressarcimento integral (R$ 5,9 bilhões)
        b) Multa civil
        c) Suspensão de direitos políticos
      `,
      metadados: {
        data: new Date('2023-01-15'),
        autor: 'MPF',
        tags: ['improbidade', 'licitação']
      }
    }
  ];

  const partes: Parte[] = [];
  for (let i = 1; i <= 16; i++) {
    partes.push({
      id: `p${i.toString().padStart(3, '0')}`,
      nome: `Agente Público ${i}`,
      tipo: 'reu',
      cargo: i <= 3 ? 'Presidente/Ministro' : i <= 8 ? 'Diretor' : 'Assessor',
      responsabilidade: i <= 3 ? 'Aprovação de contratos' : 'Execução'
    });
  }

  return {
    id: 'caso-001',
    titulo: 'Operação Superfaturamento Bilionário - Improbidade Administrativa',
    descricao: 'Esquema de superfaturamento - Prejuízo: R$ 5,9 bilhões',
    documentos,
    timeline: [
      {
        id: 'ev001',
        data: new Date('2015-01-01'),
        tipo: 'inicio_esquema',
        descricao: 'Início do período investigado',
        documentosRelacionados: []
      },
      {
        id: 'ev002',
        data: new Date('2020-12-31'),
        tipo: 'fim_esquema',
        descricao: 'Fim do período',
        documentosRelacionados: []
      },
      {
        id: 'ev003',
        data: new Date('2022-11-20'),
        tipo: 'auditoria',
        descricao: 'TCU conclui auditoria',
        documentosRelacionados: []
      },
      {
        id: 'ev004',
        data: new Date('2023-01-15'),
        tipo: 'ajuizamento',
        descricao: 'MPF ajuíza ação',
        documentosRelacionados: []
      }
    ],
    partes,
    temas: ['Improbidade Administrativa', 'Licitações e Contratos', 'Dano ao Erário'],
    objetivos: [
      'Ressarcimento integral de R$ 5,9 bilhões',
      'Responsabilização de TODOS os envolvidos',
      'Evitar prescrição',
      'Criar precedente'
    ]
  };
}

// EXECUTAR
exemploCompletoSIICAF().catch(console.error);
