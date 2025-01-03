import request from "supertest"
import { app } from '../../app'

const createTicket = () => request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: "Test", price: 120.0 })

describe('Index API', () => {
    const ticketsEndpoint = '/api/tickets'

    it('can fetch the list of tickets', async () => {
        await createTicket()
        await createTicket()
        await createTicket()
       
        const response = await request(app)
            .get(ticketsEndpoint)
            .send()
            .expect(200)

        expect(response.body.length).toEqual(3)      
    })
})