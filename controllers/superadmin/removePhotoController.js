const cloudinary = require("../../utils/cloudinary")
const Photo = require("../../models/Photo")

exports.removePhoto= async (req,res) => {
    
    try{

        let photo_id = req.params.id
        const deleted_photo = await Photo.findByIdAndDelete({_id: photo_id})

        if(deleted_photo){
            await cloudinary.uploader.destroy(deleted_photo.pid)
            res.sendStatus(200)
        }else{
            throw new Error("Photo is not present")
        }


    }catch(error){
        res.send({error: error.message})
    }
    
}