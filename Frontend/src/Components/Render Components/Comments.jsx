import React, { useEffect, useState } from "react";
import { useAllContexts } from "../../Contexts/AllContexts";
import { baseURL } from "../../../baseurl";
import { NavLink } from "react-router-dom";
import { timeCalc } from "../../TimeCalculator";

function Comments({
  authorimage,
  postedAt,
  likes,
  content,
  commentId,
  postId,
  userId,
  commentBy,
  author,
  canedit,
  addedMs,
}) {
  let {
    userToken,
    getAllComments,
    user,
    currPost,
    editComment,
    blockEditComment,
  } = useAllContexts();

  let [commenter, setCommenter] = useState({});
  let [canEdit, setCanEdit] = useState(false);
  let [editCmt, setEditCmt] = useState(content);

  // 🔹 Fetch commenter
  let getCommenter = async (commentBy) => {
    try {
      let response = await fetch(`${baseURL}/user/api/getuser/${commentBy}`);
      let data = await response.json();
      if (data.success) setCommenter(data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCommenter(commentBy);
  }, []);

  useEffect(() => {
    setEditCmt(content);
  }, [content]);

  // 🔹 Disable editing after 1 min
  useEffect(() => {
    if (commentBy == user._id && canedit && canEdit) {
      setTimeout(async () => {
        await blockEditComment(postId, commentId);
        setCanEdit(false);
      }, 60000);
    }
  }, [canEdit]);

  // 🔹 Delete Comment
  let deleteComment = async () => {
    if (commentBy == user._id || currPost.createdBy == user._id) {
      try {
        await fetch(
          `${baseURL}/comments/api/deletecomment/${postId}/${commentId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              userToken,
            },
          },
        );
        getAllComments(currPost?._id);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
      {/* PROFILE PIC */}
      <NavLink
        to={
          commentBy != user._id
            ? `/othersprofile/${commentBy}`
            : `/profilepage/${user._id}`
        }
      >
        <img
          src={
            commentBy == user._id
              ? user.profilepic
              : commenter?.profilepic || authorimage
          }
          className="w-10 h-10 rounded-full object-cover"
        />
      </NavLink>

      {/* CONTENT */}
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {commentBy == user._id ? user.name : commenter?.name || "User"}
          </span>

          <span className="text-xs text-gray-400">{timeCalc(addedMs)}</span>
        </div>

        {/* COMMENT TEXT / EDIT MODE */}
        {canEdit && canedit ? (
          <input
            type="text"
            value={editCmt}
            onChange={(e) => setEditCmt(e.target.value)}
            className="w-full mt-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 outline-none"
          />
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {content}
          </p>
        )}

        {/* ACTIONS */}
        {(commentBy == user._id || currPost.createdBy == user._id) && (
          <div className="flex gap-3 text-xs mt-2 text-gray-500">
            {/* EDIT */}
            {commentBy == user._id && canedit && (
              <button
                onClick={async () => {
                  if (canEdit) {
                    await editComment(editCmt, postId, commentId);
                    setCanEdit(false);
                  } else {
                    setCanEdit(true);
                  }
                }}
                className="hover:text-indigo-600"
              >
                {canEdit ? "Save" : "Edit"}
              </button>
            )}

            {/* DELETE */}
            <button onClick={deleteComment} className="hover:text-red-500">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Comments;
