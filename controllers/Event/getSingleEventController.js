const Event = require('../../models/Event')

exports.getSingleEvent = async(req, res) => {
    try{
        const event = await Event.findById(req.params.id)
        res.status(201).send(event)
    }catch(error){
        res.send({error: error.message})
    }
}
