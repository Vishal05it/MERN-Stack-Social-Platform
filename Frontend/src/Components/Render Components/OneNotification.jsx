import React, { useEffect, useState } from "react";
import { useAllContexts } from "../../Contexts/AllContexts";
import { baseURL } from "../../../baseurl";
import { useLoader } from "../../Contexts/LoaderState";
import { errorEmitter, successEmitter } from "../../emitter";
import { NavLink } from "react-router-dom";
import { timeCalc } from "../../TimeCalculator";

function OneNotification({ user, type, post, time, addedMs }) {
  let {
    getOnePost,
    gotNotifications,
    setGotNotifications,

    setPostState,

    setUserState,
    userToken,
  } = useAllContexts();
  let { setShowLoader } = useLoader();
  return (
    <>
      <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition">
        {/* USER DP */}
        <NavLink to={`/othersprofile/${user._id}`}>
          <img
            src={user?.profilepic}
            className="w-10 h-10 rounded-full object-cover"
          />
        </NavLink>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">{user?.name}</span>{" "}
            {type == "like" ? "liked" : "commented on"} your post
          </p>

          <span className="text-xs text-gray-400">{timeCalc(addedMs)}</span>
        </div>

        {/* POST IMAGE */}
        <NavLink to={`/onepost/${post._id}`}>
          <img
            src={
              post?.postImage
                ? post?.postImage
                : "https://images.unsplash.com/photo-1499750310107-5fef28a66643"
            }
            className="w-14 h-14 rounded-lg object-cover"
          />
        </NavLink>
      </div>
    </>
  );
}

export default OneNotification;
