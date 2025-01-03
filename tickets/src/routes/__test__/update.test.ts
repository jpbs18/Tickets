import request from "supertest"
import { app } from '../../app'
import mongoose from "mongoose"
import { natsWrapper } from "../../nats-wrapper"
import { Ticket } from "../../models/ticket"

describe('Update ticket API', () => {
    const ticketsEndpoint = '/api/tickets'

    it('return a 404 if the provided id does not exist', async () => {
        const ticketId = new mongoose.Types.ObjectId().toHexString()
        await request(app)
            .put(`${ticketsEndpoint}/${ticketId}`)
            .set('Cookie', signin())
            .send({ title: "Title", price: 100.0 })
            .expect(404) 
    })

    it('return a 401 if the user is not authenticated', async () => {
        const ticketId = new mongoose.Types.ObjectId().toHexString()
        await request(app)
        .put(`${ticketsEndpoint}/${ticketId}`)
        .send()
        .expect(401) 
    })

    it('return a 401 if the does not own a ticket', async () => {
        const response = await request(app)
            .post(ticketsEndpoint)
            .set('Cookie', signin())
            .send({ title: "Test", price: 10.0 })
        
        await request(app)
            .put(`${ticketsEndpoint}/${response.body.id}`)
            .set('Cookie', signin())
            .send({ title: "Test 2", price: 12.0 })
            .expect(401)
    })

    it('return a 400 if the user provides invalid title or price', async () => {
        const cookie = signin()

        const response = await request(app)
            .post(ticketsEndpoint)
            .set('Cookie', cookie)
            .send({ title: "Test", price: 10.0 })
    
        await request(app)
            .put(`${ticketsEndpoint}/${response.body.id}`)
            .set('Cookie', cookie)
            .send({ title: "", price: 12.0 })
            .expect(400)

            await request(app)
            .put(`${ticketsEndpoint}/${response.body.id}`)
            .set('Cookie', cookie)
            .send({ title: "Title 2", price: -12.0 })
            .expect(400)
    })

    it('updates the ticket when provided valid inputs', async () => {
        const cookie = signin()

        const response = await request(app)
            .post(ticketsEndpoint)
            .set('Cookie', cookie)
            .send({ title: "Test", price: 10.0 })
    
        await request(app)
            .put(`${ticketsEndpoint}/${response.body.id}`)
            .set('Cookie', cookie)
            .send({ title: "Title 2", price: 12.0 })
            .expect(200)

        const ticketResponse = await request(app)
            .get(`${ticketsEndpoint}/${response.body.id}`)
            .send()
            .expect(200)
        
            expect(ticketResponse.body.title).toEqual('Title 2')
            expect(ticketResponse.body.price).toEqual(12.0)
    })

    it('publishes an event', async () => {
        const cookie = signin()

        const response = await request(app)
            .post(ticketsEndpoint)
            .set('Cookie', cookie)
            .send({ title: "Test", price: 10.0 })
    
        await request(app)
            .put(`${ticketsEndpoint}/${response.body.id}`)
            .set('Cookie', cookie)
            .send({ title: "Title 2", price: 12.0 })
            .expect(200)

    
        expect(natsWrapper.client.publish).toHaveBeenCalled()
    })

    it('rejects updates if a ticket is already reserved', async () => {
        const cookie = signin()

        const response = await request(app)
            .post(ticketsEndpoint)
            .set('Cookie', cookie)
            .send({ title: "Test", price: 10.0 })

        const ticket = await Ticket.findById(response.body.id)
        ticket!.set('orderId', new mongoose.Types.ObjectId().toHexString())
        await ticket!.save()
    
        await request(app)
            .put(`${ticketsEndpoint}/${response.body.id}`)
            .set('Cookie', cookie)
            .send({ title: "Title 2", price: 12.0 })
            .expect(400)
    })
})