const mongoose = require("mongoose");


const photoSchema = new mongoose.Schema({
    pid:{
        type: String,
    },
    purl:{
        type: String,
    },
    thumbnail:{
        type: String,
    }
});


const Photo = mongoose.model("Photo", photoSchema);
module.exports = Photo;