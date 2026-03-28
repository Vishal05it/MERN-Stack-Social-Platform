const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({ // Disk storage means using server storage
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../Uploads")); // Destination to save files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "_" + Math.floor(Math.random() * 100); // Providing unique name to each file
        cb(null, file.fieldname + "_" + uniqueSuffix);
    }
});
const upload = multer({ storage });
module.exports = upload;