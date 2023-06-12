const User = require('../../models/User')

exports.login= async (req,res) => {

    try{
        const user = await User.findByCredentials(req.body.userid, req.body.password)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
        console.log("completed login...",user)
    }catch(error){
        // console.log("....",user)
        res.send({error: error.message})
    }

}