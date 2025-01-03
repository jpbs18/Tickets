import { Publisher, OrderCreatedEvent, Subject } from "@jpbs/common"

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    public readonly subject = Subject.OrderCreated;
}