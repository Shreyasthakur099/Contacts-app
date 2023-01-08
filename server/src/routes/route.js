const express = require("express")
const router = express.Router()
const contactController = require("../controller/contactsController")
const messageController = require("../controller/messageController")
const path = require("path")

router.post("/message/send" , messageController.sendMsg)
router.post("/message/textbox" , messageController.getMsgSendpage)
router.get("/message/sentMessagesList" , messageController.sentMsgList)
router.post("/message/info" , messageController.getMsgInfo)
router.get("/contacts/getList" , contactController.getContactList)
router.post("/contacts/info" , contactController.getContactinfo)

module.exports = router