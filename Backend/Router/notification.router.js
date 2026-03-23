const express = require("express");
const notificationRouter = express.Router();
const notificationModel = require("../Schema/notifications.model");
const userModel = require("../Schema/user.model");
const postModel = require("../Schema/post.model");
const verifyUserToken = require("../Middlewares/verifyUserToken.middleware");
notificationRouter.get("/gettotalnotifications/:userId", verifyUserToken, async (req, res) => {
    try {
        let totalNotifications = await notificationModel.countDocuments({ foruser: req.params.userId, isread: false });
        let allNotifications = await notificationModel.find({ foruser: req.params.userId, isread: false }).populate("byuser").populate("post");
        let showNotifications = await notificationModel.countDocuments({ foruser: req.params.userId });
        if (!totalNotifications) {
            res.status(404).send({
                message: "No new notifications!",
                success: false
            })
            return 0;
        }
        res.status(200).send({
            message: "New notifications fetched!",
            success: true,
            totalNotifications,
            showNotifications,
            allNotifications
        });
        return totalNotifications;
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false
        });
        return 0;
    }
});
notificationRouter.get("/getallnotifications/:userId", verifyUserToken, async (req, res) => {
    try {
        let totalNotifications = await notificationModel.countDocuments({ foruser: req.params.userId })
        let allNotifications = await notificationModel.find({ foruser: req.params.userId }).populate("byuser").populate("post").sort({ createdAt: -1 });
        let showNotifications = await notificationModel.countDocuments({ foruser: req.params.userId });
        if (!totalNotifications) {
            res.status(404).send({
                message: "No new notifications!",
                success: false
            })
            return 0;
        }
        res.status(200).send({
            message: "All the notifications fetched!",
            success: true,
            totalNotifications,
            showNotifications,
            allNotifications
        });
        return totalNotifications;
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false
        });
        return 0;
    }
});
notificationRouter.get("/countnotifications/:userId", verifyUserToken, async (req, res) => {
    try {
        let totalNotifications = await notificationModel.countDocuments({ foruser: req.params.userId, isread: false });
        let showNotifications = await notificationModel.countDocuments({ foruser: req.params.userId });
        if (!totalNotifications) {
            res.status(404).send({
                message: "No new notifications!",
                success: false
            })
            return 0;
        }
        res.status(200).send({
            message: "New notifications fetched!",
            success: true,
            totalNotifications,
            showNotifications,
        });
        return totalNotifications;
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false
        });
        return 0;
    }
});
notificationRouter.post("/postnotifications/:userId/:postId", verifyUserToken, async (req, res) => {
    try {
        let post = await postModel.findById(req.params.postId);
        if (!post) {
            res.status(404).send({
                message: "Post not found!",
                success: false,
            });
            return;
        }
        if (req.params.userId == post.createdBy) {
            res.status(401).send({
                message: "Self like ignored",
                status: 401,
                success: false,
            })
            return;
        }
        let { typeofnotification, addedMs } = req.body;
        let existingNotification = await notificationModel.findOne({ byuser: req.params.userId, post: req.params.postId, typeofnotification, addedMs });
        if (!existingNotification) {
            let storedNotification = await notificationModel.create({ byuser: req.params.userId, post: req.params.postId, isread: false, typeofnotification, foruser: post.createdBy, addedMs });
            res.status(200).send({
                message: "New notifications stored!",
                success: true,
                storedNotification
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false
        })
    }
});
notificationRouter.put("/readallnotifications/:userId", verifyUserToken, async (req, res) => {
    try {
        let allNotifications = await notificationModel.updateMany({ foruser: req.params.userId }, { $set: { isread: true } });
        res.status(200).send({
            message: "All notifications read!",
            success: true,
            allNotifications
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false
        })
    }
});
module.exports = notificationRouter;