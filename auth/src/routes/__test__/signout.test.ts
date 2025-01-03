import request from 'supertest'
import { app } from '../../app'

describe('User Signout API', () => {
    const signupEndpoint = '/api/users/signup'
    const signoutEndpoint = '/api/users/signout'
    
    it('clears cookie session after signing out', async() => {
        await request(app)
            .post(signupEndpoint)
            .send({ email: 'test@test.com', password: 'password' })
            .expect(201)
        
        const response = await request(app)
            .post(signoutEndpoint)
            .send({})
            .expect(200)
        
        const cookie = response.get('Set-Cookie')
        if(!cookie){
            throw new Error('Expected cookie but got undefined')
        }

        expect(cookie[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly')
    })
})