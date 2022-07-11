const readXlsxFile = require('read-excel-file/node')
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

exports.uploadMembers = async(req,res) => {
    try{

        const readfile = await readXlsxFile(req.file.path)
        const real_header = ["fullname", "memberid", "email", "mobile", "birthdate", "membertype", "groupleader", "mentor", "address", "address2", "city", "zipcode", "country", "state"]
        let header = readfile[0]
        header = header.map(col => {
            return col.toLowerCase();
          });

        let header_fault = []
        let members = {}
        for (let i = 0; i < real_header.length; i++) {
            const col = real_header[i];
            if(header.includes(col)) {
                continue;
            }else{
                header_fault = [...header_fault, col]
            }
        }

        if(header_fault.length!==0){
            res.status(201).send({header : header_fault, members})
            return
        }

        for (let index = 1; index < readfile.length; index++) {
            var member = {}
            const data = readfile[index];   
            for (let i = 0; i < data.length; i++) {
                member = {
                    ...member,
                    [header[i]]: data[i]
                }
            }

            let checkMember = await Member.checkMember(member.email);
            if(checkMember){
                members = {
                    ...members,
                    [member.fullname]: member.email
                }
                continue;
            }else{
                checkMember = await Member.checkMember(String(member.mobile));
                if(checkMember){
                    members = {
                        ...members,
                        [member.fullname]: member.mobile
                    }
                    continue;
                }
            }
            member = {...member,"password": generatePassword()}
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