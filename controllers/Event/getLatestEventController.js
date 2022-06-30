const Event = require('../../models/Event')

exports.getLatestEvent = async(req, res) => {
    try{
        const today = new Date()
        const events = await Event.find({$and:[{startdate: {$lte: today}},{enddate: {$gte: today}}]})
        res.status(201).send({events: events})
    }catch(error){
        res.send({error: error.message})
    }
}
