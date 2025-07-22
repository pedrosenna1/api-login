const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/server');

describe('Recuperação de Senha - /api/auth/forgot-password', () => {
  const baseUrl = '/api/auth';
  const testUser = {
    email: 'reginaldo@exemplo.com',
    password: 'senha123',
    name: 'Reginaldo'
  };

  before(async () => {
    // Garante que o usuário de teste existe
    await request(app)
      .post(`${baseUrl}/register`)
      .set('Content-Type', 'application/json')
      .send(testUser);
  });

  it('deve retornar 200 para email válido cadastrado', async () => {
    const response = await request(app)
      .post(`${baseUrl}/forgot-password`)
      .send({ email: testUser.email });
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('success', true);
    expect(response.body).to.have.property('token');
    expect(response.body).to.have.property('expiresAt');
  });

  it('deve retornar 400 se o email não for enviado', async () => {
    const response = await request(app)
      .post(`${baseUrl}/forgot-password`)
      .send({});
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error');
  });

  it('deve retornar 400 se o email for vazio', async () => {
    const response = await request(app)
      .post(`${baseUrl}/forgot-password`)
      .send({ email: '' });
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error');
  });

  it('deve retornar 400 se o email for inválido', async () => {
    const response = await request(app)
      .post(`${baseUrl}/forgot-password`)
      .send({ email: 'email_invalido' });
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error');
  });

  it('deve retornar 404 para email não cadastrado', async () => {
    const response = await request(app)
      .post(`${baseUrl}/forgot-password`)
      .send({ email: 'naoexiste@exemplo.com' });
    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('error');
  });
});
