import request from 'supertest'
import { app } from '../../app'

describe('Current user API', () => {
    const currentuserEndpoint = '/api/users/currentuser'
    const correctEmail = 'test@test.com'
    
    it('responds with details about the current user', async() => {
        const cookie = await signin()      

        const response = await request(app)
            .get(currentuserEndpoint)
            .set('Cookie', cookie)
            .send()
            .expect(200)  
            
        expect(response.body.currentUser.email).toEqual(correctEmail)
    })

    it('responds with null if not authenticated', async() => {      
        const response = await request(app)
            .get(currentuserEndpoint)
            .send()
            .expect(200)  
            
        expect(response.body.currentUser).toBeNull()
    })
})