import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"

describe('Updated ticket listener API', () => {
    const setup = async () => {
        const listener = new TicketUpdatedListener(natsWrapper.client)
        const ticket = Ticket.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            title: 'Test',
            price: 100
        })

        await ticket.save()
        const data = {
            version: ticket.version + 1,
            id: ticket.id,
            title: 'updated name',
            price: 70,
            userId: new mongoose.Types.ObjectId().toHexString(),
        }

        // @ts-ignore
        const msg: Message = {
            ack: jest.fn()
        }

        return { listener, data, ticket, msg }
    }

    it('finds, updates and saves a ticket', async () => {
        const { listener, data, ticket, msg } = await setup()
        await listener.onMessage(data, msg) 
        const updatedTicket = await Ticket.findById(ticket.id)

        expect(updatedTicket!.title).toEqual(data.title)
        expect(updatedTicket!.price).toEqual(data.price)
        expect(updatedTicket!.version).toEqual(data.version)
    })

    it('acks the message', async () => {
        const { listener, data, msg } = await setup()
        await listener.onMessage(data, msg)
        
        expect(msg.ack).toHaveBeenCalled()
    })

    it('does not call ack if the event has skipped version number', async () => {
        const { listener, data, msg } = await setup()
        data.version = 4

        await expect(listener.onMessage(data, msg)).rejects.toThrow('Ticket not found.')
    })
})