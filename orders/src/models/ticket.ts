import { OrderStatus } from "@jpbs/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order } from "./order";

interface TicketAttributes {
    id: string
    title: string
    price: number
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attributes: TicketAttributes): TicketDoc
    findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>
}

export interface TicketDoc extends mongoose.Document {
    title: string
    price: number
    version: number
    isReserved(): Promise<boolean>
}

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id
            delete ret._id
        }
    }
})

TicketSchema.set('versionKey', 'version')
TicketSchema.plugin(updateIfCurrentPlugin)

TicketSchema.statics.build = (attributes: TicketAttributes) => new Ticket({ 
    _id: attributes.id, 
    title: attributes.title, 
    price: attributes.price 
})

TicketSchema.statics.findByEvent = (event: { id: string, version: number }) => Ticket.findOne({
    _id: event.id,
    version: event.version - 1
})

TicketSchema.methods.isReserved = async function() {
    const existingOrder = await Order.findOne({ 
        ticket: this, 
        status: { 
            $in: [
                OrderStatus.Created, 
                OrderStatus.AwaitingPayment, 
                OrderStatus.Complete
            ] 
        } 
    })

    return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema)

export { Ticket }