import React, { useEffect, useState } from "react";
import { useAllContexts } from "../../Contexts/AllContexts";
import { timeCalc } from "../../TimeCalculator";
import Typing from "./Typing";

function Message({
  name,
  profilepic,
  senderid,
  message,
  msgId,
  addedMs,
  msgDataId,
  receiverId,
  canedit,
}) {
  let {
    user,
    latestMsgId,
    setLatestMsgId,
    isTyping,
    editMessage,
    deleteMessage,
    getAllMessages,
  } = useAllContexts();
  let [canEdit, setCanEdit] = useState(false);
  let [newMessage, setNewMessage] = useState(message);

  // useEffect(() => {
  //   console.log(msgId);
  // }, []);
  return (
    <>
      <div
        id={`messageSect${msgId}`}
        className={`flex items-end gap-2 ${
          senderid === user._id ? "justify-end" : "justify-start"
        }`}
      >
        {/* SHOW DP ONLY FOR RECEIVED MESSAGES */}
        {senderid !== user._id && (
          <img src={profilepic} className="w-8 h-8 rounded-full object-cover" />
        )}

        <div className="max-w-xs sm:max-w-md">
          {/* MESSAGE BUBBLE */}
          <div
            className={`px-4 py-2 rounded-2xl text-sm ${
              senderid === user._id
                ? "bg-indigo-600 text-white rounded-br-none"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
            }`}
          >
            {canEdit && canedit ? (
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="bg-transparent outline-none w-full"
              />
            ) : (
              message
            )}
          </div>

          {/* META + ACTIONS */}
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
            <span>{timeCalc(addedMs)}</span>

            {senderid === user._id && canedit && (
              <>
                <button
                  onClick={async () => {
                    if (canEdit) {
                      await editMessage(msgDataId, newMessage);
                      await getAllMessages(receiverId);
                      setCanEdit(false);
                    } else setCanEdit(true);
                  }}
                >
                  {canEdit ? "Save" : "Edit"}
                </button>
              </>
            )}
            {senderid === user._id && (
              <button
                onClick={async () => {
                  await deleteMessage(msgDataId);
                  await getAllMessages(receiverId);
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Message;
