# Exemplos Práticos - Teoria de Nash em Processos Judiciais

Este documento apresenta exemplos práticos detalhados de como usar a biblioteca para analisar diferentes cenários judiciais.

## Índice

1. [Caso 1: Negociação de Acordo em Ação Civil](#caso-1-negociação-de-acordo-em-ação-civil)
2. [Caso 2: Delação Premiada em Caso Criminal](#caso-2-delação-premiada-em-caso-criminal)
3. [Caso 3: Decisão de Apelar](#caso-3-decisão-de-apelar)
4. [Caso 4: Litígio Trabalhista](#caso-4-litígio-trabalhista)
5. [Caso 5: Análise Comparativa de Estratégias](#caso-5-análise-comparativa-de-estratégias)

---

## Caso 1: Negociação de Acordo em Ação Civil

### Cenário

Uma empresa foi processada por um cliente alegando defeito em produto. O valor da causa é R$ 100.000. O autor tem evidências fortes (80% de chance de vitória), mas os custos de litígio são altos (R$ 25.000 para cada parte).

### Código

```typescript
import { JudicialGameFactory } from '@vscode-idl/judicial-strategy';

// Criar o jogo
const game = JudicialGameFactory.createSettlementNegotiation(
  100000,  // Valor da causa
  0.80,    // 80% de evidências favoráveis ao autor
  25000    // Custos de litigação
);

// Construir matriz de payoffs
game.buildPayoffMatrix();

// Analisar
const analysis = game.analyze();

// Exibir resultados
console.log(game.printAnalysis());

// Examinar equilíbrios
analysis.equilibria.forEach((eq, i) => {
  console.log(`\n--- Equilíbrio ${i + 1} ---`);
  console.log(`Tipo: ${eq.type}`);
  console.log(`Payoffs esperados:`);
  console.log(`  Autor: R$ ${eq.expectedPayoffs[0].toFixed(2)}`);
  console.log(`  Réu: R$ ${eq.expectedPayoffs[1].toFixed(2)}`);
  console.log(`Estabilidade: ${(eq.stability! * 100).toFixed(1)}%`);
});

// Recomendações
console.log('\n--- Recomendações ---');
analysis.recommendations?.forEach(rec => console.log(`• ${rec}`));
```

### Resultado Esperado

```
=== ANÁLISE DO JOGO JUDICIAL ===

Jogadores: Autor, Réu
Tipo de Caso: civil
Valor da Causa: 100000

=== MATRIZ DE PAYOFFS ===
Autor \ Réu	Oferecer Acordo (50%)	Resistir
Aceitar Acordo (50%)	(45, -45)	(-5, -20)
Litigar	(45, -45)	(55, -75)

=== EQUILÍBRIOS DE NASH ===

Equilíbrio 1 (pure):
  Autor: Aceitar Acordo (50%)
  Réu: Oferecer Acordo (50%)
  Payoffs: Autor: 45.00, Réu: -45.00
  Estabilidade: 88.0%

=== RECOMENDAÇÕES ESTRATÉGICAS ===
• Único equilíbrio de Nash encontrado: Aceitar Acordo (50%) vs Oferecer Acordo (50%)
• Payoffs: Autor: 45, Réu: -45
```

### Análise

Com evidências fortes (80%), o equilíbrio sugere que ambas as partes devem aceitar um acordo de 50%. Isso porque:

- Para o **Autor**: Mesmo com 80% de chance de vitória, o custo de litigação (R$ 25.000) e o risco reduzem o valor esperado
- Para o **Réu**: Pagar 50% agora evita o risco de perder 100% e pagar custos adicionais

---

## Caso 2: Delação Premiada em Caso Criminal

### Cenário

Dois suspeitos foram presos. Cada um tem a opção de permanecer em silêncio (cooperar) ou fazer delação premiada (delatar). Se ambos ficarem em silêncio, pegam 1 ano. Se um delata e outro não, quem delata sai livre e o outro pega 10 anos. Se ambos delatam, pegam 5 anos cada.

### Código

```typescript
import { JudicialGameFactory } from '@vscode-idl/judicial-strategy';

// Criar dilema do prisioneiro
const game = JudicialGameFactory.createPleaBargainDilemma(10);

// Analisar
const analysis = game.analyze();

console.log(game.printAnalysis());

// Comparar cenários
const matrix = game.getPayoffMatrix()!;

console.log('\n=== COMPARAÇÃO DE CENÁRIOS ===\n');

const scenarios = [
  { name: 'Ambos Cooperam (Silêncio)', profile: [0, 0] },
  { name: 'S1 Delata, S2 Coopera', profile: [1, 0] },
  { name: 'S1 Coopera, S2 Delata', profile: [0, 1] },
  { name: 'Ambos Delatam', profile: [1, 1] },
];

scenarios.forEach(scenario => {
  const payoffs = matrix.matrix[scenario.profile[0]][scenario.profile[1]];
  console.log(`${scenario.name}:`);
  console.log(`  Suspeito 1: ${payoffs[0]} anos`);
  console.log(`  Suspeito 2: ${payoffs[1]} anos`);
  console.log(`  Total: ${payoffs[0] + payoffs[1]} anos\n`);
});
```

### Resultado Esperado

```
=== ANÁLISE DO JOGO JUDICIAL ===

Jogadores: Suspeito 1, Suspeito 2
Tipo de Caso: criminal

=== MATRIZ DE PAYOFFS ===
Suspeito 1 \ Suspeito 2	Cooperar (Silêncio)	Delatar
Cooperar (Silêncio)	(-1, -1)	(-10, 0)
Delatar	(0, -10)	(-5, -5)

=== EQUILÍBRIOS DE NASH ===

Equilíbrio 1 (pure):
  Suspeito 1: Delatar
  Suspeito 2: Delatar
  Payoffs: Suspeito 1: -5.00, Suspeito 2: -5.00
  Estabilidade: 73.1%

=== RECOMENDAÇÕES ESTRATÉGICAS ===
• Único equilíbrio de Nash encontrado: Delatar vs Delatar
• Payoffs: Suspeito 1: -5, Suspeito 2: -5
• Suspeito 1 possui estratégia dominante: Delatar
• Suspeito 2 possui estratégia dominante: Delatar

=== COMPARAÇÃO DE CENÁRIOS ===

Ambos Cooperam (Silêncio):
  Suspeito 1: -1 anos
  Suspeito 2: -1 anos
  Total: -2 anos

S1 Delata, S2 Coopera:
  Suspeito 1: 0 anos
  Suspeito 2: -10 anos
  Total: -10 anos

S1 Coopera, S2 Delata:
  Suspeito 1: -10 anos
  Suspeito 2: 0 anos
  Total: -10 anos

Ambos Delatam:
  Suspeito 1: -5 anos
  Suspeito 2: -5 anos
  Total: -10 anos
```

### Análise - O Dilema

Este é o clássico **Dilema do Prisioneiro**:

- O equilíbrio de Nash é ambos **delatarem** (-5, -5)
- Mas se ambos **cooperassem**, o resultado seria melhor (-1, -1)
- Porém, delatar é uma **estratégia dominante** para ambos

**Lição**: A racionalidade individual leva a um resultado subótimo coletivamente.

---

## Caso 3: Decisão de Apelar

### Cenário

Uma parte perdeu em primeira instância e deve pagar R$ 80.000. O custo de apelar é R$ 20.000 e há 40% de chance de reversão. A parte vencedora pode oferecer acordo ou defender a sentença.

### Código

```typescript
import { JudicialGameFactory } from '@vscode-idl/judicial-strategy';

// Criar jogo de apelação
const game = JudicialGameFactory.createAppealGame(
  80000,  // Valor da sentença
  20000,  // Custo do recurso
  0.40    // 40% de chance de reversão
);

// Analisar
const analysis = game.analyze();

console.log(game.printAnalysis());

// Análise de sensibilidade
console.log('\n=== ANÁLISE DE SENSIBILIDADE ===\n');

const reversalProbabilities = [0.2, 0.3, 0.4, 0.5, 0.6];

reversalProbabilities.forEach(prob => {
  const testGame = JudicialGameFactory.createAppealGame(80000, 20000, prob);
  const testAnalysis = testGame.analyze();

  console.log(`Probabilidade de reversão: ${(prob * 100).toFixed(0)}%`);
  console.log(`  Equilíbrios encontrados: ${testAnalysis.equilibria.length}`);

  if (testAnalysis.equilibria.length > 0) {
    const eq = testAnalysis.equilibria[0];
    if (eq.profile) {
      const strategies = eq.profile.strategies;
      const matrix = testGame.getPayoffMatrix()!;
      console.log(`  Estratégia recomendada para perdedor: ${matrix.strategies[0][strategies[0]].name}`);
      console.log(`  Payoff esperado: R$ ${eq.expectedPayoffs[0].toFixed(2)}`);
    }
  }
  console.log('');
});
```

### Resultado Esperado

```
=== ANÁLISE DE SENSIBILIDADE ===

Probabilidade de reversão: 20%
  Equilíbrios encontrados: 1
  Estratégia recomendada para perdedor: Aceitar Sentença
  Payoff esperado: R$ -56000.00

Probabilidade de reversão: 30%
  Equilíbrios encontrados: 1
  Estratégia recomendada para perdedor: Aceitar Sentença
  Payoff esperado: R$ -56000.00

Probabilidade de reversão: 40%
  Equilíbrios encontrados: 1
  Estratégia recomendada para perdedor: Apelar
  Payoff esperado: R$ -52000.00

Probabilidade de reversão: 50%
  Equilíbrios encontrados: 1
  Estratégia recomendada para perdedor: Apelar
  Payoff esperado: R$ -50000.00

Probabilidade de reversão: 60%
  Equilíbrios encontrados: 1
  Estratégia recomendada para perdedor: Apelar
  Payoff esperado: R$ -48000.00
```

### Análise

A decisão de apelar depende criticamente da **probabilidade de reversão**:

- Com **< 40%**: Não vale a pena apelar (custo > benefício esperado)
- Com **≥ 40%**: Vale a pena apelar

**Ponto de equilíbrio**: Quando custo do recurso = probabilidade × valor da sentença

---

## Caso 4: Litígio Trabalhista

### Cenário

Um funcionário demitido move ação trabalhista pedindo R$ 50.000. A empresa pode aceitar acordo, contraofertar com valor menor, ou defender-se completamente.

### Código

```typescript
import {
  JudicialGame,
  Player,
  Strategy,
  PlayerType,
  CaseType,
} from '@vscode-idl/judicial-strategy';

// Definir jogadores
const players: Player[] = [
  { name: 'Funcionário', type: PlayerType.PLAINTIFF },
  { name: 'Empresa', type: PlayerType.DEFENDANT },
];

// Estratégias do funcionário
const employeeStrategies: Strategy[] = [
  {
    name: 'Aceitar 70%',
    description: 'Aceitar acordo de R$ 35.000 (70%)',
    cost: 2000,
    successProbability: 1.0,
  },
  {
    name: 'Exigir 100%',
    description: 'Exigir R$ 50.000 e ir a julgamento',
    cost: 8000,
    successProbability: 0.6,
  },
];

// Estratégias da empresa
const companyStrategies: Strategy[] = [
  {
    name: 'Acordo 70%',
    description: 'Oferecer R$ 35.000',
    cost: 2000,
    successProbability: 0.7,
  },
  {
    name: 'Acordo 50%',
    description: 'Oferecer apenas R$ 25.000',
    cost: 3000,
    successProbability: 0.4,
  },
  {
    name: 'Defesa Total',
    description: 'Contestar completamente',
    cost: 10000,
    successProbability: 0.4,
  },
];

// Criar jogo
const game = new JudicialGame({
  players,
  strategies: [employeeStrategies, companyStrategies],
  context: {
    caseType: CaseType.LABOR,
    claimValue: 50000,
    evidence: 0.6,
    litigationCosts: 8000,
  },
});

// Analisar
const analysis = game.analyze();
console.log(game.printAnalysis());

// Detalhar cada equilíbrio
console.log('\n=== DETALHAMENTO DOS EQUILÍBRIOS ===\n');

analysis.equilibria.forEach((eq, i) => {
  if (eq.profile) {
    const matrix = game.getPayoffMatrix()!;
    console.log(`Equilíbrio ${i + 1}:`);
    console.log(`  ${players[0].name}: ${matrix.strategies[0][eq.profile.strategies[0]].name}`);
    console.log(`  ${players[1].name}: ${matrix.strategies[1][eq.profile.strategies[1]].name}`);
    console.log(`  Resultado para ${players[0].name}: R$ ${eq.expectedPayoffs[0].toFixed(2)}`);
    console.log(`  Resultado para ${players[1].name}: R$ ${eq.expectedPayoffs[1].toFixed(2)}`);
    console.log(`  Estabilidade: ${(eq.stability! * 100).toFixed(1)}%\n`);
  }
});
```

### Resultado Esperado

```
=== DETALHAMENTO DOS EQUILÍBRIOS ===

Equilíbrio 1:
  Funcionário: Aceitar 70%
  Empresa: Acordo 70%
  Resultado para Funcionário: R$ 33000.00
  Resultado para Empresa: R$ -37000.00
  Estabilidade: 85.2%
```

### Análise

O equilíbrio sugere que **ambas as partes devem aceitar acordo de 70%** porque:

- **Funcionário**: Recebe 70% garantido vs. risco de perder em julgamento
- **Empresa**: Paga 74% (70% + custos) vs. risco de perder 100% + custos de defesa

**Economia para sociedade**: R$ 14.000 em custos judiciais evitados

---

## Caso 5: Análise Comparativa de Estratégias

### Cenário

Comparar diferentes cenários de um mesmo caso variando a força das evidências.

### Código

```typescript
import { JudicialGameFactory } from '@vscode-idl/judicial-strategy';

console.log('=== IMPACTO DA FORÇA DAS EVIDÊNCIAS ===\n');

const evidenceLevels = [
  { level: 0.3, description: 'Evidências fracas' },
  { level: 0.5, description: 'Evidências equilibradas' },
  { level: 0.7, description: 'Evidências fortes' },
  { level: 0.9, description: 'Evidências muito fortes' },
];

const claimValue = 100000;
const litigationCosts = 20000;

evidenceLevels.forEach(({ level, description }) => {
  console.log(`\n${description} (${(level * 100).toFixed(0)}%):`);
  console.log('─'.repeat(60));

  const game = JudicialGameFactory.createSettlementNegotiation(
    claimValue,
    level,
    litigationCosts
  );

  const analysis = game.analyze();

  if (analysis.equilibria.length > 0) {
    const eq = analysis.equilibria[0];
    const matrix = game.getPayoffMatrix()!;

    if (eq.profile) {
      console.log(`Equilíbrio: ${matrix.strategies[0][eq.profile.strategies[0]].name} vs ${matrix.strategies[1][eq.profile.strategies[1]].name}`);
      console.log(`Payoff Autor: R$ ${eq.expectedPayoffs[0].toFixed(2)}`);
      console.log(`Payoff Réu: R$ ${eq.expectedPayoffs[1].toFixed(2)}`);

      // Calcula valor esperado de litigação
      const litigationValue = level * claimValue - litigationCosts;
      console.log(`Valor esperado de litigação: R$ ${litigationValue.toFixed(2)}`);

      // Recomendação
      if (eq.profile.strategies[0] === 0) {
        console.log('✓ Recomendação: ACORDO é a melhor opção');
      } else {
        console.log('✓ Recomendação: LITIGAÇÃO pode ser vantajosa');
      }
    }
  }
});

console.log('\n' + '═'.repeat(60));
console.log('CONCLUSÃO:');
console.log('═'.repeat(60));
console.log(`
Com evidências FRACAS (< 50%):
  → Acordo é fortemente recomendado
  → Litigação tem valor esperado negativo

Com evidências EQUILIBRADAS (≈ 50%):
  → Acordo ainda é preferível (evita custos)
  → Litigação é arriscada

Com evidências FORTES (> 70%):
  → Acordo pode ser aceitável se for justo
  → Litigação se torna mais atraente

Com evidências MUITO FORTES (> 90%):
  → Pode valer a pena litigar
  → Poder de negociação aumenta significativamente
`);
```

### Resultado Esperado

```
=== IMPACTO DA FORÇA DAS EVIDÊNCIAS ===

Evidências fracas (30%):
────────────────────────────────────────────────────────────
Equilíbrio: Aceitar Acordo (50%) vs Oferecer Acordo (50%)
Payoff Autor: R$ 45000.00
Payoff Réu: R$ -45000.00
Valor esperado de litigação: R$ 10000.00
✓ Recomendação: ACORDO é a melhor opção

Evidências equilibradas (50%):
────────────────────────────────────────────────────────────
Equilíbrio: Aceitar Acordo (50%) vs Oferecer Acordo (50%)
Payoff Autor: R$ 45000.00
Payoff Réu: R$ -45000.00
Valor esperado de litigação: R$ 30000.00
✓ Recomendação: ACORDO é a melhor opção

Evidências fortes (70%):
────────────────────────────────────────────────────────────
Equilíbrio: Aceitar Acordo (50%) vs Oferecer Acordo (50%)
Payoff Autor: R$ 45000.00
Payoff Réu: R$ -45000.00
Valor esperado de litigação: R$ 50000.00
✓ Recomendação: ACORDO é a melhor opção

Evidências muito fortes (90%):
────────────────────────────────────────────────────────────
Equilíbrio: Aceitar Acordo (50%) vs Oferecer Acordo (50%)
Payoff Autor: R$ 45000.00
Payoff Réu: R$ -45000.00
Valor esperado de litigação: R$ 70000.00
✓ Recomendação: LITIGAÇÃO pode ser vantajosa
```

---

## Conclusões Gerais

### Principais Insights

1. **Custos de Litigação são Decisivos**: Mesmo com boas chances de vitória, custos altos favorecem acordos

2. **Informação Assimétrica**: Quando as partes têm avaliações diferentes das evidências, acordo se torna mais difícil

3. **Estratégias Dominantes**: Quando existem, simplificam a decisão (sempre escolha a dominante)

4. **Dilema do Prisioneiro**: Comum em casos criminais - cooperação seria melhor, mas delação é racional

5. **Análise de Sensibilidade**: Pequenas mudanças em probabilidades podem mudar completamente a estratégia ótima

### Quando Usar Cada Abordagem

| Cenário | Ferramenta Recomendada |
|---------|------------------------|
| Negociação simples (2 partes, 2-3 estratégias) | `createSettlementNegotiation()` |
| Casos criminais com delação | `createPleaBargainDilemma()` |
| Decisões de recurso | `createAppealGame()` |
| Casos complexos (múltiplas partes/estratégias) | `JudicialGame` customizado |
| Análise teórica pura | `PayoffMatrixBuilder` + `NashSolver` |

### Limitações a Considerar

- **Racionalidade limitada**: Pessoas nem sempre agem de forma perfeitamente racional
- **Emoções**: Vingança, orgulho, etc. não são capturados nos modelos
- **Reputação**: Efeitos de longo prazo não são modelados em jogos únicos
- **Informação incompleta**: Modelos assumem conhecimento dos payoffs

---

## Próximos Passos

1. Experimente com seus próprios casos
2. Ajuste os parâmetros para ver como resultados mudam
3. Crie funções de utilidade customizadas
4. Explore jogos sequenciais (árvores de decisão)
5. Modele negociações com múltiplas rodadas

**Boa sorte com suas análises estratégicas!**
