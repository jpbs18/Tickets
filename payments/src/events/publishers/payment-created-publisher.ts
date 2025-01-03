import { PaymentCreatedEvent, Publisher, Subject } from "@jpbs/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    public readonly subject = Subject.PaymentCreated
}