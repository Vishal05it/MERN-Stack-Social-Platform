const express = require("express");
const likePostsRouter = express.Router();
const likePostsModel = require("../Schema/likeposts.model");
const notificationsModel = require("../Schema/notifications.model");
likePostsRouter.get("/getinfo/:userId/:postId", async (req, res) => {
    try {
        let result = await likePostsModel.findOne({ likedby: req.params.userId, post: req.params.postId });
        if (!result) {
            res.send({
                message: "Post not liked!",
                success: false,
                status: 400
            })
            return;
        }
        res.status(200).send({
            message: "Post is liked",
            success: true,
            status: 200
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false,
            status: 400
        })
    }
})
likePostsRouter.post("/like/:userId/:postId", async (req, res) => {
    try {
        let result = await likePostsModel.create({ likedby: req.params.userId, post: req.params.postId })
        res.status(200).send({
            message: "Post liked",
            success: true,
            status: 200,
            result
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false,
            status: 400
        })
    }
})
likePostsRouter.delete("/dislike/:userId/:postId", async (req, res) => {
    try {
        let result = await likePostsModel.deleteOne
            ({ likedby: req.params.userId, post: req.params.postId });
        let deleteNotification = await notificationsModel.deleteOne({ byuser: req.params.userId, post: req.params.postId });
        res.status(200).send({
            message: "Post disliked",
            success: true,
            status: 200,
            result
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false,
            status: 400
        })
    }
})
module.exports = likePostsRouter;