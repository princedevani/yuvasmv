const Member = require("../../models/Member");
const cloudinary = require("../../utils/cloudinary")

exports.deleteMember = async(req,res) => {
    try{

        const member = await Member.findById(req.params.id)
        if(member){
            if(member.profile.pid!=="default-profile/blank-profile_ppt6u7"){
                await cloudinary.uploader.destroy(member.profile.pid)
                await Member.findOneAndDelete(req.params.id)
            }else{
                await Member.findOneAndDelete(req.params.id)
            }
        }else{
            throw new Error("User not found !")
        }

        res.status(201).send(member)
    }catch(error){
        res.send({error: error.message})
    }
}