const Member = require('../../models/Member');
const twilio = require('twilio');
const dotenv = require("dotenv");
dotenv.config({path:"config/config.env"})

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


function generatePassword() {
    var length = 10,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

exports.createMember = async (req,res) =>{

    try{
        const checkMember = await Member.checkMember(req.body.email);
        if(checkMember){
            throw new Error("Member with this email already exist. Please use different one !!")
        }
        let newMember = req.body;
        newMember = {...newMember,["password"]: generatePassword()}
        const member = new Member(newMember)
        await member.save()

        // const mobile = `+91${newMember.mobile}`
        // const message = `Your Id has been created. Please use this credentials for first time login.\nUserid: ${newMember.email}  Password: ${newMember.password}`

        // const notificationOpts = {
        // toBinding: JSON.stringify({
        //     binding_type: 'sms',
        //     address: mobile,
        // }),
        // body: message,
        // };
        
        // await client.notify.services(process.env.TWILIO_SMS_SERVICE).notifications.create(notificationOpts)

        res.status(201).send({newMember})

    }catch(error){
        res.send({error: error.message})
    }

}