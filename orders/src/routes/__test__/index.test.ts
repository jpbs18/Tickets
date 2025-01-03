import request from "supertest"
import { app } from '../../app'
import { Ticket } from "../../models/ticket"
import mongoose from "mongoose"

const buildTicket = async () => {
    const ticket = Ticket.build({ 
        title: 'Test', 
        price: 25, 
        id: new mongoose.Types.ObjectId().toHexString() 
    })
    
    await ticket.save()
    return ticket
}

describe('Index API', () => {
    const ordersEndpoint = '/api/orders'

    it('fetches orders for a particular user', async () => {
        const ticket1 = await buildTicket() 
        const ticket2 = await buildTicket() 
        const ticket3 = await buildTicket() 

        const user1 = signin()
        const user2 = signin()

        await request(app)
            .post(ordersEndpoint)
            .set('Cookie', user1) 
            .send({ ticketId: ticket1.id })
            .expect(201)

        await request(app)
            .post(ordersEndpoint)
            .set('Cookie', user2) 
            .send({ ticketId: ticket2.id })
            .expect(201)

        await request(app)
            .post(ordersEndpoint)
            .set('Cookie', user2) 
            .send({ ticketId: ticket3.id })
            .expect(201)

        const response1 = await request(app)
            .get(ordersEndpoint)
            .set('Cookie', user1)
            .expect(200)

        const response2 = await request(app)
            .get(ordersEndpoint)
            .set('Cookie', user2)
            .expect(200)

        expect(response1.body.length).toEqual(1)
        expect(response2.body.length).toEqual(2)
    });
})