const request = require('supertest')
const { expect } = require('chai')

describe('Login', () => {
    describe('POST /api/auth/login', () => {
        it('Login realizado com sucesso', async () => {
            const resposta = await request('http://localhost:3001')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                'email': 'reginaldo@exemplo.com',
                'password': 'senha123',
            })

            expect(resposta.status).to.equal(200)
            expect(resposta.body.success).to.be.true
            expect(resposta.body.token).to.be.a('string')
        })
    })
})