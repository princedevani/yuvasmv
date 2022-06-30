const User = require('../../models/User')

exports.logout = async(req,res) =>{
    try{
        const updated_tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await User.findOneAndUpdate({email: req.user.email},{tokens: updated_tokens})    
        res.status(200).send()
    }catch(error){
        res.send({error: error.message})
    } 
}

exports.logoutAll = async(req,res) =>{
    try{
        await User.findOneAndUpdate({email: req.user.email},{tokens: []})
        res.status(200).send()
    }catch(error){
        res.send({error: error.message})
    }   
}