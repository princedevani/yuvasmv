const bcrypt = require("bcryptjs");
// const User = require("../../models/User");
const Member = require("../../models/Member");

exports.forgotPassword = async(req,res) => {
    try{
        const u = await Member.getMemberInfo(req.body.email);
        const isMatch = await bcrypt.compare(req.body.password, u.password);
        if(isMatch){
            throw new Error("Old password & Current password can't be same")
        }
        console.log("user data",u)
        const user = await Member.findOneAndUpdate({_id: u._id},{password: await bcrypt.hash(req.body.password, 8)},{returnDocument: 'after'})
        await user.save()
        res.status(200).send({})
    }catch(error){
        console.log("errror",error)
        res.send({error: error.message})
    }
}