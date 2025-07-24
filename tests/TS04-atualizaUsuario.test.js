const request = require('supertest');
const { expect } = require('chai');

const baseUrl = 'http://localhost:3001';
const registerUrl = '/api/auth/register';
const patchUrl = (id) => `/api/auth/register/${encodeURIComponent(id)}`;

describe('PATCH /api/auth/register/:id - Atualização parcial de usuário', () => {
  const user1 = {
    email: 'patchuser1@exemplo.com',
    password: 'senha123',
    name: 'Usuário Patch 1'
  };
  const user2 = {
    email: 'patchuser2@exemplo.com',
    password: 'senha123',
    name: 'Usuário Patch 2'
  };

  before(async () => {
    // Garante que os usuários de teste existem
    await request(baseUrl).post(registerUrl).send(user1);
    await request(baseUrl).post(registerUrl).send(user2);
  });

  it('deve atualizar o nome do usuário', async () => {
    const response = await request(baseUrl)
      .patch(patchUrl(user1.email))
      .send({ name: 'Nome Atualizado' });
    expect(response.status).to.eq(200);
    expect(response.body.user.name).to.eq('Nome Atualizado');
    expect(response.body.user.email).to.eq(user1.email);
  });

  it('deve atualizar a senha do usuário', async () => {
    const response = await request(baseUrl)
      .patch(patchUrl(user1.email))
      .send({ password: 'novaSenha123' });
    expect(response.status).to.eq(200);
    expect(response.body.user.email).to.eq(user1.email);
  });

  it('deve atualizar o email do usuário', async () => {
    const response = await request(baseUrl)
      .patch(patchUrl(user1.email))
      .send({ email: 'patchuser1novo@exemplo.com' });
    expect(response.status).to.eq(200);
    expect(response.body.user.email).to.eq('patchuser1novo@exemplo.com');
  });

  it('deve retornar erro ao tentar atualizar usuário inexistente', async () => {
    const response = await request(baseUrl)
      .patch(patchUrl('naoexiste@exemplo.com'))
      .send({ name: 'Novo Nome' });
    expect(response.status).to.eq(404);
    expect(response.body.error).to.exist;
  });

  it('deve retornar erro ao tentar atualizar email para um já existente', async () => {
    // user2 já existe, tentar atualizar user1novo para user2
    const response = await request(baseUrl)
      .patch(patchUrl('patchuser1novo@exemplo.com'))
      .send({ email: user2.email });
    expect(response.status).to.eq(500); // O controller retorna 500 para erro genérico
    expect(response.body.error).to.exist;
  });

  it('deve retornar erro ao tentar atualizar senha muito curta', async () => {
    const response = await request(baseUrl)
      .patch(patchUrl(user2.email))
      .send({ password: '123' });
    expect(response.status).to.eq(400);
    expect(response.body.error).to.exist;
  });

  it('deve retornar erro ao não enviar nenhum campo válido', async () => {
    const response = await request(baseUrl)
      .patch(patchUrl(user2.email))
      .send({});
    expect(response.status).to.eq(400);
    expect(response.body.error).to.exist;
  });
}); 