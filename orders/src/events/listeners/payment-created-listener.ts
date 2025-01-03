import { Subject, Listener, PaymentCreatedEvent, OrderStatus } from '@jpbs/common'
import { queuGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    public readonly subject = Subject.PaymentCreated
    public readonly queueGroupName = queuGroupName

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message){
        const order = await Order.findById(data.orderId)

        if(!order){
            throw new Error('Order not found.')
        }

        order.set({ status: OrderStatus.Complete })
        await order.save()

        msg.ack()
    }
}