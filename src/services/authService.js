const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Serviço de autenticação
 * Armazena dados em memória para fins de estudo
 */

class AuthService {
  constructor() {
    // Usuários armazenados em memória
    this.users = new Map();
    // Tentativas de login por email
    this.loginAttempts = new Map();
    // Tokens de recuperação de senha
    this.resetTokens = new Map();
    // Chave secreta para JWT (em produção, usar variável de ambiente)
    this.jwtSecret = 'sua_chave_secreta_jwt_aqui';
    // Não criar usuário de teste aqui
  }

  /**
   * Realiza login do usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Object} Resultado do login
   */
  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    // Verificar se a conta está bloqueada
    const accountStatus = this.getAccountStatus(email);
    if (accountStatus.isLocked) {
      throw new Error('Conta bloqueada. Solicite o desbloqueio ou aguarde 30 minutos.');
    }

    // Buscar usuário
    const user = this.users.get(email);
    if (!user) {
      this.recordFailedAttempt(email);
      throw new Error('Email ou senha inválidos');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.recordFailedAttempt(email);
      throw new Error('Email ou senha inválidos');
    }

    // Login bem-sucedido - resetar tentativas
    this.resetLoginAttempts(email);

    // Gerar token JWT
    const token = jwt.sign(
      { email: user.email, name: user.name },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        email: user.email,
        name: user.name
      }
    };
  }

  /**
   * Registra tentativa falhada de login
   * @param {string} email - Email do usuário
   */
  recordFailedAttempt(email) {
    const attempts = this.loginAttempts.get(email) || {
      count: 0,
      lastAttempt: null,
      lockUntil: null
    };

    attempts.count += 1;
    attempts.lastAttempt = new Date().toISOString();

    // Bloquear após 3 tentativas
    if (attempts.count >= 3) {
      attempts.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
      const user = this.users.get(email);
      if (user) {
        user.isLocked = true;
        this.users.set(email, user);
      }
    }

    this.loginAttempts.set(email, attempts);
  }

  /**
   * Reseta as tentativas de login
   * @param {string} email - Email do usuário
   */
  resetLoginAttempts(email) {
    this.loginAttempts.delete(email);
  }

  /**
   * Obtém o status da conta
   * @param {string} email - Email do usuário
   * @returns {Object} Status da conta
   */
  getAccountStatus(email) {
    const user = this.users.get(email);
    const attempts = this.loginAttempts.get(email);

    if (!user) {
      return {
        exists: false,
        isLocked: false,
        remainingAttempts: 3
      };
    }

    // Verificar se o bloqueio expirou
    if (attempts && attempts.lockUntil) {
      const lockUntil = new Date(attempts.lockUntil);
      const now = new Date();
      
      if (now > lockUntil) {
        // Desbloquear automaticamente
        user.isLocked = false;
        this.users.set(email, user);
        this.resetLoginAttempts(email);
        return {
          exists: true,
          isLocked: false,
          remainingAttempts: 3
        };
      }
    }

    return {
      exists: true,
      isLocked: user.isLocked || false,
      remainingAttempts: attempts ? Math.max(0, 3 - attempts.count) : 3,
      lockUntil: attempts?.lockUntil || null
    };
  }

  /**
   * Desbloqueia uma conta
   * @param {string} email - Email do usuário
   * @returns {Object} Resultado do desbloqueio
   */
  unlockAccount(email) {
    const user = this.users.get(email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (!user.isLocked) {
      throw new Error('Conta não está bloqueada');
    }

    user.isLocked = false;
    this.users.set(email, user);
    this.resetLoginAttempts(email);

    return {
      success: true,
      message: 'Conta desbloqueada com sucesso'
    };
  }

  /**
   * Solicita recuperação de senha
   * @param {string} email - Email do usuário
   * @returns {Object} Resultado da solicitação
   */
  forgotPassword(email) {
    if (!email) {
      throw new Error('Email é obrigatório');
    }

    const user = this.users.get(email);
    if (!user) {
      throw new Error('Email não encontrado');
    }

    // Gerar token de recuperação
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    this.resetTokens.set(email, {
      token: resetToken,
      expiresAt: tokenExpiry.toISOString()
    });

    // Em produção, enviar email com o token
    // Por enquanto, retornamos o token para demonstração
    return {
      success: true,
      message: 'Token de recuperação enviado para o email',
      token: resetToken, // Em produção, não retornar o token
      expiresAt: tokenExpiry.toISOString()
    };
  }

  /**
   * Redefine a senha usando token
   * @param {string} email - Email do usuário
   * @param {string} token - Token de recuperação
   * @param {string} newPassword - Nova senha
   * @returns {Object} Resultado da redefinição
   */
  async resetPassword(email, token, newPassword) {
    if (!email || !token || !newPassword) {
      throw new Error('Email, token e nova senha são obrigatórios');
    }

    const user = this.users.get(email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const resetData = this.resetTokens.get(email);
    if (!resetData) {
      throw new Error('Token inválido');
    }

    if (resetData.token !== token) {
      throw new Error('Token inválido');
    }

    const tokenExpiry = new Date(resetData.expiresAt);
    const now = new Date();
    if (now > tokenExpiry) {
      this.resetTokens.delete(email);
      throw new Error('Token expirado');
    }

    // Validar nova senha
    if (newPassword.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }

    // Criptografar nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    this.users.set(email, user);

    // Remover token usado
    this.resetTokens.delete(email);

    // Resetar tentativas de login
    this.resetLoginAttempts(email);

    return {
      success: true,
      message: 'Senha redefinida com sucesso'
    };
  }

  /**
   * Verifica se um token JWT é válido
   * @param {string} token - Token JWT
   * @returns {Object} Dados do token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  /**
   * Registra um novo usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @param {string} name - Nome do usuário
   * @returns {Object} Resultado do registro
   */
  async register(email, password, name) {
    if (!email || !password || !name) {
      throw new Error('Email, senha e nome são obrigatórios');
    }

    if (this.users.has(email)) {
      throw new Error('Email já cadastrado');
    }

    if (password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      email,
      password: hashedPassword,
      name,
      isLocked: false,
      createdAt: new Date().toISOString()
    };

    this.users.set(email, user);

    return {
      success: true,
      message: 'Usuário registrado com sucesso',
      user: {
        email: user.email,
        name: user.name
      }
    };
  }
}

// Exporta uma instância singleton do serviço
module.exports = new AuthService(); 