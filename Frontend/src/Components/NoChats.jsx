import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAllContexts } from "../Contexts/AllContexts";

function NoChats() {
  let { setIsHome, setShowFooter } = useAllContexts();
  useEffect(() => {
    setIsHome(false);
  }, []);
  useEffect(() => {
    setShowFooter(true);
  }, []);
  return (
    <>
      <section className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="text-6xl">💬</div>

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            No Conversations Yet
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Start chatting with people and your conversations will appear here.
          </p>

          <NavLink
            to="/"
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Explore Posts
          </NavLink>
        </div>
      </section>
    </>
  );
}

export default NoChats;
