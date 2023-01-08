const mongoose = require("mongoose")

const messageModel = mongoose.Schema({
    text : String,
    recieverName : String,
    recieverPhoneNumber : String,
    OTP : Number,
    dateTime : {
        type : Date,
        default : Date.Now
    }

})

module.exports = mongoose.model("sentMessage" , messageModel)