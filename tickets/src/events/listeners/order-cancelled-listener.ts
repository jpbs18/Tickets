import { Listener, OrderCancelledEvent, Subject } from "@jpbs/common";
import { Message } from "node-nats-streaming";
import { queuGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    public readonly subject = Subject.OrderCancelled;
    public readonly queueGroupName = queuGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id)
        if(!ticket){
            throw new Error('Ticket not found')
        }

        ticket.set({ orderId: undefined })
        await ticket.save()
        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            orderId: ticket.orderId,
            userId: ticket.userId,
            price: ticket.price,
            title: ticket.title,
            version: ticket.version
        })

        msg.ack()
    }
}