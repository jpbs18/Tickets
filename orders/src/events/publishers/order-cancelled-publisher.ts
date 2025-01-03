import { Publisher, OrderCancelledEvent, Subject } from "@jpbs/common"

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    public readonly subject = Subject.OrderCancelled;
}