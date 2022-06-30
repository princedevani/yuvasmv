

const User = require('../../models/User')

exports.signup= async (req,res) => {
    
    try{
        const checkUser = await User.checkUser(req.body.email);
        if(checkUser){
            throw new Error("User with this email already exist. Please use different one !!")
        }
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(error){
        res.send({error: error.message})
    }
    
}