const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/server');

describe('Desbloqueio de Conta - /api/auth/unlock-account', () => {
  const baseUrl = '/api/auth';
  const testUser = {
    email: 'unlockuser@exemplo.com',
    password: 'senha123',
    name: 'Usuário Unlock'
  };

  before(async () => {
    // Garante que o usuário de teste existe
    await request(app)
      .post(`${baseUrl}/register`)
      .send(testUser);
  });

  it('deve retornar 400 se o email não for enviado', async () => {
    const response = await request(app)
      .post(`${baseUrl}/unlock-account`)
      .send({});
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error');
  });

  it('deve retornar 400 se o email for vazio', async () => {
    const response = await request(app)
      .post(`${baseUrl}/unlock-account`)
      .send({ email: '' });
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error');
  });

  it('deve retornar 400 se o email for inválido', async () => {
    const response = await request(app)
      .post(`${baseUrl}/unlock-account`)
      .send({ email: 'email_invalido' });
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error');
  });

  it('deve retornar 404 para email não cadastrado', async () => {
    const response = await request(app)
      .post(`${baseUrl}/unlock-account`)
      .send({ email: 'naoexiste@exemplo.com' });
    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('error');
  });

  it('deve retornar 400 se a conta não estiver bloqueada', async () => {
    // Garante que a conta está desbloqueada
    const response = await request(app)
      .post(`${baseUrl}/unlock-account`)
      .send({ email: testUser.email });
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error');
    expect(response.body.error).to.match(/Conta não bloqueada/);
  });

  it('deve bloquear e depois desbloquear a conta com sucesso', async () => {
    // Bloqueia a conta com 3 tentativas de login inválidas
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post(`${baseUrl}/login`)
        .send({ email: testUser.email, password: 'senhaerrada' });
    }
    // Tenta desbloquear
    const response = await request(app)
      .post(`${baseUrl}/unlock-account`)
      .send({ email: testUser.email });
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('success', true);
    expect(response.body).to.have.property('message').that.match(/Conta desbloqueada com sucesso/);
  });
}); 