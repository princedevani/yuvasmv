const Member = require("../../models/Member");

exports.editMember = async(req,res) => {
    try{
        const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new:
            true, runValidators: true })
        res.status(201).send(member)
    }catch(error){
        res.send({error: error.message})
    }
}