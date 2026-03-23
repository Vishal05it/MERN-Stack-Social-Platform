const jwt = require("jsonwebtoken");
let userModel = require("../Schema/user.model");
const AuthUSer = async (req, res, next) => {
    try {
        console.log("User middleware is running");
        const SECRET_KEY = process.env.SECRET_KEY;
        let token = req.header("userToken");
        if (!token) {
            return res.status(401).send({
                message: "Unauthorized, Please login!",
                success: false,
                reason: "No token",
                status: 401
            })
        }
        let decode = jwt.verify(token, SECRET_KEY);
        if (!decode) {
            res.send({
                message: "Invalid Token!",
                success: false,
                status: 404,
                userExist: null
            })
            return;
        }
        req.userId = decode.userId;
        let user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).send({
                message: "Account does not exist",
                success: false,
                status: 404,
                userExist: null
            })
        }
        return next();
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            message: "Token expired or invalid",
            success: false,
            status: 401
        })
    }

}
module.exports = AuthUSer;