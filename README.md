# Lava-car

Sistema simples para cadastrar proprietários, veículos e serviços de um lava-car.
Feito com base na alternativa A do PDF: Node.js, Express, PostgreSQL com pg, React e Axios.

## Organização

- `server/src/config`: conexão com o PostgreSQL.
- `server/src/controllers`: consultas SQL e funções dos cadastros.
- `server/src/routes`: endereços da API.
- `server/src/middlewares`: verificação do token JWT.
- `server/src/seeders`: criação das tabelas e dados de exemplo.
- `client/src/components`: telas do sistema.
- `database`: estrutura e dados em SQL.

A organização segue a alternativa pg do PDF: as consultas ficam nos controllers, sem Models do Sequelize. O React cuida das telas.

## Como executar

1. Instale as dependências com `npm install`.
2. No pgAdmin, crie um banco chamado `lavacar`:

```sql
CREATE DATABASE lavacar;
```

3. Configure os dados do PostgreSQL no `.env` da pasta principal, principalmente `DB_PORT`, `DB_USER` e `DB_PASSWORD`. O arquivo `.env.example` mostra os campos. A chave JWT local já foi gerada.
4. Execute `npm run seed` para criar as quatro tabelas e os dados fictícios.
5. Inicie o backend:

```sh
npm start
```

6. Em outro terminal, na mesma pasta, inicie as telas:

```sh
npm run dev:client
```

Acesse http://localhost:5173. O backend usa a porta 3000.

Login de exemplo: **admin@email.com** / **123456**.
Também existem `ana@email.com` e `pedro@email.com`, com a mesma senha de exemplo.

Para usar sem o servidor do Vite, execute `npm run build` e depois `npm start`. Nesse caso, acesse http://localhost:3000.

## Funcionamento

Cadastre primeiro o proprietário, depois o veículo e, por último, o serviço.
A busca de proprietários envia o texto para a API, que consulta o PostgreSQL com `ILIKE`.
Cada serviço começa como `aberto`. É possível alterar para `em_andamento`, `concluido` ou `cancelado`.
O login gera um token que dura 30 minutos. As outras rotas exigem esse token.
As senhas dos exemplos estão em hash bcrypt e o CPF não aparece nas listagens.
O seed pode ser executado novamente sem repetir os dados de exemplo.

## Rotas

| Método | Rota | Função |
| --- | --- | --- |
| POST | /api/auth/login | Entrar |
| GET / POST | /api/proprietarios | Buscar e cadastrar proprietários |
| GET / POST | /api/veiculos | Listar e cadastrar veículos |
| GET / POST | /api/ordens-servico | Listar e cadastrar serviços |
| PATCH | /api/ordens-servico/:id/status | Alterar o status |

A documentação e o diagrama estão em `docs/atividade.md`.
