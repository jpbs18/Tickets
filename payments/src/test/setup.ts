import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

declare global {
  var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper')
process.env.STRIPE_KEY = 'sk_test_51QcPcSAHXuFD7wENVs8rx0rMdWN8U9xg2aAaCODAh8jjb7JTMPMYbRB3XttreNb9VtvlqT0gk5beQONdXDvNTale00CJ0GcPLY'
let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "sdfgs4gfg4fggbnki"

  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
  jest.clearAllMocks()

  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) {
      await collection.deleteMany({})
    }
  }
})

afterAll(async () => {
  if (mongo) {
    await mongo.stop()
  }
  await mongoose.connection.close()
})

global.signin = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const sessiontJSON = JSON.stringify({ jwt: token })
  const base64 = Buffer.from(sessiontJSON).toString('base64')

  return [`session=${base64}`]
}