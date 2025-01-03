import { OrderCreatedListener } from "../order-created-listener"
import { OrderStatus } from "@jpbs/common"
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"

describe('Created order listener API', () => {
    const setup = async () => {
        const listener = new OrderCreatedListener(natsWrapper.client)
        const ticket = Ticket.build({
            title: 'Concert',
            price: 74,
            userId: new mongoose.Types.ObjectId().toHexString()
        })

        await ticket.save()
        const data = {
            id: new mongoose.Types.ObjectId().toHexString(),
            version: 0,
            status: OrderStatus.Created,
            userId: new mongoose.Types.ObjectId().toHexString(),
            expiresAt: '10-10-2023',
            ticket: {
                id: ticket.id,
                price: ticket.price
            }     
        }

        // @ts-ignore
        const msg: Message = {
            ack: jest.fn()
        }

        return { listener, data, ticket, msg }
    }

    it('sets the userId of the ticket', async () => {
        const { listener, data, ticket, msg } = await setup()
        await listener.onMessage(data, msg)

        const updatedTicket = await Ticket.findById(ticket.id)
        expect(updatedTicket!.orderId).toEqual(data.id)
    })

    it('acks the message', async () => {
        const { listener, data, ticket, msg } = await setup()
        await listener.onMessage(data, msg)

        expect(msg.ack).toHaveBeenCalled()
    })

    it('publishes a ticket updated event', async () => {
        const { listener, data, ticket, msg } = await setup()
        await listener.onMessage(data, msg)

        expect(natsWrapper.client.publish).toHaveBeenCalled()     
    })
})