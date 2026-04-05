# Histórias de Usuário — ECP Digital Bank

> **Agent:** Product Owner (story subagent)
> **Phase:** 02-product-discovery
> **Skills:** user-story-writer, acceptance-criteria-writer

---

## EPIC-01: Conta Digital e Autenticação

### STORY-01: Registro de conta

**Como** um brasileiro adulto insatisfeito com bancos tradicionais,
**Quero** criar minha conta digital com nome, CPF, e-mail e senha,
**Para que** eu tenha acesso imediato às funcionalidades bancárias sem burocracia.

```gherkin
Funcionalidade: Registro de conta digital

  Cenário: Registro com sucesso
    Dado que o usuário acessa a tela de registro
    E informa nome "João Silva"
    E informa CPF "123.456.789-00"
    E informa e-mail "joao@email.com"
    E informa senha "Senha@123"
    Quando toca em "Criar conta"
    Então a conta é criada com status "active"
    E uma conta bancária com saldo R$ 0,00 é vinculada
    E o usuário é redirecionado para o dashboard
    E um JWT é gerado e armazenado no client

  Cenário: CPF já cadastrado
    Dado que o CPF "123.456.789-00" já está registrado
    Quando o usuário tenta registrar com esse CPF
    Então exibe mensagem "CPF já cadastrado"
    E o botão "Criar conta" permanece habilitado

  Cenário: E-mail já cadastrado
    Dado que o e-mail "joao@email.com" já está registrado
    Quando o usuário tenta registrar com esse e-mail
    Então exibe mensagem "E-mail já cadastrado"

  Esquema do cenário: Validação de campos obrigatórios
    Dado que o usuário está na tela de registro
    Quando deixa o campo "<campo>" vazio e toca em "Criar conta"
    Então exibe mensagem "<mensagem>"

    Exemplos:
      | campo  | mensagem                    |
      | nome   | Nome é obrigatório          |
      | cpf    | CPF é obrigatório           |
      | email  | E-mail é obrigatório        |
      | senha  | Senha é obrigatória         |
```

---

### STORY-02: Login

**Como** um usuário cadastrado,
**Quero** fazer login com e-mail e senha,
**Para que** eu acesse minha conta com segurança.

```gherkin
Funcionalidade: Login

  Cenário: Login com sucesso
    Dado que o usuário "joao@email.com" está cadastrado com senha "Senha@123"
    Quando informa e-mail "joao@email.com" e senha "Senha@123"
    E toca em "Entrar"
    Então o JWT é gerado e armazenado
    E o usuário é redirecionado para o dashboard

  Cenário: Senha incorreta
    Dado que o usuário "joao@email.com" está cadastrado
    Quando informa senha incorreta
    Então exibe mensagem "E-mail ou senha incorretos"

  Cenário: E-mail não cadastrado
    Quando informa e-mail "naoexiste@email.com"
    E toca em "Entrar"
    Então exibe mensagem "E-mail ou senha incorretos"
```

---

## EPIC-02: Pix Completo

### STORY-03: Enviar Pix

**Como** um usuário com saldo disponível,
**Quero** enviar Pix informando chave, valor e descrição,
**Para que** eu transfira dinheiro instantaneamente.

```gherkin
Funcionalidade: Envio de Pix

  Contexto:
    Dado que o usuário "João" está autenticado
    E possui saldo de R$ 2.000,00 em conta

  Cenário: Envio de Pix com sucesso
    Dado que João seleciona tipo de chave "CPF"
    E informa a chave "987.654.321-00"
    E informa o valor "R$ 150,00"
    E informa a descrição "Almoço"
    Quando toca em "Enviar Pix"
    Então o Pix é processado com sucesso
    E o saldo é atualizado para R$ 1.850,00
    E João vê o comprovante com número de transação
    E uma transação tipo "pix_sent" é registrada

  Cenário: Saldo insuficiente
    Dado que João possui saldo de R$ 50,00
    E informa o valor "R$ 100,00"
    Quando toca em "Enviar Pix"
    Então exibe mensagem "Saldo insuficiente"
    E nenhuma transação é registrada

  Cenário: Limite noturno excedido (RN-02)
    Dado que são 23h00
    E João informa o valor "R$ 1.500,00"
    Quando toca em "Enviar Pix"
    Então exibe mensagem "Limite noturno de Pix: R$ 1.000,00 por transação"

  Cenário: Limite diário excedido (RN-01)
    Dado que João já enviou R$ 4.900,00 hoje
    E informa o valor "R$ 200,00"
    Quando toca em "Enviar Pix"
    Então exibe mensagem "Limite diário de Pix excedido (R$ 5.000,00)"

  Esquema do cenário: Validação do valor
    Quando João informa o valor "<valor>"
    Então exibe mensagem "<mensagem>"

    Exemplos:
      | valor      | mensagem                          |
      | R$ 0,00    | Informe um valor maior que zero   |
      | -R$ 10,00  | Valor inválido                    |
```

---

### STORY-04: Gerenciar chaves Pix

**Como** um usuário do banco digital,
**Quero** registrar, listar e desativar minhas chaves Pix,
**Para que** eu controle como recebo transferências.

```gherkin
Funcionalidade: Gestão de chaves Pix

  Cenário: Registrar chave Pix com sucesso
    Dado que o usuário tem 2 chaves ativas
    Quando registra uma chave tipo "email" com valor "joao@email.com"
    Então a chave é criada com status "active"
    E o total de chaves ativas passa para 3

  Cenário: Limite de 5 chaves atingido (RN-05)
    Dado que o usuário tem 5 chaves ativas
    Quando tenta registrar uma nova chave
    Então exibe mensagem "Limite de 5 chaves Pix atingido"

  Cenário: Desativar chave Pix
    Dado que o usuário tem a chave "joao@email.com" ativa
    Quando desativa a chave
    Então o status muda para "inactive"

  Cenário: Listar chaves
    Dado que o usuário tem 3 chaves ativas
    Quando acessa a tela de chaves Pix
    Então vê as 3 chaves com tipo, valor e data de criação
```

---

## EPIC-03: Extrato Inteligente

### STORY-05: Consultar extrato

**Como** um usuário do banco,
**Quero** ver meu extrato com transações categorizadas,
**Para que** eu entenda para onde meu dinheiro está indo.

```gherkin
Funcionalidade: Extrato inteligente

  Cenário: Visualizar extrato com transações
    Dado que o usuário tem 15 transações no mês
    Quando acessa a tela de extrato
    Então vê a lista de transações ordenada por data (mais recente primeiro)
    E cada transação mostra: tipo, descrição, valor, categoria e data
    E valores de saída são exibidos em vermelho
    E valores de entrada são exibidos em verde

  Cenário: Extrato vazio
    Dado que o usuário não tem transações
    Quando acessa a tela de extrato
    Então vê mensagem "Nenhuma transação encontrada"

  Cenário: Filtrar por tipo
    Dado que o usuário tem transações de Pix e cartão
    Quando filtra por tipo "pix_sent"
    Então vê apenas transações de Pix enviado
```

---

## EPIC-04: Cartão Virtual

### STORY-06: Gerenciar cartão virtual

**Como** um usuário que faz compras online,
**Quero** criar e gerenciar cartões virtuais,
**Para que** eu tenha segurança nas transações online.

```gherkin
Funcionalidade: Cartão virtual

  Cenário: Criar cartão virtual
    Dado que o usuário está autenticado
    Quando solicita a criação de um cartão virtual
    Então um cartão é gerado com status "active"
    E os últimos 4 dígitos são exibidos
    E um limite padrão é atribuído

  Cenário: Bloquear cartão
    Dado que o cartão está "active"
    Quando o usuário toca em "Bloquear"
    Então o status muda para "blocked"
    E novas compras são rejeitadas

  Cenário: Desbloquear cartão
    Dado que o cartão está "blocked"
    Quando o usuário toca em "Desbloquear"
    Então o status volta para "active"

  Cenário: Listar cartões
    Dado que o usuário tem 2 cartões
    Quando acessa a tela de cartões
    Então vê os 2 cartões com últimos 4 dígitos, status e limite
```

---

## EPIC-05: Pagamento de Contas

### STORY-07: Pagar boleto

**Como** um usuário com contas a pagar,
**Quero** pagar boletos pelo app,
**Para que** eu não precise usar outro banco ou app.

```gherkin
Funcionalidade: Pagamento de boleto

  Cenário: Pagar boleto com sucesso
    Dado que o usuário tem saldo de R$ 500,00
    E informa o código de barras do boleto
    E o valor do boleto é R$ 150,00
    Quando toca em "Pagar"
    Então o pagamento é processado
    E o saldo é atualizado para R$ 350,00
    E uma transação tipo "payment" é registrada

  Cenário: Saldo insuficiente para boleto
    Dado que o usuário tem saldo de R$ 50,00
    E o valor do boleto é R$ 150,00
    Quando toca em "Pagar"
    Então exibe mensagem "Saldo insuficiente"
```
