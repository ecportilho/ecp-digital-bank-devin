# ECP Digital Bank

Banco digital completo construido com Fastify 5.0, React 18.3, SQLite3 e TypeScript.

![Dark Theme Dashboard](https://img.shields.io/badge/theme-dark-0b0f14) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue) ![Fastify](https://img.shields.io/badge/Fastify-5.0-black) ![React](https://img.shields.io/badge/React-18.3-61dafb) ![SQLite](https://img.shields.io/badge/SQLite3-better--sqlite3-003B57)

---

## Indice

- [Visao Geral](#visao-geral)
- [Screenshots](#screenshots)
- [Arquitetura](#arquitetura)
- [Tech Stack](#tech-stack)
- [Primeiros Passos](#primeiros-passos)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Banco de Dados](#banco-de-dados)
- [API Endpoints](#api-endpoints)
- [Frontend](#frontend)
- [Regras de Negocio](#regras-de-negocio)
- [Design System](#design-system)
- [Deploy em Producao](#deploy-em-producao)
- [Documentacao do Produto](#documentacao-do-produto)
- [Seguranca](#seguranca)
- [Contribuicao](#contribuicao)

---

## Visao Geral

O **ECP Digital Bank** e uma aplicacao web de banco digital voltada para brasileiros de 20 a 45 anos. Oferece operacoes essenciais como Pix, cartao virtual, extrato inteligente e pagamento de contas, com interface dark theme, responsiva e de alto desempenho.

**Funcionalidades principais:**
- Conta digital com saldo em tempo real
- Pix: enviar, receber, gerenciar chaves (max 5 por conta)
- Cartao virtual com bloqueio/desbloqueio instantaneo
- Extrato com categorizacao e filtros por tipo
- Pagamento de boletos via codigo de barras
- Perfil do usuario com edicao e exclusao (soft delete)
- Centro de notificacoes com marcacao de lidas

**Demo:** Login com `joao@email.com` / `Senha@123` (saldo R$ 5.000,00)

---

## Screenshots

| Dashboard | Pix | Extrato |
|-----------|-----|---------|
| Saldo, acoes rapidas, ultimas transacoes | Envio com tipo de chave, gestao de chaves | 7 transacoes com filtros por tipo |

| Cartoes | Pagamentos | Perfil |
|---------|-----------|--------|
| Cartao virtual com bloqueio | Pagamento de boleto | Dados pessoais e zona de perigo |

---

## Arquitetura

```
Monolito Node.js (porta 3333)
+--------------------------------------------------+
|                    Fastify 5.0                    |
|                                                   |
|  +---------------------------------------------+ |
|  |              Plugins                         | |
|  |  @fastify/cors  |  @fastify/helmet           | |
|  |  @fastify/rate-limit  |  @fastify/static     | |
|  +---------------------------------------------+ |
|                                                   |
|  +-------------------+  +---------------------+  |
|  |   API Routes      |  |  Static Files       |  |
|  |   /api/*          |  |  /  (web/dist/)     |  |
|  |                   |  |  SPA fallback       |  |
|  | /api/auth/*       |  |  -> index.html      |  |
|  | /api/accounts/*   |  +---------------------+  |
|  | /api/pix/*        |                            |
|  | /api/cards/*      |  +---------------------+  |
|  | /api/transactions |  |    SQLite3           |  |
|  | /api/payments/*   |  |  better-sqlite3     |  |
|  | /api/users/*      |  |  database.sqlite    |  |
|  +-------------------+  +---------------------+  |
+--------------------------------------------------+
```

- **Backend**: Fastify 5.0 (TypeScript) serve API REST + frontend estatico
- **Frontend**: React 18.3 SPA compilado para `web/dist/`
- **Database**: SQLite3 via `better-sqlite3` (sincrono, sem ORM)
- **Autenticacao**: JWT (7 dias) + bcryptjs
- **Validacao**: Zod schemas como source of truth

---

## Tech Stack

### Backend
| Tecnologia | Versao | Funcao |
|------------|--------|--------|
| Node.js | 20+ | Runtime |
| Fastify | 5.0 | HTTP framework |
| TypeScript | 5.5 | Tipagem |
| better-sqlite3 | 11.3 | Database driver |
| Zod | 3.23 | Validacao de schemas |
| bcryptjs | 2.4 | Hash de senhas |
| jsonwebtoken | 9.0 | Autenticacao JWT |
| @fastify/cors | 10.0 | Cross-origin |
| @fastify/helmet | 12.0 | Headers de seguranca |
| @fastify/rate-limit | 10.0 | Limitacao de requisicoes |
| @fastify/static | 9.0 | Serve arquivos estaticos |

### Frontend
| Tecnologia | Versao | Funcao |
|------------|--------|--------|
| React | 18.3 | UI framework |
| Vite | 5.4 | Build tool |
| React Router | 6.26 | Roteamento SPA |
| Tailwind CSS | 3.4 | Estilos utilitarios |
| Lucide React | 0.441 | Icones |
| clsx | 2.1 | Class names condicionais |

---

## Primeiros Passos

### Pre-requisitos
- Node.js >= 20
- npm >= 10

### Instalacao

```bash
# Clonar repositorio
git clone https://github.com/ecportilho/ecp-digital-bank-devin.git
cd ecp-digital-bank-devin

# Instalar dependencias (raiz, server e web)
npm install
cd server && npm install && cd ..
cd web && npm install && cd ..
```

### Configurar ambiente

```bash
# Copiar .env de exemplo
cp .env.example .env

# Variavel padrao:
# PORT=3333
# JWT_SECRET=ecp-banco-digital-secret-key-2024
# NODE_ENV=development
```

### Executar migracao e seed

```bash
# Criar tabelas
npm run db:migrate

# Popular com dados de demonstracao
npm run db:seed
```

### Rodar em desenvolvimento

```bash
# Inicia backend (porta 3333) + frontend (porta 5173) simultaneamente
npm run dev
```

- **Frontend dev**: http://localhost:5173
- **Backend API**: http://localhost:3333
- **Health check**: http://localhost:3333/health

### Rodar em producao (porta unica)

```bash
# Build do frontend
npm run build

# Iniciar servidor (serve API + frontend na porta 3333)
cd server && npx tsx src/server.ts
```

- **App completo**: http://localhost:3333

---

## Estrutura do Projeto

```
ecp-digital-bank-devin/
|-- package.json                    # Scripts raiz (dev, build, db:migrate, db:seed)
|-- tsconfig.base.json              # Config base TypeScript
|-- .env                            # Variaveis de ambiente
|
|-- server/                         # Backend Fastify
|   |-- package.json
|   |-- tsconfig.json
|   |-- database.sqlite             # Banco SQLite (gerado)
|   |-- src/
|       |-- server.ts               # Entry point + plugins + rotas + static serving
|       |-- database/
|       |   |-- connection.ts       # Singleton de conexao SQLite
|       |   |-- migrations/
|       |   |   |-- 001_initial.ts  # Schema: 8 tabelas + indices
|       |   |   |-- run.ts          # Runner de migracoes
|       |   |-- seed.ts             # Dados de demonstracao
|       |-- modules/
|       |   |-- auth/               # Login, registro, JWT
|       |   |   |-- auth.routes.ts
|       |   |   |-- auth.schemas.ts # Zod schemas
|       |   |   |-- auth.service.ts
|       |   |-- accounts/           # Saldo, status da conta
|       |   |-- pix/                # Envio, chaves, limites
|       |   |-- cards/              # Cartao virtual, bloqueio
|       |   |-- payments/           # Boletos
|       |   |-- transactions/       # Extrato, filtros
|       |   |-- users/              # Perfil, exclusao
|       |-- shared/
|           |-- errors/
|           |   |-- app-error.ts    # Classe AppError
|           |   |-- error-codes.ts  # Codigos padronizados
|           |-- middleware/
|           |   |-- auth.ts         # Middleware JWT
|           |   |-- error-handler.ts
|           |-- utils/
|               |-- money.ts        # Conversao centavos <-> reais
|               |-- uuid.ts         # Geracao UUID v4
|
|-- web/                            # Frontend React
|   |-- package.json
|   |-- vite.config.ts
|   |-- tailwind.config.js          # Design tokens customizados
|   |-- index.html
|   |-- src/
|       |-- main.tsx                # Entry point React
|       |-- App.tsx                 # Router + AuthProvider
|       |-- styles/
|       |   |-- index.css           # Tailwind base + custom classes
|       |-- lib/
|       |   |-- api.ts              # Cliente HTTP (fetch wrapper)
|       |   |-- format.ts           # Formatacao BRL, datas
|       |-- hooks/
|       |   |-- useAuth.tsx         # Context de autenticacao
|       |-- components/
|       |   |-- ui/
|       |   |   |-- Button.tsx      # Variantes: primary, secondary, danger
|       |   |   |-- Card.tsx        # Container com borda
|       |   |   |-- Input.tsx       # Input com label
|       |   |   |-- Modal.tsx       # Dialog overlay
|       |   |   |-- Badge.tsx       # Tags coloridas
|       |   |-- layout/
|       |       |-- AppLayout.tsx   # Layout autenticado (sidebar + main)
|       |       |-- Sidebar.tsx     # Navegacao lateral
|       |       |-- MobileNav.tsx   # Navegacao mobile bottom bar
|       |-- pages/
|           |-- Login.tsx           # Tela de login
|           |-- Register.tsx        # Cadastro
|           |-- Dashboard.tsx       # Home com saldo e transacoes
|           |-- Pix.tsx             # Enviar Pix + chaves
|           |-- Extrato.tsx         # Lista de transacoes
|           |-- Cards.tsx           # Cartoes virtuais
|           |-- Payments.tsx        # Pagamento de boletos
|           |-- Profile.tsx         # Dados pessoais
|           |-- Notifications.tsx   # Centro de notificacoes
|
|-- 01-strategic-context/           # Fase 01 - Contexto Estrategico
|   |-- strategic-context.md        # OKRs, OST, visao, riscos
|
|-- 02-product-discovery/           # Fase 02 - Product Discovery
|   |-- epics/
|   |   |-- epics.md                # 5 epicos priorizados
|   |-- stories/
|       |-- stories.md              # 7 historias com Gherkin
|
|-- 03-product-delivery/            # Fase 03 - Product Delivery
|   |-- hitl-delivery-checkpoints.md # HITLs #7-#10
|
|-- 04-product-operation/           # Fase 04 - Operacao
|   |-- operations.md               # SLOs, DORA, seguranca, runbooks
|
|-- hitl-final-report.md            # Relatorio final dos 12 HITLs
|-- product_briefing_espec.md       # Spec funcional (input)
|-- tech_spec.md                    # Spec tecnica (input)
|-- design_spec.md                  # Spec de design (input)
```

---

## Banco de Dados

### Diagrama ER

```
users 1---1 accounts 1---N transactions
  |                   1---N pix_keys
  |                   1---N cards 1---N invoices
  |                              1---N card_purchases
  1---N notifications
```

### Tabelas

| Tabela | Descricao | Colunas principais |
|--------|-----------|-------------------|
| `users` | Usuarios do banco | id, name, cpf, email, password_hash, deleted_at |
| `accounts` | Contas bancarias | id, user_id, balance (cents), status |
| `transactions` | Movimentacoes | id, account_id, type, amount, category, idempotency_key |
| `pix_keys` | Chaves Pix | id, account_id, type (cpf/email/phone/random), value |
| `cards` | Cartoes virtuais | id, account_id, last_four, holder_name, credit_limit, status |
| `invoices` | Faturas do cartao | id, card_id, month, year, total, status |
| `card_purchases` | Compras no cartao | id, card_id, invoice_id, merchant, amount |
| `notifications` | Notificacoes | id, user_id, title, body, type, read |

### Convencoes
- **IDs**: UUID v4 (TEXT)
- **Valores monetarios**: Inteiros em centavos (1 real = 100)
- **Timestamps**: TEXT no formato ISO 8601
- **Soft delete**: Coluna `deleted_at` (NULL = ativo)
- **Indices**: Em account_id, created_at, value (pix_keys)

---

## API Endpoints

Todos os endpoints estao sob o prefixo `/api`. Exceto login e registro, todos requerem header `Authorization: Bearer <token>`.

### Autenticacao
| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | `/api/auth/login` | Login (retorna token + user) |
| POST | `/api/auth/register` | Cadastro de novo usuario |

### Conta
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/accounts/me` | Dados da conta (saldo, status) |

### Pix
| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | `/api/pix/send` | Enviar Pix |
| GET | `/api/pix/keys` | Listar chaves do usuario |
| POST | `/api/pix/keys` | Registrar nova chave |
| DELETE | `/api/pix/keys/:id` | Remover chave |

### Cartoes
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/cards` | Listar cartoes |
| POST | `/api/cards` | Criar cartao virtual |
| PATCH | `/api/cards/:id/status` | Bloquear/desbloquear |

### Transacoes
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/transactions` | Extrato (com filtro ?type=) |

### Pagamentos
| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | `/api/payments/boleto` | Pagar boleto |

### Usuario
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/users/me` | Dados do usuario |
| PATCH | `/api/users/me` | Atualizar nome |
| DELETE | `/api/users/me` | Excluir conta (soft delete) |

### Notificacoes
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/users/notifications` | Listar notificacoes |
| PATCH | `/api/users/notifications/:id/read` | Marcar como lida |

### Formato de erro padrao

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Descricao do erro",
  "details": [
    { "field": "email", "message": "E-mail invalido" }
  ]
}
```

Codigos HTTP: 400 (validacao), 401 (nao autenticado), 403 (sem permissao), 404 (nao encontrado), 409 (conflito), 422 (regra de negocio), 429 (rate limit), 500 (interno).

---

## Frontend

### Paginas

| Rota | Componente | Descricao |
|------|-----------|-----------|
| `/login` | Login.tsx | Formulario de login |
| `/register` | Register.tsx | Formulario de cadastro |
| `/` | Dashboard.tsx | Home com saldo, acoes rapidas, ultimas transacoes |
| `/pix` | Pix.tsx | Enviar Pix + gerenciar chaves |
| `/extrato` | Extrato.tsx | Lista de transacoes com filtros |
| `/cartoes` | Cards.tsx | Cartoes virtuais com bloqueio |
| `/pagamentos` | Payments.tsx | Pagamento de boletos |
| `/perfil` | Profile.tsx | Dados pessoais e exclusao |
| `/notificacoes` | Notifications.tsx | Centro de notificacoes |

### Componentes reutilizaveis

| Componente | Props | Variantes |
|-----------|-------|-----------|
| Button | variant, size, isLoading | primary, secondary, danger, ghost |
| Card | className, children | - |
| Input | label, error, ...inputProps | - |
| Modal | isOpen, onClose, title | - |
| Badge | variant | success, danger, warning, info, default |
| AppLayout | children | Sidebar (desktop) + MobileNav (mobile) |

### Autenticacao
- Token JWT armazenado em `localStorage` (chave `ecp_token`)
- `AuthProvider` valida token na inicializacao chamando `/api/users/me`
- Rotas protegidas redirecionam para `/login` se nao autenticado
- Logout limpa token e redireciona

---

## Regras de Negocio

| ID | Regra | Implementacao |
|----|-------|---------------|
| RN-01 | Limite diario Pix (diurno) | Max R$ 5.000/dia entre 6h-22h |
| RN-02 | Limite noturno Pix | Max R$ 1.000/transacao entre 22h-6h |
| RN-03 | Autenticacao reforcada | Transacoes > R$ 2.000 exigem confirmacao |
| RN-04 | Saldo insuficiente | Pix e pagamentos bloqueados se saldo < valor |
| RN-05 | Chaves Pix | Max 5 por conta (1 CPF + 4 outras) |
| RN-06 | Cartao virtual | Limite independente do saldo. Fatura fecha dia 25 |
| RN-07 | Soft delete | Nenhum registro deletado fisicamente |
| RN-08 | Idempotencia | `idempotency_key` previne transacoes duplicadas |
| RN-09 | Valores monetarios | Sempre integer em centavos |
| RN-10 | Rate limiting | 100 req/min por IP |

---

## Design System

### Cores

| Token | Valor | Uso |
|-------|-------|-----|
| Background | `#0b0f14` | Fundo principal |
| Surface | `#131c28` | Cards e containers |
| Secondary | `#0f1620` | Fundo secundario |
| Accent (Lime) | `#b7ff2a` | CTAs, links, badges ativos |
| Text Primary | `#eaf2ff` | Texto principal |
| Text Secondary | `#a9b7cc` | Texto secundario |
| Text Tertiary | `#7b8aa3` | Texto terciario |
| Success | `#3dff8b` | Entradas, status ativo |
| Warning | `#ffcc00` | Alertas |
| Danger | `#ff4d4d` | Saidas, erros, exclusao |
| Info | `#4da3ff` | Informacoes |

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Tamanhos**: text-xs (12px), text-sm (14px), text-base (16px), text-lg (18px), text-xl (20px), text-2xl (24px)

### Espacamento
- **Border radius cards**: 18px (`rounded-card`)
- **Border radius controls**: 13px (`rounded-control`)
- **Padding cards**: 24px
- **Gap entre elementos**: 16px / 24px

---

## Deploy em Producao

### Opcao 1: Servidor Node.js (recomendado)

```bash
# Build do frontend
cd web && npm run build && cd ..

# Iniciar servidor (serve API + frontend)
cd server && NODE_ENV=production npx tsx src/server.ts
```

O servidor Fastify serve:
- API em `/api/*`
- Frontend estatico em `/` (arquivos de `web/dist/`)
- SPA fallback: qualquer rota nao-API retorna `index.html`

### Opcao 2: Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN cd server && npm ci --production
RUN cd web && npm ci && npm run build
EXPOSE 3333
CMD ["npx", "tsx", "server/src/server.ts"]
```

### Opcao 3: Fly.io

```bash
flyctl launch
flyctl deploy
```

### Variaveis de ambiente em producao

```bash
PORT=3333                              # Porta do servidor
JWT_SECRET=<segredo-forte-aleatorio>   # Chave JWT (obrigatoria)
NODE_ENV=production                    # Nivel de log
```

---

## Documentacao do Produto

Este projeto foi construido seguindo um processo de 4 fases com 12 checkpoints (HITLs):

### Fase 01 - Contexto Estrategico
**Arquivo:** [`01-strategic-context/strategic-context.md`](01-strategic-context/strategic-context.md)
- OKRs com 5 Key Results
- Opportunity Solution Tree (11 oportunidades)
- North Star Metric: Transacoes ativas mensais por usuario
- Analise de mercado (TAM/SAM/SOM)
- 4 Riscos de Cagan

### Fase 02 - Product Discovery
**Arquivos:** [`02-product-discovery/epics/`](02-product-discovery/epics/) | [`02-product-discovery/stories/`](02-product-discovery/stories/)
- 5 epicos priorizados
- 7 user stories com criterios de aceitacao em Gherkin

### Fase 03 - Product Delivery
**Arquivo:** [`03-product-delivery/hitl-delivery-checkpoints.md`](03-product-delivery/hitl-delivery-checkpoints.md)
- Arquitetura e design do banco de dados
- 18 API endpoints documentados
- 7 paginas + 5 componentes UI
- Regras de negocio implementadas

### Fase 04 - Operacao
**Arquivo:** [`04-product-operation/operations.md`](04-product-operation/operations.md)
- 5 SLOs (disponibilidade 99.5%, latencia P50 <100ms, P99 <500ms)
- 4 DORA metrics com targets
- Estrategia de monitoramento
- 7 controles de seguranca
- Runbook de incidentes

### Relatorio Final
**Arquivo:** [`hitl-final-report.md`](hitl-final-report.md)
- Resumo dos 12 HITLs
- KRs vs resultados
- Recomendacoes para proximo ciclo

---

## Seguranca

| Controle | Implementacao |
|----------|--------------|
| Autenticacao | JWT com expiracao de 7 dias |
| Hash de senhas | bcryptjs (salt rounds = 10) |
| Headers | Helmet (X-Frame-Options, HSTS, etc.) |
| Rate limiting | 100 req/min por IP |
| CORS | Origem configuravel |
| Validacao | Zod em todas as rotas de entrada |
| Soft delete | Dados nunca sao deletados fisicamente |
| CSP | Desabilitado para compatibilidade SPA |

---

## Contribuicao

1. Fork o repositorio
2. Crie uma branch (`git checkout -b feature/minha-feature`)
3. Commit suas mudancas (`git commit -m 'feat: minha feature'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

### Convencoes
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)
- **TypeScript**: Strict mode, sem `any`
- **Imports**: Case-sensitive (Linux)
- **Caminhos**: `path.join()` (nunca strings concatenadas)
- **Dinheiro**: Sempre em centavos (integer)
- **IDs**: UUID v4

---

## Especificacoes de Entrada

| Documento | Descricao |
|-----------|-----------|
| [`product_briefing_espec.md`](product_briefing_espec.md) | O QUE construir (funcionalidades, regras de negocio) |
| [`tech_spec.md`](tech_spec.md) | COMO construir (stack, arquitetura, convencoes) |
| [`design_spec.md`](design_spec.md) | COM QUE CARA (cores, tipografia, componentes) |

---

*Construido pelo ECP AI Multi-Agent Squad | v3.0*
