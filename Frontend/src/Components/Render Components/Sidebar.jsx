import React, { useRef, useState } from "react";
import userImg from "../../assets/user-circles-set_78370-4704-removebg-preview.png";
import { useAllContexts } from "../../Contexts/AllContexts";
import { NavLink, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { errorEmitter } from "../../emitter";
function Sidebar() {
  let {
    sideBarAnim,
    setSideBarAnim,
    setIsLogin,
    setUser,
    user,
    setIsUser,
    setUserFound,
    setOtpSent,
    setAllNotifications,
    setGotNotifications,
    setUserState,
    setPostState,
    setAllSearchUser,
    setAllMessages,
    setUnReadMsg,
    searchPost,
    searchUser,
  } = useAllContexts();
  let [searchPostState, setSearchPostState] = useState("");
  let [searchUserState, setSearchUserState] = useState("");
  let searchPostRef = useRef();
  let searchUserRef = useRef();
  const navigate = useNavigate();
  return (
    <>
      <div
        className="fixed top-0 right-0 h-full w-72 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border-l border-gray-200 dark:border-gray-700 shadow-xl z-50 transition-all duration-500"
        style={{
          animation: `${sideBarAnim} 0.5s ease forwards`,
        }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <img
              src={user?.profilepic}
              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
            />
            <div>
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {user ? user.name : "User"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Welcome back 👋
              </p>
            </div>
          </div>

          <button
            style={{ cursor: "pointer" }}
            onClick={() => setSideBarAnim(`hideBar`)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-red-500"
          >
            ✕
          </button>
        </div>

        {/* MENU */}
        <div className="px-3 py-4 space-y-1 text-sm">
          {/* PROFILE */}
          <NavLink
            to={`/profilepage/${user._id}`}
            onClick={() => {
              setIsUser(false);
              setSideBarAnim("hideBar");
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
          >
            <User size={18} />
            <span>View Profile</span>
          </NavLink>

          {/* SEARCH */}
          {/* <div
            onClick={() => setSideBarAnim("hideBar")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            🔍
            <span>Search</span>
          </div> */}

          {/* CHAT */}
          <NavLink to="/">
            <div
              onClick={() => setSideBarAnim("hideBar")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              🏠
              <span>Home</span>
            </div>
          </NavLink>
          <NavLink to="/allchats">
            <div
              onClick={() => setSideBarAnim("hideBar")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              💬
              <span>Chat</span>
            </div>
          </NavLink>
          <NavLink to="/notifications">
            <div
              onClick={() => setSideBarAnim("hideBar")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              🔔
              <span>Notifications</span>
            </div>
          </NavLink>
          <NavLink to="/createpost">
            <div
              onClick={() => setSideBarAnim("hideBar")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              ➕<span>Create Post</span>
            </div>
          </NavLink>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300 cursor-pointer">
            <span
              style={{ cursor: "pointer" }}
              onClick={async (e) => {
                e.preventDefault();
                if (!searchPostState) {
                  errorEmitter("Please enter avalid input");
                  return;
                }
                navigate("/");
                await searchPost(searchPostState);
                setSearchPostState("");
                searchPostRef.current.value = "";
              }}
            >
              ❔
            </span>
            <span>
              <input
                type="text"
                ref={searchPostRef}
                className="dark:text-gray-50 dark:border-gray-100 light:text-gray-800 light:border-gray-800 p-1"
                value={searchPostState}
                onChange={(e) => setSearchPostState(e.target.value)}
                placeholder="Search Posts..."
              />
            </span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300 cursor-pointer">
            <span
              style={{ cursor: "pointer" }}
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
            >
              🔍
            </span>
            <span>
              <input
                type="text"
                ref={searchUserRef}
                className="dark:text-gray-50 dark:border-gray-100 light:text-gray-800 light:border-gray-800 p-1"
                value={searchUserState}
                onChange={(e) => setSearchUserState(e.target.value)}
                placeholder="Search Users..."
              />
            </span>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

        {/* SETTINGS */}
        <div className="px-3 space-y-1 text-sm">
          <NavLink
            to="/updateprofile"
            onClick={() => setSideBarAnim("hideBar")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
          >
            ⚙️
            <span>Settings</span>
          </NavLink>

          <NavLink
            to="/updateemailpass"
            onClick={() => setSideBarAnim("hideBar")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
          >
            🔐
            <span>Change Password/Email</span>
          </NavLink>
        </div>

        {/* LOGOUT */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
          <NavLink
            to="/login"
            onClick={() => {
              localStorage.removeItem("userToken");
              localStorage.setItem("isLogin", false);
              setUser({});
              setSideBarAnim("hideBar");
              localStorage.setItem("user", JSON.stringify({}));
              setIsLogin(false);
              setIsUser(false);
              setUserFound({});
              setOtpSent(false);
              localStorage.removeItem("otpSent");
              localStorage.removeItem("totalNot");
              setGotNotifications(false);
              setAllNotifications({});
              setPostState({});
              setUserState({});
              setAllNotifications([]);
              setUnReadMsg(0);
              setAllConvos([]);
            }}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            🚪 Logout
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
