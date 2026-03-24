import React from "react";
import { NavLink } from "react-router-dom";
import { useAllContexts } from "../Contexts/AllContexts";
function Footer() {
  let { user } = useAllContexts();
  return (
    <>
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-0.5">
        <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* BRAND */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              DevConnect
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              A modern platform to share ideas, connect with developers, and
              build your presence.
            </p>
          </div>

          {/* PRODUCT */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Product
            </h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li className="hover:text-indigo-600 cursor-pointer">
                <NavLink
                  to="/"
                  onClick={() => {
                    let topSect = document.querySelector("#topSect");
                    topSect?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Home
                </NavLink>
              </li>
              <li className="hover:text-indigo-600 cursor-pointer">
                <NavLink to="/createpost"> Create Post</NavLink>
              </li>
              <li className="hover:text-indigo-600 cursor-pointer">
                <NavLink to="/allchats">Chats</NavLink>{" "}
              </li>
              <li className="hover:text-indigo-600 cursor-pointer">
                <NavLink to={`/profilepage/${user?._id}`}> Profile</NavLink>
              </li>
            </ul>
          </div>

          {/* ACCOUNT */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Account
            </h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li className="hover:text-indigo-600 cursor-pointer">
                <NavLink to="/login">Login</NavLink>{" "}
              </li>
              <li className="hover:text-indigo-600 cursor-pointer">
                <NavLink to="/signup">Signup</NavLink>
              </li>
              <li className="hover:text-indigo-600 cursor-pointer">
                <NavLink to="/updateprofile">Settings</NavLink>
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Connect
            </h3>
            <div className="flex gap-3 text-gray-500 dark:text-gray-400">
              <a
                href="https://my-portfolio-7ffo.vercel.app/"
                target="_blank"
                className="hover:text-indigo-600 cursor-pointer"
              >
                🌐
              </a>
              <a
                target="_blank"
                href="https://www.linkedin.com/in/vishal-tiwari-17684822a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                className="hover:text-indigo-600 cursor-pointer"
              >
                💼
              </a>
              <a
                target="_blank"
                href="https://github.com/Vishal05it"
                className="hover:text-indigo-600 cursor-pointer"
              >
                😼
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-200 dark:border-gray-700 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} DevConnect. All rights reserved.
        </div>
      </footer>
    </>
  );
}

export default Footer;
