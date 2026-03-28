import React, { useEffect, useState } from "react";
import Comments from "./Render Components/Comments";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { baseURL } from "../../baseurl";
import { useAllContexts } from "../Contexts/AllContexts";
import { errorEmitter, successEmitter } from "../emitter";
import NoPost from "./NoPost";
import { MessageSquarePlus } from "lucide-react";
import { timeCalc } from "../TimeCalculator";

function OnePost() {
  let param = useParams();
  const navigate = useNavigate();
  let [content, setContent] = useState("");
  let {
    currPost,
    setCurrPost,
    isLogin,
    userToken,
    user,
    setUser,
    allComments,
    blockEditComment,
    setAllComments,
    postNotifications,
    setIsHome,
    setShowFooter,
  } = useAllContexts();
  useEffect(() => {
    setShowFooter(true);
  }, []);
  let [totalCmts, setTotalCmts] = useState(0);
  let [writing, setWriting] = useState(false);
  let getCmtCounts = async (postId) => {
    try {
      let response = await fetch(
        `${baseURL}/comments/api/getallcomments/${postId}`,
      );
      let data = await response.json();
      //console.log(data.totalComments);
      return data.totalComments;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };
  useEffect(() => {
    setIsHome(false);
    console.log(param.postId);
    getOnePostShow();
    getAllComments();
    // console.log("User at OnePost", user);
    // console.log("Current ms : " + Date.now());
    setTimeout(() => {
      // console.log("Now ms : " + Date.now());
    }, 60000);
  }, []);
  // useEffect(() => {
  //   getOnePostShow();
  //   getAllComments();
  // }, [currPost]);
  useEffect(() => {
    let findCmts = async () => {
      let tempCmts = await getCmtCounts(param.postId);
      setTotalCmts(tempCmts);
    };
    findCmts();
  }, []);

  let [isCurrUserLiked, setIsCurrUserLiked] = useState(false);

  useEffect(() => {
    let checkLikes = async () => {
      let liked = await getLikes();
      setIsCurrUserLiked(liked);
    };
    checkLikes();
  }, [user, param.postId]);

  let getOnePost = async (postId) => {
    try {
      let response = await fetch(`${baseURL}/posts/api/getone/${postId}`);
      let dataFound = await response.json();
      let post = dataFound.post;
      setCurrPost(post);
      return post;
    } catch (error) {
      console.log(error);
    }
  };
  let deletePost = async (postId) => {
    try {
      let response = await fetch(`${baseURL}/posts/api/deletepost/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let dataFound = await response.json();
      //console.log(dataFound);
      let post = dataFound.deletedPost;
      setCurrPost(null);
      successEmitter(dataFound.message);
      // await removeAllComments(param.postId);
      return post;
    } catch (error) {
      console.log(error);
    }
  };

  let getAllComments = async () => {
    try {
      let response = await fetch(
        `${baseURL}/comments/api/getallcomments/${param.postId}`,
      );
      let data = await response.json();
      //  console.log(data);
      setAllComments(data.allComments);
    } catch (error) {
      console.log(error);
    }
  };

  let postComment = async (content) => {
    try {
      if (!isLogin) {
        errorEmitter("Login first to like/comment");
        navigate("/login");
      }
      if (!content || content == "") {
        errorEmitter("Cannot post empty comment");
        return;
      }
      let response = await fetch(
        `${baseURL}/comments/api/postcomment/${param.postId}/${user?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            userToken: userToken,
          },
          body: JSON.stringify({
            content,
            author: user?.name,
            authorimg: user?.profilepic,
            addedMs: Date.now(),
          }),
        },
      );
      let data = await response.json();
      //console.log(data);
      setAllComments([...allComments, data.comment]);
      setWriting(false);
      await getAllComments();
      await postNotifications(param.postId, "comment");
      setTimeout(async () => {
        console.log("Now ms : " + Date.now() + " so editing is not possible");
        await blockEditComment(param.postId, data.comment._id);
      }, 60000);
    } catch (error) {
      console.log(error);
    }
  };

  let dislikeFunc = async (postFound) => {
    if (isLogin) {
      let response = await fetch(
        `${baseURL}/posts/api/dislikepost/${postFound._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            userToken: localStorage.getItem("userToken"),
          },
          body: JSON.stringify({
            like: currPost?.like,
          }),
        },
      );
      let data = await response.json();
      // successEmitter(data.message);
      // console.log("disLiked Post : ");
      // console.log(data.newPost);
      await removeLike();
      return data.newPost;
    } else {
      errorEmitter("Login in first to like/comment");
      navigate("/login");
    }
  };
  let getLikes = async () => {
    try {
      let response = await fetch(
        `${baseURL}/storelikes/api/getinfo/${user?._id}/${param.postId}`,
      );
      let data = await response.json();
      // console.log(data);
      if (data.success) {
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  let removeLike = async () => {
    try {
      let response = await fetch(
        `${baseURL}/storelikes/api/dislike/${user._id}/${param.postId}`,
        {
          method: "DELETE",
        },
      );
      let data = await response.json();
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  let storeLike = async () => {
    try {
      let response = await fetch(
        `${baseURL}/storelikes/api/like/${user?._id}/${param.postId}`,
        {
          method: "POST",
        },
      );
      let data = await response.json();
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  let likeFunc = async (postFound) => {
    if (isLogin) {
      let response = await fetch(
        `${baseURL}/posts/api/likepost/${postFound._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            userToken: localStorage.getItem("userToken"),
          },
          body: JSON.stringify({
            like: currPost?.like,
          }),
        },
      );
      let data = await response.json();
      // successEmitter(data.message);
      // console.log("Liked Post : ");
      // console.log(data.newPost);
      await storeLike();
      await postNotifications(param.postId, "like");
      return data.newPost;
    } else {
      errorEmitter("Login in first to like/comment");
      navigate("/login");
    }
  };

  let getOnePostShow = async () => {
    try {
      let response = await fetch(`${baseURL}/posts/api/getone/${param.postId}`);
      let data = await response.json();
      // console.log(data);
      setCurrPost(data.post);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {currPost ? (
        <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-6">
            {/* LEFT → POST */}

            <div className="relative lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              {/* IMAGE */}

              <img
                src={
                  currPost?.postImage ||
                  "https://images.unsplash.com/photo-1499750310107-5fef28a66643"
                }
                className="w-full h-72 object-cover"
              />
              {/* EDIT / DELETE ICONS */}
              {currPost?.createdBy == user?._id && (
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  {/* EDIT */}
                  <NavLink
                    to={`/editpost/${currPost?._id}/${currPost?.title}/${currPost?.description}`}
                    className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-full hover:bg-indigo-100 dark:hover:bg-gray-700 transition shadow"
                  >
                    ✏️
                  </NavLink>

                  {/* DELETE */}
                  <button
                    onClick={async () => {
                      await deletePost(currPost?._id);
                      navigate("/");
                    }}
                    className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-full hover:bg-red-100 dark:hover:bg-red-600/30 transition shadow"
                  >
                    🗑
                  </button>
                </div>
              )}
              {/* CONTENT */}
              <div className="p-6 space-y-4">
                <span className="text-xs text-gray-400">
                  Posted {timeCalc(currPost?.addedMs)}
                </span>

                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  {currPost?.title}
                </h1>

                <p className="text-gray-600 dark:text-gray-300">
                  {currPost?.description}
                </p>

                {/* ACTIONS */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={async () => {
                      let tempPost = await getOnePost(currPost._id);
                      if (isCurrUserLiked) {
                        setCurrPost(await dislikeFunc(tempPost));
                        setIsCurrUserLiked(false);
                      } else {
                        setCurrPost(await likeFunc(tempPost));
                        setIsCurrUserLiked(true);
                      }
                    }}
                    className="flex items-center gap-2 text-red-500"
                  >
                    {isLogin && isCurrUserLiked ? "❤️" : "🤍"}
                    <span>{currPost.like}</span>
                  </button>

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {totalCmts} comments
                  </span>
                </div>

                {/* AUTHOR */}
                <NavLink
                  to={
                    currPost?.createdBy == user._id
                      ? `/profilepage/${currPost?.createdBy}`
                      : `/othersprofile/${currPost?.createdBy}`
                  }
                  className="flex items-center gap-3 pt-4"
                >
                  <img
                    src={currPost?.authorimage}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {currPost?.author}
                  </span>
                </NavLink>
              </div>
            </div>

            {/* RIGHT → COMMENTS */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-[80vh]">
              {/* ADD COMMENT */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-2">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => {
                    setWriting(true);
                    setContent(e.target.value);
                  }}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
                />

                <button
                  onClick={async () => {
                    if (content) await postComment(content);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                >
                  Post
                </button>
              </div>

              {/* COMMENTS LIST */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {allComments?.map((elm, idx) => (
                  <Comments
                    key={idx}
                    authorimage={elm.authorimg}
                    postedAt={elm.createdAt}
                    likes={elm.likes}
                    content={elm.content}
                    commentId={elm._id}
                    postId={param.postId}
                    userId={user?._id}
                    commentBy={elm.commentby}
                    author={elm.author}
                    addedMs={elm.addedMs}
                    canedit={elm.canedit}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <NoPost />
      )}
    </>
  );
}

export default OnePost;
