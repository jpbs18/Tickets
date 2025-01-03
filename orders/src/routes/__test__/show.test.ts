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

describe('Show API', () => {
    const ordersEndpoint = '/api/orders'

    it('fetches an order by the ID', async () => {
        const ticket = await buildTicket() 
        const user = signin()
        
        const { body: order } = await request(app)
            .post(ordersEndpoint)
            .set('Cookie', user) 
            .send({ ticketId: ticket.id })
            .expect(201)

        const { body: fetchedOrder } =await request(app)
            .get(`${ordersEndpoint}/${order.id}`)
            .set('Cookie', user)
            .send()
            .expect(200)  
        
        expect(fetchedOrder.id).toEqual(order.id)
    });

    it('return an error if one user tries to fetch another users order', async () => {
        const ticket = await buildTicket() 
        const user = signin()
        
        const { body: order } = await request(app)
            .post(ordersEndpoint)
            .set('Cookie', user) 
            .send({ ticketId: ticket.id })
            .expect(201)

        await request(app)
            .get(`${ordersEndpoint}/${order.id}`)
            .set('Cookie', signin())
            .send()
            .expect(401)  
    });
})