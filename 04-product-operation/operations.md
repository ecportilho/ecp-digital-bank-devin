# Fase 04 — Operacao do Produto | ECP Digital Bank

> **Agent:** DevOps Engineer + SRE
> **Phase:** 04-product-operation
> **Date:** 2026-04-05

---

## 1. Arquitetura de Deploy

### Topologia

```
[Usuario] → [CDN/Edge] → [Node.js Server (Fastify)]
                              ├── Frontend (static files)
                              ├── API Routes (/api/*)
                              └── SQLite Database (local)
```

**Decisao:** Deploy monolitico — servidor unico serve frontend (static) + backend (API) + banco (SQLite).

**Justificativa:**
- MVP nao justifica complexidade de microservicos
- SQLite elimina dependencia de banco externo
- Deploy unico simplifica operacao
- Latencia minima (sem network hop entre frontend e API)

---

## 2. SLOs (Service Level Objectives)

| SLO | Metrica | Target | Janela |
|-----|---------|--------|--------|
| Disponibilidade | Uptime do /health | 99.5% | 30 dias |
| Latencia P50 | Tempo de resposta API | < 100ms | 7 dias |
| Latencia P99 | Tempo de resposta API | < 500ms | 7 dias |
| Taxa de erro | Respostas 5xx / Total | < 1% | 24 horas |
| Time-to-first-byte | Carregamento da pagina | < 200ms | 7 dias |

### Error Budget

- **Budget mensal:** 0.5% = ~3.6 horas de downtime permitido
- **Politica:** Se error budget < 25%, congelar deploys nao-criticos

---

## 3. DORA Metrics (Targets)

| Metrica | Target MVP | Elite (futuro) |
|---------|-----------|----------------|
| Deployment Frequency | 1x/semana | Multiplos/dia |
| Lead Time for Changes | < 1 semana | < 1 hora |
| Mean Time to Recovery (MTTR) | < 4 horas | < 1 hora |
| Change Failure Rate | < 25% | < 5% |

---

## 4. Monitoramento

### Health Check

```
GET /health
Response: { "status": "ok", "timestamp": "2026-04-05T23:17:18.316Z" }
```

### Logs

- **Formato:** JSON estruturado (Pino via Fastify)
- **Campos:** level, time, pid, hostname, reqId, method, url, statusCode, responseTime
- **Nivel:** `info` (producao), `debug` (desenvolvimento)

### Metricas Recomendadas (Horizonte 1)

| Metrica | Tipo | Descricao |
|---------|------|-----------|
| `http_requests_total` | Counter | Total de requisicoes por rota/metodo/status |
| `http_request_duration_ms` | Histogram | Latencia por rota |
| `active_users_daily` | Gauge | DAU |
| `transactions_total` | Counter | Total de transacoes por tipo |
| `pix_success_rate` | Gauge | Taxa de sucesso Pix |
| `error_rate` | Gauge | Taxa de erro 5xx |

---

## 5. Seguranca

### Implementado

| Controle | Status | Descricao |
|----------|--------|-----------|
| Helmet | Ativo | Headers de seguranca HTTP |
| Rate Limiting | Ativo | 100 req/min por IP |
| CORS | Ativo | Origin configuravel |
| JWT Auth | Ativo | Tokens assinados com secret |
| bcrypt | Ativo | Hash de senhas (salt rounds = 10) |
| Zod Validation | Ativo | Validacao de input em todas as rotas |
| Soft Delete | Ativo | Dados nao sao apagados fisicamente |

### Recomendado (Horizonte 1)

- [ ] HTTPS/TLS (via reverse proxy ou cloud provider)
- [ ] Rotacao de JWT secret
- [ ] Rate limiting por usuario (alem de IP)
- [ ] Audit log para operacoes financeiras
- [ ] CSP (Content Security Policy) mais restritivo

---

## 6. Plano de Incidentes

### Severidades

| Severidade | Descricao | SLA Resposta | SLA Resolucao |
|-----------|-----------|-------------|--------------|
| SEV1 | Servico indisponivel | 15 min | 1 hora |
| SEV2 | Funcionalidade critica degradada (Pix, login) | 30 min | 4 horas |
| SEV3 | Funcionalidade secundaria com problema | 2 horas | 24 horas |
| SEV4 | Bug cosmetico ou melhoria | 1 dia | 1 sprint |

### Runbook basico

1. Verificar `/health` endpoint
2. Verificar logs do servidor (JSON estruturado)
3. Verificar uso de disco (SQLite pode crescer)
4. Reiniciar servico se necessario
5. Notificar stakeholders conforme severidade

---

## 7. Backup e Recovery

| Item | Estrategia | RPO | RTO |
|------|-----------|-----|-----|
| SQLite Database | Snapshot diario | 24h | 1h |
| Codigo | Git (GitHub) | 0 | 15 min |
| Configuracao | .env no vault | 0 | 30 min |

---

## 8. Capacidade e Escalabilidade

### Limites atuais (SQLite)

- ~1000 usuarios concorrentes (write lock)
- ~10GB de dados antes de degradacao
- Single server (sem horizontal scaling)

### Plano de migracab (quando necessario)

1. SQLite → PostgreSQL (quando > 100 usuarios ativos)
2. Monolito → API Gateway + Servicos (quando > 1000 usuarios)
3. Node.js single → Cluster mode (quando CPU > 70%)

---

## 9. Output JSON (Agent Contract)

```json
{
  "status": "success",
  "phase": "04-product-operation",
  "agent": "devops-engineer",
  "subagents_used": ["infra-provisioner", "ci-cd-builder", "monitor-setup", "sre-guardian"],
  "skills_used": [
    "docker-compose-writer", "github-actions-writer",
    "prometheus-grafana-setup", "slo-definer",
    "dora-metrics-collector", "runbook-generator",
    "incident-response-planner"
  ],
  "deliverables": {
    "deploy_type": "monolith",
    "slos_defined": 5,
    "dora_targets": 4,
    "security_controls": 7,
    "monitoring_metrics": 6
  },
  "next_hitl": 11,
  "recommendation": "avancar"
}
```
