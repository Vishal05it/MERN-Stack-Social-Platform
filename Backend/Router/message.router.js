const express = require("express");
const messageRouter = express.Router();
const userModel = require("../Schema/user.model");
const messageModel = require("../Schema/message.model");
const verifyUserToken = require("../Middlewares/verifyUserToken.middleware");
const conversationModel = require("../Schema/conversation.model");
messageRouter.get("/countunreadforuser/:userId", verifyUserToken, async (req, res) => {
    try {
        let unreadMessages1 = await conversationModel.countDocuments({ user1: req.params.userId, readby: { $ne: req.userId } });
        let unreadMessages2 = await conversationModel.countDocuments({ user2: req.params.userId, readby: { $ne: req.userId } });
        res.status(200).send({
            message: "Total unread messages fetched!",
            success: true,
            totalunread: unreadMessages1 + unreadMessages2
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false,
        })
    }
})
messageRouter.post("/sendmessage/:messageby/:messageto", verifyUserToken, async (req, res) => {
    try {
        let messageBy = await userModel.findById(req.params.messageby);
        if (!messageBy) {
            res.status(404).send({
                message: "Invalid Sender Error!",
                success: false
            });
            return;
        }
        let messageTo = await userModel.findById(req.params.messageto);
        if (!messageTo) {
            res.status(404).send({
                message: "Receiver not found!",
                success: false
            });
            return;
        }
        let { message, addedMs } = req.body;
        let sendMessage = await messageModel.create({ messageby: req.params.messageby, messageto: req.params.messageto, message, isreadbywhom: [req.userId], addedMs });
        let findConvo1 = await conversationModel.findOne({ user1: req.params.messageby, user2: req.params.messageto });
        let findConvo2 = await conversationModel.findOne({ user1: req.params.messageto, user2: req.params.messageby });
        if (findConvo1) {
            let updatedFindConvo1 = await conversationModel.updateOne({ user1: req.params.messageby, user2: req.params.messageto }, { readby: [req.userId] });
            res.status(200).send({
                message: "Message successfully sent!",
                success: true,
                sendMessage,
                updatedFindConvo1
            });
            return;
        }

        else if (findConvo2) {
            let updatedFindConvo2 = await conversationModel.updateOne({ user1: req.params.messageto, user2: req.params.messageby }, { readby: [req.userId] });
            res.status(200).send({
                message: "Message successfully sent!",
                success: true,
                sendMessage,
                updatedFindConvo2
            });
            return;
        }
        else {
            let newConvo = await conversationModel.create({
                user1: req.params.messageby, user2: req.params.messageto, readby: [req.userId]
            });
            res.status(200).send({
                message: "Message successfully sent!",
                success: true,
                sendMessage,
                newConvo
            });
        }
        setTimeout(async () => {
            sendMessage.canedit = false;
            let blockedEditMessage = await sendMessage.save();
        }, 60000);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false
        })
    }
});

messageRouter.put("/readmessages/:messageby/:messageto", verifyUserToken, async (req, res) => {
    try {
        if (req.userId == req.params.messageby) {
            let readMessages1 = await messageModel.updateMany({ messageby: req.userId, messageto: req.params.messageto }, { $addToSet: { isreadbywhom: req.userId } });
            let readMessages2 = await messageModel.updateMany({ messageby: req.params.messageto, messageto: req.userId }, { $addToSet: { isreadbywhom: req.userId } });
            let readMessages;
            if (readMessages1) {
                readMessages = readMessages1;
            }
            else readMessages = readMessages2;
            let convo1 = await conversationModel.updateOne({ user1: req.params.messageby, user2: req.params.messageto }, { $addToSet: { readby: req.userId } });
            let convo2 = await conversationModel.updateOne({ user1: req.params.messageto, user2: req.params.messageby }, { $addToSet: { readby: req.userId } });
            if (convo1) {
                res.status(200).send({
                    message: "Conversation updated and all messages read!",
                    success: true,
                    convo: convo1,
                    readMessages
                });
                return;
            }
            else {
                res.status(200).send({
                    message: "Conversation updated and all messages read!",
                    success: true,
                    convo: convo2,

                    readMessages
                });
                return;
            }
        }
        else {

            let readMessages1 = await messageModel.updateMany({ messageby: req.userId, messageto: req.params.messageto }, { $addToSet: { isreadbywhom: req.userId } });
            let readMessages2 = await messageModel.updateMany({ messageby: req.userId, messageto: req.params.messageby }, { $addToSet: { isreadbywhom: req.userId } });
            let readMessages3 = await messageModel.updateMany({ messageby: req.params.messageto, messageto: req.userId }, { $addToSet: { isreadbywhom: req.userId } });
            let readMessages4 = await messageModel.updateMany({ messageby: req.params.messageby, messageto: req.userId }, { $addToSet: { isreadbywhom: req.userId } });
            let readMessages;
            if (readMessages1) readMessages = readMessages1;
            else if (readMessages2) readMessages = readMessages2;
            else if (readMessages3) readMessages = readMessages3;
            else if (readMessages4) readMessages = readMessages4;
            let convo1 = await conversationModel.updateOne({ user1: req.params.messageto, user2: req.params.messageby }, { $addToSet: { readby: req.userId } });
            let convo2 = await conversationModel.updateOne({ user1: req.params.messageby, user2: req.params.messageto }, { $addToSet: { readby: req.userId } });
            if (convo1) {
                res.status(200).send({
                    message: "Conversation updated and all messages read!",
                    success: true,
                    convo: convo1,
                    totalUnread,
                    readMessages
                });
                return;
            }
            else {
                res.status(200).send({
                    message: "Conversation updated and all messages read!",
                    success: true,
                    convo: convo2,
                    totalUnread,
                    readMessages
                });
                return;
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false
        })
    }
});
messageRouter.get("/getallmessages/:messageby/:messageto", verifyUserToken, async (req, res) => {
    try {
        let allMessages1 = await messageModel.find({ messageby: req.params.messageby, messageto: req.params.messageto }).sort({ createdAt: 1 }).populate("messageby").populate("messageto");
        let allMessages2 = await messageModel.find({ messageby: req.params.messageto, messageto: req.params.messageby }).sort({ createdAt: 1 }).populate("messageby").populate("messageto");
        if (allMessages1.length == 0 && allMessages2.length == 0) {
            res.status(404).send({
                message: "No messages found",
                success: false
            });
            return;
        }
        let allMessages = [...allMessages1, ...allMessages2];
        allMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        res.status(200).send({
            message: "All messages found!",
            success: true,
            messageIdx: 1,
            messageby: req.params.messageby,
            messageto: req.params.messageto,
            allMessages
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false
        });
    }
});
messageRouter.get("/countunreadmessages/:messageby/:messageto", verifyUserToken, async (req, res) => {
    try {
        let totalUnreadMsgs = 0;
        let allMessages1 = await messageModel.countDocuments({ messageby: req.params.messageby, messageto: req.params.messageto, isreadbywhom: { $ne: req.userId } });
        let allMessages2 = await messageModel.countDocuments({ messageby: req.params.messageto, messageto: req.params.messageby, isreadbywhom: { $ne: req.userId } });
        totalUnreadMsgs = allMessages1 + allMessages2;
        if (totalUnreadMsgs <= 0) {
            res.status(404).send({
                message: "No new messages",
                success: false,
                totalUnreadMsgs,
                allMessages1,
                allMessages2,

            });
            return;
        }
        res.status(200).send({
            message: "All unread messages found!",
            success: true,
            messageby: req.params.messageby,
            messageto: req.params.messageto,
            totalUnreadMsgs
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false,
            totalUnreadMsgs: 0
        });
    }
});
messageRouter.put("/editmessage/:messageId", verifyUserToken, async (req, res) => {
    try {
        let message = await messageModel.findById(req.params.messageId);
        if (!message) {
            res.status(404).send({
                message: "Message not found!",
                success: false
            });
            return;
        }
        if (message.canedit) {
            let { newMessage } = req.body;
            message.message = newMessage;
            let editedMessage = await message.save();
            res.status(200).send({
                message: "Message edited successfully!",
                success: true,
                editedMessage,
            });
            setTimeout(async () => {
                message.canedit = false;
                let blockedEditMessage = await message.save();
            }, 60000);
        }
        else {
            res.status(400).send({
                message: "Message cannot be edited now!",
                success: false,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false
        });
    }
});
messageRouter.delete("/deletemessage/:messageId", verifyUserToken, async (req, res) => {
    try {
        let message = await messageModel.findById(req.params.messageId);
        if (!message) {
            res.status(404).send({
                message: "Message not found!",
                success: false
            });
            return;
        }
        let deletedMessage = await messageModel.findByIdAndDelete(req.params.messageId);
        res.status(200).send({
            message: "Message deleted successfully!",
            success: true,
            deletedMessage,
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false
        });
    }
});
messageRouter.delete("/deletechat/:messageby/:messageto", verifyUserToken, async (req, res) => {
    try {
        let deletedMsgs1 = await messageModel.deleteMany({ messageby: req.params.messageby, messageto: req.params.messageto });
        let deletedMsgs2 = await messageModel.deleteMany({ messageby: req.params.messageto, messageto: req.params.messageby });
        if (!deletedMsgs2 && !deletedMsgs1) {
            res.status(404).send({
                message: "Messages not found!",
                success: false
            });
            return;
        }
        let deletedConvo1 = await conversationModel.deleteOne({ user1: req.params.messageby, user2: req.params.messageto });
        let deletedConvo2 = await conversationModel.deleteOne({ user1: req.params.messageto, user2: req.params.messageby });
        if (deletedConvo1) {
            res.status(200).send({
                message: "Chat deleted successfully!",
                success: true,
                deletedMsgs,
                deletedConvo: deletedConvo1
            });
            return;
        }
        else {
            res.status(200).send({
                message: "Chat deleted successfully!",
                success: true,
                deletedMsgs,
                deletedConvo: deletedConvo2
            });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false
        });
    }
});
module.exports = messageRouter;