const express = require("express")
const userModel = require("../models/userModel")
const messageModel = require("../models/messageModel")
const otpGenerator = require('otp-generator')
const dotenv = require("dotenv")
const path = require("path")
dotenv.config({path : "./config.env"})


const twilioSID = process.env.twilio_SID
const twilioAuth_token = process.env.twilio_authToken
const twilio = require("twilio")(twilioSID , twilioAuth_token)
const Swal = require('sweetalert2')


// retrieve List of messages
const sentMsgList = async (req,res)=>{
    
    messageModel.find( {} , 'recieverName dateTime' ,(err, messageList )=>{
        if(err)
        {
            console.log("Error in fetching Messages List : " + err)
            res.status(503).render(path.join( __dirname , "../../client/views/Error.ejs") , {message : "Error in getting Messages List "})
        }
        else{
            
            console.log("Messages recieved successfully...")
            messageList.sort(function(a, b){
                var keyA = new Date(a.dateTime),
                    keyB = new Date(b.dateTime);
                // Compare the 2 dates
                if(keyA > keyB) return -1;
                if(keyA < keyB) return 1;
                return 0;
            });
            console.log("Message List : " , messageList)
            res.render( path.join( __dirname,"../../client/views/messageListPage.ejs") , { messageList : messageList})
        }
    })


}

// send SMS
const sendMsg = async (req,res)=>{

    // generating random otp
    const otp = await otpGenerator.generate(6 , {
        digits : true,
        lowerCaseAlphabets : false,
        upperCaseAlphabets : false,
        specialChars : false
    })
    console.log(req.body)
    userModel.find({_id: req.body.userId} ,async (err , user)=>{
                    
            // // sending SMS
            twilio.messages
                .create({ 
                        body: req.body.text + "\nYour OTP is : " + otp, 
                        from: "+15109162169",
                        to: "+91"+user[0].phoneNumber 
                })
                .then(()=>{
                    console.log("Message sent Successfully.")
                })
                .catch((err)=>{
                    console.log("Error sending message : " , err)
                    
                    res.status(503).render(path.join( __dirname , "../../client/views/Error.ejs") , {message : "Error Sending Message"})
                })
                
            // saving message in database
            const newMessage = new messageModel({
                text : req.body.text,
                recieverName : user[0].firstName + user[0].lastName,
                recieverPhoneNumber : user[0].phoneNumber,
                OTP : otp,
                dateTime : Date.now()
            })
            
            const sentMessage = await newMessage.save()
                                                .catch((err)=>{ 
                                                    console.log("Error saving message" + err)
                                                    res.status(403).json({success : false , message : "error saving message"})
                                                })
            console.log(sentMessage)
            res.status(200).render(path.join( __dirname , "../../client/views/messageSentConfirmation.ejs"))
    })

}

const getMsgSendpage = (req,res)=>{
    userModel.find({_id : req.body.userID} , (err , userData)=>{
        if(err)
        {
            console.log("Error in fetching Contact Info : " + err)
            res.status(503).render(path.join( __dirname , "../../client/views/Error.ejs") , {message : "Error in getting Contact Info "})

        }
        else{
            
            console.log("User Info recieved successfully...")
            console.log("User details : " , userData)
            res.render( path.join(__dirname , "../../client/views/sendMessagePage.ejs") , 
                { userData : userData}
            )
        }
    })
}

//getting a message information
const getMsgInfo =  (req,res)=>{
    console.log(req.body)

    messageModel.findOne( { _id : req.body.messageID } , "text recieverName OTP dateTime -_id" , ( err , msgInfo)=>{
        if(err)
        {
            console.log("Error finding Message information : " + err)
            res.status(503).render(path.join( __dirname , "../../client/views/Error.ejs") , {message : "Error getting Message information "})
            res.status(503).json({success : false})
        }
        else{
            
            console.log("Message found successfully...")
            console.log("Message : " , msgInfo)
            
            res.status(200).render(
                path.join( __dirname , "../../client/views/messageInfo.ejs"),
                {
                    data : msgInfo
                })
        }
    } )
}

const messageController = {
    sendMsg,
    sentMsgList,
    getMsgInfo,
    getMsgSendpage
}

module.exports = messageController