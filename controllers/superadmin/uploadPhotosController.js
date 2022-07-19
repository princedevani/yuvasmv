const cloudinary = require("../../utils/cloudinary")
const fs = require('fs')
const { promisify } = require('util')
const Photo = require("../../models/Photo")
const unlinkAsync = promisify(fs.unlink)

exports.uploadPhotos= async (req,res) => {
    
    try{

        for (let index = 0; index < req.files.length; index++) {
            const element = req.files[index].path;
            const image = await cloudinary.uploader.upload(element,{folder: 'eventphotos'})
            const photo = {pid: image.public_id, purl: image.secure_url, thumbnail: image.secure_url.replace("/image/upload","/image/upload/c_fill,w_300,h_300")}
            const p = new Photo(photo)
            await p.save()
            await unlinkAsync(element)
        }

        res.sendStatus(200)

    }catch(error){
        res.send({error: error.message})
    }
    
}