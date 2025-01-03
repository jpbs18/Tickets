import request from "supertest"
import { app } from '../../app'
import { Ticket } from "../../models/ticket"
import { natsWrapper } from "../../nats-wrapper"

describe('New Ticket API', () => {
    const ticketsEndpoint = '/api/tickets'

    it('has a route handler listening to /api/tickets for post requests', async () => {
        const response = await request(app)
            .post(ticketsEndpoint)
            .send({})
        
        expect(response.status).not.toEqual(404)
    })

    it('can only be accessed if user is signed in', async () => {
        await request(app)
            .post(ticketsEndpoint)
            .send({})
            .expect(401)
    })

    it('returns status different of 401 when user is signed in', async () => {
        const response = await request(app)
            .post(ticketsEndpoint)
            .set('Cookie', signin())
            .send({})

        expect(response.status).not.toEqual(401)
    })

    it('returns an error if invalid title is provided', async () => {
        await request(app)
            .post(ticketsEndpoint)
            .set('Cookie', signin())
            .send({ title: '', price: 100 })
            .expect(400)      
    })

    it('returns an error if invalid price is provided', async () => {
        await request(app)
            .post(ticketsEndpoint)
            .set('Cookie', signin())
            .send({ title: 'Ticket', price: -10.0 })
            .expect(400)
    })

    it('creates a ticket with valid inputs', async () => {
        await request(app)
            .post(ticketsEndpoint)
            .set('Cookie', signin())
            .send({ title: 'Ticket', price: 10.0 })
            .expect(201)

        const tickets = await Ticket.find({})
        
        expect(tickets.length).toEqual(1)
        expect(tickets[0].title).toEqual('Ticket')
        expect(tickets[0].price).toEqual(10.0)
    })

    it('publishes an event', async () => {
        await request(app)
            .post(ticketsEndpoint)
            .set('Cookie', signin())
            .send({ title: 'Ticket', price: 10.0 })
            .expect(201)

        expect(natsWrapper.client.publish).toHaveBeenCalled()
    })
})