const connectToDB = require("./connectToDB");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require('cors');
const postRouter = require("./Router/post.router");
const userRouter = require("./Router/user.router");
const commentRouter = require("./Router/comment.router");
const likePostsRouter = require("./Router/likeposts.router");
const notificationRouter = require("./Router/notification.router");
const messageRouter = require("./Router/message.router");
const conversationRouter = require("./Router/conversation.router");
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: "https://mern-stack-social-platform-qxs481slk-vishal05its-projects.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))
app.use(express.json());
app.use("/posts/api", postRouter);
app.use("/user/api", userRouter);
app.use("/notification/api", notificationRouter);
app.use("/comments/api", commentRouter);
app.use("/storelikes/api", likePostsRouter);
app.use("/message/api", messageRouter);
app.use("/conversation/api", conversationRouter);

app.listen(PORT, () => {
    console.log(`Server is running at : http://localhost:${PORT}`);
})
connectToDB();
