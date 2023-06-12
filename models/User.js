const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "yuvasmv";

const userSchema = new mongoose.Schema({

    fname: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isLength(value,{min:3})){
                throw new Error("First name atleast have 3 letters")
            }
        }
    },
    lname: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Enter a valid email address")
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type:String,
            required: true
        }
    }]

})

userSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async(userid, password) => {
    const user = await User.findOne({email: userid})
    if(!user){
        throw new Error('There is no account with given email address. Please register first to login !')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error("The entered password is incorrect")
    }
    return user
}

userSchema.statics.getUserInfo = async (userid) => {
    console.log("data,,,,>",userid)
    const user = await User.findOne({ email: userid })
  console.log("data,,,,>",user)
    if (!user) {
      throw new Error("User is not present");
    }
    return user;
  };

userSchema.statics.getUserById = async(_id) =>{

    const user = await User.findById({_id})
    if(!user){
        throw new Error('User is not present')
    }
    return user
}

userSchema.statics.checkUser = async(data) =>{
    const user = await User.findOne({email: data})
    return user ? true : false
}

const User = mongoose.model('User',userSchema)

module.exports = User