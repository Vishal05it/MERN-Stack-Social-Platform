const mongoose = require("mongoose");
const likePostsSchema = mongoose.Schema({
    likedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        unique: false
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        unique: false
    }
}, { timestamps: true })
likePostsSchema.index({ post: 1, likedby: 1 }, { unique: true });
let likePostsModel = mongoose.model("likepost", likePostsSchema);
module.exports = likePostsModel;