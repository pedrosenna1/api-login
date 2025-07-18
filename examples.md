# Exemplos de Uso da API de Autenticação

## Pré-requisitos
- API rodando em `http://localhost:3001`
- Documentação Swagger disponível em `http://localhost:3001/api-docs`

## Exemplos de Requisições

### 1. Verificar Status da API
```bash
curl http://localhost:3001/health
```

**Resposta:**
```json
{
  "status": "OK",
  "message": "API de Autenticação funcionando corretamente",
  "timestamp": "2025-07-12T14:37:57.729Z"
}
```

### 2. Login com Sucesso
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "usuario@exemplo.com",
    "name": "Usuário Teste"
  }
}
```

### 3. Login com Credenciais Inválidas
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senhaerrada"
  }'
```

**Resposta:**
```json
{
  "error": "Credenciais inválidas",
  "message": "Email ou senha inválidos"
}
```

### 4. Verificar Status da Conta
```bash
curl http://localhost:3001/api/auth/status/usuario@exemplo.com
```

**Resposta:**
```json
{
  "exists": true,
  "isLocked": false,
  "remainingAttempts": 3,
  "lockUntil": null
}
```

### 5. Solicitar Recuperação de Senha
```bash
curl -X POST http://localhost:3001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Token de recuperação enviado para o email",
  "token": "abc123def456...",
  "expiresAt": "2025-07-12T15:37:57.729Z"
}
```

### 6. Redefinir Senha
```bash
curl -X PATCH http://localhost:3001/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "token": "abc123def456...",
    "newPassword": "nova_senha123"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Senha redefinida com sucesso"
}
```

### 7. Registrar Novo Usuário
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "novo@exemplo.com",
    "password": "senha123",
    "name": "Novo Usuário"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "user": {
    "email": "novo@exemplo.com",
    "name": "Novo Usuário"
  }
}
```

### 8. Desbloquear Conta
```bash
curl -X POST http://localhost:3001/api/auth/unlock-account \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Conta desbloqueada com sucesso"
}
```

## Exemplos de Erros

### Conta Bloqueada (após 3 tentativas)
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senhaerrada"
  }'
```

**Resposta:**
```json
{
  "error": "Conta bloqueada",
  "message": "Conta bloqueada. Solicite o desbloqueio ou aguarde 30 minutos."
}
```

### Token de Recuperação Inválido
```bash
curl -X PATCH http://localhost:3001/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "token": "token_invalido",
    "newPassword": "nova_senha123"
  }'
```

**Resposta:**
```json
{
  "error": "Token inválido",
  "message": "Token inválido"
}
```

### Email Já Cadastrado
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123",
    "name": "Usuário"
  }'
```

**Resposta:**
```json
{
  "error": "Email já cadastrado",
  "message": "Email já cadastrado"
}
```

## Usando PowerShell

Para usuários do PowerShell, use `Invoke-RestMethod`:

```powershell
# Login
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email": "usuario@exemplo.com", "password": "senha123"}'

# Verificar status da conta
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/status/usuario@exemplo.com" -Method GET

# Solicitar recuperação de senha
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/forgot-password" -Method POST -ContentType "application/json" -Body '{"email": "usuario@exemplo.com"}'

# Registrar novo usuário
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" -Method POST -ContentType "application/json" -Body '{"email": "novo@exemplo.com", "password": "senha123", "name": "Novo Usuário"}'
```

## Usando Postman

1. Importe a coleção do Swagger em `http://localhost:3001/api-docs`
2. Configure o ambiente com a URL base: `http://localhost:3001`
3. Teste todos os endpoints diretamente na interface do Postman



## Funcionalidades de Segurança

- ✅ Login com validação de credenciais
- ✅ Bloqueio automático após 3 tentativas falhadas
- ✅ Desbloqueio manual de conta
- ✅ Recuperação de senha com token
- ✅ Criptografia de senhas com bcrypt
- ✅ Tokens JWT para autenticação
- ✅ Validação de formato de email
- ✅ Controle de tentativas de login
- ✅ Expiração automática de bloqueios (30 minutos)
- ✅ Tokens de recuperação com expiração (1 hora)

## Usuário de Teste

A API inclui um usuário de teste pré-cadastrado:
- **Email:** `usuario@exemplo.com`
- **Senha:** `senha123`
- **Nome:** `Usuário Teste` 