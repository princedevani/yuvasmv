const Member = require("../../models/Member")

exports.getAdmins = async(req,res) =>{
    try{
        const list = await Member.find({membertype: "admin"}).sort({"fullname":"asc"})
        res.status(201).send(list)
    }catch(error){
        res.send({error: error.message})
    }
}