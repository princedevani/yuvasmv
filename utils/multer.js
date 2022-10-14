// const multer = require('multer');
// const fs = require('fs-extra');

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       if(file.originalname.includes(".xlsx")){
//         fs.mkdirsSync("./excel")
//         cb(null, './excel')
//       }else{
//         fs.mkdirsSync("./photos")
//         cb(null, './photos')
//       }
      
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname)
//     }
// })

// exports.upload = multer({ storage: storage })