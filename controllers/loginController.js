const Member = require('../models/Member')

exports.userLogin= async (req,res) => {

    try{
        const user = await Member.findByCredentials(req.body.userid,req.body.password)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(error){
        res.send({error: error.message})
    }

}