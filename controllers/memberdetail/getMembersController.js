const Member = require("../../models/Member")

function findData(data) {

    let q = [{membertype: "member"}]
    if(data.mentor){
        let m = []
        data.mentor.forEach(element => {
            m.push({"mentor": element})
        });
        q.push({$or: m})
    }
    if(data.groupleader){
        let g = []

        for (let index = 0; index < data.groupleader.length; index++) {
            const element = data.groupleader[index];
            g.push({"groupleader": element})
        }
        q.push({$or: g})
    }
    return q
}

exports.getMembers = async(req,res) => {
    try{
        let q = req.body.length===0 ? {} : {$and : findData(req.body)}
        const list = await Member.find(q).sort({"fullname":"asc"})
        res.status(201).send({list})
    }catch(error){
        res.send({error: error.message})
    }
}


// data = {
//     mentor: ["m1","m2",'m3"],
//     groupleader: ["gl1","gl2"]
// }

// //members
// $and: [
//     {membertype: "member"},
//     {$or:[
//         {mentor: "m1"},
//         {mentor: "m2"},
//         {mentor: "m3"}
//     ]},
//     {$or:[
//         {groupleader: "gl1"},
//         {groupleader: "gl2"}
//     ]}
// ]

// //groupleaders
// $and: [
//     {membertype: "groupleader"},
//     {$or:[
//         {mentor: "m1"},
//         {mentor: "m2"},
//         {mentor: "m3"}
//     ]},
// ]