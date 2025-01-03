import { Subject, Publisher, ExpirationCompleteEvent } from "@jpbs/common"

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    public readonly subject = Subject.ExpirationComplete
}