const mongoose = require("mongoose");
const notificationsSchema = mongoose.Schema({
    foruser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    byuser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    },
    typeofnotification: {
        type: "String",
        enum: ["like", "comment"]
    },
    isread: {
        type: Boolean,
        default: false,
    }
    ,
    addedMs: {
        type: Number,

    }
}, { timestamps: true });
notificationsSchema.index({ foruser: 1 });
notificationsSchema.index({ post: 1, byuser: 1, typeofnotification: 1 }, { unique: true });
const notificationsModel = mongoose.model("notification", notificationsSchema);
module.exports = notificationsModel;