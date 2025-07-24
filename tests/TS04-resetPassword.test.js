const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/server');

describe('TS04 - POST /api/auth/reset-password', () => {
  let token;
  const email = 'reginaldo@exemplo.com';
  const newPassword = 'novaSenha123';

  before(async () => {
    // Solicita token de recuperação para o usuário padrão
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email });
    token = res.body.token;
  });

  it('deve redefinir a senha com sucesso', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ email, token, newPassword });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('message');
  });

  it('deve retornar 404 para token inválido', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ email, token: 'token_invalido', newPassword });
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error', 'Token inválido');
  });

  it('deve retornar 400 se faltar campos obrigatórios', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ email, token });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('deve retornar 400 se a senha for muito curta', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ email, token, newPassword: '123' });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });
}); 