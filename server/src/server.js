const express = require("express")
const dotenv = require("dotenv")
const Routes = require("./routes/route")
const connectDB = require("./dbConnection/dbConnect")
const path = require("path")

const app = express()
app.use( express.json() )
app.use(express.urlencoded({ extended: false }));
app.use(express.static( path.join(__dirname , '../client')))
app.set('view engine' , 'pug')
dotenv.config({path : "./config.env"})
connectDB()

app.get("/home" , (req,res)=>{
    res.sendFile( path.join(__dirname , "../client/index.html"))
})

app.use("/" , Routes)

PORT = process.env.PORT
app.listen( PORT , (err)=>{
    if( err ) 
        console.log("Error starting server : " + err)
    else
        console.log(`Server running at http://localhost:${8000}/`)
})