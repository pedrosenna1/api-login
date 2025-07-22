const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin, validateEmail, validateResetPassword, validateRegister } = require('../middleware/validation');

// Rota para login
router.post('/login', validateLogin, authController.login);

// Rota para solicitar recuperação de senha
router.post('/forgot-password', validateEmail, authController.forgotPassword);

// Rota para redefinir senha
router.post('/reset-password', validateResetPassword, authController.resetPassword);

// Rota para desbloquear conta
router.post('/unlock-account', validateEmail, authController.unlockAccount);

// Rota para verificar status da conta
router.get('/status/:email', authController.getAccountStatus);

// Rota para registro de usuário
router.post('/register', validateRegister, authController.register);

module.exports = router; 