const postModel = require("../Schema/post.model");
const jwt = require("jsonwebtoken");
const userModel = require("../Schema/user.model");
const PostVerify = async (req, res, next) => {
    try {
        console.log("Post middleware is running");
        const SECRET_KEY = process.env.SECRET_KEY;
        let token = req.header("userToken");
        if (!token) {
            return res.send({
                message: "Unauthorized, Please login!",
                success: false,
                status: 404,
                reason: "token not found"
            })
        }
        const decode = jwt.verify(token, SECRET_KEY);
        // if (!decode.userId) {
        //     return res.status(401).send({
        //         success: false,
        //         message: "Unauthorized, Please login!",
        //     });
        // }
        const user = await userModel.findById(decode.userId);
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized, Please login!",
                reason: "User not found"
            });
        }
        req.userId = decode.userId;
        const findPost = await postModel.findOne({ createdBy: req.userId, _id: req.params.postId })
        if (!findPost) {
            return res.status(400).send({
                message: "Post not found",
                success: false,
                status: 400,

            })
        }
        req.postId = findPost._id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Token expired or invalid",
            success: false,
            status: 400
        })
    }

}
module.exports = PostVerify;