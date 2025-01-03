import { Publisher, Subject, TicketCreatedEvent } from '@jpbs/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    public readonly subject = Subject.TicketCreated; 
}