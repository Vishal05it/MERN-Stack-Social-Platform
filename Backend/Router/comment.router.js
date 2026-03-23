const express = require("express");
const commentRouter = express.Router();
const commentModel = require("../Schema/comment.model");
const postModel = require("../Schema/post.model");
const userModel = require("../Schema/user.model");
const verifyUserToken = require("../Middlewares/verifyUserToken.middleware");

commentRouter.get("/getallcomments/:postId", async (req, res) => {
    try {
        let post = await postModel.findById(req.params.postId).sort({ updatedAt: -1 })
        if (!post) {
            res.status(400).send({
                message: "Post not found!",
                success: false,
                status: 400
            })
            return;
        }
        let allComments = await commentModel.find({ "commenton": post._id }).sort({ updatedAt: -1 })
        let totalComments = await commentModel.countDocuments({ "commenton": post._id });
        res.status(200).send({
            message: "Comments fetched successfully",
            success: true,
            status: 200,
            allComments,
            totalComments,
            post
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false,
            status: 500
        })
    }
})
commentRouter.post("/postcomment/:postId/:userId", verifyUserToken, async (req, res) => {
    try {
        let post = await postModel.findById(req.params.postId);
        if (!post) {
            res.status(404).send({
                message: "Post not found!",
                success: false,
                status: 404
            })
            return;
        }
        let { content, author, authorimg, addedMs } = req.body;
        let commenter = await userModel.findById(req.params.userId).select("-password");
        let comment = await commentModel.create({ content, commenton: post._id, commentby: req.params.userId, author, authorimg, addedMs });
        res.status(200).send({
            message: "Commented successfully",
            success: true,
            status: 200,
            comment,
            post,
            commenter
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false,
            status: 500
        })
    }
})
commentRouter.put("/editcomment/:postId/:commentId", verifyUserToken, async (req, res) => {
    try {
        let comment = await commentModel.findById(req.params.commentId);
        if (!comment) {
            res.status(400).send({
                message: "Comment not found!",
                success: false,
                status: 400
            })
            return;
        }
        if (comment.commentby != req.userId) {
            res.status(400).send({
                message: "Cannot edit other's comments!",
                success: false,
                status: 400
            })
            return;
        }
        if (!comment.canedit) {
            res.status(400).send({
                message: "Can not edit comment now",
                success: false,
                status: 400
            })
            return;
        }
        let { content, canedit } = req.body;
        if (content) {
            comment.content = content;
        }

        let editedComment = await comment.save();
        res.status(200).send({
            message: "Comment edited successfully",
            success: true,
            status: 200,
            editedComment
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error!",
            success: false,
            status: 500
        })
        return;
    }
})
commentRouter.put("/blockeditcomment/:postId/:commentId", verifyUserToken, async (req, res) => {
    try {
        let comment = await commentModel.findById(req.params.commentId);
        if (!comment) {
            res.status(400).send({
                message: "Comment not found!",
                success: false,
                status: 400
            })
            return;
        }

        if (!comment.canedit) {
            res.status(400).send({
                message: "Can not edit comment now",
                success: false,
                status: 400
            })
            return;
        }
        let { content, canedit } = req.body;

        if (canedit) {
            comment.canedit = false;
        }
        let blockedComment = await comment.save();
        res.status(200).send({
            message: "Comment editing blocked successfully",
            success: true,
            status: 200,
            blockedComment
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error!",
            success: false,
            status: 500
        })
        return;
    }
})
commentRouter.delete("/deletecomment/:postId/:commentId", verifyUserToken, async (req, res) => {
    try {
        let comment = await commentModel.findById(req.params.commentId);
        if (!comment) {
            res.status(400).send({
                message: "Comment not found!",
                success: false,
                status: 400
            })
            return;
        }
        // if (comment.commentby != req.userId) {
        //     res.status(400).send({
        //         message: "Cannot delete other's comments!",
        //         success: false,
        //         status: 400
        //     })
        //     return;
        // }
        let deletedComment = await comment.deleteOne();
        res.status(200).send({
            message: "Comment deleted successfully",
            success: true,
            status: 200,
            deletedComment
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error!",
            success: false,
            status: 500
        })
        return;
    }
})
commentRouter.delete("/deleteallcomments/:postId", async (req, res) => {
    try {

        let deletedAllComments = await commentModel.deleteMany({ commenton: req.params.postId });
        res.status(200).send({
            message: "Comment deleted successfully",
            success: true,
            status: 200,
            deletedAllComments
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error!",
            success: false,
            status: 500
        })
        return;
    }
});
module.exports = commentRouter;