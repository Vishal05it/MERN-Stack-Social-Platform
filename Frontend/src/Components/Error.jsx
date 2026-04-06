import React from "react";
import { NavLink } from "react-router-dom";

function Error() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-rose-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-950 dark:to-black">
      <div className="w-full max-w-md text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-10 space-y-6">
        {/* ERROR CODE */}
        <h1 className="text-7xl font-extrabold text-purple-600">404</h1>

        {/* MESSAGE */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Page Not Found
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sorry, the page you are looking for does not exist or has been
            moved.
          </p>
        </div>

        {/* BUTTON */}
        <NavLink
          to="/"
          className="inline-block px-8 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition shadow-md"
        >
          Go Back Home
        </NavLink>
      </div>
    </section>
  );
}

export default Error;
