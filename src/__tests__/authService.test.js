const authService = require('../services/authService');

describe('AuthService', () => {
  beforeEach(async () => {
    // Resetar o serviço antes de cada teste
    authService.users.clear();
    authService.loginAttempts.clear();
    authService.resetTokens.clear();
    // Criar usuário de teste usando o método register
    await authService.register('usuario@exemplo.com', 'senha123', 'Usuário Teste');
  });

  describe('login', () => {
    test('deve fazer login com credenciais válidas', async () => {
      const result = await authService.login('usuario@exemplo.com', 'senha123');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Login realizado com sucesso');
      expect(result.token).toBeDefined();
      expect(result.user).toEqual({
        email: 'usuario@exemplo.com',
        name: 'Usuário Teste'
      });
    });

    test('deve falhar com email inválido', async () => {
      await expect(authService.login('email@invalido.com', 'senha123'))
        .rejects.toThrow('Email ou senha inválidos');
    });

    test('deve falhar com senha inválida', async () => {
      await expect(authService.login('usuario@exemplo.com', 'senhaerrada'))
        .rejects.toThrow('Email ou senha inválidos');
    });

    test('deve falhar com dados vazios', async () => {
      await expect(authService.login('', 'senha123'))
        .rejects.toThrow('Email e senha são obrigatórios');
    });
  });

  describe('bloqueio de conta', () => {
    test('deve bloquear conta após 3 tentativas falhadas', async () => {
      // Primeira tentativa
      await expect(authService.login('usuario@exemplo.com', 'senhaerrada'))
        .rejects.toThrow('Email ou senha inválidos');

      // Segunda tentativa
      await expect(authService.login('usuario@exemplo.com', 'senhaerrada'))
        .rejects.toThrow('Email ou senha inválidos');

      // Terceira tentativa - deve bloquear
      await expect(authService.login('usuario@exemplo.com', 'senhaerrada'))
        .rejects.toThrow('Email ou senha inválidos');

      // Quarta tentativa - deve falhar por conta bloqueada
      await expect(authService.login('usuario@exemplo.com', 'senha123'))
        .rejects.toThrow('Conta bloqueada');
    });

    test('deve resetar tentativas após login bem-sucedido', async () => {
      // Duas tentativas falhadas
      await expect(authService.login('usuario@exemplo.com', 'senhaerrada'))
        .rejects.toThrow('Email ou senha inválidos');
      await expect(authService.login('usuario@exemplo.com', 'senhaerrada'))
        .rejects.toThrow('Email ou senha inválidos');

      // Login bem-sucedido
      const result = await authService.login('usuario@exemplo.com', 'senha123');
      expect(result.success).toBe(true);

      // Tentativas devem ter sido resetadas
      const status = authService.getAccountStatus('usuario@exemplo.com');
      expect(status.remainingAttempts).toBe(3);
    });
  });

  describe('getAccountStatus', () => {
    test('deve retornar status correto para usuário existente', () => {
      const status = authService.getAccountStatus('usuario@exemplo.com');

      expect(status.exists).toBe(true);
      expect(status.isLocked).toBe(false);
      expect(status.remainingAttempts).toBe(3);
    });

    test('deve retornar status correto para usuário inexistente', () => {
      const status = authService.getAccountStatus('inexistente@exemplo.com');

      expect(status.exists).toBe(false);
      expect(status.isLocked).toBe(false);
      expect(status.remainingAttempts).toBe(3);
    });

    test('deve mostrar tentativas restantes após falhas', async () => {
      // Uma tentativa falhada
      await expect(authService.login('usuario@exemplo.com', 'senhaerrada'))
        .rejects.toThrow('Email ou senha inválidos');

      const status = authService.getAccountStatus('usuario@exemplo.com');
      expect(status.remainingAttempts).toBe(2);
    });
  });

  describe('unlockAccount', () => {
    test('deve desbloquear conta bloqueada', async () => {
      // Bloquear conta
      await expect(authService.login('usuario@exemplo.com', 'senhaerrada'))
        .rejects.toThrow('Email ou senha inválidos');
      await expect(authService.login('usuario@exemplo.com', 'senhaerrada'))
        .rejects.toThrow('Email ou senha inválidos');
      await expect(authService.login('usuario@exemplo.com', 'senhaerrada'))
        .rejects.toThrow('Email ou senha inválidos');

      // Desbloquear
      const result = authService.unlockAccount('usuario@exemplo.com');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Conta desbloqueada com sucesso');

      // Verificar se pode fazer login novamente
      const loginResult = await authService.login('usuario@exemplo.com', 'senha123');
      expect(loginResult.success).toBe(true);
    });

    test('deve falhar ao desbloquear conta não bloqueada', () => {
      expect(() => authService.unlockAccount('usuario@exemplo.com'))
        .toThrow('Conta não está bloqueada');
    });

    test('deve falhar ao desbloquear usuário inexistente', () => {
      expect(() => authService.unlockAccount('inexistente@exemplo.com'))
        .toThrow('Usuário não encontrado');
    });
  });

  describe('forgotPassword', () => {
    test('deve gerar token de recuperação para usuário existente', () => {
      const result = authService.forgotPassword('usuario@exemplo.com');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Token de recuperação enviado para o email');
      expect(result.token).toBeDefined();
      expect(result.expiresAt).toBeDefined();
    });

    test('deve falhar para usuário inexistente', () => {
      expect(() => authService.forgotPassword('inexistente@exemplo.com'))
        .toThrow('Email não encontrado');
    });

    test('deve falhar com email vazio', () => {
      expect(() => authService.forgotPassword(''))
        .toThrow('Email é obrigatório');
    });
  });

  describe('resetPassword', () => {
    test('deve redefinir senha com token válido', async () => {
      // Solicitar token
      const forgotResult = authService.forgotPassword('usuario@exemplo.com');
      const token = forgotResult.token;

      // Redefinir senha
      const result = await authService.resetPassword('usuario@exemplo.com', token, 'nova_senha123');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Senha redefinida com sucesso');

      // Verificar se pode fazer login com nova senha
      const loginResult = await authService.login('usuario@exemplo.com', 'nova_senha123');
      expect(loginResult.success).toBe(true);
    });

    test('deve falhar com token inválido', async () => {
      await expect(authService.resetPassword('usuario@exemplo.com', 'token_invalido', 'nova_senha123'))
        .rejects.toThrow('Token inválido');
    });

    test('deve falhar com senha muito curta', async () => {
      const forgotResult = authService.forgotPassword('usuario@exemplo.com');
      const token = forgotResult.token;

      await expect(authService.resetPassword('usuario@exemplo.com', token, '123'))
        .rejects.toThrow('A senha deve ter pelo menos 6 caracteres');
    });

    test('deve falhar com dados vazios', async () => {
      await expect(authService.resetPassword('', '', ''))
        .rejects.toThrow('Email, token e nova senha são obrigatórios');
    });
  });

  describe('register', () => {
    test('deve registrar novo usuário', async () => {
      const result = await authService.register('novo@exemplo.com', 'senha123', 'Novo Usuário');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Usuário registrado com sucesso');
      expect(result.user).toEqual({
        email: 'novo@exemplo.com',
        name: 'Novo Usuário'
      });

      // Verificar se pode fazer login
      const loginResult = await authService.login('novo@exemplo.com', 'senha123');
      expect(loginResult.success).toBe(true);
    });

    test('deve falhar ao registrar email já existente', async () => {
      await expect(authService.register('usuario@exemplo.com', 'senha123', 'Usuário'))
        .rejects.toThrow('Email já cadastrado');
    });

    test('deve falhar com senha muito curta', async () => {
      await expect(authService.register('novo@exemplo.com', '123', 'Usuário'))
        .rejects.toThrow('A senha deve ter pelo menos 6 caracteres');
    });

    test('deve falhar com dados vazios', async () => {
      await expect(authService.register('', '', ''))
        .rejects.toThrow('Email, senha e nome são obrigatórios');
    });
  });

  describe('verifyToken', () => {
    test('deve verificar token válido', async () => {
      const loginResult = await authService.login('usuario@exemplo.com', 'senha123');
      const token = loginResult.token;

      const decoded = authService.verifyToken(token);
      expect(decoded.email).toBe('usuario@exemplo.com');
      expect(decoded.name).toBe('Usuário Teste');
    });

    test('deve falhar com token inválido', () => {
      expect(() => authService.verifyToken('token_invalido'))
        .toThrow('Token inválido');
    });
  });
}); 