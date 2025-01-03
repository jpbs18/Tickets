import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth } from '@jpbs/common'
import { Order } from '../models/order'

const router = express.Router()

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
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

    res.status(200).send(order)
})

export { router as showOrderRouter }