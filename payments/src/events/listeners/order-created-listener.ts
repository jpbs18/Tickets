import { Listener, OrderCreatedEvent, Subject } from "@jpbs/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    public readonly subject = Subject.OrderCreated
    public readonly queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            version: data.version,
            status: data.status,
            userId: data.userId
        })
        await order.save()

        msg.ack()
    }
}