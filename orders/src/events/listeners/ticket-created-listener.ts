import { Message } from "node-nats-streaming"
import { Ticket } from "../../models/ticket"
import { Subject, Listener, TicketCreatedEvent } from "@jpbs/common"
import { queuGroupName } from "./queue-group-name"

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    public readonly subject = Subject.TicketCreated
    public readonly queueGroupName = queuGroupName

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data 
        const ticket = Ticket.build({ id, title, price })   
        await ticket.save()
        
        msg.ack()
    }  
}