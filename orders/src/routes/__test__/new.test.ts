import request from "supertest"
import { app } from '../../app'
import mongoose from "mongoose"
import { Order } from "../../models/order"
import { Ticket } from "../../models/ticket"
import { OrderStatus } from "@jpbs/common"
import { natsWrapper } from "../../nats-wrapper"

describe('New Order API', () => {
    const ordersEndpoint = '/api/orders'

    it('returns an error if the ticket does not exist', async () => {
      const ticketId = new mongoose.Types.ObjectId();
      
      await request(app)
        .post(ordersEndpoint)
        .set('Cookie', global.signin())
        .send({ ticketId })
        .expect(404);
    });

    it('returns error if ticket is already reserved', async () => {
      const ticket = Ticket.build({ 
        title: 'Test1', 
        price: 100, 
        id: new mongoose.Types.ObjectId().toHexString() 
      })

      await ticket.save()

      const order = Order.build({ 
        ticket, 
        userId: "123", 
        status: OrderStatus.Created, 
        expiresAt: new Date() 
      })
      await order.save()

      await request(app)
        .post(ordersEndpoint)
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(400);
    })

    it('reserves a ticket', async () => {
      const ticket = Ticket.build({ 
        title: 'Test1', 
        price: 100, 
        id: new mongoose.Types.ObjectId().toHexString() 
      })

      await ticket.save() 
    
      await request(app)
        .post(ordersEndpoint)
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);
    })

    it('emits an order created event', async () => {
      const ticket = Ticket.build({ 
        title: 'Test1', 
        price: 100, 
        id: new mongoose.Types.ObjectId().toHexString() 
      })

      await ticket.save()  

      await request(app)
        .post(ordersEndpoint)
        .set('Cookie', signin())
        .send({ ticketId: ticket.id })
        .expect(201)

      expect(natsWrapper.client.publish).toHaveBeenCalled()
    })
})