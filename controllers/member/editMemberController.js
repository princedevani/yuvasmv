const Member = require("../../models/Member");

exports.editMember = async(req,res) => {
    try{
        const member = await Member.findById(req.params.id)
        const updated_member = await Member.findByIdAndUpdate(req.params.id, req.body,{new: true})
        if(updated_member.membertype==="admin"){
            await Member.updateMany({mentor: member.fullname},{mentor:updated_member.fullname})
        }else if(member.membertype==="groupleader"){
            await Member.updateMany({groupleader: member.fullname},{groupleader:updated_member.fullname})
        }
        res.status(201).send(member)
    }catch(error){
        res.send({error: error.message})
    }
}