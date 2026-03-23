const express = require("express");
const conversationRouter = express.Router();
const conversationModel = require("../Schema/conversation.model");
const verifyUser = require("../Middlewares/verifyUserToken.middleware");
conversationRouter.get("/getallconvo/:userId", verifyUser, async (req, res) => {
    try {
        let convo1 = await conversationModel.find({
            user1: req.params.userId
        }).sort({ updatedAt: 1 });
        let convo2 = await conversationModel.find({
            user2: req.params.userId
        }).sort({ updatedAt: 1 });
        if (convo1.length == 0 && convo2.length == 0) {
            res.status(404).send({
                message: "You have no new messages",
                success: false,
            });
            return;
        }
        let allConvo = [...convo1, ...convo2];
        allConvo.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        res.status(200).send({
            message: "All conversations found!",
            success: true,
            allConvo
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false
        })
    }
});
conversationRouter.put("/typing/:user1Id/:user2Id", verifyUser, async (req, res) => {
    try {
        let updateConvo1 = await conversationModel.updateOne({ user1: req.params.user1Id, user2: req.params.user2Id }, { $addToSet: { isTyping: req.userId } });
        let sendConvo1 = await conversationModel.findOne({ user1: req.params.user1Id, user2: req.params.user2Id });
        if (updateConvo1) {
            res.status(200).send({
                message: "User1 is Typing",
                success: true,
                updatedConvo: sendConvo1
            });
            return;
        }
        let updateConvo2 = await conversationModel.updateOne({ user1: req.params.user2Id, user2: req.params.user1Id }, { $addToSet: { isTyping: req.userId } });
        let sendConvo2 = await conversationModel.findOne({ user1: req.params.user2Id, user2: req.params.user1Id });
        if (updateConvo2) {
            res.status(200).send({
                message: "User2 is Typing",
                success: true,
                updatedConvo: sendConvo2
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error !",
            success: false
        })
    }
});
conversationRouter.put("/nottyping/:user1Id/:user2Id", verifyUser, async (req, res) => {
    try {

        let updateConvo1 = await conversationModel.updateOne({ user1: req.params.user1Id, user2: req.params.user2Id }, { $pull: { isTyping: req.userId } });
        let sendConvo1 = await conversationModel.findOne({ user1: req.params.user1Id, user2: req.params.user2Id });
        if (updateConvo1) {
            res.status(200).send({
                message: "User1 is no longer typing",
                success: true,
                updatedConvo: sendConvo1
            });
            return;
        }
        let updateConvo2 = await conversationModel.updateOne({ user1: req.params.user2Id, user2: req.params.user1Id }, { $pull: { isTyping: req.userId } });
        let sendConvo2 = await conversationModel.findOne({ user1: req.params.user2Id, user2: req.params.user1Id });
        if (updateConvo2) {
            res.status(200).send({
                message: "User2 is no longer typing",
                success: true,
                updatedConvo: sendConvo2
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error !",
            success: false
        })
    }
});
module.exports = conversationRouter;