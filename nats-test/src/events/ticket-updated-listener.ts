import { Message } from "node-nats-streaming"
import { Listener } from "../../../common/src/events/base-listener"
import { TicketUpdatedEvent } from "../../../common/src/events/ticket-updated-event"
import { Subject } from "../../../common/src/events/subjects"

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    public readonly subject = Subject.TicketUpdated
    public queueGroupName = 'payments-service'

    onMessage(data: TicketUpdatedEvent['data'], msg: Message): void {
        console.log(`Event data: ID: ${data.id} - Title: ${data.title} - Price: ${data.price}`)
        msg.ack()
    }    
}