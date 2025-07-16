const request = require('supertest')
const {expect} = require('chai')
const {getEmail} = require('./00-criarUsuario.test')

describe('validar usuario',()=>{
    let email
    before(async ()=>{
        email = getEmail()

    })
    
    it('validar usuario',async()=>{
        const response = await request('http://localhost:3001')
            .get(`/api/auth/status/${email}`)
        
        expect(response.status).to.eq(200)
        expect(response.body.exists).to.eq(true)

    })



})