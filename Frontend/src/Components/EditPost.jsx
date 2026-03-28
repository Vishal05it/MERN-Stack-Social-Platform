import React, { useEffect, useState } from "react";
import { useAllContexts } from "../Contexts/AllContexts";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL } from "../../baseurl";
import { errorEmitter, successEmitter } from "../emitter";
import { useLoader } from "../Contexts/LoaderState";

function EditPost() {
  let param = useParams();
  let [postImg, setPostImg] = useState("");
  const navigate = useNavigate();
  let { user, currPost, setCurrPost, setIsHome, setShowFooter } =
    useAllContexts();
  let { showLoader, setShowLoader } = useLoader();
  useEffect(() => {
    setShowFooter(true);
  }, []);
  let [post, setPost] = useState({
    title: "",
    description: "",
    postImage: "",
  });
  let onChangeFunc = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };
  let getOnePost = async (postId) => {
    try {
      let response = await fetch(`${baseURL}/posts/api/getone/${postId}`);
      let dataFound = await response.json();
      let post = dataFound.post;
      setPost({ ...post, postImage: post.postImage });
      setCurrPost(post);
      return post;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setIsHome(false);
    let initPost = async () => {
      await getOnePost(param.postId);
    };
    initPost();
  }, []);
  let editPost = async () => {
    try {
      let formData = new FormData();
      formData.append("title", post.title);
      formData.append("description", post.description);

      formData.append("postImage", post.postImage);

      formData.append("addedMs", Date.now());
      setShowLoader(true);
      let response = await fetch(
        `${baseURL}/posts/api/updatepost/${param.postId}`,
        {
          method: "PUT",
          headers: {
            userToken: localStorage.getItem("userToken"),
          },
          body: formData,
        },
      );
      let data = await response.json();
      successEmitter("Post updated successfully!");
      console.log("Post Updated : ", data);
      navigate(`/onepost/${param.postId}`);
    } catch (error) {
      errorEmitter("Error updating the Post");
      console.log(error);
    } finally {
      setShowLoader(false);
    }
  };
  return (
    <>
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* HEADER */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Edit Post ✏️
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update your post details
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
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* IMAGE PREVIEW */}
            {currPost.postImage && (
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={post.postImage ? post.postImage : currPost.postImage}
                  className="w-full h-52 object-cover"
                />
              </div>
            )}

            {/* FILE INPUT */}
            <input
              type="file"
              onChange={(e) => {
                let file = e.target.files[0];
                setPost({ ...post, postImage: file });
                setPostImg(URL.createObjectURL(file));
              }}
              className="text-sm text-gray-500 dark:text-gray-400"
            />

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  await editPost();
                }}
                className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow"
              >
                Update Post
              </button>

              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default EditPost;
