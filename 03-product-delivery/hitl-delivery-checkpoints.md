# HITLs #7-#10 — Checkpoints de Delivery | ECP Digital Bank

> **Phase:** 03-product-delivery
> **Date:** 2026-04-05

---

## HITL #7 — Arquitetura e Design do Banco de Dados

### Decisao: `approved`

### Artefatos Avaliados

**Arquitetura escolhida:** Monolito modular (Fastify 5.0 + SQLite3)

**Justificativa:**
- Adequada para MVP — simplicidade operacional, deploy único
- Modularidade permite futura extração de microserviços
- SQLite elimina dependência de servidor de banco externo
- TypeScript strict mode garante segurança de tipos

**Schema do banco — 8 tabelas:**

| Tabela | Campos principais | Relacionamentos |
|--------|------------------|-----------------|
| `users` | id, name, cpf, email, password_hash, deleted_at | 1:1 accounts |
| `accounts` | id, user_id, balance, status | 1:N transactions, pix_keys, cards |
| `transactions` | id, account_id, type, amount, description, category | N:1 accounts |
| `pix_keys` | id, account_id, key_type, key_value | N:1 accounts |
| `cards` | id, account_id, last_four, holder_name, expiry, limit, status | N:1 accounts, 1:N card_purchases |
| `invoices` | id, card_id, due_date, total, status | N:1 cards |
| `card_purchases` | id, card_id, invoice_id, description, amount | N:1 cards, N:1 invoices |
| `notifications` | id, user_id, type, title, message, read | N:1 users |

**Regras de negocio implementadas:**
- RN-01: Limite diario Pix R$ 5.000 (padrao)
- RN-02: Limite por transacao R$ 1.000 (padrao)
- RN-05: Maximo 5 chaves Pix por conta
- RN-07: Soft delete (deleted_at) para usuarios
- Dinheiro armazenado em centavos (integer)
- IDs como UUID v4
- Indexes em foreign keys e campos de busca

---

## HITL #8 — APIs e Persistencia

### Decisao: `approved`

### Endpoints da API

| Modulo | Metodo | Rota | Descricao |
|--------|--------|------|-----------|
| Auth | POST | `/api/auth/register` | Cadastro (name, cpf, email, password) |
| Auth | POST | `/api/auth/login` | Login (email, password) → JWT |
| Accounts | GET | `/api/accounts/me` | Saldo e status da conta |
| Pix | POST | `/api/pix/send` | Enviar Pix |
| Pix | GET | `/api/pix/keys` | Listar chaves Pix |
| Pix | POST | `/api/pix/keys` | Criar chave Pix |
| Pix | DELETE | `/api/pix/keys/:id` | Remover chave Pix |
| Transactions | GET | `/api/transactions` | Listar transacoes (com filtros) |
| Cards | GET | `/api/cards` | Listar cartoes |
| Cards | POST | `/api/cards` | Criar cartao virtual |
| Cards | PATCH | `/api/cards/:id/block` | Bloquear cartao |
| Cards | PATCH | `/api/cards/:id/unblock` | Desbloquear cartao |
| Payments | POST | `/api/payments/boleto` | Pagar boleto |
| Users | GET | `/api/users/profile` | Perfil do usuario |
| Users | PATCH | `/api/users/profile` | Atualizar nome |
| Users | DELETE | `/api/users/profile` | Excluir conta (soft delete) |
| Users | GET | `/api/users/notifications` | Listar notificacoes |
| Users | PATCH | `/api/users/notifications/:id/read` | Marcar como lida |

**Validacao:** Zod schemas como source of truth para todas as rotas

**Autenticacao:** JWT com bcryptjs (salt rounds = 10)

**Error Handling:** AppError com codigos especificos:
- `INVALID_CREDENTIALS`, `USER_NOT_FOUND`, `INSUFFICIENT_BALANCE`
- `PIX_DAILY_LIMIT_EXCEEDED`, `PIX_TRANSACTION_LIMIT_EXCEEDED`
- `PIX_KEY_LIMIT_EXCEEDED`, `CARD_ALREADY_BLOCKED`

---

## HITL #9 — Frontend e Fidelidade ao Design

### Decisao: `approved`

### Conformidade com design_spec.md

| Aspecto | Especificado | Implementado | Status |
|---------|-------------|-------------|--------|
| Background | #0b0f14 | #0b0f14 | Conforme |
| Surface | #131c28 | #131c28 | Conforme |
| Accent (Lime) | #b7ff2a | #b7ff2a | Conforme |
| Text Primary | #eaf2ff | #eaf2ff | Conforme |
| Text Secondary | #a9b7cc | #a9b7cc | Conforme |
| Font | Inter | Inter (Google Fonts) | Conforme |
| Card Radius | 18px | 18px | Conforme |
| Control Radius | 13px | 13px | Conforme |
| Semantic Colors | Success/Warning/Danger/Info | Implementados | Conforme |

### Componentes UI Implementados

| Componente | Props | Variantes |
|-----------|-------|-----------|
| Button | variant, size, loading, disabled | primary, secondary, danger, ghost |
| Input | label, error, forwardRef | - |
| Card | variant, children | default, highlight |
| Badge | variant | lime, success, warning, danger, info, neutral |
| Modal | isOpen, onClose, title | - |
| Sidebar | nav items, user profile | - |
| MobileNav | bottom nav (5 items) | - |
| AppLayout | protected route wrapper | - |

### Paginas Implementadas (7)

1. **Dashboard** — saldo, acoes rapidas, ultimas transacoes
2. **Pix** — enviar Pix + gerenciar chaves (2 tabs)
3. **Extrato** — lista de transacoes com filtros por tipo
4. **Cartoes** — cartao virtual com bloqueio/desbloqueio
5. **Pagamentos** — pagamento de boleto
6. **Perfil** — editar nome + zona de perigo (excluir conta)
7. **Notificacoes** — lista com marcar como lida

---

## HITL #10 — Qualidade e Testes

### Decisao: `approved_with_reservations`

### Cobertura Atual

| Area | Status | Observacao |
|------|--------|-----------|
| Testes unitarios | Pendente | Nao implementados (MVP) |
| Testes E2E | Manual | Testado via browser — 6/6 fluxos OK |
| Validacao de tipos | OK | TypeScript strict mode |
| Validacao de input | OK | Zod schemas em todas as rotas |
| Error handling | OK | AppError + error codes + HTTP mapping |
| Build sem erros | OK | Frontend e backend compilam sem erros |

### Reservas

1. **Testes automatizados** — Recomendado adicionar Vitest (backend) e Playwright (E2E) no proximo ciclo
2. **Cobertura de codigo** — Sem metricas de cobertura (target: 80% no Horizonte 1)
3. **Performance testing** — Nao realizado (recomendado k6 para carga)

### Evidencias de Teste Manual

- Login com credenciais demo: OK
- Dashboard com saldo e transacoes: OK
- Pix envio + gestao de chaves: OK
- Extrato com filtros: OK
- Cartao virtual com bloqueio: OK
- Pagamento de boleto: OK
- Perfil com edicao: OK
- Notificacoes com marcar como lida: OK

---

## Resumo dos HITLs de Delivery

| HITL | Area | Decisao | Proximo |
|------|------|---------|---------|
| #7 | Arquitetura + DB | Approved | HITL #8 |
| #8 | APIs + Persistencia | Approved | HITL #9 |
| #9 | Frontend + Design | Approved | HITL #10 |
| #10 | Qualidade + Testes | Approved with reservations | Fase 04 |

**Recomendacao:** Avancar para Fase 04 (Operacao) com reserva de adicionar testes automatizados no proximo ciclo.
