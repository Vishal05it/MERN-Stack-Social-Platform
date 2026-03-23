import React from "react";
import { useAllContexts } from "../../Contexts/AllContexts";
import { errorEmitter, successEmitter } from "../../emitter";
import { useState } from "react";
import { baseURL } from "../../../baseurl";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../../Contexts/LoaderState";

function MyPosts({ userId }) {
  let { showLoader, setShowLoader } = useLoader();
  let {
    allPosts,
    setAllPosts,
    user,
    userToken,
    getAllPosts,
    getMyPosts,
    getAllPostsHome,
    showMyPosts,
    setShowMyPosts,
  } = useAllContexts();
  const navigate = useNavigate();

  return (
    <>
      <label
        htmlFor="Toggle1"
        className="inline-flex items-center space-x-4 cursor-pointer dark:text-gray-100"
      >
        <span>All posts</span>
        <span className="relative">
          <input
            id="Toggle1"
            type="checkbox"
            onChange={async (e) => {
              if (e.target.checked) {
                setShowMyPosts(true);
                await getMyPosts(userId);
                //console.log("Input checked");
              } else if (!e.target.checked) {
                setShowMyPosts(false);
                await getAllPostsHome();
                //console.log("Input Unchecked");
              }
            }}
            className="hidden peer"
          />
          <div
            className="w-10 h-6 rounded-full shadow-inner dark:bg-gray-100 peer-checked:dark:bg-violet-600"
            bis_skin_checked="1"
          ></div>
          <div
            className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:dark:bg-gray-700 peer-checked:left-auto dark:bg-violet-600"
            bis_skin_checked="1"
          ></div>
        </span>
        <span>My Posts</span>
      </label>
    </>
  );
}

export default MyPosts;
