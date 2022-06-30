const mongoose = require("mongoose");


const eventSchema = new mongoose.Schema({
    startdate:{
        type: Date,
        required: true
    },
    enddate:{
        type: Date,
        required: true,
        default: Date.now()
    },
    title:{
        type: String,
        require: true
    },
    message:{
        type: String,
        required: true
    },
    photos: [{
        pid:{
          type: String,
        },
        purl:{
          type: String,
        },
        thumbnail:{
          type: String,
        }
    }] 
});


const Event = mongoose.model("Event", eventSchema);
module.exports = Event;