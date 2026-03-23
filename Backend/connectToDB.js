const mongoose = require("mongoose");
let connectToDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to DB")
    } catch (error) {
        console.log("Error connecting to DB", error);
    }
}
module.exports = connectToDB;