const mongoose = require("mongoose");
const commentSchema = mongoose.Schema({
    commentby: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    commenton: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "post"
    },
    likes: {
        type: Number,
        default: 0
    },
    authorimg: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPHHLCPnASW-uMU5Iun97gCckqqlm6DAh5-Q&s"
    },
    canedit: {
        type: Boolean,
        default: true
    },
    content: {
        type: String,
        default: "",
        required: [true, "Cannot post empty comment"]
    }
    ,
    author: {
        type: String
    },

    addedMs: {
        type: Number,
    }
}, { timestamps: true })
const commentModel = mongoose.model("comment", commentSchema);
module.exports = commentModel;