const mongoose = require("mongoose");
const conversationSchema = mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    readby: [mongoose.Schema.Types.ObjectId],
    isTyping: [mongoose.Schema.Types.ObjectId]
}, { timestamps: true });
conversationSchema.index({ user1: 1, user2: 1 }, { unique: true });
const conversationModel = mongoose.model("conversation", conversationSchema);
module.exports = conversationModel;