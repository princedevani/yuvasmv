const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const User = require("../models/User")
const JWT_SECRET = "yuvasmv";

exports.auth = async (req, res, next) => {
    try{

        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, JWT_SECRET)
        let user;
        user = await User.findOne({_id:decoded._id, 'tokens.token': token})
        if(!user){
            user = await Member.findOne({_id:decoded._id, 'tokens.token': token})
            if(!user){
                throw new Error()
            }
        }

        req.token = token
        req.user = user
        next()
        
    }catch(e){
        res.status(401).send({error: "Please authenticate...!!!"})
    }
}
