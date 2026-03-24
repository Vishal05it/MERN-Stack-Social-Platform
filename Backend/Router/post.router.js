const express = require("express");
const postModel = require("../Schema/post.model")
const postRouter = express.Router();

const verifyToken = require("../Middlewares/verifyUserToken.middleware");
const verifyPostToken = require("../Middlewares/verifyPostToken.middleware");
const likeCommentsToken = require("../Middlewares/likePost.middleware");
const commentModel = require("../Schema/comment.model");
const likePostsModel = require("../Schema/likeposts.model");
const notificationsModel = require("../Schema/notifications.model");
postRouter.get("/getallposts", async (req, res) => {
    try {
        let { page = 1, items = 8 } = req.query;
        let totalDocs = await postModel.countDocuments();
        let totalPages = Math.ceil(totalDocs / items);
        if (page <= 0 || page > totalPages) {
            res.status(404).send({
                message: "Page not found!",
                success: false
            });
            return;
        }
        let skipItems = (page - 1) * items;
        let allPosts = await postModel.find({}).sort({ updatedAt: -1 }).limit(items).skip(skipItems);
        res.status(200).send({
            message: "All posts found",
            posts: allPosts,
            totalPosts: totalDocs,
            status: 200
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Internal Server Error",
            posts: null,
            totalPosts: null,
            status: 500,
            errorFound: error
        })
    }
})
postRouter.get("/getmyposts/:userId", async (req, res) => {
    try {
        let allMyPosts = await postModel.find({ createdBy: req.params.userId }).sort({ updatedAt: -1 });
        if (allMyPosts.length <= 0) {
            res.status(400).send({
                message: "You have no posts!",
                posts: null,
                totalPosts: null,
                status: 400,
                success: false
            })
            return;
        }
        let totalDocs = await postModel.countDocuments({ createdBy: req.params.userId });
        res.status(200).send({
            message: "All your posts found",
            posts: allMyPosts,
            totalPosts: totalDocs,
            status: 200,
            success: true
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Internal Server Error",
            posts: null,
            totalPosts: null,
            status: 500,
            success: false,
            errorFound: error
        })
    }
})
postRouter.post("/addpost", verifyToken, async (req, res) => {
    try {
        let { title, description, isPrivate, author, postImage, authorimage, addedMs } = req.body;
        let addPost = await postModel.create({ title, description, isPrivate, author, postImage, createdBy: req.userId, authorimage, addedMs });
        res.status(200).send({
            message: "Post added successfully",
            success: true,
            post: addPost,
            status: 200
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while posting the data.",
            status: 500,
            success: false,
            error: error.errors
        })
    }
})
postRouter.put("/updatepost/:postId", verifyPostToken, async (req, res) => {
    try {
        let { title, description, isPrivate, postImage, addedMs } = req.body;
        let post = await postModel.findById(req.postId);
        console.log(post);
        if (title) {
            post.title = title;
        }
        if (description) {
            post.description = description;
        }

        if (isPrivate) {
            post.isPrivate = isPrivate;
        }
        if (postImage) {
            post.postImage = postImage;
        }
        if (addedMs) {
            post.addedMs = addedMs;
        }
        let updatePost = await post.save();
        console.log(updatePost);
        res.status(200).send({
            message: "Post updated successfully",
            success: true,
            oldPost: post,
            newPost: updatePost,
            status: 200
        })
    }

    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while updating the data.",
            status: 500,
            success: false,
            error: error.errors
        })
    }
})
postRouter.delete("/deletepost/:postId", async (req, res) => {
    try {

        let post = await postModel.findById(req.params.postId);
        console.log(post);
        if (!post) {
            res.send({
                message: "Post not found!",
                status: 400,
                success: false,

            })
            return;
        }
        let deletedPost = await postModel.deleteOne(post);
        let deleteLikes = await likePostsModel.deleteMany({ post: post._id });
        let deleteComments = await commentModel.deleteMany({ commenton: post._id });
        let deleteNotifications = await notificationsModel.deleteMany({ post: post._id });
        res.status(200).send({
            message: "Post deleted successfully",
            success: true,
            deletedPost,
            status: 200
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while deleting the data.",
            status: 500,
            success: false,
            error: error.errors
        })
    }
})
postRouter.put("/setlikes/:postId", likeCommentsToken, async (req, res) => {
    try {

        let post = await postModel.findById(req.postId);
        console.log(post);


        let updatePost = await post.save();
        console.log(updatePost);
        res.status(200).send({
            message: "Post updated successfully",
            success: true,
            oldPost: post,
            newPost: updatePost,
            status: 200
        })
    }

    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while updating the data.",
            status: 500,
            success: false,
            error: error.errors
        })
    }
})
postRouter.put("/likepost/:postId", likeCommentsToken, async (req, res) => {
    try {
        let { like, comments } = req.body;
        let post = await postModel.findById(req.postId);
        console.log(post);

        post.like += 1;

        if (comments) {
            post.comments = comments;
        }

        let updatePost = await post.save();
        console.log(updatePost);
        res.status(200).send({
            message: "Post liked successfully",
            success: true,
            likes: like,

            comments: comments,
            newPost: updatePost,
            status: 200
        })
    }

    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while updating the data.",
            status: 500,
            success: false,
            error: error.errors
        })
    }
})
postRouter.put("/dislikepost/:postId", likeCommentsToken, async (req, res) => {
    try {
        let { like, comments, } = req.body;
        let post = await postModel.findById(req.postId);
        console.log(post);

        post.like -= 1;

        if (comments) {
            post.comments = comments;
        }

        let updatePost = await post.save();
        console.log(updatePost);
        res.status(200).send({
            message: "Post disliked successfully",
            success: true,
            likes: like,
            comments: comments,
            newPost: updatePost,
            status: 200
        })
    }

    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while updating the data.",
            status: 500,
            success: false,
            error: error.errors
        })
    }
})
postRouter.get("/getone/:postId", async (req, res) => {
    try {
        let onePost = await postModel.findById(req.params.postId);
        res.status(200).send({
            message: "Post fetched successfully",
            success: true,
            post: onePost,
            status: 200
        })
    } catch (error) {
        res.status(500).send({
            message: "Post not found",
            success: false,
            post: null,
            status: 500
        })
    }
})
postRouter.get("/getuserpost/:userId", async (req, res) => {
    try {
        let allPosts = await postModel.find({ createdBy: req.params.userId });
        if (allPosts.length == 0) {
            res.status(404).send({
                message: "Posts not found",
                success: false,
                post: null,
                status: 404
            });
            return;
        }
        res.status(200).send({
            message: "Posts fetched successfully",
            success: true,
            allPosts,
            status: 200
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error!",
            success: false,
            post: null,
            status: 500
        })
    }
})
postRouter.get("/searchposts", async (req, res) => {
    try {
        let keyword = req.query.keyword;
        let allPosts = await postModel.find({
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        });
        if (allPosts.length <= 0) {
            res.status(404).send({
                message: "No posts found!",
                success: false,
                status: 404
            })
            return;
        }
        res.status(200).send({
            message: "All posts fetched successfully!",
            success: true,
            posts: allPosts,
            status: 200
        });

    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error!",
            success: false,
            status: 500
        })
    }
})
postRouter.post("/postdefault", async (req, res) => {
    await postModel.deleteMany({});
    try {
        let postedBlogs = await postModel.create([
            {
                title: "How I Learned Full Stack in 6 Months",
                description: "A personal journey through learning MERN stack with real struggles, wins, and lessons.",
                like: 12,
                comments: 3,
                author: "Vishal Tiwari",

                postImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
                createdBy: "698fc62b187461f6c5085dd6"
            },
            {
                title: "Why JavaScript is Everywhere",
                description: "From browsers to servers, JavaScript has taken over modern development.",
                like: 34,
                comments: 9,
                author: "Aman Verma",

                postImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c"
                ,
                createdBy: "698fc62b187461f6c5085dd6"
            },
            {
                title: "Understanding React Hooks",
                description: "A deep dive into useState, useEffect, and custom hooks.",
                like: 41,
                comments: 14,
                author: "Neha Sharma",

                postImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
                createdBy: "698fc62b187461f6c5085dd6"
            },
            {
                title: "Building REST APIs with Node.js",
                description: "Best practices for structuring backend APIs using Express and MongoDB.",
                like: 28,
                comments: 7,
                author: "Rahul Mehta",

                postImage: "https://images.unsplash.com/photo-1518770660439-4636190af475",
                createdBy: "698fc62b187461f6c5085dd6"
            },
            {
                title: "Why Tailwind is Better than CSS?",
                description: "Exploring utility-first CSS and why developers love Tailwind.",
                like: 52,
                comments: 18,
                author: "Priya Singh",

                postImage: "https://images.unsplash.com/photo-1504639725590-34d0984388bd",
                createdBy: "698fc62b187461f6c5085dd6"
            },
            {
                title: "Common React Mistakes",
                description: "Avoiding unnecessary re-renders and props drilling in React apps.",
                like: 37,
                comments: 10,
                author: "Karan Patel",

                postImage: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387"
            },
            {
                title: "Why You Should Learn Node.js",
                description: "Node.js is fast, scalable, and perfect for modern backend development.",
                like: 45,
                comments: 11,
                author: "Ananya Iyer",

                postImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159"
            },
            {
                title: "Deploying MERN Apps Easily",
                description: "Step-by-step guide to deploying React + Node apps.",
                like: 29,
                comments: 6,
                author: "Rohit Gupta",

                postImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
                createdBy: "698fc62b187461f6c5085dd6"
            },
            {
                title: "Why Internships Matter",
                description: "How internships shape your real-world development skills.",
                like: 19,
                comments: 5,
                author: "Saurabh Mishra",

                postImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
                createdBy: "698fc62b187461f6c5085dd6"
            },
            {
                title: "React vs Angular vs Vue",
                description: "Comparing the three most popular frontend frameworks.",
                like: 61,
                comments: 20,
                author: "Pooja Sharma",

                postImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
                createdBy: "698fc62b187461f6c5085dd6"
            },
            {
                title: "Understanding MongoDB",
                description: "NoSQL databases explained simply for beginners.",
                like: 22,
                comments: 8,
                author: "Arjun Reddy",

                postImage: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68",
                createdBy: "698fc62b187461f6c5085dd6"
            },
            {
                title: "How to Build a Blog App",
                description: "Designing and developing a full-stack blog platform.",
                like: 48,
                comments: 15,
                author: "Vikram Singh",

                postImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
                createdBy: "698fc62b187461f6c5085dd6"
            },
            {
                title: "Best VS Code Extensions",
                description: "Must-have tools for modern developers.",
                like: 31,
                comments: 9,
                author: "Nitin Tiwari",

                postImage: "https://media.istockphoto.com/id/887987150/photo/blogging-woman-reading-blog.jpg?s=612x612&w=0&k=20&c=7SScR_Y4n7U3k5kBviYm3VwEmW4vmbngDUa0we429GA=",
                createdBy: "698fc62b187461f6c5085dd6"
            },
            {
                title: "How to Crack Internships",
                description: "Practical tips for landing your first paid internship.",
                like: 55,
                comments: 22,
                author: "Riya Kapoor",

                postImage: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
                createdBy: "698fc62b187461f6c5085dd6"
            },
            {
                title: "Why Open Source Matters",
                description: "Contributing to open source and building real experience.",
                like: 17,
                comments: 4,
                author: "Amit Patel",

                postImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
                createdBy: "698fc62b187461f6c5085dd6"
            },
            {
                title: "From Fresher to Developer",
                description: "How to build real-world projects that impress recruiters.",
                like: 66,
                comments: 24,
                author: "Shivam Gupta",

                postImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
                createdBy: "698fc62b187461f6c5085dd6"
            }
        ]
        )
        res.status(200).send({
            message: "Default posts posted successfully.",
            status: 200,
            defPosts: postedBlogs
        })
    } catch (error) {
        res.status(500).send({
            message: "Error while posting the data.",
            status: 500,
            defPosts: null,
            error: error.errors
        })
    }
})
module.exports = postRouter;