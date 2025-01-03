import { OrderCreatedListener } from "../order-created-listener"
import { OrderStatus } from "@jpbs/common"
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"

describe('Created order listener API', () => {
    const setup = async () => {
        const listener = new OrderCreatedListener(natsWrapper.client)
        const data = {
            id: new mongoose.Types.ObjectId().toHexString(),   
            version: 0,
            expiresAt: '10-10-2023',
            userId: new mongoose.Types.ObjectId().toHexString(),
            status: OrderStatus.Created,
            ticket: {
                id: new mongoose.Types.ObjectId().toHexString(),
                price: 34
            }
        }

        // @ts-ignore
        const msg: Message = {
            ack: jest.fn()
        }

        return { listener, data, msg }
    }

    it('replicates the order info', async () => {
        const { listener, data,  msg } = await setup()
        await listener.onMessage(data, msg)

        const order = await Order.findById(data.id)
        expect(order!.price).toEqual(data.ticket.price)
    })

    it('acks the message', async () => {
        const { listener, data, msg } = await setup()
        await listener.onMessage(data, msg)

        expect(msg.ack).toHaveBeenCalled()
    })
})