import { OrderStatus } from "@jpbs/common";
import mongoose from "mongoose";
import { TicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttributes {
    userId: string
    status: OrderStatus
    expiresAt: Date
    ticket: TicketDoc
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attributes: OrderAttributes): OrderDoc
}

interface OrderDoc extends mongoose.Document {
    userId: string
    status: OrderStatus
    expiresAt: Date
    ticket: TicketDoc
    version: number
}

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    },
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id
            delete ret._id
        }
    }
})

OrderSchema.set('versionKey', 'version')
OrderSchema.plugin(updateIfCurrentPlugin)
OrderSchema.statics.build = (attributes: OrderAttributes) => new Order(attributes)
const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema)

export { Order }