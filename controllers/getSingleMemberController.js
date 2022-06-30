const Member = require('../models/Member');

exports.getSingleMember = async(req,res) => {
    try{
        const member = await Member.findById(req.params.id)
        if(!member){
            throw new Error("User not found !!")
        }
        res.status(201).send({member})
    }catch(error){
        res.send({error: error.message})
    }
}