/**
 * Utilitário para padronizar respostas da API
 */

/**
 * Cria uma resposta de sucesso padronizada
 * @param {Object} res - Objeto response do Express
 * @param {number} statusCode - Código de status HTTP
 * @param {string} message - Mensagem de sucesso
 * @param {*} data - Dados da resposta
 */
const successResponse = (res, statusCode = 200, message = 'Sucesso', data = null) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

/**
 * Cria uma resposta de erro padronizada
 * @param {Object} res - Objeto response do Express
 * @param {number} statusCode - Código de status HTTP
 * @param {string} error - Tipo do erro
 * @param {string} message - Mensagem de erro
 */
const errorResponse = (res, statusCode = 500, error = 'Erro interno do servidor', message = 'Ocorreu um erro inesperado') => {
  res.status(statusCode).json({
    success: false,
    error,
    message,
    timestamp: new Date().toISOString()
  });
};

/**
 * Cria uma resposta de validação padronizada
 * @param {Object} res - Objeto response do Express
 * @param {string} message - Mensagem de erro de validação
 */
const validationError = (res, message = 'Dados inválidos') => {
  errorResponse(res, 400, 'Dados inválidos', message);
};

/**
 * Cria uma resposta de não encontrado padronizada
 * @param {Object} res - Objeto response do Express
 * @param {string} message - Mensagem de não encontrado
 */
const notFoundError = (res, message = 'Recurso não encontrado') => {
  errorResponse(res, 404, 'Não encontrado', message);
};

module.exports = {
  successResponse,
  errorResponse,
  validationError,
  notFoundError
}; 