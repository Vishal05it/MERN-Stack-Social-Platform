import React, { useEffect } from "react";
import { useAllContexts } from "../Contexts/AllContexts";
import { NavLink, useParams } from "react-router-dom";
import NoProfile from "./NoProfile";

function SearchProfiles() {
  let { allSearchUser, user, setIsHome, setShowFooter } = useAllContexts();
  useEffect(() => {
    setIsHome(false);
  }, []);
  useEffect(() => {
    setShowFooter(true);
  }, []);
  let param = useParams();
  return (
    <>
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          {/* HEADER */}
          <div className="text-center space-y-2">
            <p className="text-sm uppercase text-gray-500 dark:text-gray-400 tracking-wider">
              Search Results
            </p>

            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
              People named "{param?.keyword}"
            </h1>
          </div>

          {/* RESULTS */}
          {allSearchUser.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {allSearchUser.map((elm, idx) => (
                <NavLink
                  key={idx}
                  to={
                    elm._id == user._id
                      ? `/profilepage/${user._id}`
                      : `/othersprofile/${elm._id}`
                  }
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition cursor-pointer">
                    {/* PROFILE PIC */}
                    <img
                      src={elm?.profilepic}
                      className="w-16 h-16 rounded-full object-cover mx-auto"
                    />

                    {/* INFO */}
                    <div className="text-center mt-4 space-y-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {elm?.name}
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {elm?.bio || "No bio available"}
                      </p>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          ) : (
            <NoProfile />
          )}
        </div>
      </section>
    </>
  );
}

export default SearchProfiles;
