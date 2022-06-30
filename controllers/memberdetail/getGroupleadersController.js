const Member = require("../../models/Member")

function findData(data) {
    let q = [{membertype: "groupleader"}]
    if(data.mentor){
        let m = []
        data.mentor.forEach(element => {
            m.push({"mentor": element})
        });
        q.push({$or: m})
    }
    return q
}

exports.getGroupLeaders = async(req,res) => {
    try{
        let q = req.body.length===0 ? {} : {$and : findData(req.body)}
        const list = await Member.find(q).sort({"fullname":"asc"})
        res.status(201).send({list})
    }catch(error){
        res.send({error: error.message})
    }
}