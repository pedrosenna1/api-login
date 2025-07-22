/**
 * Middleware de validação para dados de entrada
 */

/**
 * Valida dados de login
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Email e senha são obrigatórios'
    });
  }

  if (typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Email deve ser uma string não vazia'
    });
  }

  if (typeof password !== 'string' || password.trim() === '') {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Senha deve ser uma string não vazia'
    });
  }

  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Formato de email inválido'
    });
  }

  next();
};

/**
 * Valida se o email é válido
 */
const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Email é obrigatório'
    });
  }

  if (typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Email deve ser uma string não vazia'
    });
  }

  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Formato de email inválido'
    });
  }

  next();
};

/**
 * Valida dados para redefinição de senha
 */
const validateResetPassword = (req, res, next) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Email, token e nova senha são obrigatórios'
    });
  }

  if (typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Email deve ser uma string não vazia'
    });
  }

  if (typeof token !== 'string' || token.trim() === '') {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Token deve ser uma string não vazia'
    });
  }

  if (typeof newPassword !== 'string' || newPassword.trim() === '') {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Nova senha deve ser uma string não vazia'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'A senha deve ter pelo menos 6 caracteres'
    });
  }

  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Formato de email inválido'
    });
  }

  next();
};

/**
 * Valida dados de registro
 */
const validateRegister = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Email, senha e nome são obrigatórios'
    });
  }

  if (typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Email deve ser uma string não vazia'
    });
  }

  if (typeof password !== 'string' || password.trim() === '') {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Senha deve ser uma string não vazia'
    });
  }

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Nome deve ser uma string não vazia'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'A senha deve ter pelo menos 6 caracteres'
    });
  }

  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Formato de email inválido'
    });
  }

  next();
};

module.exports = {
  validateLogin,
  validateEmail,
  validateResetPassword,
  validateRegister
}; 