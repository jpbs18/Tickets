import { Message } from "node-nats-streaming"
import { Subject, Listener, ExpirationCompleteEvent, OrderStatus } from "@jpbs/common"
import { queuGroupName } from "./queue-group-name"
import { Order } from "../../models/order"
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher"

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    public readonly subject = Subject.ExpirationComplete
    public readonly queueGroupName = queuGroupName

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket')
        if(!order){
            throw new Error('Order not found.')
        }

        if(order.status === OrderStatus.Complete){
            msg.ack()
            return
        }
        
        order.set({ status: OrderStatus.Cancelled })
        await order.save()   

        new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })

        msg.ack()
    }  
}