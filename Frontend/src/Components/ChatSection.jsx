import React, { useEffect, useState } from "react";
import { ArrowBigDown, ArrowBigUp, MessageSquarePlus } from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import { useAllContexts } from "../Contexts/AllContexts";
import { useLoader } from "../Contexts/LoaderState";
import { baseURL } from "../../baseurl";
import Message from "./Render Components/Message";
import EmojiPicker from "emoji-picker-react";
import Typing from "./Render Components/Typing";
function ChatSection() {
  let [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  let [typedMessage, setTypedMessage] = useState(0);
  // useEffect(() => {
  //   if (typedMessage == message.length) {
  //     setIsTyping(false);
  //   } else setIsTyping(true);
  // }, [typedMessage]);
  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };
  let {
    isUser,
    setIsUser,
    userFound,
    setUserFound,
    sendMessage,
    getAllMessages,
    allMessages,
    setAllMessages,
    readAllMessages,
    user,
    setIsHome,
    showFooter,
    setShowFooter,
    latestMsgId,
    setLatestMsgId,
    setIsTyping,
    isTyping,
    typingReq,
    stopTypingReq,
    typers,
  } = useAllContexts();
  let { showLoader, setShowLoader } = useLoader();
  let [firstMsgId, setFirstMsgId] = useState("#");
  let param = useParams();
  let getUser = async () => {
    try {
      setShowLoader(true);
      let response = await fetch(
        `${baseURL}/user/api/getuser/${param.toUserId}`,
      );
      let data = await response.json();
      setUserFound(data.user);
      //console.log(data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoader(false);
    }
  };
  useEffect(() => {
    setShowFooter(false);
  }, []);
  useEffect(() => {
    setIsHome(false);
    if (!isUser) {
      getUser();
      // console.log("Running Once!");
      setIsUser(true);
    }
    getAllMessages(param.toUserId);
    readAllMessages(param.toUserId);
  }, [param.userId]);
  useEffect(() => {
    if (allMessages?.length > 0) {
      setFirstMsgId(0);
      setLatestMsgId(allMessages.length - 1);
    }
    if (latestMsgId != "#") {
      let latestMsg = document.querySelector(`#messageSect${latestMsgId}`);
      latestMsg?.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages, latestMsgId]);
  let [typeOnce, setTypeOnce] = useState(false);
  useEffect(() => {
    let trackTyping = async () => {
      if (isTyping) {
        if (!typeOnce) {
          await typingReq(param.toUserId);
          setTypeOnce(true);
        }
      } else {
        await stopTypingReq(param.toUserId);
        setTypeOnce(false);
      }
    };
    trackTyping();
  }, [isTyping]);
  return (
    <>
      <section className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <NavLink to={`/othersprofile/${userFound?._id}`}>
            <img
              src={userFound?.profilepic}
              className="w-10 h-10 rounded-full object-cover"
            />
          </NavLink>
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {userFound?.name}
          </span>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {allMessages.map((elm, idx) => (
            <Message
              key={idx}
              name={elm.messageby.name}
              msgId={idx}
              canedit={elm.canedit}
              msgDataId={elm._id}
              senderid={elm.messageby._id}
              receiverId={elm.messageto._id}
              profilepic={elm.messageby.profilepic}
              message={elm.message}
              addedMs={elm.addedMs}
            />
          ))}
        </div>

        {/* TYPING */}
        {/* {typers.length > 0 && (
          <div className="px-4 text-sm text-gray-500 dark:text-gray-400">
            Typing...
          </div>
        )} */}

        {/* INPUT BAR */}
        <div className="flex items-center gap-2 p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {/* EMOJI */}
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            😊
          </button>

          {/* INPUT */}
          <input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setIsTyping(true);
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
          />

          {/* SEND */}
          <button
            onClick={async () => {
              setIsTyping(false);
              await sendMessage(param.toUserId, message);
              await getAllMessages(param.toUserId);
              setMessage("");
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl"
          >
            Send
          </button>
        </div>

        {/* EMOJI PICKER */}
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-4">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
        {/* FLOATING SCROLL BUTTONS */}
        <div className="fixed right-4 bottom-24 flex flex-col gap-3 z-50">
          {/* SCROLL TO TOP */}
          <button
            onClick={() => {
              let firstMsg = document.querySelector(
                `#messageSect${firstMsgId}`,
              );
              firstMsg?.scrollIntoView({ behavior: "smooth" });
            }}
            className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            ⬆
          </button>

          {/* SCROLL TO BOTTOM */}
          <button
            onClick={() => {
              let latestMsg = document.querySelector(
                `#messageSect${latestMsgId}`,
              );
              latestMsg?.scrollIntoView({ behavior: "smooth" });
            }}
            className="p-3 rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700 transition"
          >
            ⬇
          </button>
        </div>
      </section>
      {/* <div
        style={{
          width: "100vw",
          height: "20vh",
          padding: "0px 130px",
        }}
        className="bg-gray-500"
      >
        {typers.length > 0
          ? typers.map((elm, idx) => {
              if (elm == user._id) {
                return (
                  <div
                    key={idx}
                    style={{
                      float: "right",
                    }}
                  >
                    <Typing />
                  </div>
                );
              } else if (elm == param.toUserId) {
                <div
                  key={idx}
                  style={{
                    float: "left",
                  }}
                >
                  <Typing />
                </div>;
              }
            })
          : ""}
      </div> */}
    </>
  );
}

export default ChatSection;
