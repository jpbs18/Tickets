import { Message } from "node-nats-streaming"
import { Listener } from "../../../common/src/events/base-listener"
import { TicketCreatedEvent } from "../../../common/src/events/ticket-created-event"
import { Subject } from "../../../common/src/events/subjects"

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    public readonly subject = Subject.TicketCreated
    public queueGroupName = 'payments-service'

    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log(`Event data: ID: ${data.id} - Title: ${data.title} - Price: ${data.price}`)
        msg.ack()
    }    
}