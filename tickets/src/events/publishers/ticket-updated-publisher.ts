import { Publisher, Subject, TicketUpdatedEvent } from '@jpbs/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    public readonly subject = Subject.TicketUpdated; 
}