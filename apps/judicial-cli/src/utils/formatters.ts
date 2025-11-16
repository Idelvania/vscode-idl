/**
 * Formatadores de output
 */

import { JudicialGame, GameAnalysis } from '../../../../libs/judicial-strategy/src';

export function formatOutput(
  game: JudicialGame,
  analysis: GameAnalysis,
  format: string
): string {
  switch (format.toLowerCase()) {
    case 'json':
      return formatJSON(game, analysis);
    case 'html':
      return formatHTML(game, analysis);
    case 'txt':
    default:
      return game.printAnalysis();
  }
}

function formatJSON(game: JudicialGame, analysis: GameAnalysis): string {
  const matrix = game.getPayoffMatrix();

  return JSON.stringify(
    {
      matrix: matrix ? {
        players: matrix.players,
        strategies: matrix.strategies.map((strats) =>
          strats.map((s) => s.name)
        ),
      } : null,
      equilibria: analysis.equilibria.map((eq) => ({
        type: eq.type,
        strategies: eq.profile?.strategies,
        payoffs: eq.expectedPayoffs,
        stability: eq.stability,
      })),
      dominantStrategies: analysis.dominantStrategies,
      dominatedStrategies: analysis.dominatedStrategies,
      recommendations: analysis.recommendations,
    },
    null,
    2
  );
}

function formatHTML(game: JudicialGame, analysis: GameAnalysis): string {
  const matrix = game.getPayoffMatrix();
  const textAnalysis = game.printAnalysis();

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SIICAF - Análise Estratégica</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 2em;
    }
    .header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
    }
    .card {
      background: white;
      padding: 25px;
      margin-bottom: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .card h2 {
      margin-top: 0;
      color: #667eea;
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
    }
    pre {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      border-left: 4px solid #667eea;
    }
    .equilibrium {
      background: #e8f5e9;
      padding: 15px;
      margin: 10px 0;
      border-radius: 5px;
      border-left: 4px solid #4caf50;
    }
    .recommendation {
      background: #fff3e0;
      padding: 12px;
      margin: 8px 0;
      border-radius: 5px;
      border-left: 4px solid #ff9800;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding: 20px;
      color: #666;
      border-top: 1px solid #ddd;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background: #667eea;
      color: white;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 0.85em;
      font-weight: bold;
    }
    .badge-pure {
      background: #4caf50;
      color: white;
    }
    .badge-mixed {
      background: #ff9800;
      color: white;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>⚖️ SIICAF - Análise Estratégica</h1>
    <p>Sistema de Inteligência e Investigação de Condutas Antijurídicas e Fraudes</p>
    <p>© Dra. Idelvânia Menezes de Araújo - OAB/GO 64.265-A</p>
  </div>

  <div class="card">
    <h2>📊 Jogadores e Estratégias</h2>
    ${matrix ? `
    <table>
      <thead>
        <tr>
          <th>Jogador</th>
          <th>Estratégias Disponíveis</th>
        </tr>
      </thead>
      <tbody>
        ${matrix.players.map((player, i) => `
          <tr>
            <td><strong>${player}</strong></td>
            <td>${matrix.strategies[i].map(s => s.name).join(', ')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    ` : '<p>Matriz não disponível</p>'}
  </div>

  <div class="card">
    <h2>🎯 Equilíbrios de Nash Encontrados</h2>
    ${analysis.equilibria.length === 0 ? '<p>Nenhum equilíbrio encontrado.</p>' : ''}
    ${analysis.equilibria.map((eq, i) => `
      <div class="equilibrium">
        <h3>Equilíbrio ${i + 1} <span class="badge badge-${eq.type}">${eq.type === 'pure' ? 'PURO' : 'MISTO'}</span></h3>
        ${eq.profile ? `
          <p><strong>Estratégias:</strong></p>
          <ul>
            ${matrix ? eq.profile.strategies.map((stratIdx, playerIdx) => `
              <li>${matrix.players[playerIdx]}: ${matrix.strategies[playerIdx][stratIdx].name}</li>
            `).join('') : ''}
          </ul>
        ` : ''}
        <p><strong>Payoffs Esperados:</strong></p>
        <ul>
          ${eq.expectedPayoffs.map((payoff, idx) => `
            <li>${matrix?.players[idx]}: ${payoff.toFixed(2)}</li>
          `).join('')}
        </ul>
        <p><strong>Estabilidade:</strong> ${((eq.stability || 0) * 100).toFixed(1)}%</p>
      </div>
    `).join('')}
  </div>

  <div class="card">
    <h2>💡 Recomendações Estratégicas</h2>
    ${analysis.recommendations?.map(rec => `
      <div class="recommendation">
        • ${rec}
      </div>
    `).join('') || '<p>Nenhuma recomendação disponível.</p>'}
  </div>

  <div class="card">
    <h2>📋 Análise Completa (Texto)</h2>
    <pre>${textAnalysis}</pre>
  </div>

  <div class="footer">
    <p><strong>SIICAF - Sistema de Inteligência e Investigação de Condutas Antijurídicas e Fraudes</strong></p>
    <p>Licenciado pelo INPI - Propriedade da Dra. Idelvânia Menezes de Araújo - OAB/GO 64.265-A</p>
    <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
  </div>
</body>
</html>
  `.trim();
}
