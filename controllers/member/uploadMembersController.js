const readXlsxFile = require('read-excel-file/node')
const validator = require('validator');
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const Member = require('../../models/Member')

function generatePassword() {
    var length = 10,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

async function validateData(name,value,member){

    let temp = true

    switch(name){

        case "email":
            if (!validator.isEmail(value)) {
                temp = {email: `Email id (${value}) is not valid`}
            } else {
                let checkMember = await Member.checkMember(value);
                if(checkMember){temp = {email: `Email ${value} already exist`}}
            }
            break;

        case "mobile":
            if(!validator.isNumeric(String(value))){
                temp = {mobile: `Mobile Number (${value}) is not valid`}
            }else if(!validator.isLength(String(value), {min: 10,max:10})){
                temp = {mobile: `Mobile Number (${value}) does not have 10 characters`}
            }else {
                checkMember = await Member.checkMember(String(value));
                if(checkMember){temp = {mobile: `Mobile Number (${value}) already exist`}}
            }
            break;

        case "zipcode":
            if(!validator.isNumeric(String(value))){
                temp = {zipcode: `Zipcode (${value}) should contain only numeric character`}
            }else if(!validator.isLength(String(value), {min: 6,max:6})){
                temp = {zipcode: `Zipcode (${value}) should be of 6 numbers only`}
            }
            break;

        case "groupleader":
            if(member.membertype==="admin" || member.membertype==="groupleader"){
                if(value!==null){
                    temp = {groupleader: `No need to assign groupleader (${value}) to ${member.membertype}`}
                }
            }else if(member.membertype==="member"){
                if(value!==null){
                    const g = await Member.find({membertype: "groupleader",fullname:value});
                    if(g.length===0){
                        temp = {groupleader: `Groupleader (${value}) is not present`}
                    }
                }else{
                    temp = {groupleader: `Groupleader can't be empty for member`}
                }
            }
            break;

        case "mentor":
            if(member.membertype==="admin"){
                if(value!==null){
                    temp = {mentor: `No need to assign mentor (${value}) to admin`}
                }
            }else if(member.membertype==="groupleader" || member.membertype==="member"){
                if(value!==null){
                    let a = await Member.find({membertype: "admin",fullname:value});
                    if(a.length===0){
                        temp = {mentor: `Mentor (${value}) is not present`}
                    }
                }else{
                    temp = {mentor: `Mentor can't be empty for ${member.membertype}`}
                }
            }
            break;

        default:
            if(name!=="address2" && value===null){
                temp = {[name]:  `${name.charAt(0).toUpperCase()}${name.slice(1)} field can't be empty`}
            }
            break;
    }
    return temp;

}

exports.uploadMembers = async(req,res) => {
    try{

        const readfile = await readXlsxFile(req.file.path)
        const real_header = ["fullname", "email", "mobile", "memberid", "birthdate", "membertype", "groupleader", "mentor", "address", "address2", "city", "zipcode", "state"]
        let header = readfile[0]
        header = header.map(col => {
            return col.toLowerCase();
        });

        let header_fault = []
        let members = {}
        let ordered_header = []

        for (let i = 0; i < real_header.length; i++) {
            const col = real_header[i];
            if(header.includes(col)) {
                continue;
            }else{
                header_fault = [...header_fault, col]
            }
        }

        if(header_fault.length!==0){
            await unlinkAsync(req.file.path)
            res.status(201).send({header : header_fault, members})
            return
        }else{
            for(let i = 0; i < real_header.length; i++){
                if(header.includes(real_header[i])){
                    ordered_header = [...ordered_header, real_header[i]]
                }
            }
        }

        for (let index = 1; index < readfile.length; index++) {
            var member = {}
            const data = readfile[index];   
            let errors = ""
            const ordered_data=[]
            for(let j=0; j < ordered_header.length; j++){
                ordered_data.push(data[header.indexOf(ordered_header[j])])
            }
            for (let i = 0; i < ordered_data.length; i++) {
                const flag = await validateData(ordered_header[i],ordered_data[i],member)
                if(flag===true){
                    member = {
                        ...member,
                        [ordered_header[i]]: ordered_data[i]
                    }
                }else{
                    errors += `${flag[ordered_header[i]]},  `
                }
            }

            if(errors.length!==0){
                members = {
                    ...members,
                    [member.fullname]: errors
                } 
                continue;
            }

            member = {...member,"password": generatePassword()}
            console.log("member...".member)
            const m = new Member(member)
            await m.save()
        }
        
        await unlinkAsync(req.file.path)
        if(members!=={}){
            res.status(201).send({members,header : header_fault})
        }else{
            res.status(200).send()
        }

    }catch(error){ 
        res.send({error: error.message})
    }
}