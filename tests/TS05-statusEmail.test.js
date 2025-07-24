const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/server');

describe('TS05 - GET /api/auth/status/:email', () => {
  const email = 'reginaldo@exemplo.com';

  it('deve retornar 200 e exists true para email existente', async () => {
    const res = await request(app)
      .get(`/api/auth/status/${email}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('exists', true);
    expect(res.body).to.have.property('isLocked');
    expect(res.body).to.have.property('remainingAttempts');
  });

  it('deve retornar 200 e exists false para email inexistente', async () => {
    const res = await request(app)
      .get('/api/auth/status/naoexiste@exemplo.com');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('exists', false);
  });

  it('deve retornar 400 para email inválido', async () => {
    const res = await request(app)
      .get('/api/auth/status/email_invalido');
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error', 'Email inválido');
  });
}); 