import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAllContexts } from "../../Contexts/AllContexts";
import { errorEmitter, successEmitter } from "../../emitter";
import { baseURL } from "../../../baseurl";
import { timeCalc } from "../../TimeCalculator";
function Blog({
  likes,
  comments,
  author,
  authorDP,
  title,
  description,
  blogImg,
  postId,
  showFullHeart,
  createdBy,
  addedMs,
}) {
  let {
    isLogin,
    user,
    setUser,
    currPost,
    setCurrPost,
    allPosts,
    setAllPosts,
    getCmtCounts,
    likeFunc,
    storeLike,
    removeLike,
    dislikeFunc,
    getOnePost,
  } = useAllContexts();
  let [isCurrUserLiked, setIsCurrUserLiked] = useState(false);
  let [totalCmts, setTotalCmts] = useState(0);

  let navigate = useNavigate();
  let getLikes = async () => {
    if (isLogin) {
      try {
        let response = await fetch(
          `${baseURL}/storelikes/api/getinfo/${user?._id}/${postId}`,
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
    }
  };
  useEffect(() => {
    let checkLikes = async () => {
      let liked = await getLikes(postId);
      setIsCurrUserLiked(liked);
    };
    checkLikes();
  }, [user, postId]);
  useEffect(() => {
    let findCmts = async () => {
      let tempCmts = await getCmtCounts(postId);
      setTotalCmts(tempCmts);
    };
    findCmts();
  }, []);

  return (
    <>
      <article className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition duration-300 flex flex-col">
        {/* IMAGE */}
        <NavLink to={`/onepost/${postId}`}>
          <div className="overflow-hidden">
            <img
              src={
                blogImg
                  ? blogImg
                  : "https://images.unsplash.com/photo-1499750310107-5fef28a66643"
              }
              className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
            />
          </div>
        </NavLink>

        {/* CONTENT */}
        <div className="p-4 flex flex-col flex-1 space-y-3">
          {/* TIME */}
          <span className="text-xs text-gray-400">{timeCalc(addedMs)}</span>

          {/* TITLE */}
          <NavLink to={`/onepost/${postId}`}>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
              {title}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {description}
            </p>
          </NavLink>

          {/* AUTHOR */}
          <div className="flex items-center gap-2 pt-2">
            <img
              src={
                authorDP
                  ? authorDP
                  : "https://www.imanami.com/wp-content/uploads/2016/03/unknown-user.jpg"
              }
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {author}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-between pt-3 text-sm">
            {/* LIKE */}
            <button
              style={{ cursor: "pointer" }}
              onClick={async () => {
                let tempPost = await getOnePost(postId);
                if (isCurrUserLiked) {
                  setCurrPost(await dislikeFunc(tempPost, likes));
                  setIsCurrUserLiked(false);
                } else {
                  setCurrPost(await likeFunc(tempPost, likes));
                  setIsCurrUserLiked(true);
                }
              }}
              className="flex items-center gap-1 text-red-500 hover:scale-105 transition"
            >
              {isLogin && isCurrUserLiked ? "❤️" : "🤍"}
              <span>
                {currPost && postId == currPost._id ? currPost.like : likes}
              </span>
            </button>

            {/* COMMENTS */}
            <span className="text-gray-500 dark:text-gray-400">
              {totalCmts ? totalCmts : 0} comments
            </span>
          </div>
        </div>
      </article>
    </>
  );
}

export default Blog;
