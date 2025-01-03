import { OrderStatus } from "@jpbs/common"
import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from "mongoose-update-if-current"

interface OrderAttributes {
    id: string
    userId: string
    status: OrderStatus
    version: number
    price: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attributes: OrderAttributes): OrderDoc
}

interface OrderDoc extends mongoose.Document {
    userId: string
    status: OrderStatus
    price: number
    version: number
}

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus)
    }
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
OrderSchema.statics.build = (attributes: OrderAttributes) => new Order({
    _id: attributes.id,
    version: attributes.version,
    price: attributes.price,
    userId: attributes.userId,
    status: attributes.status
})
const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema)

export { Order }

