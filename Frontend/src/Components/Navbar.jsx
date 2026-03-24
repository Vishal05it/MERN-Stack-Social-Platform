import React, { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAllContexts } from "../Contexts/AllContexts";
import userImg from "../assets/user-circles-set_78370-4704-removebg-preview.png";
import MyPosts from "./Render Components/MyPosts";
import { useState } from "react";
import { useLoader } from "../Contexts/LoaderState";
import ButtonLoader from "./Render Components/ButtonLoader";
import {
  BellRing,
  CirclePlus,
  House,
  MailPlus,
  MessageSquare,
  UserRoundPlus,
  UserSearch,
} from "lucide-react";
import { errorEmitter } from "../emitter";
function Navbar() {
  let {
    lightModeFunc,
    darkModeFunc,
    theme,
    setTheme,
    isLogin,
    setIsLogin,
    sideBarAnim,
    user,
    setSideBarAnim,
    searchPost,
    totalNot,
    setTotalNot,
    actualNot,
    setActualNot,
    getNotifications,
    getUnreadMessages,
    unReadMsg,
    setUnReadMsg,
    searchUser,
    allSearchUser,
    setAllSearchUser,
    getAllConvos,
    showMyPosts,
    setShowMyPosts,
  } = useAllContexts();
  let searchPostRef = useRef();
  let searchUserRef = useRef();
  const navigate = useNavigate();
  let { showBtnLoader, setShowBtnLoader } = useLoader();
  let iconRef = useRef();
  let toggleTheme = () => {
    let htmlTag = document.querySelector("html");
    if (theme == "dark") {
      lightModeFunc();
    } else darkModeFunc();
    htmlTag.classList.remove("light");
    htmlTag.classList.remove("dark");
    htmlTag.classList.add(theme);
    localStorage.setItem("theme", theme);
  };
  let [searchPostState, setSearchPostState] = useState("");
  let [searchUserState, setSearchUserState] = useState("");
  useEffect(() => {
    toggleTheme();
    let fetchReq = async () => {
      await getNotifications();
      await getUnreadMessages();
      await getAllConvos();
    };
    fetchReq();
  }, []);
  // useEffect(() => {
  //   if (theme == "light") {
  //     iconRef?.current?.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
  //   } else if (theme == "dark") {
  //     iconRef?.current?.innerHTML = ` <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           width="24"
  //           height="24"
  //           viewBox="0 0 24 24"
  //           style={{ position: "absolute", top: "40%", right: "30%" }}
  //           fill="none"
  //           stroke="currentColor"
  //           stroke-width="2"
  //           stroke-linecap="round"
  //           stroke-linejoin="round"
  //           className="lucide lucide-moon-star-icon lucide-moon-star"><path d="M18 5h4" />
  //           <path d="M20 3v4" />
  //           <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
  //         </svg>`;
  //   }
  // }, [theme]);
  let { userToken, setUserToken, isHome, setIsHome } = useAllContexts();
  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <NavLink to="/">
              <div className="flex items-center gap-2 font-semibold text-lg">
                <span className="text-indigo-600">Dev</span>
                <span className="text-gray-800 dark:text-gray-200">
                  Connect
                </span>
              </div>
            </NavLink>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-2 text-sm font-medium">
              <NavLink
                to=""
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <House size={18} /> Home
              </NavLink>

              {isLogin && user ? (
                <NavLink
                  to="/createpost"
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <CirclePlus size={18} /> Create
                </NavLink>
              ) : (
                <NavLink
                  to="/login"
                  className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Login
                </NavLink>
              )}

              {!isLogin ? (
                <NavLink
                  to="/signup"
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <UserRoundPlus size={18} /> Signup
                </NavLink>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* SEARCH */}
          <div className="hidden md:flex items-center w-1/3">
            <div className="relative w-full">
              <input
                type="search"
                ref={searchPostRef}
                value={searchPostState}
                onChange={(e) => setSearchPostState(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  if (!searchPostState) {
                    errorEmitter("Please enter avalid input");
                    return;
                  }
                  await searchPost(searchPostState);
                  setSearchPostState("");
                  navigate("/");
                  searchPostRef.current.value = "";
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                🔍
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {isLogin && (
              <>
                <div className="hidden lg:flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-xl">
                  <UserSearch
                    onClick={async () => {
                      if (!searchUserState) {
                        errorEmitter("Please enter a valid input");
                        return;
                      }
                      await searchUser(searchUserState);
                      setSearchUserState("");
                      searchUserRef.current.value = "";
                      navigate(`/searchuser/${searchUserState}`);
                    }}
                    size={16}
                    className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    ref={searchUserRef}
                    value={searchUserState}
                    onChange={(e) => setSearchUserState(e.target.value)}
                    placeholder="Search users..."
                    className="bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 "
                  />
                </div>
                {/* Notifications */}
                <NavLink
                  to="/notifications"
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <BellRing
                    size={20}
                    className="text-gray-700 dark:text-gray-300"
                  />
                  {totalNot > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow">
                      {totalNot}
                    </span>
                  )}
                </NavLink>

                {/* Messages */}
                <NavLink
                  to="/allchats"
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <MessageSquare
                    size={20}
                    className="text-gray-700 dark:text-gray-300"
                  />
                  {unReadMsg > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow">
                      {unReadMsg}
                    </span>
                  )}
                </NavLink>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              ref={iconRef}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
            >
              🌗
            </button>
            {isLogin && isHome && (
              <div className="relative">
                <button
                  onClick={() => setShowMyPosts(!showMyPosts)}
                  className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Filter
                </button>

                {showMyPosts && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-2 z-50">
                    <MyPosts userId={user._id} />
                  </div>
                )}
              </div>
            )}
            {/* Profile */}
            {isLogin ? (
              <img
                src={user?.profilepic}
                className="h-10 w-10 rounded-full object-cover cursor-pointer border-2 border-indigo-500 shadow-sm hover:scale-105 transition"
                onClick={() => setSideBarAnim(`showBar`)}
              />
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition shadow-sm"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
