import { Password } from './../services/password';
import mongoose from 'mongoose'

interface UserAttributes {
    email: string
    password: string
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attributes: UserAttributes): UserDoc
}

interface UserDoc extends mongoose.Document {
    email: string
    password: string
}

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id
            delete ret._id
            delete ret.password
            delete ret.__v
        }
    }
})

UserSchema.pre('save', async function(done){
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'))
        this.set('password', hashed)
    }

    done()
})

UserSchema.statics.build = (attributes: UserAttributes) => new User(attributes)
const User = mongoose.model<UserDoc, UserModel>('User', UserSchema)

export { User }