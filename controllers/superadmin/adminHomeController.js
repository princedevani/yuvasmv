const User = require('../../models/User')

exports.home = async(req,res) => {
    try{
        let user = await User.getUserById(req.user._id)
        res.status(201).send({user})
    }catch(error){
        res.send({error: error.message})
    }
}