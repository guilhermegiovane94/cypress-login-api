# 🔐 Projeto Cypress - Validação de Login (Backend Only)

[![Cypress](https://img.shields.io/badge/Cypress-13.x-77a24e?style=for-the-badge&logo=cypress)](https://www.cypress.io/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0-blue.svg?style=for-the-badge)](VERSION)

Este projeto tem o intuito de demonstrar na prática o uso da tecnologia **Cypress**, aplicando o padrão de projeto **PO (Page Object)** e consumindo massas de dados através de **arquivos JSON** (`fixtures`).

Foco exclusivo no **backend**: nenhum teste de frontend, nenhum `cy.visit`, nenhum seletor de tela — apenas requisições diretas via `cy.request()`.

---

## 📑 Sumário

- [🎯 Objetivo](#-objetivo)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🛠️ Tecnologias](#️-tecnologias)
- [✅ O que é validado](#-o-que-é-validado)
- [🧪 Cenários de Teste](#-cenários-de-teste)

## 🎯 Objetivo

Validar o endpoint de login diretamente na camada de backend, cobrindo:

- Status HTTP (200 de sucesso / 400 de erro)
- Presença e formato do token de autenticação
- Mensagens de erro da API
- Campos obrigatórios (`email` / `password`)
- Estrutura da resposta (headers, body, `content-type`, `duration`)
- Contrato completo de sucesso e de erro

## 📁 Estrutura do Projeto

```
cypress-login-api/
├── cypress/
│   ├── e2e/
│   │   └── login-api.cy.js      # Specs de API
│   ├── fixtures/
│   │   └── users.json           # Dados de teste
│   ├── pages/
│   │   └── LoginApi.js          # Service Object (equivalente ao Page Object)
│   └── support/
│       └── e2e.js
```

### Responsabilidades de cada arquivo

| Arquivo | Responsabilidade |
|---------|------------------|
| `cypress.config.js` | Configuração global: `baseUrl`, timeouts, eventos de Node |
| `cypress/e2e/login-api.cy.js` | Specs de teste organizadas em `describe` / `context` / `it` |
| `cypress/pages/LoginApi.js` | Service Object que encapsula `cy.request()` e validações reutilizáveis |
| `cypress/fixtures/users.json` | Fixtures com usuários válidos, inválidos e corpos incompletos |
| `cypress/support/e2e.js` | Arquivo de suporte carregado antes de cada spec |

## 🛠️ Tecnologias

- **Cypress 13.x** — framework de testes E2E/API
- **Service Object** — padrão Page Object adaptado para requisições de API
- **Fixtures (JSON)** — massas de dados separadas da lógica de teste
- **`cy.request()`** — requisições HTTP diretas (sem interface de usuário)
- **Chai** — biblioteca de asserções integrada ao Cypress

## ✅ O que é validado

| Contexto | O que valida |
|----------|--------------|
| **Estrutura da resposta** | Status, body, headers, `content-type` JSON, `duration` |
| **Login válido** | Status 200 + token (string não vazia) |
| **Login inválido** | Status 400 + propriedade `error` |
| **Campos obrigatórios** | Falta de `password`, falta de `email`, body vazio |
| **Fluxo completo** | Contrato de sucesso e de erro juntos |

## 🧪 Cenários de Teste

Os testes estão agrupados nos seguintes contextos:

1. **Validação de endpoint e estrutura da resposta** — verifica se o endpoint responde com status, body, headers e `content-type` JSON.
2. **Login com credenciais válidas** — status 200 e retorno de token; o token deve ser uma string não vazia.
3. **Login com credenciais inválidas** — status 400 e mensagem de erro (`error`).
4. **Validação de campos obrigatórios** — body sem `password`, sem `email` e body vazio devem retornar erro 400.
5. **Fluxo completo de validação backend** — happy path (sucesso) + negative path (falha) em um único teste.

## 📦 Dados de Teste (Fixtures)

As massas de dados ficam em `cypress/fixtures/users.json`:

```json
{
  "validUser": {
    "email": "eve.holt@reqres.in",
    "password": "cityslicka"
  },
  "invalidUser": {
    "email": "usuario_invalido@email.com",
    "password": "senha_errada"
  },
  "missingPassword": { "email": "eve.holt@reqres.in" },
  "missingEmail": { "password": "cityslicka" },
  "emptyBody": {}
}
```

## 🌐 API Utilizada

- **Base URL:** `https://reqres.in`
- **Endpoint:** `POST /api/login`
- **Sucesso:** retorna `{ "token": "..." }` (status 200)
- **Erro:** retorna `{ "error": "..." }` (status 400)

> ⚠️ A API ReqRes é um serviço público de simulação. Em ambiente de produção, substitua a `baseUrl` no `cypress.config.js` pela URL da sua própria API.

## 📋 Exemplo de Respostas

**Sucesso (200):**
```json
{
  "token": "ABC123DEF456"
}
```

**Erro — credenciais inválidas (400):**
```json
{
  "error": "user not found"
}
```

**Erro — senha ausente (400):**
```json
{
  "error": "Missing password"
}
```

## 🚀 Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [npm](https://www.npmjs.com/) (instalado junto com o Node.js)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/cypress-login-api.git
cd cypress-login-api

# Instale as dependências
npm install
```

### Executar os testes

| Comando | Descrição |
|---------|-----------|
| `npm run cy:open` | Abre o Cypress Test Runner (modo interativo) |
| `npm run cy:run` | Executa os testes em modo headless (sem interface) |
| `npm test` | Executa os testes em modo headless (mesmo que `cy:run`) |

**Exemplos:**

```bash
# Modo interativo (interface gráfica)
npm run cy:open

# Modo headless (ideal para CI/CD)
npm run cy:run
```

Ao abrir o Test Runner, selecione o arquivo `login-api.cy.js` para executar os cenários de validação de login.

## 🔁 Integração Contínua (CI/CD)

Exemplo de workflow do **GitHub Actions** (`.github/workflows/cypress.yml`):

```yaml
name: Cypress Login API Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run Cypress tests
        run: npm run cy:run
```

## 📊 Relatórios e Artefatos do Cypress

Após executar os testes, o Cypress gera automaticamente:

- `cypress/videos/` — gravações dos testes (modo headless)
- `cypress/screenshots/` — capturas de tela em caso de falha
- `cypress/downloads/` — downloads realizados durante os testes

Esses artefatos são úteis para depuração e auditoria de execuções em CI.

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um **fork** do repositório
2. Crie uma **branch** para sua feature ou correção (`git checkout -b feature/minha-mudanca`)
3. Faça suas alterações e **commit** (`git commit -m "feat: adiciona novo cenário de teste"`)
4. Envie para o repositório remoto (`git push origin feature/minha-mudanca`)
5. Abra um **Pull Request**

Siga o padrão de commits mensageiros (ex: `feat:`, `fix:`, `docs:`, `chore:`).

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✍️ Autor

Desenvolvido por **Guilherme Giovane** — Somente backend. Zero validação de frontend.

---

*Última atualização: outubro de 2026*
