# BoraLá API

## Pré-requisitos

- Git
- Node.js (v16+)
- PostgreSQL

## Setup Rápido

1.  **Clone:**

    ```bash
    git clone <URL_DO_REPOSITORIO> borala-api
    cd borala-api
    ```

2.  **Instale Dependências:**

    ```bash
    npm install
    ```

3.  **Configure o Ambiente:**

    - Copie `.env.example` para `.env`:
      ```bash
      # Linux/Mac/Git Bash:
      cp .env.example .env
      # Windows CMD:
      copy .env.example .env
      ```
    - **Edite o `.env`:** Preencha `DB_PASSWORD` com sua senha local do PostgreSQL e `JWT_SECRET` com um segredo forte.

4.  **Crie o Banco (Manual):**

    - Conecte-se ao seu PostgreSQL local.
    - Execute: `CREATE DATABASE carona_api;` (se ainda não existir).

5.  **Rode as Migrations:**

    ```bash
    npx knex migrate:latest
    ```

6.  **Inicie o Servidor:**
    ```bash
    npm run dev
    ```

O servidor estará rodando em `http://localhost:3333`.


## 📘 Documentação Completa (Swagger)

Para uma visão detalhada de todos os campos, schemas, possíveis erros (status codes) e validações, acesse a documentação completa no arquivo borala_api_swagger.yaml.

Este arquivo pode ser importado em ferramentas como **Swagger UI**, **Postman** ou **Insomnia** para testar os endpoints de forma interativa.