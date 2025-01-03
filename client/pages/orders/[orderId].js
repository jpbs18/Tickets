import { useEffect, useState } from 'react'
import useRequest from '../../hooks/useRequest';
import StripeCheckout from 'react-stripe-checkout'
import Router from 'next/router'

export default function ShowOrder({ order, currentUser }){
    const [timeLeft, setTimeLeft] = useState(0)
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
    })

    useEffect(() => {
        const findTimeLeft = () => {
            const secondsLeft = (new Date(order.expiresAt) - new Date()) / 1000
            setTimeLeft(Math.round(secondsLeft))
        }

        findTimeLeft()
        const timerId = setInterval(findTimeLeft, 1000)
        return () => clearInterval(timerId)
    }, [])

    if(timeLeft < 0){
        return <div>Order expired.</div>
    }

    return <div>
        Time left to pay: {timeLeft} seconds.
        <StripeCheckout 
            token={({ id }) => doRequest({ token: id })} 
            stripeKey='pk_test_51QcPcSAHXuFD7wENb9tQsoAqGc0W16qj5Ne6aWgfQePfl1nJyDmX3uM1xkVdbqj346XveW9CRVuHJBJbjUSovRWL00xL4LCjUl'
            amount={order.ticket.price * 100}
            email={currentUser.email}
        />
        {errors}
    </div>
}

ShowOrder.getInitialProps = async(context, client) => {
    const { orderId } = context.query
    const { data } = await client.get(`/api/orders/${orderId}`)
    return { order: data }
}