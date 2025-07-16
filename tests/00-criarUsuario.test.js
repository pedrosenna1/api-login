const request = require('supertest')
const {expect} = require('chai')

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

module.exports ={
    getEmail: ()=> email 

}