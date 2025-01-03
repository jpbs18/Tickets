import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus } from '@jpbs/common'
import { Order } from '../models/order'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.delete('/api/orders/:orderId', async(req: Request, res: Response) => {
    const { orderId } = req.params   
    if (!mongoose.isValidObjectId(orderId)) {
        throw new BadRequestError('Invalid order ID.')
    }

    const order = await Order.findById(orderId).populate('ticket')
    if(!order){
            throw new NotFoundError()
        }
    
    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError()
    }

    order.status = OrderStatus.Cancelled
    await order.save()

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id,
        }
    })

    res.status(204).send(order)
})

export { router as deleteOrderRouter }