const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        trim: true,
        required: [true, 'please tell us your name'],
        unique: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase:true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type:String,
        required: true,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain password')
            }
            if(value.length < 8 ){
                throw new Error('Password has to have a minimum length of 7')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required:true
        }
    }]
})

userSchema.plugin(uniqueValidator)

//this deletes all the information associated with user when user is deleted
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//generate auth token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//this finds the username and password and compares it to the database
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//Hash password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User
