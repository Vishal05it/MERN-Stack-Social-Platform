import React, { useEffect, useState } from "react";
import userImg from "../assets/user-circles-set_78370-4704-removebg-preview.png";
import { useAllContexts } from "../Contexts/AllContexts";
import { NavLink, useParams } from "react-router-dom";
import { baseURL } from "../../baseurl";
import { useLoader } from "../Contexts/LoaderState";
import Blog from "./Render Components/Blog";
import NoPost from "./NoPost";
function ProfilePage() {
  let param = useParams();
  let {
    user,
    isUser,
    setIsUser,
    userFound,
    setUserFound,
    getAllUserPosts,
    allPosts,
    setIsHome,
    setShowFooter,
  } = useAllContexts();
  let { setShowLoader } = useLoader();
  useEffect(() => {
    setShowFooter(true);
  }, []);
  useEffect(() => {
    setIsHome(false);
    let fetchMyPosts = async () => {
      await getAllUserPosts(user._id);
    };
    fetchMyPosts();
  }, []);
  return (
    <>
      <>
        {/* PROFILE HEADER */}
        <section className="bg-gray-50 dark:bg-gray-900 py-10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md p-6 flex flex-col sm:flex-row items-center gap-6">
              {/* PROFILE PIC */}
              <img
                src={user?.profilepic}
                className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
              />

              {/* INFO */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  {user?.name}
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.bio || "No bio available"}
                </p>

                {/* DETAILS */}
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <p>📧 {user?.email}</p>
                  <p>
                    📞 {user?.phoneno ? user?.phoneno : "Unavailable or Hidden"}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <NavLink to="/updateprofile">
                <button className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
                  Edit Profile
                </button>
              </NavLink>
            </div>
          </div>
        </section>

        {/* POSTS SECTION */}
        <section className="bg-gray-50 dark:bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-4 space-y-6">
            {/* HEADER */}
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Your Posts
            </h3>

            {/* POSTS GRID */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allPosts.length > 0 ? (
                allPosts.map((elm, idx) => (
                  <Blog
                    key={idx}
                    likes={elm.like}
                    comments={elm.comments}
                    author={elm.author}
                    authorDP={elm.authorimage}
                    title={elm.title}
                    description={elm.description}
                    blogImg={elm.postImage}
                    postId={elm._id}
                    userId={user._id}
                    createdBy={elm.createdBy}
                  />
                ))
              ) : (
                <NoPost />
              )}
            </div>
          </div>
        </section>
      </>
    </>
  );
}

export default ProfilePage;
