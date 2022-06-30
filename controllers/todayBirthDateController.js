const Member = require("../models/Member")
const { startOfDay, endOfDay } = require("date-fns")

exports.getBirthDate = async (req,res) => {
    try{
        let today = new Date()
        const users = await Member.find({birthdate: {$gte: startOfDay(today), $lte: endOfDay(today)}}).sort({"fullname":"asc"})
        res.status(201).send(users)
    }catch(error){
        res.send({error:error.message})
    }
}