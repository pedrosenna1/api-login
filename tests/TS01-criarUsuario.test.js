const request = require('supertest')
const {expect} = require('chai')

describe('validar usuario',()=>{
    let email
    before (async() => {
        const response = await request('http://localhost:3001')
            .post('/api/auth/register')
            .send({
                email: "reginaldo@exemplo.com",
                password: "senha123",
                name: "Reginaldo"
            })
            if(response.body.error == 'Email já cadastrado'){
                expect(response.status).to.eq(409)
                email = 'reginaldo@exemplo.com'
            }
            else {
                expect(response.status).to.eq(201)
                email = response.body.user.email}
            


})
    
    it('validar usuario',async()=>{
        const response = await request('http://localhost:3001')
            .get(`/api/auth/status/${email}`)
        
        expect(response.status).to.eq(200)
        expect(response.body.exists).to.eq(true)

    })



})