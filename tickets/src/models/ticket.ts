import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketAttributes {
    title: string
    price: number
    userId: string
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attributes: TicketAttributes): TicketDoc
}

interface TicketDoc extends mongoose.Document {
    title: string
    price: number
    userId: string
    version: number
    orderId?: string
}

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String
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

TicketSchema.statics.build = (attributes: TicketAttributes) => new Ticket(attributes)
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema)

export { Ticket }