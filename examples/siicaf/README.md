# Exemplos SIICAF - Análise de Processos Judiciais

Este diretório contém exemplos práticos de uso da biblioteca Nash integrada com o SIICAF.

## 📁 Arquivos de Exemplo

### 1. `exemplo-caso-civil.json`
Exemplo completo de processo civil (ação de cobrança).

**Como usar:**
```powershell
# Via PowerShell
Analyze-CustomCase -ConfigFile ".\examples\siicaf\exemplo-caso-civil.json" -Output ".\relatorio-civil.html" -Formato html

# Via CLI
node dist/apps/judicial-cli/main.js custom --input examples/siicaf/exemplo-caso-civil.json --output relatorio-civil.html --format html
```

### 2. `exemplo-caso-criminal.json`
Exemplo de processo criminal com análise de delação premiada.

**Como usar:**
```powershell
# Via PowerShell
Analyze-CustomCase -ConfigFile ".\examples\siicaf\exemplo-caso-criminal.json" -Output ".\relatorio-criminal.html" -Formato html
```

### 3. `exemplo-recurso.json`
Exemplo de análise de viabilidade de recurso trabalhista.

**Como usar:**
```powershell
# Via PowerShell
Analyze-CustomCase -ConfigFile ".\examples\siicaf\exemplo-recurso.json" -Output ".\relatorio-recurso.html" -Formato html
```

## 🚀 Exemplo de Código TypeScript

### Usar Módulo SIICAF Integration

```typescript
import * as fs from 'fs';
import { SIICAFIntegration, SIICAFProcesso } from '@vscode-idl/judicial-strategy';

// Carregar processo de arquivo
const arquivoProcesso = fs.readFileSync('./examples/siicaf/exemplo-caso-civil.json', 'utf-8');
const dados = JSON.parse(arquivoProcesso);

// Converter para formato SIICAF
const processo: SIICAFProcesso = {
  ...dados.processo,
  dataAbertura: new Date(dados.processo.dataAbertura),
  evidencias: dados.processo.evidencias?.map((ev: any) => ({
    ...ev,
    data: new Date(ev.data)
  }))
};

// Executar análise
const analise = await SIICAFIntegration.analyzeProcesso(
  processo,
  dados.parametrosAnalise.tipoAnalise,
  dados.parametrosAnalise
);

// Gerar relatório
const relatorio = SIICAFIntegration.generateRelatorio(processo, analise);

// Salvar
fs.writeFileSync('./relatorio-completo.txt', relatorio);

console.log('✓ Análise concluída!');
console.log(relatorio);
```

## 📊 Estrutura de Arquivo JSON

### Formato Completo

```json
{
  "processo": {
    "numeroProcesso": "string",
    "tipo": "civil|criminal|trabalhista|administrativo",
    "status": "ativo|arquivado|suspenso|em_recurso",
    "dataAbertura": "ISO 8601 date",
    "valorCausa": "number (opcional)",
    "descricao": "string (opcional)",
    "partes": [
      {
        "nome": "string",
        "tipo": "autor|reu|promotor|etc",
        "documento": "CPF/CNPJ (opcional)",
        "advogado": "string (opcional)",
        "recursos": "number (opcional)"
      }
    ],
    "evidencias": [
      {
        "tipo": "documento|testemunho|pericia|laudo|outro",
        "descricao": "string",
        "forca": "number (0.0 a 1.0)",
        "data": "ISO 8601 date",
        "arquivo": "string (opcional)"
      }
    ],
    "metadata": {
      // Campos customizados
    }
  },
  "parametrosAnalise": {
    "tipoAnalise": "acordo|delacao|recurso|customizada",
    "valorCausa": "number (para acordo)",
    "evidencia": "number (para acordo)",
    "custoLitigacao": "number (para acordo)",
    "penaMaxima": "number (para delacao)",
    "valorSentenca": "number (para recurso)",
    "custoRecurso": "number (para recurso)",
    "probabilidadeReversao": "number (para recurso)",
    "analista": "string (opcional)",
    "observacoes": "string (opcional)"
  }
}
```

## 🎯 Casos de Uso

### 1. Análise Rápida via PowerShell

```powershell
# Carregar módulo
Import-Module .\scripts\powershell\SIICAF-Nash.psm1

# Analisar caso civil
Analyze-SettlementNegotiation -ValorCausa 150000 -Evidencia 0.78 -CustoLitigacao 25000

# Analisar caso criminal
Analyze-PleaBargain -PenaMaxima 12

# Analisar recurso
Analyze-Appeal -ValorSentenca 80000 -CustoRecurso 18000 -ProbabilidadeReversao 0.25
```

### 2. Integração com Sistema SIICAF

```typescript
// No seu sistema SIICAF existente
import { SIICAFIntegration } from '@vscode-idl/judicial-strategy';

class SIICAFProcessManager {
  async analisarProcesso(processoId: string) {
    // Buscar processo do banco de dados
    const processo = await this.database.getProcesso(processoId);

    // Converter para formato de análise
    const processoSIICAF = this.convertToSIICAFFormat(processo);

    // Executar análise Nash
    const analise = await SIICAFIntegration.analyzeProcesso(
      processoSIICAF,
      'acordo'
    );

    // Salvar resultado
    await this.database.saveAnalise(processoId, analise);

    // Notificar advogado
    await this.notificationService.notifyLawyer(
      processo.advogadoId,
      analise
    );

    return analise;
  }
}
```

### 3. Análise em Lote

```powershell
# Processar múltiplos casos
$casos = @(
    ".\examples\siicaf\exemplo-caso-civil.json",
    ".\examples\siicaf\exemplo-caso-criminal.json",
    ".\examples\siicaf\exemplo-recurso.json"
)

foreach ($caso in $casos) {
    $nomeArquivo = [System.IO.Path]::GetFileNameWithoutExtension($caso)

    Write-Host "Analisando: $nomeArquivo" -ForegroundColor Cyan

    Analyze-CustomCase `
        -ConfigFile $caso `
        -Output ".\relatorios\$nomeArquivo-relatorio.html" `
        -Formato html

    Write-Host "✓ Concluído" -ForegroundColor Green
}
```

## 📈 Análise de Sensibilidade

```powershell
# Testar diferentes cenários de evidência
$evidencias = @(0.3, 0.5, 0.7, 0.9)

foreach ($evidencia in $evidencias) {
    Write-Host "`nCenário: Evidência = $($evidencia * 100)%" -ForegroundColor Yellow

    Analyze-SettlementNegotiation `
        -ValorCausa 150000 `
        -Evidencia $evidencia `
        -CustoLitigacao 25000 `
        -Output ".\analises\evidencia-$($evidencia * 100).html" `
        -Formato html
}
```

## 🔍 Validação de Arquivos JSON

```powershell
# Validar estrutura do JSON
function Test-SIICAFJson {
    param([string]$FilePath)

    try {
        $conteudo = Get-Content $FilePath | ConvertFrom-Json

        # Verificar campos obrigatórios
        if (-not $conteudo.processo) {
            throw "Campo 'processo' não encontrado"
        }
        if (-not $conteudo.processo.numeroProcesso) {
            throw "Campo 'numeroProcesso' não encontrado"
        }
        if (-not $conteudo.processo.partes) {
            throw "Campo 'partes' não encontrado"
        }

        Write-Host "✓ JSON válido: $FilePath" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Error "✗ JSON inválido: $_"
        return $false
    }
}

# Validar todos os exemplos
Test-SIICAFJson ".\examples\siicaf\exemplo-caso-civil.json"
Test-SIICAFJson ".\examples\siicaf\exemplo-caso-criminal.json"
Test-SIICAFJson ".\examples\siicaf\exemplo-recurso.json"
```

## 📞 Suporte

Para dúvidas sobre os exemplos ou integração com SIICAF, consulte:
- [Guia de Integração](../../docs/SIICAF-INTEGRATION-GUIDE.md)
- [README da Biblioteca](../../libs/judicial-strategy/README.md)
- [Exemplos Detalhados](../../libs/judicial-strategy/EXAMPLES.md)

---

**SIICAF - Sistema de Inteligência e Investigação de Condutas Antijurídicas e Fraudes**

© Dra. Idelvânia Menezes de Araújo - OAB/GO 64.265-A

Licenciado pelo INPI - Propriedade Intelectual Protegida
