import request from "supertest"
import { app } from '../../app'
import { Ticket } from "../../models/ticket"
import { OrderStatus } from "@jpbs/common"
import { Order } from "../../models/order"
import { natsWrapper } from "../../nats-wrapper"
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

describe('Delete API', () => {
    const ordersEndpoint = '/api/orders'

    it('marks an order as cancelled', async () => {
        const ticket = await buildTicket() 
        const user = signin()
        
        const { body: order } = await request(app)
            .post(ordersEndpoint)
            .set('Cookie', user) 
            .send({ ticketId: ticket.id })
            .expect(201)

        await request(app)
            .delete(`${ordersEndpoint}/${order.id}`)
            .set('Cookie', user)
            .send()
            .expect(204)  
        
        const updatedOrder = await Order.findById(order.id)
        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
    });

    it('emits a order cancelled event', async () => {
        const user = signin()
        const ticket = Ticket.build({ 
            title: 'Test1', 
            price: 100, 
            id: new mongoose.Types.ObjectId().toHexString()
        })
        
        await ticket.save()  
        
        const { body: order } = await request(app)
            .post(ordersEndpoint)
            .set('Cookie', user)
            .send({ ticketId: ticket.id })
            .expect(201)
        
        await request(app)
            .delete(`${ordersEndpoint}/${order.id}`)
            .set('Cookie', user)
            .send()
            .expect(204)  

        expect(natsWrapper.client.publish).toHaveBeenCalled()
    })
})

