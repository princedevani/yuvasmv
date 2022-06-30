const Member = require("../../models/Member")
const bcrypt = require("bcryptjs");

exports.changePassword = async(req,res) => {
    try{
        if(req.body.oldpassword===req.body.password){
            throw new Error("Old password & Current password can't be same")
        }
        
        const m = await Member.getMemberById(req.user._id);
        const isMatch = await bcrypt.compare(req.body.oldpassword, m.password)
        if(isMatch){
            const user = await Member.findOneAndUpdate({_id: req.user._id},{password: await bcrypt.hash(req.body.password, 8)},{returnDocument: 'after'})
            await user.save()
        }else{
            throw new Error("Old password doesn't match. Please type correct password !")
        }

        res.status(200).send()
    }catch(error){
        res.send({error: error.message})
    }
}
