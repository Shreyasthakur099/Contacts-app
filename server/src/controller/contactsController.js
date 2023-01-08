const mongoose = require("mongoose")
const userModel = require("../models/userModel")
const path = require("path")

const getContactList = (req , res)=>{
    
    userModel.find( {} , (err, userList )=>{
        if(err)
        {
            console.log("Error in fetching Contact List : " + err)
            res.status(503).render(path.join( __dirname , "../../../client/views/Error.ejs") , {message : "Error getting Contact List"})
        }
        else{
            
            console.log("Contacts recieved successfully...")
            console.log("Contact List : " , userList)
            res.render( path.join(__dirname , "../../../client/views/contactListsPage.ejs") , 
                { userList : userList}
            )
        }
    })
}

const getContactinfo = (req,res)=>{
    userModel.find( {_id : req.body.userID} , (err, userData )=>{
        if(err)
        {
            console.log("Error in fetching Contact Info : " + err)
            res.status(503).render(path.join( __dirname , "../../../client/views/Error.ejs") , {message : "Error getting Contact Info"})
        }
        else{
            
            console.log("User Info recieved successfully...")
            console.log("User details : " , userData)
            res.render( path.join(__dirname , "../../../client/views/contactInfoPage.ejs") , 
                { userData : userData}
            )
        }
    })
}

const contactsController = { 
    getContactList ,
    getContactinfo
}

module.exports = contactsController