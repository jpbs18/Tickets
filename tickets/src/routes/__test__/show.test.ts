import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

describe('Show Ticket API', () => {
    const ticketsEndpoint = '/api/tickets'
    const ticketId = new mongoose.Types.ObjectId().toHexString()

    it('returns a 404 if the ticket is not found', async () => {
        await request(app)
            .get(`${ticketsEndpoint}/${ticketId}`)
            .send()
            .expect(404)
    })

    it('return the ticket if the ticket is found', async () => {
        const response = await request(app)
            .post(ticketsEndpoint)
            .set('Cookie', signin())
            .send({ title: 'Title', price: 100.0 })
            .expect(201)

        const ticketResponse = await request(app)
            .get(`${ticketsEndpoint}/${response.body.id}`)
            .send()
            .expect(200)

        expect(ticketResponse.body.title).toEqual('Title')
        expect(ticketResponse.body.price).toEqual(100.0)
    })
})