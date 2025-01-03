import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

declare global {
  var signin: () => string[];
}

jest.mock('../nats-wrapper')
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

global.signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const sessiontJSON = JSON.stringify({ jwt: token })
  const base64 = Buffer.from(sessiontJSON).toString('base64')

  return [`session=${base64}`]
}