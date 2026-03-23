import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAllContexts } from "../Contexts/AllContexts";

function NoProfile() {
  let { setIsHome, setShowFooter } = useAllContexts();
  useEffect(() => {
    setIsHome(false);
  }, []);
  useEffect(() => {
    setShowFooter(true);
  }, []);
  return (
    <>
      <section className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center space-y-4">
          {/* ICON */}
          <div className="text-6xl">🔍</div>

          {/* TEXT */}
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            No Profiles Found
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            We couldn't find anyone matching your search.
          </p>

          {/* CTA */}
          <NavLink
            to="/"
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Go to Home
          </NavLink>
        </div>
      </section>
    </>
  );
}

export default NoProfile;
