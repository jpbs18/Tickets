import request from 'supertest'
import { app } from '../../app'

describe('User Signin API', () => {
    const signinEndpoint = '/api/users/signin'
    const signupEndpoint = '/api/users/signup'
    
    it('returns a 200 status code on successful signin', async () => {
        await request(app)
            .post(signupEndpoint)
            .send({ email: 'test@test.com', password: 'password' })
            .expect(201)

        await request(app)
            .post(signinEndpoint)
            .send({ email: 'test@test.com', password: 'password' })
            .expect(200)
    })
  
    it('returns 400 status code when given email does not exist', async() => {
        await request(app)
            .post(signinEndpoint)
            .send({ email: 'test@test.com', password: 'password' })
            .expect(400)
    })

    it('returns 400 status code when given password is invalid', async() => {
        await request(app)
            .post(signupEndpoint)
            .send({ email: 'test@test.com', password: 'password' })
            .expect(201)

        await request(app)
            .post(signinEndpoint)
            .send({ email: 'test@test.com', password: 'pass' })
            .expect(400)
    })
})