import express from 'express'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import 'express-async-errors'
import { NotFoundError, errorHandler, currentUser } from '@jpbs/common'
import { indexOrderRouter } from './routes'
import { newOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'
import { deleteOrderRouter } from './routes/delete'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({ 
    signed: false, 
    secure: false
}))

app.use(currentUser)
app.use(indexOrderRouter)
app.use(newOrderRouter)
app.use(showOrderRouter)
app.use(deleteOrderRouter)
app.all('*', async () => { throw new NotFoundError() })
app.use(errorHandler)

export { app }