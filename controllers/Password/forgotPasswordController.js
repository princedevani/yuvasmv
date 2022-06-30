const bcrypt = require("bcryptjs");
const User = require("../../models/User");

exports.forgotPassword = async(req,res) => {
    try{
        const u = await User.getUserInfo(req.body.userid);
        const isMatch = await bcrypt.compare(req.body.password, u.password);
        if(isMatch){
            throw new Error("Old password & Current password can't be same")
        }
        const user = await User.findOneAndUpdate({_id: u._id},{password: await bcrypt.hash(req.body.password, 8)},{returnDocument: 'after'})
        await user.save()
        res.status(200).send()
    }catch(error){
        res.send({error: error.message})
    }
}