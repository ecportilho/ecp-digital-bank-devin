# Épicos — ECP Digital Bank

> **Agent:** Product Owner (epic subagent)
> **Phase:** 02-product-discovery
> **Skills:** opportunity-prioritizer, epic-writer

---

## Priorização de Oportunidades (RICE Score)

| Opp | Descrição | Reach | Impact | Confidence | Effort | Score | Decisão |
|-----|-----------|-------|--------|------------|--------|-------|---------|
| OPP-1.1 | Pix instantâneo em 3 toques | 90% | 3 | 90% | 2 | 121.5 | attack_now |
| OPP-2.1 | Cadastro mínimo (4 campos) | 100% | 3 | 95% | 1 | 285.0 | attack_now |
| OPP-3.1 | Extrato inteligente categorizado | 70% | 2 | 70% | 2 | 49.0 | attack_now |
| OPP-1.3 | Cartão virtual sob demanda | 50% | 2 | 60% | 3 | 20.0 | attack_now |
| OPP-1.2 | Pagamento de boletos integrado | 60% | 2 | 80% | 2 | 48.0 | attack_now |
| OPP-4.1 | Comprovante Pix claro | 85% | 1 | 90% | 1 | 76.5 | attack_now |
| OPP-4.2 | Gestão visual de chaves Pix | 60% | 1 | 80% | 1 | 48.0 | attack_now |
| OPP-5.1 | Mensagens de erro específicas | 100% | 1 | 95% | 1 | 95.0 | attack_now |
| OPP-2.2 | Onboarding guiado | 40% | 2 | 50% | 2 | 20.0 | attack_later |
| OPP-3.2 | Notificações úteis | 50% | 2 | 50% | 3 | 16.7 | attack_later |
| OPP-5.2 | Status em tempo real | 40% | 1 | 60% | 2 | 12.0 | attack_later |

---

## Épicos

### EPIC-01: Conta Digital e Autenticação

**Hypothesis Statement:** Se oferecermos cadastro em 4 campos com conta ativa imediatamente, então os usuários completarão o registro e farão a primeira transação em ≤ 3 minutos (KR-2), porque a principal barreira é a burocracia do cadastro tradicional.

**Business Outcome:** Aquisição de usuários com baixa fricção
**Leading Indicator:** Conversion rate do registro
**KRs relacionados:** KR-2, KR-3

---

### EPIC-02: Pix Completo

**Hypothesis Statement:** Se simplificarmos o envio de Pix para 3 toques com comprovante imediato, então os usuários realizarão ≥ 8 transações/mês (KR-1) e avaliarão o fluxo com NPS ≥ 60 (KR-4), porque a rapidez e clareza são os principais drivers de uso recorrente.

**Business Outcome:** Engajamento recorrente via transações Pix
**Leading Indicator:** Pix adoption rate, transações/dia
**KRs relacionados:** KR-1, KR-4, KR-5

---

### EPIC-03: Extrato Inteligente

**Hypothesis Statement:** Se categorizarmos automaticamente as transações e mostrarmos insights de gastos, então a retenção D7 será ≥ 40% (KR-3), porque o controle financeiro é o motivo pelo qual usuários retornam ao app.

**Business Outcome:** Retenção e stickiness
**Leading Indicator:** DAU/MAU ratio, sessões por semana
**KRs relacionados:** KR-3, KR-1

---

### EPIC-04: Cartão Virtual

**Hypothesis Statement:** Se oferecermos geração de cartão virtual sob demanda com bloqueio instantâneo, então aumentaremos a diversidade de transações e a percepção de segurança, contribuindo para ≥ 8 transações/mês (KR-1).

**Business Outcome:** Receita por interchange e engajamento
**Leading Indicator:** Cartões gerados/mês, compras/cartão
**KRs relacionados:** KR-1

---

### EPIC-05: Pagamento de Contas

**Hypothesis Statement:** Se integrarmos pagamento de boletos e contas de serviço no mesmo app, então os usuários consolidarão suas operações financeiras aqui, aumentando transações/mês (KR-1).

**Business Outcome:** Consolidação de operações financeiras
**Leading Indicator:** Boletos pagos/mês
**KRs relacionados:** KR-1, KR-3
