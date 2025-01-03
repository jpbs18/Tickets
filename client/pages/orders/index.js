export default function OrderIndex({ orders }) {
    return <ul>
        {orders.map(order => {
            return <li key={order.key}>
                {order.ticket.title} - {order.status}
            </li>
        })}
    </ul>
}

OrderIndex.getInitialProps = async(useContext, client) => {
    const { data } = await client.get('/api/orders')
    return { orders: data }
}