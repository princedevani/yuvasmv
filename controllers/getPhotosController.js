const Photo = require('../models/Photo')

exports.getPhotos= async (req,res) => {

    try{

        const photos = await Photo.find({})
        if(photos){
            res.status(201).send({photos})
        }else{
            throw new Error("No Photos Found")
        }

    }catch(error){
        res.send({error: error.message})
    }

}