const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: [2, "Title must be grater than 2 letters."]
    },
    description: {
        type: String,
        required: true,
        minlength: [2, "Description must be grater than 2 letters."]
    },
    like: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    author: {
        type: String,
        required: true,
        minlength: [2, "Author's name must be greater than 2"]
    },
    date: {
        type: String,
        default: `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
    },
    authorimage: {
        type: String,
        default: "https://www.imanami.com/wp-content/uploads/2016/03/unknown-user.jpg"
    },
    postImage: {
        type: String,
        default: "https://media.istockphoto.com/id/922745190/photo/blogging-blog-concepts-ideas-with-worktable.jpg?s=612x612&w=0&k=20&c=xR2vOmtg-N6Lo6_I269SoM5PXEVRxlgvKxXUBMeMC_A="
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        //required: [true, "id required!"]
    },
    addedMs: {
        type: Number,
    }
}, { timestamps: true });
const postModel = mongoose.model("post", postSchema);
module.exports = postModel;