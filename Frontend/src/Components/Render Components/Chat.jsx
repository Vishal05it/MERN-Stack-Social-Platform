import React, { useEffect, useState } from "react";
import { baseURL } from "../../../baseurl";
import { useAllContexts } from "../../Contexts/AllContexts";
import { useLoader } from "../../Contexts/LoaderState";
import { NavLink } from "react-router-dom";

function Chat({ user, anyunread, unread, id }) {
  // let { setUserFound, userFound, findAllUnreadMsgs } = useAllContexts();
  // let [chatUserFound, setChatUserFound] = useState(false);
  // let { setShowLoader } = useLoader();
  // let [totalUnread, setTotalUnread] = useState(0);
  return (
    <>
      <NavLink to={`/messages/${user?._id}`}>
        <div
          className={`flex items-center gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer ${unread > 0 ? "bg-indigo-50 dark:bg-gray-700/50" : ""}`}
        >
          {/* PROFILE PIC */}
          <img
            src={user?.profilepic}
            className="w-12 h-12 rounded-full object-cover"
          />

          {/* TEXT */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {user?.name}
              </span>

              {unread > 0 && (
                <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                  {unread}
                </span>
              )}
            </div>

            <span className="text-sm text-gray-500 dark:text-gray-400">
              {unread > 0 ? `${unread} new messages` : "No new messages"}
            </span>
          </div>
        </div>
      </NavLink>
    </>
  );
}

export default Chat;
