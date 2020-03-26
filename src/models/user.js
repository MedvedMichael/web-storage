const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    nickname: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true,
        default: 'user'
    },
    email: {
        type: String,
        required: true,
        toLowerCase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    ban:{
        type: Boolean,
        required: true,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user)
        throw new Error('Unable to log in')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
        throw new Error('Unable to log in')

    return user
}



userSchema.methods.generateAuthToken = async function () {
    try {
        const user = this
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '30 minutes'})
        user.tokens = user.tokens.concat({ token })
        await user.save()
        return token
    }
    catch (error) {
        console.log(error)
    }
}


userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8)

    next()
})



const User = new mongoose.model('User', userSchema)
module.exports = User