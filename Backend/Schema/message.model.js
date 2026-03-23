const mongoose = require("mongoose");
const messageSchema = mongoose.Schema({
    messageby: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    messageto: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    message: {
        type: String,
    },
    canedit: {
        type: Boolean,
        default: true,
    },
    isread: {
        type: Boolean,
        default: false,
    },
    isreadbywhom: [
        mongoose.Schema.Types.ObjectId,
    ],
    addedMs: {
        type: Number,

    }
}, { timestamps: true });
messageSchema.index({ createdAt: 1 });
const messageModel = mongoose.model("message", messageSchema);
module.exports = messageModel;