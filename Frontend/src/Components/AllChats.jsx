import React, { useEffect, useState } from "react";
import { useAllContexts } from "../Contexts/AllContexts";
import Chat from "./Render Components/Chat";
import NoChats from "./NoChats";
import { baseURL } from "../../baseurl";
function AllChats() {
  let {
    allConvos,
    setAllConvos,
    user,
    findAllUnreadMsgs,
    setIsHome,
    setShowFooter,
  } = useAllContexts();
  let [allChatData, setAllChatData] = useState([]);
  let getUser = async (partner) => {
    try {
      let response = await fetch(`${baseURL}/user/api/getuser/${partner}`);
      let data = await response.json();
      // console.log(data.user);
      return data.user;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setShowFooter(true);
  }, []);
  useEffect(() => {
    setIsHome(false);
    let fetchChatData = async () => {
      let tempChatData = await Promise.all(
        allConvos.map(async (elm, idx) => {
          const partner = elm.user1 == user._id ? elm.user2 : elm.user1;
          const partnerState = await getUser(partner);
          const anyunreadState = elm.anyunread;
          const unreadCount = await findAllUnreadMsgs(partner);
          return {
            user: partnerState,
            anyunread: anyunreadState,
            unread: unreadCount,
          };
        }),
      );
      console.log(tempChatData);
      setAllChatData(tempChatData);
    };
    fetchChatData();
    console.log(allChatData);
  }, [allConvos]);
  return (
    <>
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          {/* HEADER */}
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Messages
          </h2>

          {/* CHAT LIST */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
            {allConvos.length > 0 ? (
              allChatData.map((elm, idx) => (
                <Chat
                  key={idx}
                  user={elm.user}
                  anyunread={elm.anyunread}
                  unread={elm.unread}
                />
              ))
            ) : (
              <NoChats />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default AllChats;
