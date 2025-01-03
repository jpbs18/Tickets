import { OrderCancelledListener } from "../order-cancelled-listener"
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"

describe('Cancelled order listener API', () => {
    const setup = async () => {
        const listener = new OrderCancelledListener(natsWrapper.client)
        const orderId = new mongoose.Types.ObjectId().toHexString()
        const ticket = Ticket.build({
            title: 'Concert',
            price: 80,
            userId: new mongoose.Types.ObjectId().toHexString(),
        })

        ticket.set('orderId', orderId)
        await ticket.save()

        const data = {
            id: new mongoose.Types.ObjectId().toHexString(),
            version: 0,
            ticket: {
                id: ticket.id,
            }     
        }

        // @ts-ignore
        const msg: Message = {
            ack: jest.fn()
        }

        return { listener, data, ticket, msg, orderId }
    }

    it('updates the ticket', async () => {
        const { listener, data, ticket, msg, orderId } = await setup()
        await listener.onMessage(data, msg)

        const updatedTicket = await Ticket.findById(ticket.id)
        expect(updatedTicket!.orderId).not.toBeDefined()
    })

    it('acks the message', async () => {
        const { listener, data, msg } = await setup()
        await listener.onMessage(data, msg)

        expect(msg.ack).toHaveBeenCalled()
    })

    it('publishes a ticket cancelled event', async () => {
        const { listener, data, msg } = await setup()
        await listener.onMessage(data, msg)

        expect(natsWrapper.client.publish).toHaveBeenCalled()     
    })
})