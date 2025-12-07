# 🚗 BoraLá API

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

> API RESTful robusta para gerenciamento de caronas compartilhadas, conectando motoristas e passageiros de forma eficiente e segura.

## 📖 Sobre o Projeto

O **BoraLá** é um sistema de backend completo para aplicações de carona. Ele gerencia todo o ciclo de vida de uma viagem, desde o cadastro do veículo e criação da rota, até a reserva de assentos e avaliação final entre os participantes.

O projeto foi construído seguindo princípios de **Clean Code** e arquitetura em camadas (**MSC** - Model, Service, Controller), garantindo escalabilidade, facilidade de manutenção e integridade dos dados.

## 🚀 Tecnologias e Ferramentas

- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [Express](https://expressjs.com/)
- **Banco de Dados:** PostgreSQL
- **ORM/Query Builder:** [Knex.js](https://knexjs.org/)
- **Validação:** [Zod](https://zod.dev/) (Middleware de validação robusto para entradas de dados)
- **Autenticação:** JWT (JSON Web Token) & Bcrypt
- **Testes:** Jest & Supertest (Testes Unitários e E2E)
- **Uploads:** Multer (Gerenciamento de avatares de usuário)

## ✨ Funcionalidades Principais

- 🔐 **Autenticação & Segurança:** \* Login e cadastro de usuários.
  - Recuperação de senha segura via token.
- 👤 **Perfil de Usuário:** \* Gerenciamento de dados pessoais e biografia.
  - Upload e atualização de foto de perfil (avatar).
- 🚗 **Gestão de Veículos:** \* CRUD completo de veículos.
  - Validação de placas e vínculo exclusivo com o motorista.
- 📍 **Caronas (Rides):**
  - Criação de caronas com origem, destino, horário e custo estimado.
  - Filtros avançados de busca (data, preço máximo, origem/destino).
  - Controle de status (Agendada, Em Progresso, Finalizada, Cancelada).
- 🎟️ **Reservas (Bookings):** \* Sistema de solicitação de vagas.
  - Aprovação automática ou manual pelo motorista.
  - Controle transacional de assentos disponíveis (evita _overbooking_).
- ⭐ **Avaliações (Reviews):** \* Sistema de feedback com notas (1-5) e comentários.
  - Regras de negócio que garantem que apenas participantes avaliem a carona.
- 🎉 **Eventos:** \* Integração de caronas destinadas a eventos específicos (shows, festivais).

## 🛠️ Instalação e Execução

### Pré-requisitos

- Git
- Node.js (v16 ou superior)
- PostgreSQL rodando localmente ou via Docker

### Passo a Passo

1.  **Clone o repositório:**

    ```bash
    git clone <URL_DO_REPOSITORIO> borala-api
    cd borala-api
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Copie o arquivo de exemplo e configure suas credenciais do banco.

    ```bash
    # Linux/Mac
    cp .env.example .env
    # Windows
    copy .env.example .env
    ```

    > Edite o arquivo `.env` preenchendo `DB_USER`, `DB_PASSWORD` e definindo um `JWT_SECRET` seguro.

4.  **Banco de Dados:**
    Certifique-se que o banco de dados `borala` existe no seu Postgres e execute as migrations para criar as tabelas:

    ```bash
    npx knex migrate:latest
    ```

5.  **Inicie o Servidor:**
    ```bash
    npm run dev
    ```
    O servidor iniciará em `http://localhost:3333`.

## 🧪 Rodando os Testes

O projeto possui uma suíte de testes automatizados (Unitários e Ponta a Ponta) configurados com Jest.

```bash
# Rodar todos os testes
npm test
```
