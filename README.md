# API de Autenticação e Login

API REST exclusiva para autenticação de usuários, controle de tentativas de login, bloqueio de conta e recuperação de senha, desenvolvida com Node.js e Express. **Não há endpoints de carrinho de compras ou funcionalidades de ecommerce.**

## Funcionalidades

- ✅ Login com sucesso
- ✅ Login inválido
- ✅ Bloquear senha após 3 tentativas
- ✅ Recuperação de senha (lembrar senha)
- ✅ Registro de novo usuário
- ✅ Desbloqueio de conta
- ✅ Documentação Swagger integrada

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

## Executando a API

### Desenvolvimento (com hot reload):
```bash
npm run dev
```

### Produção:
```bash
npm start
```

A API estará disponível em: `http://localhost:3001`

## Documentação Swagger

Acesse a documentação interativa da API em:
`http://localhost:3001/api-docs`

## Endpoints

### Autenticação

- `POST /api/auth/login` - Realizar login
- `POST /api/auth/forgot-password` - Solicitar recuperação de senha
- `POST /api/auth/reset-password` - Redefinir senha
- `POST /api/auth/unlock-account` - Desbloquear conta
- `GET /api/auth/status` - Verificar status da conta

### Exemplos de Uso

#### Login com sucesso:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }'
```

#### Solicitar recuperação de senha:
```bash
curl -X POST http://localhost:3001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com"
  }'
```

#### Redefinir senha:
```bash
curl -X POST http://localhost:3001/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "token": "token_recuperacao",
    "newPassword": "nova_senha123"
  }'
```

#### Verificar status da conta:
```bash
curl http://localhost:3001/api/auth/status/usuario@exemplo.com
```

## Estrutura do Projeto

```
src/
├── controllers/     # Controladores da API
├── routes/         # Rotas da aplicação
├── services/       # Lógica de negócio
├── middleware/     # Middlewares customizados
├── utils/          # Utilitários
└── server.js       # Arquivo principal do servidor
```

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Swagger** - Documentação da API
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Segurança
- **Morgan** - Logging de requisições
- **bcryptjs** - Criptografia de senhas
- **jsonwebtoken** - Tokens JWT

## Testes

Para executar os testes:
```bash
npm test
```

## Observações

- Esta API é destinada para estudos de autenticação e testes
- Os dados são armazenados em memória (não há persistência)
- A comunicação é feita via JSON
- Senhas são criptografadas com bcrypt
- Controle de tentativas de login implementado
- **Não há rotas de carrinho de compras**
- Seguindo boas práticas de desenvolvimento 

 