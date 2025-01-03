import request from 'supertest'
import { app } from '../../app'

describe('User Signup API', () => {
    const signupEndpoint = '/api/users/signup'
    
    it('returns a 201 status code on successful signup', async () => {
        await request(app)
            .post(signupEndpoint)
            .send({ email: 'test@test.com', password: 'password' })
            .expect(201)
    })
  
    it('returns a 400 status code with invalid credentials', async () => {
        const invalidRequests = [
            { email: 'test.com', password: 'password' },
            { email: 'test@test.com', password: 'p' }, 
            {}                                        
        ]
  
        for (const body of invalidRequests) {
            await request(app)
            .post(signupEndpoint)
            .send(body)
            .expect(400)
        }
    })
  
    it('disallows duplicate email addresses', async () => {
        await request(app)
            .post(signupEndpoint)
            .send({ email: 'test@test.com', password: 'password' })
            .expect(201)
  
        await request(app)
            .post(signupEndpoint)
            .send({ email: 'test@test.com', password: 'password' })
            .expect(400)
    })

    it('sets cookie after successfull signup', async () => {
        const response = await request(app)
            .post(signupEndpoint)
            .send({ email: 'test@test.com', password: 'password' })
            .expect(201)

        expect(response.get('Set-Cookie')).toBeDefined()
    })
  })