import React from "react";
import { useEffect } from "react";
import Blog from "./Render Components/Blog";
import { useState } from "react";
import { useAllContexts } from "../Contexts/AllContexts";
import { baseURL } from "../../baseurl";
import MyPosts from "./Render Components/MyPosts";
import { errorEmitter, successEmitter } from "../emitter";
import NoPost from "./NoPost";
import { useLoader } from "../Contexts/LoaderState";
import { CircleArrowUp } from "lucide-react";

function Home() {
  let {
    allPosts,
    setAllPosts,
    user,
    isLogin,
    getAllPostsHome,
    showMyPosts,
    setShowMyPosts,
    getNotificationsCount,
    gotNotifications,
    setGotNotifications,
    isHome,
    setIsHome,
    showFooter,
    setShowFooter,
  } = useAllContexts();
  let { showLoader, setShowLoader } = useLoader();
  let [page, setPage] = useState(1);
  useEffect(() => {
    setIsHome(true);
    let fetchData = async () => {
      await getAllPostsHome(page);

      if (user) {
        //console.log("User at Home : ", user);
      }
    };
    if (!showMyPosts) {
      fetchData();
    }
    setShowFooter(true);
  }, [page]);
  useEffect(() => {
    if (!gotNotifications) {
      getNotificationsCount();
      setGotNotifications(true);
    }
  }, []);

  return (
    <>
      {allPosts?.length > 0 ? (
        <section className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-800 min-h-screen">
          <div
            id="topSect"
            className="max-w-7xl mx-auto px-4 space-y-10 relative"
          >
            {/* HEADER */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
                Explore Posts
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Discover ideas, share thoughts, and connect with people
              </p>
            </div>

            {/* POSTS GRID */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allPosts.map((elm, idx) => {
                return (
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
                    addedMs={elm.addedMs}
                  />
                );
              })}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-6 pt-6">
              <button
                onClick={() => setPage(--page)}
                className="px-6 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
              >
                Previous
              </button>

              <button
                onClick={() => setPage(++page)}
                className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow"
              >
                Next
              </button>
            </div>
            <div
              style={{ position: "fixed", bottom: "2%", right: "2%" }}
              onClick={() => {
                document
                  .querySelector("#topSect")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              <CircleArrowUp />
            </div>
          </div>
        </section>
      ) : (
        <NoPost />
      )}
    </>
  );
}

export default Home;
