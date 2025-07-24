const authService = require('../services/authService');

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         password:
 *           type: string
 *           description: Senha do usuário
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica se o login foi bem-sucedido
 *         message:
 *           type: string
 *           description: Mensagem de resposta
 *         token:
 *           type: string
 *           description: Token JWT para autenticação
 *         user:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             name:
 *               type: string
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *         - token
 *         - newPassword
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         token:
 *           type: string
 *           description: Token de recuperação
 *         newPassword:
 *           type: string
 *           description: Nova senha
 *     AccountStatus:
 *       type: object
 *       properties:
 *         exists:
 *           type: boolean
 *           description: Se o usuário existe
 *         isLocked:
 *           type: boolean
 *           description: Se a conta está bloqueada
 *         remainingAttempts:
 *           type: integer
 *           description: Tentativas restantes
 *         lockUntil:
 *           type: string
 *           format: date-time
 *           description: Data de expiração do bloqueio
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Tipo do erro
 *         message:
 *           type: string
 *           description: Mensagem de erro
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realizar login
 *     description: Autentica um usuário com email e senha
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "usuario@exemplo.com"
 *             password: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       423:
 *         description: Conta bloqueada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes('obrigatórios')) {
      res.status(400).json({
        error: 'Dados inválidos',
        message: error.message
      });
    } else if (error.message.includes('inválidos')) {
      res.status(401).json({
        error: 'Credenciais inválidas',
        message: error.message
      });
    } else if (error.message.includes('bloqueada')) {
      res.status(423).json({
        error: 'Conta bloqueada',
        message: error.message
      });
    } else {
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }
};

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperação de senha
 *     description: Envia um token de recuperação para o email
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *           example:
 *             email: "usuario@exemplo.com"
 *     responses:
 *       200:
 *         description: Token enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 expiresAt:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Email não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const forgotPassword = (req, res) => {
  try {
    const { email } = req.body;
    const result = authService.forgotPassword(email);
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes('obrigatório')) {
      res.status(400).json({
        error: 'Dados inválidos',
        message: error.message
      });
    } else if (error.message.includes('não encontrado')) {
      res.status(404).json({
        error: 'Email não encontrado',
        message: error.message
      });
    } else {
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }
};

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Redefinir senha
 *     description: Redefine a senha usando token de recuperação
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *           example:
 *             email: "usuario@exemplo.com"
 *             token: "token_recuperacao"
 *             newPassword: "nova_senha123"
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Token não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const result = await authService.resetPassword(email, token, newPassword);
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes('obrigatórios')) {
      res.status(400).json({
        error: 'Dados inválidos',
        message: error.message
      });
    } else if (error.message.includes('não encontrado') || error.message.includes('inválido') || error.message.includes('expirado')) {
      res.status(404).json({
        error: 'Token inválido',
        message: error.message
      });
    } else {
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }
};

/**
 * @swagger
 * /api/auth/unlock-account:
 *   post:
 *     summary: Desbloquear conta
 *     description: Desbloqueia uma conta que foi bloqueada por tentativas excessivas
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *           example:
 *             email: "usuario@exemplo.com"
 *     responses:
 *       200:
 *         description: Conta desbloqueada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const unlockAccount = (req, res) => {
  try {
    const { email } = req.body;
    const result = authService.unlockAccount(email);
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes('não encontrado')) {
      res.status(404).json({
        error: 'Usuário não encontrado',
        message: error.message
      });
    } else if (error.message.includes('não está bloqueada')) {
      res.status(400).json({
        error: 'Conta não bloqueada',
        message: error.message
      });
    } else {
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }
};

/**
 * @swagger
 * /api/auth/status/{email}:
 *   get:
 *     summary: Verificar status da conta
 *     description: Verifica o status de uma conta (bloqueada, tentativas restantes, etc.)
 *     tags: [Autenticação]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email do usuário
 *     responses:
 *       200:
 *         description: Status da conta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountStatus'
 *       400:
 *         description: Email inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const getAccountStatus = (req, res) => {
  try {
    const { email } = req.params;
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Email inválido',
        message: 'Formato de email inválido'
      });
    }
    const status = authService.getAccountStatus(email);
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     description: Cria uma nova conta de usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *               name:
 *                 type: string
 *                 description: Nome do usuário
 *           example:
 *             email: "novo@exemplo.com"
 *             password: "senha123"
 *             name: "Novo Usuário"
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const result = await authService.register(email, password, name);
    res.status(201).json(result);
  } catch (error) {
    if (error.message.includes('obrigatórios')) {
      res.status(400).json({
        error: 'Dados inválidos',
        message: error.message
      });
    } else if (error.message.includes('já cadastrado')) {
      res.status(409).json({
        error: 'Email já cadastrado',
        message: error.message
      });
    } else {
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  }
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  unlockAccount,
  getAccountStatus,
  register
}; 