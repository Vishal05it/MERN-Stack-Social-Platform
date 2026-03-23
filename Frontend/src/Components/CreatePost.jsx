import React, { useEffect, useState } from "react";
import { errorEmitter, successEmitter } from "../emitter";
import { baseURL } from "../../baseurl";
import { useAllContexts } from "../Contexts/AllContexts";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../Contexts/LoaderState";

function CreatePost() {
  let [postImg, setPostImg] = useState("");
  let { showLoader, setShowLoader } = useLoader();
  const navigate = useNavigate();
  let { user, setIsHome, setShowFooter, isLogin } = useAllContexts();
  let [post, setPost] = useState({
    title: "",
    description: "",
    postImage: "",
  });
  let onChangeFunc = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    setShowFooter(true);
  }, []);
  let addPost = async () => {
    try {
      let response = await fetch(`${baseURL}/posts/api/addpost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userToken: localStorage.getItem("userToken"),
        },
        body: JSON.stringify({
          title: post.title,
          description: post.description,
          author: user?.name,
          createdBy: user?._id,
          postImage: post.postImage,
          authorimage: user?.profilepic,
          addedMs: Date.now(),
        }),
      });
      let data = await response.json();
      successEmitter("Post added successfully!");
      // console.log("Post Added : ", data);
      navigate("/");
    } catch (error) {
      errorEmitter("Error adding the Post");
      console.log(error);
    }
  };
  useEffect(() => {
    setIsHome(false);
  }, []);
  return (
    <>
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* HEADER */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Create New Post
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Share your thoughts with the community
            </p>
          </div>

          {/* FORM */}
          <div className="space-y-5">
            {/* TITLE */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={post.title}
                onChange={(e) => onChangeFunc(e)}
                placeholder="Enter post title"
                className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* IMAGE URL */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Image URL
              </label>
              <input
                type="text"
                name="postImage"
                value={post.postImage}
                onChange={(e) => {
                  onChangeFunc(e);
                  setPostImg(e.target.value);
                }}
                placeholder="Paste image URL"
                className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                rows={5}
                value={post.description}
                onChange={(e) => onChangeFunc(e)}
                placeholder="Write your post..."
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* IMAGE PREVIEW */}
            {postImg && (
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img src={postImg} className="w-full h-52 object-cover" />
              </div>
            )}

            {/* FILE INPUT */}
            <input
              type="file"
              onChange={(e) => {
                setPostImg(e.target.files);
              }}
              className="text-sm text-gray-500 dark:text-gray-400"
            />

            {/* BUTTON */}
            <button
              onClick={async () => {
                if (!isLogin) {
                  errorEmitter("Login first to add a post");
                  return;
                }
                if (!post.title || !post.description) {
                  errorEmitter("Title or Description cannot be empty");
                  return;
                }
                await addPost();
              }}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow"
            >
              Create Post 🚀
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default CreatePost;
