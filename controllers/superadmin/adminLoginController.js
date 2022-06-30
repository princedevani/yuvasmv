const User = require('../../models/User')

exports.login= async (req,res) => {

    try{
        const user = await User.findByCredentials(req.body.userid, req.body.password)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(error){
        res.send({error: error.message})
    }

}