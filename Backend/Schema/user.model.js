const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [2, "Name must be atleast 2 characters long"]
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email!"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be 6 characters long"]
    },
    age: {
        type: Number,
        default: null
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Others"],
        default: "Male"
    },
    phoneno: {
        type: String,
        maxlength: [13, "Phone number must be only 13 digits long"]
    },
    city: {
        type: String,
        default: null
    },
    state: {
        type: String,
        default: null
    },
    zipcode: {
        type: Number,
        default: null
    },
    bio: {
        type: String,
        default: null
    },
    profilepic: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPHHLCPnASW-uMU5Iun97gCckqqlm6DAh5-Q&s"
    }
}, { timestamps: true });
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;