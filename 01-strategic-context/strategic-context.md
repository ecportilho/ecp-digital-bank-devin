# Fase 01 — Contexto Estratégico | ECP Digital Bank

> **Agent:** Product Manager
> **Phase:** 01-strategic-context
> **Input:** product_briefing_espec.md
> **Date:** 2026-04-05

---

## 1. Objetivo (Outcome de Alto Nível)

**Democratizar o acesso a serviços bancários digitais de alta qualidade para brasileiros de 20 a 45 anos, eliminando a fricção e burocracia dos bancos tradicionais, entregando uma experiência digital-first que permita realizar operações financeiras essenciais com rapidez, segurança e transparência.**

---

## 2. North Star Metric

**Transações ativas mensais por usuário (MAT/user)** — mede o engajamento real com o produto. Um usuário que faz mais transações está extraindo mais valor da plataforma.

### Métricas de Input Causais

| Métrica | Descrição | Relação com North Star |
|---------|-----------|----------------------|
| Time-to-first-transaction | Tempo entre registro e primeira operação | Reduzir → mais usuários engajados |
| DAU/MAU ratio | Proporção de usuários diários vs mensais | Aumentar → mais stickiness |
| Pix adoption rate | % de usuários que usaram Pix pelo menos 1x no mês | Aumentar → mais transações |
| Feature discovery rate | % de usuários que descobrem 3+ funcionalidades em 7 dias | Aumentar → mais retenção |

---

## 3. Key Results (KRs)

| KR | Descrição | Baseline | Target | Frequência |
|----|-----------|----------|--------|-----------|
| KR-1 | Média de transações ativas por usuário por mês | 0 (novo produto) | ≥ 8 transações/mês | Mensal |
| KR-2 | Time-to-first-transaction após registro | N/A | ≤ 3 minutos | Semanal |
| KR-3 | Taxa de retenção D7 (usuários ativos 7 dias após registro) | 0% | ≥ 40% | Semanal |
| KR-4 | NPS do fluxo de Pix | N/A | ≥ 60 | Mensal |
| KR-5 | Taxa de erro em transações (falhas visíveis ao usuário) | N/A | ≤ 1% | Diária |

---

## 4. Visão de Produto (3-5 anos)

O ECP Digital Bank será a escolha natural para brasileiros que querem um banco que funciona como um app deveria funcionar: rápido, transparente e sem surpresas. Em 3 anos, expandiremos de operações bancárias essenciais para um ecossistema financeiro completo que inclui investimentos, crédito inteligente e gestão financeira pessoal — sempre mantendo a simplicidade como princípio inegociável.

**Horizonte 1 (0-12 meses):** Banco digital essencial — conta, Pix, cartão virtual, extrato inteligente, pagamentos
**Horizonte 2 (12-24 meses):** Ecossistema financeiro — investimentos automatizados, crédito baseado em comportamento, seguros
**Horizonte 3 (24-36 meses):** Plataforma financeira — open banking, marketplace de serviços financeiros, IA para gestão financeira pessoal

---

## 5. Princípios de Decisão do Produto

| # | Princípio | Desempata quando... |
|---|-----------|-------------------|
| 1 | **Simplicidade antes de completude** | Dúvida entre adicionar feature vs simplificar fluxo → simplificar |
| 2 | **Velocidade é feature** | Dúvida entre mais dados na tela vs resposta mais rápida → velocidade |
| 3 | **Dinheiro nunca erra** | Dúvida entre UX elegante vs segurança de transação → segurança |
| 4 | **Transparência radical** | Dúvida entre esconder complexidade vs mostrar detalhes → mostrar |
| 5 | **Mobile-first, web-always** | Dúvida entre otimizar desktop vs mobile → mobile (mesmo sendo web) |

---

## 6. Opportunity Solution Tree (OST)

### Objetivo → KRs → Oportunidades

```
OBJETIVO: Democratizar acesso a banco digital de qualidade
│
├── KR-1: ≥ 8 transações/mês por usuário
│   ├── OPP-1.1: Usuários querem enviar dinheiro instantaneamente sem burocracia
│   │   → Dor: Bancos tradicionais exigem muitos passos para transferir
│   │   → Necessidade: Pix em 3 toques ou menos
│   │   → Evidência: 83% dos brasileiros usam Pix como principal meio de pagamento (BCB 2025)
│   │
│   ├── OPP-1.2: Usuários precisam pagar contas sem sair do app
│   │   → Dor: Alternar entre apps de banco e apps de boleto
│   │   → Necessidade: Pagamento de boletos e contas de serviço integrado
│   │
│   └── OPP-1.3: Usuários desejam controle sobre gastos com cartão virtual
│       → Desejo: Criar cartões temporários para compras online com segurança
│       → Necessidade: Geração sob demanda e bloqueio instantâneo
│
├── KR-2: Time-to-first-transaction ≤ 3 minutos
│   ├── OPP-2.1: Processo de registro é longo e confuso nos bancos tradicionais
│   │   → Dor: Formulários de cadastro com 15+ campos, verificação em dias
│   │   → Necessidade: Cadastro mínimo (nome, CPF, email, senha) com conta ativa imediatamente
│   │
│   └── OPP-2.2: Usuários não sabem o que fazer após criar a conta
│       → Dor: Tela inicial vazia, sem orientação
│       → Necessidade: Onboarding guiado que leva à primeira transação
│
├── KR-3: Retenção D7 ≥ 40%
│   ├── OPP-3.1: Usuários perdem o controle dos gastos e abandonam o app
│   │   → Dor: Extrato é lista genérica sem significado
│   │   → Necessidade: Categorização automática com insights de gastos
│   │
│   └── OPP-3.2: Usuários não encontram motivo para voltar diariamente
│       → Desejo: Notificações úteis sobre movimentação e oportunidades
│       → Necessidade: Alertas de Pix recebido, vencimentos, gastos incomuns
│
├── KR-4: NPS Pix ≥ 60
│   ├── OPP-4.1: Confirmação de Pix é ambígua — "será que foi?"
│   │   → Dor: Telas de confirmação genéricas sem comprovante claro
│   │   → Necessidade: Comprovante imediato com todos os dados da transação
│   │
│   └── OPP-4.2: Gerenciar chaves Pix é confuso
│       → Dor: Não sabe quantas chaves tem, como adicionar ou remover
│       → Necessidade: Gestão visual de chaves com limites claros (máx 5)
│
└── KR-5: Taxa de erro ≤ 1%
    ├── OPP-5.1: Mensagens de erro são genéricas e não ajudam o usuário
    │   → Dor: "Erro inesperado. Tente novamente" não explica nada
    │   → Necessidade: Mensagens específicas com ação sugerida
    │
    └── OPP-5.2: Transações falham silenciosamente sem feedback
        → Dor: Usuário não sabe se Pix foi enviado ou não
        → Necessidade: Status em tempo real com fallback gracioso
```

---

## 7. Análise dos 4 Riscos de Cagan (Pré-Discovery)

### Por Oportunidade Priorizada

| Oportunidade | Risco de Valor | Risco de Usabilidade | Risco de Viabilidade | Risco de Negócio |
|---|---|---|---|---|
| OPP-1.1 Pix instantâneo | Baixo (83% usam Pix) | Médio (fluxo de 3 toques) | Baixo (API simulada) | Baixo (sem custo regulatório no MVP) |
| OPP-2.1 Cadastro mínimo | Baixo (dor universal) | Baixo (4 campos) | Baixo (JWT + SQLite) | Médio (compliance KYC futuro) |
| OPP-3.1 Extrato inteligente | Médio (precisa validar categorização) | Médio (UI de categorias) | Baixo (categorização por regras) | Baixo |
| OPP-1.3 Cartão virtual | Médio (demanda real?) | Médio (gestão de cartão) | Baixo (geração local) | Baixo (sem integração bandeira no MVP) |
| OPP-5.1 Mensagens de erro | Alto (valor percebido?) | Baixo (texto claro) | Baixo (AppError + ErrorCode) | Baixo |

---

## 8. Análise de Mercado (Market Research)

### TAM / SAM / SOM

| Métrica | Valor | Descrição |
|---------|-------|-----------|
| TAM | ~R$ 50 bi | Mercado de bancos digitais no Brasil (2025), incluindo receitas de transações, cartões e crédito |
| SAM | ~R$ 8 bi | Segmento de jovens adultos (20-45 anos) digital-first, classe B/C, que buscam alternativa a bancos tradicionais |
| SOM | ~R$ 50 mi | Fatia realista para MVP regional com foco em operações essenciais (Pix + cartão + extrato) |

### Concorrentes Diretos

| Concorrente | Força | Fraqueza | Gap Explorável |
|---|---|---|---|
| Nubank | Marca, UX, escala | Complexidade crescente, suporte lento | Simplicidade radical |
| Inter | Ecossistema completo | UI poluída, muitas features | Foco e clareza |
| C6 Bank | Investimentos integrados | Onboarding longo | Cadastro mínimo |
| PicPay | Social payments | Não é banco completo | Banco + social |

### Tendências (1-3 anos)

1. **Open Banking/Finance** — interoperabilidade obrigatória entre instituições (BCB)
2. **Pix Automático** — débito recorrente via Pix (substitui boleto)
3. **IA para gestão financeira** — categorização, previsão de gastos, alertas inteligentes
4. **Real Digital (Drex)** — moeda digital do Banco Central
5. **Embedded Finance** — serviços bancários embutidos em plataformas não-financeiras

---

## 9. Output JSON (Agent Contract)

```json
{
  "status": "success",
  "phase": "01-strategic-context",
  "agent": "product-manager",
  "subagents_used": ["market-research", "product-vision", "product-strategy", "metrics"],
  "skills_used": [
    "market-sizing", "competitor-analysis", "trend-scanning", "customer-segmentation",
    "vision-writer", "north-star-definer", "product-principles",
    "okr-facilitator", "outcome-roadmap", "four-risks-assessor", "assumption-mapper",
    "leading-lagging-indicators"
  ],
  "deliverables": {
    "objective": "Democratizar acesso a banco digital de qualidade para brasileiros 20-45 anos",
    "north_star": "Transações ativas mensais por usuário (MAT/user)",
    "key_results": [
      { "id": "KR-1", "metric": "Transações/mês por usuário", "target": "≥ 8" },
      { "id": "KR-2", "metric": "Time-to-first-transaction", "target": "≤ 3 min" },
      { "id": "KR-3", "metric": "Retenção D7", "target": "≥ 40%" },
      { "id": "KR-4", "metric": "NPS Pix", "target": "≥ 60" },
      { "id": "KR-5", "metric": "Taxa de erro transações", "target": "≤ 1%" }
    ],
    "opportunities": 11,
    "product_principles": 5,
    "vision_horizon": "3 anos"
  },
  "open_questions": [
    "Qual o volume esperado de usuários no primeiro trimestre?",
    "Há restrições regulatórias (KYC/AML) para o MVP ou é simulação?"
  ],
  "assumptions": [
    "MVP opera como simulação — sem integração real com BCB ou bandeiras de cartão",
    "Público inicial é orgânico (sem investimento em aquisição paga)"
  ],
  "next_hitl": 1,
  "recommendation": "avançar"
}
```
