import React, { useEffect } from "react";
import { useAllContexts } from "../Contexts/AllContexts";
import OneNotification from "./Render Components/OneNotification";
import NoNotifications from "./NoNotifications";
import { baseURL } from "../../baseurl";
import { errorEmitter, successEmitter } from "../emitter";

function NotificationsSection() {
  let {
    allNotifications,
    setAllNotifications,
    actualNot,
    setActualNot,
    totalNot,
    setTotalNot,
    userToken,
    user,
    getAllNotifications,
    setIsHome,
    setShowFooter,
  } = useAllContexts();
  useEffect(() => {
    setShowFooter(true);
  }, []);
  let clearNotifications = async () => {
    try {
      let response = await fetch(
        `${baseURL}/notification/api/readallnotifications/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            userToken,
          },
        },
      );
      let data = await response.json();
      // console.log(data);
      if (data.success) {
        // successEmitter(data.message);
        setTotalNot(0);
        localStorage.setItem("totalNot", 0);
      } else errorEmitter(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsHome(false);
    let clearNots = async () => {
      await getAllNotifications();
      await clearNotifications();
    };
    clearNots();
  }, []);
  return (
    <>
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Notifications
            </h2>
          </div>

          {/* LIST */}
          <div className="space-y-3">
            {allNotifications?.length > 0 ? (
              allNotifications.map((elm, idx) => (
                <OneNotification
                  key={idx}
                  user={elm.byuser}
                  type={elm.typeofnotification}
                  post={elm.post}
                  time={elm.createdAt}
                  addedMs={elm.addedMs}
                />
              ))
            ) : (
              <NoNotifications />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default NotificationsSection;
