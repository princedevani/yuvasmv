const { findByIdAndDelete } = require("../../models/Event")
const Event = require("../../models/Event")
const cloudinary = require("../../utils/cloudinary")

exports.deleteEvent = async(req, res) => {
    try{
        
        const event = await Event.findById(req.params.id)

        if(event){
            for(i in event.files){
                const file = event.files[i]
                await cloudinary.uploader.destroy(file.pid)
            }
            await Event.findByIdAndDelete(req.params.id)
        }else{
            throw new Error("Event Not Found")
        }
        res.status(200).send()

    }catch(error){
        res.send({error: error.message})
    }
}