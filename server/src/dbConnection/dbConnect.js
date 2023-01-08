const mongoose = require('mongoose');
const dotenv = require("dotenv")
dotenv.config({path : "../../../config.env"})
mongoose.set('strictQuery', true);

const connectDB = async() => {
    try{
        // console.log(process.env.dbURI)
        const connect = await mongoose.connect( process.env.dbURI ,
            {
                useNewUrlParser : true,
                useUnifiedTopology : true
            })
        
            console.log(`DB connected successfully `)
    }
    catch(err){
        console.log("DB connection error : "+ err)
    }
}

module.exports = connectDB;