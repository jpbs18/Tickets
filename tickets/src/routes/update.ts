import express, { Request, Response }  from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError, BadRequestError } from "@jpbs/common"
import { Ticket } from '../models/ticket'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.put('/api/tickets/:id', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required.'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive amount.')
], validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body

    const ticket = await Ticket.findById(req.params.id)
    if(!ticket){
        throw new NotFoundError()
    }

    if(ticket.orderId) {
        throw new BadRequestError('Cannot edit a reserved ticket.')
    }

    if(ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    ticket.set({ title, price })
    await ticket.save()
    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        version: ticket.version,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.id
    })

    res.status(200).send(ticket)
})

export { router as updateTicketRouter }