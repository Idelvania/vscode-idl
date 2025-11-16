# Judicial Strategy - Teoria de Nash Aplicada a Processos Judiciais

Biblioteca TypeScript para modelar e analisar estratégias judiciais usando Teoria de Jogos e Equilíbrio de Nash.

## Índice

- [Visão Geral](#visão-geral)
- [Conceitos Fundamentais](#conceitos-fundamentais)
- [Instalação](#instalação)
- [Guia Rápido](#guia-rápido)
- [Exemplos de Uso](#exemplos-de-uso)
- [API Reference](#api-reference)
- [Casos de Uso](#casos-de-uso)
- [Contribuindo](#contribuindo)

## Visão Geral

Esta biblioteca fornece ferramentas para modelar e analisar jogos judiciais usando a **Teoria de Jogos** de John Nash. Ela permite:

- 🎯 Modelar conflitos judiciais como jogos estratégicos
- 🔍 Encontrar equilíbrios de Nash (puros e mistos)
- 📊 Analisar estratégias dominantes e dominadas
- 💡 Gerar recomendações estratégicas baseadas em análise matemática
- ⚖️ Simular cenários de negociação, litígio, acordos e recursos

## Conceitos Fundamentais

### Teoria de Nash

O **Equilíbrio de Nash** é um conceito central da teoria de jogos onde nenhum jogador pode melhorar seu resultado mudando unilateralmente sua estratégia, dado que os outros jogadores mantêm suas estratégias.

**Exemplo**: Em uma negociação de acordo, se ambas as partes escolherem aceitar o acordo, nenhuma delas pode melhorar seu resultado mudando para litigação (assumindo que o acordo seja justo).

### Aplicação em Processos Judiciais

Processos judiciais são naturalmente modeláveis como jogos estratégicos:

- **Jogadores**: Autor, Réu, Promotor, etc.
- **Estratégias**: Acordo, Litígio, Mediação, Recurso, etc.
- **Payoffs**: Custos, probabilidades de vitória, tempo, valores monetários

## Instalação

```bash
npm install @vscode-idl/judicial-strategy
```

## Guia Rápido

```typescript
import { JudicialGameFactory } from '@vscode-idl/judicial-strategy';

// Cria um jogo de negociação de acordo
const game = JudicialGameFactory.createSettlementNegotiation(
  100000,  // Valor da causa: R$ 100.000
  0.7,     // Força das evidências do autor: 70%
  20000    // Custos de litigação: R$ 20.000
);

// Analisa o jogo
const analysis = game.analyze();

// Imprime análise completa
console.log(game.printAnalysis());
```

## Exemplos de Uso

### 1. Negociação de Acordo (Settlement)

```typescript
import { JudicialGameFactory } from '@vscode-idl/judicial-strategy';

// Criar jogo de negociação
const settlementGame = JudicialGameFactory.createSettlementNegotiation(
  100000,  // Valor da causa
  0.8,     // Evidências fortes do autor (80%)
  25000    // Custos altos de litigação
);

// Analisar
const analysis = settlementGame.analyze();

// Resultados
console.log('Equilíbrios encontrados:', analysis.equilibria.length);
console.log('Recomendações:', analysis.recommendations);

// Saída esperada:
// Equilíbrios encontrados: 1
// Recomendações: ["Único equilíbrio de Nash encontrado: Aceitar Acordo (50%) vs Oferecer Acordo (50%)"]
```

### 2. Dilema do Prisioneiro (Plea Bargain)

```typescript
import { JudicialGameFactory } from '@vscode-idl/judicial-strategy';

// Criar dilema de delação premiada
const pleaGame = JudicialGameFactory.createPleaBargainDilemma(10);

// Analisar
const analysis = pleaGame.analyze();

console.log(pleaGame.printAnalysis());

// Mostra que mesmo que cooperação mútua seja melhor,
// o equilíbrio de Nash é ambos delatarem
```

### 3. Jogo de Recurso/Apelação

```typescript
import { JudicialGameFactory } from '@vscode-idl/judicial-strategy';

const appealGame = JudicialGameFactory.createAppealGame(
  50000,  // Valor da sentença
  15000,  // Custo do recurso
  0.3     // 30% de chance de reversão
);

const analysis = appealGame.analyze();

// Determina se vale a pena apelar
console.log(analysis.recommendations);
```

### 4. Jogo Customizado

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
  { name: 'Empresa A', type: PlayerType.PLAINTIFF },
  { name: 'Empresa B', type: PlayerType.DEFENDANT },
];

// Definir estratégias
const strategies: Strategy[][] = [
  [
    {
      name: 'Acordo Rápido',
      description: 'Aceitar acordo de 40% do valor',
      cost: 5000,
      successProbability: 1.0,
    },
    {
      name: 'Mediação',
      description: 'Propor mediação',
      cost: 10000,
      successProbability: 0.7,
    },
    {
      name: 'Litigação Total',
      description: 'Prosseguir com processo completo',
      cost: 30000,
      successProbability: 0.6,
    },
  ],
  [
    {
      name: 'Aceitar Acordo',
      description: 'Aceitar acordo de 40%',
      cost: 5000,
      successProbability: 1.0,
    },
    {
      name: 'Contraofertar',
      description: 'Oferecer 20% do valor',
      cost: 8000,
      successProbability: 0.3,
    },
    {
      name: 'Defender Vigorosamente',
      description: 'Resistir completamente',
      cost: 30000,
      successProbability: 0.4,
    },
  ],
];

// Criar jogo customizado
const game = new JudicialGame({
  players,
  strategies,
  context: {
    caseType: CaseType.COMMERCIAL,
    claimValue: 200000,
    evidence: 0.65,
    litigationCosts: 30000,
  },
});

// Analisar
const analysis = game.analyze();
console.log(game.printAnalysis());
```

### 5. Matriz de Payoff Manual

```typescript
import {
  PayoffMatrixBuilder,
  NashSolver,
} from '@vscode-idl/judicial-strategy';

// Construir matriz manualmente
const matrix = new PayoffMatrixBuilder()
  .setPlayers(['Autor', 'Réu'])
  .setAllStrategies([
    [
      { name: 'Acordo', description: 'Aceitar acordo', cost: 5 },
      { name: 'Litigar', description: 'Prosseguir', cost: 20 },
    ],
    [
      { name: 'Acordo', description: 'Oferecer acordo', cost: 5 },
      { name: 'Resistir', description: 'Resistir', cost: 20 },
    ],
  ])
  .setPayoff([0, 0], [45, -45])   // (Acordo, Acordo)
  .setPayoff([0, 1], [-5, -20])    // (Acordo, Resistir)
  .setPayoff([1, 0], [45, -45])    // (Litigar, Acordo)
  .setPayoff([1, 1], [30, -50])    // (Litigar, Resistir)
  .build();

// Encontrar equilíbrios
const equilibria = NashSolver.findPureStrategyEquilibria(matrix);

console.log('Equilíbrios encontrados:', equilibria.length);
equilibria.forEach((eq, i) => {
  console.log(`Equilíbrio ${i + 1}:`, eq.profile?.strategies);
  console.log(`Payoffs:`, eq.expectedPayoffs);
  console.log(`Estabilidade:`, eq.stability);
});
```

## API Reference

### Classes Principais

#### `JudicialGame`

Classe principal para modelar jogos judiciais.

**Construtor:**
```typescript
constructor(config: JudicialGameConfig)
```

**Métodos:**
- `buildPayoffMatrix(): PayoffMatrix` - Constrói a matriz de payoffs
- `analyze(): GameAnalysis` - Analisa o jogo e encontra equilíbrios
- `printAnalysis(): string` - Retorna análise formatada em texto

#### `JudicialGameFactory`

Factory para criar jogos judiciais pré-configurados.

**Métodos Estáticos:**
- `createSettlementNegotiation(claimValue, evidence, costs): JudicialGame`
- `createPleaBargainDilemma(maxSentence): JudicialGame`
- `createAppealGame(judgmentValue, appealCost, reversalProb): JudicialGame`

#### `NashSolver`

Solver para encontrar equilíbrios de Nash.

**Métodos Estáticos:**
- `findPureStrategyEquilibria(matrix): NashEquilibrium[]`
- `findMixedStrategyEquilibrium2x2(matrix): NashEquilibrium | null`
- `findAllEquilibria(matrix): NashEquilibrium[]`
- `findDominantStrategies(matrix): number[][]`
- `generateRecommendations(matrix, equilibria): string[]`

#### `PayoffMatrixBuilder`

Builder para construir matrizes de payoff.

**Métodos:**
- `setPlayers(players: string[]): this`
- `setStrategies(playerIndex: number, strategies: Strategy[]): this`
- `setPayoff(strategyIndices: number[], payoffs: number[]): this`
- `build(): PayoffMatrix`

### Tipos e Interfaces

#### `Player`
```typescript
interface Player {
  name: string;
  type: PlayerType;
  resources?: number;
}
```

#### `Strategy`
```typescript
interface Strategy {
  name: string;
  description: string;
  cost: number;
  successProbability?: number;
  duration?: number;
}
```

#### `NashEquilibrium`
```typescript
interface NashEquilibrium {
  type: 'pure' | 'mixed';
  profile?: StrategyProfile;
  mixedStrategies?: MixedStrategy[];
  expectedPayoffs: number[];
  stability?: number;
}
```

#### `GameAnalysis`
```typescript
interface GameAnalysis {
  equilibria: NashEquilibrium[];
  dominantStrategies?: number[][];
  dominatedStrategies?: number[][];
  recommendations?: string[];
}
```

## Casos de Uso

### 1. Assessoria Jurídica Estratégica

Advogados podem usar esta biblioteca para:
- Avaliar se vale a pena aceitar um acordo ou prosseguir com litígio
- Determinar o melhor momento para apelar
- Identificar estratégias dominantes em negociações

### 2. Pesquisa Acadêmica

Pesquisadores podem:
- Modelar diferentes cenários judiciais
- Testar teorias sobre comportamento estratégico no judiciário
- Analisar eficiência de diferentes sistemas judiciais

### 3. Educação Jurídica

Professores podem:
- Ensinar teoria de jogos aplicada ao direito
- Demonstrar conceitos de Nash de forma prática
- Criar exercícios interativos para alunos

### 4. Análise de Políticas Públicas

Formuladores de políticas podem:
- Avaliar impacto de mudanças na legislação processual
- Simular efeitos de incentivos a acordos
- Analisar eficiência de diferentes mecanismos de resolução de disputas

## Fundamentos Teóricos

### Equilíbrio de Nash

Um perfil de estratégias $(s_1^*, s_2^*, ..., s_n^*)$ é um **Equilíbrio de Nash** se para todo jogador $i$:

$$u_i(s_i^*, s_{-i}^*) \geq u_i(s_i, s_{-i}^*) \quad \forall s_i$$

Onde:
- $u_i$ é a função de utilidade do jogador $i$
- $s_i^*$ é a estratégia ótima do jogador $i$
- $s_{-i}^*$ são as estratégias dos outros jogadores

### Estratégia Dominante

Uma estratégia $s_i$ **domina estritamente** outra estratégia $s_i'$ se:

$$u_i(s_i, s_{-i}) > u_i(s_i', s_{-i}) \quad \forall s_{-i}$$

## Limitações e Considerações

1. **Racionalidade**: Assume que todos os jogadores são racionais e buscam maximizar sua utilidade
2. **Informação**: Assume informação completa (todos conhecem os payoffs)
3. **Simplificação**: Modelos simplificam a realidade complexa do sistema judicial
4. **Aspectos não-monetários**: Nem todos os fatores podem ser quantificados (reputação, precedentes, etc.)

## Testes

Execute os testes com:

```bash
npm test libs/judicial-strategy
```

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto faz parte do vscode-idl e segue a mesma licença.

## Referências

1. Nash, J. (1950). "Equilibrium points in n-person games". *Proceedings of the National Academy of Sciences*.
2. Baird, D. G., Gertner, R. H., & Picker, R. C. (1998). *Game Theory and the Law*. Harvard University Press.
3. Cooter, R., & Ulen, T. (2016). *Law & Economics* (6th ed.). Pearson.
4. Spier, K. E. (2007). "Litigation". *Handbook of Law and Economics*, Vol. 1.

## Contato

Para questões ou sugestões, abra uma issue no repositório do projeto.

---

**Desenvolvido com ❤️ usando TypeScript e Teoria de Jogos**
