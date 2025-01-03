import { Ticket } from "../ticket";

describe('Concurrency control', () => {
    it('implements optimistic concurrency control', async () => {
        const ticket = Ticket.build({ title: 'Concert', price: 70, userId: '123' })
        await ticket.save()

        const firstInstance = await Ticket.findById(ticket.id)
        const secondInstance = await Ticket.findById(ticket.id)

        firstInstance!.set({ price: 120 })
        secondInstance!.set({ price: 90 })

        await firstInstance!.save()
        await expect(secondInstance!.save()).rejects.toThrow();
    })

    it('increments the version number on multiple saves', async () => {
        const ticket = Ticket.build({ title: 'Concert', price: 70, userId: '123' })

        await ticket.save()
        expect(ticket.version).toEqual(0)

        await ticket.save()
        expect(ticket.version).toEqual(1)

        await ticket.save()
        expect(ticket.version).toEqual(2)
    })
})