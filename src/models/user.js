import mongoose from 'mongoose'
import validator from 'validator'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    status:{
        type:String,
        required:false,
        default:'user'
    },
    email:{
        type:String,
        toLowerCase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email!!!')
            }
        }
    }
}
)

const User = new mongoose.model('User', userSchema)
export default User