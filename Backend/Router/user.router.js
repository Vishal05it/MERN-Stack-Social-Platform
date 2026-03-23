const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let userModel = require("../Schema/user.model");
const AuthUSer = require("../Middlewares/verifyUserToken.middleware");
const transport = require("../mailer");
userRouter.post("/signup", async (req, res) => {
    let user = req.body;
    let { name, email, password } = req.body;
    let existingUSer = await userModel.findOne({ email });
    if (existingUSer) {
        return res.status(400).send({
            message: "User already exists",
            status: 400,
            success: false
        })
    }
    try {
        let mySalt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(password, mySalt)
        let newUser = await userModel.create({ name, email, password: hashPassword });
        let sendUser = await userModel.findById(newUser._id).select("-password");
        res.status(200).send({
            message: "Sign up successfully",
            success: true,
            userCreated: sendUser,
            status: 200,
        })
    } catch (error) {
        console.log(error.errors);
        let errorFound = Object.values(error.errors)[0]?.properties?.message;
        console.log(error);
        res.status(500).send({
            message: errorFound ? errorFound : "Internal Server Error",
            success: false,
            userCreated: null,
            status: 500,
        })
    }
});
userRouter.get("/searchuser", async (req, res) => {
    try {
        let keyword = req.query.keyword;
        let users = await userModel.find({ name: { $regex: keyword, $options: "i" } }).select("-password");
        if (!users) {
            res.status(404).send({
                message: "No user found!",
                success: false,
            });
            return;
        }
        res.status(200).send({
            message: "Users found!",
            success: true,
            users
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error",
            success: false,
            status: 500,
        });
    }
})
userRouter.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        let userExist = await userModel.findOne({ email });
        let sendUser = await userModel.findOne({ email }).select("-password");
        if (!userExist) {
            return res.status(404).send({
                message: "Account does not exist",
                success: false,
                status: 400,
                sendUser
            })
        }
        let userFound = await bcrypt.compare(password, userExist.password);
        if (!userFound) {
            return res.status(404).send({
                message: "Invalid Credentials",
                success: false,
                status: 404,
                userFound
            })
        }
        let token = jwt.sign({ userId: userExist._id }, process.env.SECRET_KEY);
        res.status(200).send({
            message: "Account logged in successfully",
            success: true,
            status: 200,
            token,
            userExist
        })
    } catch (error) {
        // console.log(error);
        // let errorMsg = Object.values(error?.errors)[0]?.properties?.message;
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error",
            success: false,
            status: 500,
        })
    }
});
userRouter.get("/profile", AuthUSer, async (req, res) => {
    try {
        let user = await userModel.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).send({
                message: "Account not found!",
                success: false,
                status: 404,
            })
        }
        res.status(200).send({
            message: "Account fetched successfully",
            success: true,
            status: 200,
            user
        })
    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error",
            success: false,
            status: 500,

        })
    }
})
userRouter.get("/getuser/:userId", async (req, res) => {
    try {
        let user = await userModel.findById(req.params.userId).select("-password");
        if (!user) {
            return res.status(404).send({
                message: "Account not found!",
                success: false,
                status: 404,
            })
        }
        res.status(200).send({
            message: "Account fetched successfully",
            success: true,
            status: 200,
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error",
            success: false,
            status: 500,

        })
    }
})
userRouter.put("/updateprofile", AuthUSer, async (req, res) => {
    try {
        let { name, age, gender, city, phoneno, state, zipcode, bio, profilepic } = req.body
        let user = await userModel.findById(req.userId);
        if (name) user.name = name;
        if (age) user.age = age;
        if (gender) user.gender = gender;
        if (city) user.city = city;
        if (phoneno) user.phoneno = phoneno;
        if (state) user.state = state;
        if (zipcode) user.zipcode = zipcode;
        if (bio) user.bio = bio;
        if (profilepic) user.profilepic = profilepic;
        let updatedUser = await user.save();
        res.status(200).send({
            message: "Account updated successfully",
            success: true,
            status: 200,
            updatedUser
        })
    } catch (error) {
        console.log(error);
        // let errorMsg = Object.values(error.errors)[0].properties.message ? Object.values(error.errors)[0].properties.message : null
        // console.log(error);
        res.status(500).send({
            message: "Internal Server Error",
            success: false,
            status: 500,
            //errorMsg: errorMsg
        })
    }
})
userRouter.put("/updatepassbyenter/:userId/:oldpassword", AuthUSer, async (req, res) => {
    try {
        let user = await userModel.findById(req.params.userId);
        if (!user) {
            res.status(400).send({
                message: "User not found!",
                success: false,
                status: 400
            })
            return;
        }
        let { password } = req.body;
        let matchPass = await bcrypt.compare(req.params.oldpassword, user.password);
        if (!matchPass) {
            res.status(400).send({
                message: "Incorrect Password!",
                success: false,
                status: 400,
            })
            return;
        }
        let salt = await bcrypt.genSalt(10);
        let newPass = await bcrypt.hash(password, salt);
        user.password = newPass;
        let updatedUser = await user.save();
        res.status(200).send({
            message: "Password successfully updated!",
            success: true,
            status: 200,

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
userRouter.put("/updateemail/:userId/:oldpassword", AuthUSer, async (req, res) => {
    try {
        let user = await userModel.findById(req.params.userId);
        if (!user) {
            res.status(400).send({
                message: "User not found!",
                success: false,
                status: 400
            })
            return;
        }
        let { email, password } = req.body;
        let matchPass = await bcrypt.compare(password, user.password);
        if (!matchPass) {
            res.status(400).send({
                message: "Incorrect Password!",
                success: false,
                status: 400
            })
            return;
        }
        let userExist = await userModel.findOne({ email });
        if (userExist) {
            res.status(400).send({
                message: "Email already registered!",
                success: false,
                status: 400
            })
            return;
        }
        user.email = email;
        let updatedUser = await user.save();
        res.status(200).send({
            message: "Email successfully updated!",
            success: true,
            status: 200,
            updatedUser
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
userRouter.put("/updatepassbyotp/:userId/:otp", AuthUSer, async (req, res) => {
    try {
        let user = await userModel.findById(req.params.userId);
        if (!user) {
            res.status(400).send({
                message: "User not found!",
                success: false,
                status: 400
            })
            return;
        }
        const message = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "OTP for password updation",
            text: `Hello ${user.name}, the OTP for resetting your password is ${req.params.otp}. This OTP is valid for only 2 minutes. If not sent by you, contact us immediately. Thank You!`
        }
        transport.sendMail(message, (err, info) => {
            if (err) {
                console.log("Error while sending the mail", err);
                return;
            }
            console.log("Mail successfully sent : ", info);
        })
        let { otpUser, password } = req.body;
        if (otpUser != "" && password != "") {
            let validated = false;
            if (otpUser != req.params.otp) {
                res.status(400).send({
                    message: "Invalid OTP!",
                    success: false,
                    status: 400,
                    validated
                });
                return;
            }
            let salt = await bcrypt.genSalt(10);
            let newPass = await bcrypt.hash(password, salt);
            user.password = newPass;
            let updatedUser = await user.save();
            res.status(200).send({
                message: "Password successfully updated!",
                success: true,
                status: 200,
                updatedUser,
                validated
            })
        }


    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false,
            status: 500
        })
    }
})
userRouter.put("/forgotpassword/:email/:otp", async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.params.email });
        if (!user) {
            res.status(404).send({
                message: "User not found!",
                success: false,
                status: 404
            })
            return;
        }
        const message = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "OTP for password updation",
            text: `Hello ${user.name}, the OTP for resetting your password is ${req.params.otp}. This OTP is valid for only 2 minutes. If not sent by you, contact us immediately. Thank You!`
        }
        transport.sendMail(message, (err, info) => {
            if (err) {
                console.log("Error while sending the mail", err);
                return;
            }
            console.log("Mail successfully sent : ", info);
        })
        let { otpUser, password } = req.body;
        if (otpUser != "" && password != "") {
            let validated = false;
            if (otpUser != req.params.otp) {
                res.status(400).send({
                    message: "Invalid OTP!",
                    success: false,
                    status: 400,
                    validated
                });
                return;
            }
            let salt = await bcrypt.genSalt(10);
            let newPass = await bcrypt.hash(password, salt);
            user.password = newPass;
            let updatedUser = await user.save();
            res.status(200).send({
                message: "Password successfully updated!",
                success: true,
                status: 200,
                updatedUser,
                validated: true
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error!",
            success: false,
            status: 500
        })
    }
})
userRouter.delete("/delete", AuthUSer, async (req, res) => {
    try {
        let deletedUser = await userModel.deleteOne({ _id: req.userId })
        res.status(200).send({
            message: "Account deleted successfully",
            success: true,
            status: 200,
            deletedUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error",
            status: 500,
            success: false,

        })
    }
})
module.exports = userRouter;