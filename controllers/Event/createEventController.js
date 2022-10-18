const Event = require("../../models/Event")
const cloudinary = require("../../utils/cloudinary")
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

exports.createEvent = async(req, res) => {
    try{
        console.log("req.file...",req.file)
        console.log("req.files...",req.files)
        let p_array = []
        for (let index = 0; index < req.files.length; index++) {
            const element = req.files[index].path;
            let image;
            let photo;
            if(req.files[index].mimetype.split("/")[0]==="image"){
                image = await cloudinary.uploader.upload(element,{folder: 'eventphotos'})
                photo = {pid: image.public_id, purl: image.secure_url, thumbnail: image.secure_url.replace("/image/upload","/image/upload/c_fill,w_300,h_300")}
            }else{
                image = await cloudinary.uploader.upload(req.files[0].path,{resource_type: "video",folder: 'eventphotos'})
                photo = {pid: image.public_id, purl: image.secure_url, thumbnail: image.secure_url}
            }
            p_array.push(photo)
            await unlinkAsync(element)
        }
        let temp = {
            startdate: req.body.startdate,
            enddate: req.body.enddate,
            title: req.body.title,
            message: req.body.message,
            photos: p_array
        }
        const event = await new Event(temp)
        await event.save()
        res.status(200).send()

    }catch(error){
        res.send({error: error.message})
    }
}