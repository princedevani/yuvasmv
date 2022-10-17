const cloudinary = require("../utils/cloudinary")
const Member = require("../models/Member");
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

exports.uploadProfilePic = async(req,res) => {
    try{

        const image = await cloudinary.uploader.upload(req.file.path,{folder: 'profiles'})
        let profile = {pid: image.public_id, purl: image.secure_url}
        const member = await Member.findByIdAndUpdate(req.user._id, {profile: profile}, { new:
            true, runValidators: true })
        res.status(201).send(member)
        await unlinkAsync(req.file.path)
    }catch(error){ 
        res.send({error: error.message})
    }
}

exports.getProfilePic = async(req,res) => {
    try{
        const member = await Member.findById(req.user._id)
        res.status(201).send(member.profile.purl)
    }
    catch(error){
        res.send({error: error.message})
    }
}

exports.removeProfilePic = async(req,res) => {
    try{
        let profile = {
            pid: "default-profile/blank-profile_ppt6u7",
            purl: "https://res.cloudinary.com/karishma027/image/upload/v1655189955/default-profile/blank-profile_ppt6u7.webp"
        }
        const member = await Member.findByIdAndUpdate(req.user._id, {profile: profile}, { new:
            true})
        await cloudinary.uploader.destroy(member.profile.pid)
        res.status(201).send(member)
    }
    catch(error){
        res.send({error: error.message})
    }
}