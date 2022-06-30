const Member = require("../../models/Member");

exports.deleteMember = async(req,res) => {
    try{
        const member = await Member.findOneAndDelete({_id:req.params.id})
        if(!member){
            throw new Error("User not found !!")
        }
        res.status(201).send({member})
    }catch(error){
        res.send({error: error.message})
    }
}