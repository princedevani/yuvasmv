const Member =  require('../models/Member')

exports.userLogout = async(req,res) =>{
    try{
        const updated_tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await Member.findOneAndUpdate({email: req.user.email},{tokens: updated_tokens})
        res.status(200).send()
    }catch(error){
        res.send({error: error.message})
    } 
}

exports.userLogoutAll = async(req,res) =>{
    try{
        await Member.findOneAndUpdate({email: req.user.email},{tokens: []}) 
        res.status(200).send()
    }catch(error){
        res.send({error: error.message})
    }   
}