import { Message } from "node-nats-streaming"
import { Ticket } from "../../models/ticket"
import { Subject, Listener, TicketUpdatedEvent } from "@jpbs/common"
import { queuGroupName } from "./queue-group-name"

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    public readonly subject = Subject.TicketUpdated
    public readonly queueGroupName = queuGroupName

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {     
        const ticket = await Ticket.findByEvent(data)
        if(!ticket){
            throw new Error('Ticket not found.')
        }

        const { title, price } = data;
        ticket.set({ title, price });
        await ticket.save();
        
        msg.ack()
    }  
}