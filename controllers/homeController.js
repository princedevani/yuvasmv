const Member = require('../models/Member');

exports.userHome = async(req,res) => {
    try{
        let user = await Member.getMemberById(req.user._id)
        res.status(201).send({user})

    }catch(error){
        res.send({error: error.message})
    }
}