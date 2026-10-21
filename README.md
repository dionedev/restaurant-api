# 🍕 Pizzaria API

API REST para gestão de pizzarias, construída com **Node.js**, **TypeScript**, **Express 5**, **Prisma ORM** e **PostgreSQL**.

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.1-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma&logoColor=white)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)

> ⚠️ **Projeto em fase inicial.** Leia a seção [Estado atual e pontos de melhoria](#%EF%B8%8F-estado-atual-e-pontos-de-melhoria).

---

## 🎯 Sobre o projeto

A **Pizzaria API** é o backend de um sistema de atendimento para pizzarias de **pequeno e médio porte**. O objetivo é centralizar, em um único sistema, as informações que normalmente ficam espalhadas entre comandas de papel, cardápios impressos e a memória da equipe.

A API foi pensada para servir de base a diferentes clientes, como um painel web para o administrador, um app para o garçom anotar pedidos na mesa ou uma tela para a cozinha acompanhar o que precisa ser preparado.

### Que problemas ela resolve?

| Problema comum                                                                | Como a API ajuda                                                                                            |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Comandas de papel que se perdem, ficam ilegíveis ou chegam erradas na cozinha | Pedidos digitais vinculados ao número da mesa, com itens e quantidades registrados                          |
| Cardápio desatualizado (preço antigo, produto que acabou)                     | Cadastro centralizado de produtos e categorias, com opção de **desativar** um produto sem apagá-lo          |
| Qualquer funcionário consegue alterar preços e cardápio                       | Controle de acesso por perfil: **ADMIN** gerencia o cardápio, **STAFF** opera o atendimento                 |
| Dificuldade em saber quais pedidos estão abertos ou já foram fechados         | Pedidos com status (aberto/fechado) e modo rascunho, permitindo montar o pedido antes de enviá-lo à cozinha |
| Erros de arredondamento em totais e valores                                   | Preços armazenados em **centavos** (inteiros), evitando problemas de ponto flutuante                        |

---

## ✨ Funcionalidades

### Implementadas

- [x] Cadastro de usuários (perfil padrão: `STAFF`)
- [x] Login com geração de token JWT
- [x] Consulta dos dados do usuário autenticado
- [x] Cadastro de categorias (somente `ADMIN`)
- [x] Validação de dados de entrada com Zod
- [x] Senhas criptografadas com bcrypt

### Planejadas (modelo de dados já existe, endpoints ainda não)

- [ ] CRUD de produtos (pizzas, bebidas, sobremesas)
- [ ] Listagem de categorias
- [ ] Abertura, envio e fechamento de pedidos por mesa
- [ ] Adição e remoção de itens em pedidos
- [ ] Upload de imagem (banner) dos produtos

---

## 🚀 Tecnologias

| Tecnologia                                                 | Versão  | Para que serve                                        |
| ---------------------------------------------------------- | ------- | ----------------------------------------------------- |
| [Express](https://expressjs.com/)                          | ^5.1.0  | Framework HTTP para criar a API REST                  |
| [Prisma](https://www.prisma.io/)                           | ^6.19.0 | ORM para acessar o PostgreSQL com tipagem             |
| [PostgreSQL](https://www.postgresql.org/)                  |         | Banco de dados relacional                             |
| [TypeScript](https://www.typescriptlang.org/)              | ^5.9.3  | Tipagem estática (modo strict)                        |
| [Zod](https://zod.dev/)                                    | ^4.1.12 | Validação dos dados recebidos                         |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js)           | ^3.0.3  | Hash de senhas                                        |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | ^9.0.2  | Geração e validação de tokens JWT                     |
| [cors](https://github.com/expressjs/cors)                  | ^2.8.5  | Liberação de requisições de outras origens            |
| [dotenv](https://github.com/motdotla/dotenv)               | ^17.2.3 | Carregamento das variáveis do `.env`                  |
| [tsx](https://github.com/privatenumber/tsx)                | ^4.20.6 | Executa TypeScript em desenvolvimento, com hot reload |

---

## 🏗️ Arquitetura

O projeto usa uma **arquitetura em camadas** no padrão **Controller + Service**. Cada requisição percorre o fluxo abaixo:

```
Requisição HTTP → Rotas → Middlewares → Controller → Service → Prisma Client → PostgreSQL
```

| Camada                  | Responsabilidade                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| **Rotas** (`routes.ts`) | Definem os endpoints e quais middlewares cada um usa                                                  |
| **Middlewares**         | Validam o token (`isAuthenticated`), a permissão (`isAdmin`) e o formato dos dados (`validateSchema`) |
| **Controllers**         | Extraem os dados da requisição, chamam o service e devolvem a resposta HTTP                           |
| **Services**            | Concentram a regra de negócio e o acesso ao banco                                                     |
| **Prisma Client**       | Executa as consultas ao PostgreSQL de forma tipada                                                    |

Cada operação tem seu próprio controller e service (ex.: `CreateUserController` + `CreateUserService`), seguindo o princípio de responsabilidade única.

```
src/
├── controllers/    # Recebem as requisições (organizados por entidade)
├── services/       # Regras de negócio
├── middlewares/    # isAuthenticated, isAdmin, validateSchema
├── schemas/        # Schemas Zod de validação
├── prisma/         # Instância do Prisma Client
├── generated/      # Prisma Client gerado (não editar manualmente)
├── routes.ts
└── server.ts
```

---

## 🗄️ Modelo de dados

```
Category (1) ──────< (N) Product (1) ──────< (N) Item (N) >────── (1) Order

User (role: STAFF | ADMIN)
```

| Entidade     | Descrição                                     | Campos principais                                                                                |
| ------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **User**     | Usuários do sistema                           | `name`, `email` (único), `password` (hash), `role`                                               |
| **Category** | Agrupamento do cardápio (ex.: "Pizzas Doces") | `name`                                                                                           |
| **Product**  | Item do cardápio                              | `name`, `price` (centavos), `description`, `banner`, `disabled`, `category_id`                   |
| **Order**    | Pedido de uma mesa                            | `table`, `status` (false = aberto, true = fechado), `draft` (true = rascunho), `name` (opcional) |
| **Item**     | Produto dentro de um pedido                   | `amount`, `order_id`, `product_id`                                                               |

- Todas as entidades usam **UUID** e possuem `createdAt` e `updatedAt` automáticos.
- **Preços em centavos:** R$ 45,90 é salvo como `4590`. A conversão para reais fica na camada de apresentação.
- **Deleção em cascata:** apagar uma categoria apaga seus produtos; apagar um produto ou um pedido apaga os itens relacionados.

---

## 🛠️ Como rodar o projeto

**Pré-requisitos:** [Node.js](https://nodejs.org/) 20 LTS ou superior, [Git](https://git-scm.com/) e um PostgreSQL (instalado na máquina ou via [Docker](https://www.docker.com/)).

### 1. Clone o repositório e instale as dependências

```bash
git clone https://github.com/dionedev/restaurant-api.git
cd restaurant-api
npm install
```

### 2. Suba um banco PostgreSQL

Com Docker (forma mais simples):

```bash
docker run --name pizzaria-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=pizzaria \
  -p 5432:5432 \
  -d postgres:16
```

Nas próximas vezes, basta rodar `docker start pizzaria-db`. Se preferir um PostgreSQL local, crie um banco chamado `pizzaria`.

### 3. Configure o `.env`

```bash
cp .env.example .env
```

Se o `.env.example` não existir, crie o `.env` manualmente com o conteúdo da seção [Variáveis de ambiente](#-variáveis-de-ambiente).

### 4. Crie as tabelas e inicie o servidor

```bash
npx prisma migrate dev
npm run dev
```

O `migrate dev` cria as tabelas e gera o Prisma Client. A API estará disponível em **http://localhost:3333**.

---

## 🧪 Teste rapidamente

Use `curl`, [Insomnia](https://insomnia.rest/) ou [Postman](https://www.postman.com/).

**1. Crie um usuário**

```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@example.com","password":"senha123"}'
```

**2. Faça login e copie o `token` da resposta**

```bash
curl -X POST http://localhost:3333/session \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha123"}'
```

**3. Consulte seus dados com o token**

```bash
curl http://localhost:3333/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**4. Para testar rotas de ADMIN**

Todo usuário é criado como `STAFF` e ainda não existe endpoint para promover. Em desenvolvimento, rode `npx prisma studio`, altere o campo `role` do usuário para `ADMIN` na tabela `users` e faça login novamente para obter um novo token.

---

## 🔑 Variáveis de ambiente

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pizzaria?schema=public"
JWT_SECRET="troque-por-uma-chave-secreta-longa"
PORT=3333
```

| Variável       | Obrigatória | Descrição                                          |
| -------------- | ----------- | -------------------------------------------------- |
| `DATABASE_URL` | ✅          | String de conexão com o PostgreSQL                 |
| `JWT_SECRET`   | ✅          | Chave secreta para assinar e validar os tokens JWT |
| `PORT`         | ❌          | Porta do servidor (padrão: `3333`)                 |

Para gerar um `JWT_SECRET` aleatório:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> 💡 Se os comandos do Prisma acusarem `Environment variable not found: DATABASE_URL`, adicione `import "dotenv/config";` no topo do `prisma.config.ts`. Com esse arquivo presente, o Prisma CLI pode não carregar o `.env` automaticamente.

---

## 📜 Scripts disponíveis

| Comando                                | O que faz                                                     |
| -------------------------------------- | ------------------------------------------------------------- |
| `npm run dev`                          | Inicia o servidor em desenvolvimento, com hot reload          |
| `npx prisma migrate dev --name <nome>` | Cria uma nova migração após alterar o `schema.prisma`         |
| `npx prisma migrate deploy`            | Aplica migrações pendentes (uso em produção)                  |
| `npx prisma generate`                  | Gera novamente o Prisma Client                                |
| `npx prisma studio`                    | Abre uma interface visual do banco em `http://localhost:5555` |

---

## 🌐 Endpoints

**URL base:** `http://localhost:3333`

| Método | Rota        | Acesso      | Body                                          | Resposta                                |
| ------ | ----------- | ----------- | --------------------------------------------- | --------------------------------------- |
| `POST` | `/users`    | Público     | `name` (mín. 3), `email`, `password` (mín. 6) | `200` com dados do usuário (sem senha)  |
| `POST` | `/session`  | Público     | `email`, `password`                           | `200` com dados do usuário e `token`    |
| `GET`  | `/me`       | Autenticado |                                               | `200` com `id`, `name`, `email`, `role` |
| `POST` | `/category` | ADMIN       | `name` (mín. 2)                               | `201` com a categoria criada            |

**Autenticação:** rotas protegidas exigem o header `Authorization: Bearer <token>`. O token é obtido em `/session` e carrega o id do usuário no campo `sub`.

**Erros:**

| Status | Quando acontece                                          | Formato                                                            |
| ------ | -------------------------------------------------------- | ------------------------------------------------------------------ |
| `400`  | Dados inválidos no body                                  | `{ "error": "Erro validação", "details": [{ "message": "..." }] }` |
| `400`  | Regra de negócio (ex.: e-mail já cadastrado)             | `{ "error": "Usuário já existente!" }`                             |
| `401`  | Token ausente/inválido ou usuário sem permissão de ADMIN | `{ "error": "..." }`                                               |

---

## ⚠️ Estado atual e pontos de melhoria

> **Esta API está em fase inicial de desenvolvimento.** A base de arquitetura está definida, mas há pontos importantes a evoluir antes de um uso em produção. Esta seção existe para deixar isso transparente para quem for usar ou contribuir com o projeto.

### 🧱 Arquitetura e código

- **Injeção de dependências:** controllers e services são instanciados com `new` diretamente nas rotas, e os services importam o Prisma Client diretamente. Isso acopla as camadas e dificulta testes unitários. Próximo passo: receber as dependências pelo construtor e montá-las em factories ou em um container de DI (ex.: `tsyringe` ou `awilix`).
- **Camada de acesso a dados:** os services consultam o banco diretamente. Uma camada de repositórios isolaria o Prisma e deixaria a regra de negócio independente do ORM.
- **Tratamento de erros:** o error handler global responde `400` para qualquer `Error`, inclusive falhas inesperadas (ex.: banco fora do ar), que deveriam ser `500`. Próximo passo: criar uma classe `AppError` com `statusCode` e registrar em log os erros não previstos.
- **Códigos HTTP:** falta de permissão deveria retornar `403 Forbidden` (hoje é `401`), criação de usuário `201` (hoje é `200`) e e-mail duplicado `409 Conflict`.
- **Validação do `.env`:** a aplicação não verifica na inicialização se as variáveis obrigatórias existem.

### 🔒 Segurança

- **CORS aberto:** qualquer origem pode chamar a API.
- **Cadastro público:** qualquer pessoa pode criar uma conta. Em uma pizzaria, o cadastro de funcionários deveria ser feito por um ADMIN.
- **Sem rate limiting:** o login não limita tentativas, ficando exposto a força bruta.
- **Custo do bcrypt:** 8 rounds, abaixo do normalmente recomendado (10 a 12).
- **Headers de segurança:** não há uso de `helmet` ou equivalente.
- **Ciclo de vida do token:** sem refresh token e sem forma de revogar um token antes de expirar.
- **Gestão de perfis:** não há endpoint para promover ou rebaixar usuários.

### 🗄️ Modelagem e regras de negócio

- **Cascade delete agressivo:** apagar um produto apaga itens de pedidos antigos, destruindo histórico de vendas. Alternativas: soft delete com o campo `disabled` ou `onDelete: Restrict`.
- **Preço não registrado no item:** se o preço de um produto mudar, o valor dos pedidos antigos muda junto. O ideal é salvar o preço unitário no momento do pedido.
- **Status do pedido como boolean:** um `enum` (ex.: `DRAFT`, `SENT`, `PREPARING`, `CLOSED`) representaria melhor o fluxo da cozinha.

### 🧪 Qualidade e operação

- Sem testes automatizados, lint ou formatação padronizados (ESLint e Prettier).
- Sem scripts `build` e `start` para produção; `tsx` e `typescript` estão em dependências de produção, quando deveriam estar em `devDependencies`.
- Sem Docker Compose, documentação OpenAPI/Swagger, logs estruturados ou pipeline de CI.
