const mongoose = require("mongoose")

const userModel = mongoose.Schema({
    firstName : String,
    lastName : String,
    phoneNumber : Number
})

module.exports = mongoose.model("users" , userModel )