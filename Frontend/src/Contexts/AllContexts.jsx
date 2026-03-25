import React, { createContext, useContext, useState } from "react";
import { baseURL } from "../../baseurl";
import { useLoader } from "./LoaderState";
import { errorEmitter, successEmitter } from "../emitter";

const allContexts = createContext();
function AllContexts({ children }) {
  let { setShowLoader, setShowBtnLoader } = useLoader();
  let [isUser, setIsUser] = useState(false);
  let [showFooter, setShowFooter] = useState(true);
  let [isTyping, setIsTyping] = useState(false);
  let [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  let [themeIcon, setThemeIcon] = useState(
    localStorage.getItem("themeIcon") || "moon",
  );
  let [userToken, setUserToken] = useState(
    localStorage.getItem("userToken") || null,
  );
  let [isHome, setIsHome] = useState(false);
  let [currPost, setCurrPost] = useState({});
  let [allNotifications, setAllNotifications] = useState([]);
  let [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {},
  );
  let [allPosts, setAllPosts] = useState([]);
  let [allConvos, setAllConvos] = useState([]);
  let [userFound, setUserFound] = useState({});
  let [otpSent, setOtpSent] = useState(
    JSON.parse(localStorage.getItem("otpSent")) || false,
  );
  let lightModeFunc = () => {
    setTheme("light");
    localStorage.setItem("theme", "light");
  };
  let darkModeFunc = () => {
    setTheme("dark");
    localStorage.setItem("theme", "dark");
  };
  let [isLogin, setIsLogin] = useState(
    JSON.parse(localStorage.getItem("isLogin")) || false,
  );
  let [sideBarAnim, setSideBarAnim] = useState(`hideBar`);
  let [allComments, setAllComments] = useState([]);
  let [typers, setTypers] = useState([]);
  let [totalNot, setTotalNot] = useState(
    Number(!localStorage.getItem("totalNot"))
      ? 0
      : Number(localStorage.getItem("totalNot")) || 0,
  );
  let [actualNot, setActualNot] = useState(
    Number(localStorage.getItem("actualNot") || 0),
  );
  let [gotNotifications, setGotNotifications] = useState(false);
  let [postState, setPostState] = useState({});
  let [userState, setUserState] = useState({});
  let [allMessages, setAllMessages] = useState([]);
  let [allSearchUser, setAllSearchUser] = useState([]);
  let [latestMsgId, setLatestMsgId] = useState("#");
  let getCmtCounts = async (postId) => {
    try {
      let response = await fetch(
        `${baseURL}/comments/api/getallcomments/${postId}`,
      );
      let data = await response.json();
      return data.totalComments;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };
  let getMyPosts = async (userId) => {
    setShowLoader(true);
    try {
      let response = await fetch(`${baseURL}/posts/api/getmyposts/${userId}`);
      let data = await response.json();
      if (data.success) {
        // successEmitter(data.message);
        setAllPosts(data.posts);
      } else {
        errorEmitter(data.message);
      }
      //  console.log(data);
    } catch (error) {
      console.log(error);
      navigate("/");
    } finally {
      setShowLoader(false);
    }
  };
  let getAllPostsHome = async (page) => {
    try {
      setShowLoader(true);
      let response = await fetch(
        `${baseURL}/posts/api/getallposts?page=${page}&items=${8}`,
      );
      let data = await response.json();
      setAllPosts(data.posts);
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoader(false);
    }
  };
  let getAllPosts = async (page) => {
    try {
      setShowLoader(true);
      let response = await fetch(
        `${baseURL}/posts/api/getallposts?page=${page}&items=${8}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            userToken,
          },
        },
      );
      let data = await response.json();
      setAllPosts(data.posts);
      // successEmitter("Back to Home Page");
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoader(false);
    }
  };
  let storeLike = async (postId) => {
    try {
      let response = await fetch(
        `${baseURL}/storelikes/api/like/${user?._id}/${postId}`,
        {
          method: "POST",
        },
      );
      let data = await response.json();
      // console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoader(false);
    }
  };
  let removeLike = async (postId) => {
    try {
      let response = await fetch(
        `${baseURL}/storelikes/api/dislike/${user._id}/${postId}`,
        {
          method: "DELETE",
        },
      );
      let data = await response.json();
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  let getLikes = async (postId) => {
    try {
      let response = await fetch(
        `${baseURL}/storelikes/api/getinfo/${user?._id}/${postId}`,
      );
      let data = await response.json();
      if (data.success) {
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  let getOnePost = async (postId) => {
    try {
      setShowLoader(true);
      let response = await fetch(`${baseURL}/posts/api/getone/${postId}`);
      let dataFound = await response.json();
      let post = dataFound.post;
      setCurrPost(post);
      return post;
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoader(false);
    }
  };
  let dislikeFunc = async (postFound, likes) => {
    try {
      if (isLogin) {
        setShowLoader(true);
        let response = await fetch(
          `${baseURL}/posts/api/dislikepost/${postFound._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              userToken: localStorage.getItem("userToken"),
            },
            body: JSON.stringify({
              like: likes,
            }),
          },
        );
        let data = await response.json();
        //  successEmitter(data.message);
        // console.log("disLiked Post : ");
        // console.log(data.newPost);
        await removeLike(postFound._id);
        return data.newPost;
      } else {
        errorEmitter("Login in first to like/comment");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoader(false);
    }
  };
  let setLikesFunc = async () => {
    try {
      let response = await fetch(`${baseURL}/posts/api/setlikes/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          userToken: localStorage.getItem("userToken"),
        },
        body: JSON.stringify({}),
      });
      let data = await response.json();
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  let likeFunc = async (postFound, likes) => {
    try {
      if (isLogin) {
        setShowLoader(true);
        let response = await fetch(
          `${baseURL}/posts/api/likepost/${postFound._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              userToken: localStorage.getItem("userToken"),
            },
            body: JSON.stringify({
              like: likes,
            }),
          },
        );
        let data = await response.json();
        // successEmitter(data.message);
        // console.log("Liked Post : ");
        // console.log(data.newPost);
        await storeLike(postFound._id);
        await postNotifications(postFound._id, "like");
        return data.newPost;
      } else {
        errorEmitter("Login in first to like/comment");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoader(false);
    }
  };
  let getAllComments = async (postId) => {
    try {
      setShowLoader(true);
      let response = await fetch(
        `${baseURL}/comments/api/getallcomments/${postId}`,
      );
      let data = await response.json();
      // console.log(data);
      setAllComments(data.allComments);
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoader(false);
    }
  };
  let editComment = async (content, postId, commentId) => {
    try {
      setShowLoader(true);
      let response = await fetch(
        `${baseURL}/comments/api/editcomment/${postId}/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            userToken,
          },
          body: JSON.stringify({
            content,
            author: user?.name,
            addedMs: Date.now(),
          }),
        },
      );
      let data = await response.json();
      // console.log(data);
      getAllComments(currPost?._id);
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoader(false);
    }
  };
  let blockEditComment = async (postId, commentId) => {
    try {
      let response = await fetch(
        `${baseURL}/comments/api/blockeditcomment/${postId}/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            userToken,
          },
          body: JSON.stringify({
            canedit: true,
          }),
        },
      );
      let data = await response.json();
      //  console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  let updateProfile = async (userState) => {
    try {
      setShowLoader(true);
      let response = await fetch(`${baseURL}/user/api/updateprofile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          userToken,
        },
        body: JSON.stringify(userState),
      });
      let data = await response.json();
      if (data.success) {
        successEmitter(data.message);
        setUser(data.updatedUser);
        localStorage.setItem("user", JSON.stringify(data.updatedUser));
      } else errorEmitter(data.message);
      //  console.log("Updated user : ", data);
      return data.success;
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoader(false);
    }
  };
  let [showMyPosts, setShowMyPosts] = useState(false);
  let [unReadMsg, setUnReadMsg] = useState(0);
  let updatePassByEnter = async (oldPassword, newPassword) => {
    try {
      setShowLoader(true);
      let response = await fetch(
        `${baseURL}/user/api/updatepassbyenter/${user._id}/${oldPassword}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            userToken,
          },
          body: JSON.stringify({ password: newPassword }),
        },
      );
      let data = await response.json();
      if (data.success) {
        successEmitter(data.message);
      } else errorEmitter(data.message);
      //console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoader(false);
    }
  };
  let updateEmail = async (currPassword, newMail) => {
    try {
      setShowLoader(true);
      let response = await fetch(
        `${baseURL}/user/api/updateemail/${user._id}/${currPassword}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            userToken,
          },
          body: JSON.stringify({ password: currPassword, email: newMail }),
        },
      );
      let data = await response.json();
      if (data.success) {
        successEmitter(data.message);
      } else errorEmitter(data.message);
      //console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoader(false);
    }
  };
  let updatePassByOtp = async (otpGen, otpUser, password) => {
    try {
      let response = await fetch(
        `${baseURL}/user/api/updatepassbyotp/${user._id}/${otpGen}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            userToken,
          },
          body: JSON.stringify({
            otpUser,
            password,
          }),
        },
      );
      let data = await response.json();
      if (data.success) {
        successEmitter(data.message);
      } else errorEmitter(data.message);
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  let forgotPassword = async (userEmail, otpGen, otpUser, password) => {
    try {
      let response = await fetch(
        `${baseURL}/user/api/forgotpassword/${userEmail}/${otpGen}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            userToken,
          },
          body: JSON.stringify({
            otpUser,
            password,
          }),
        },
      );
      let data = await response.json();
      if (data.success) {
        successEmitter(data.message);
        navigate("/login");
      } else errorEmitter(data.message);
      //console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  let searchPost = async (keyword) => {
    try {
      setShowBtnLoader(true);
      let response = await fetch(
        `${baseURL}/posts/api/searchposts?keyword=${keyword}`,
      );
      let data = await response.json();
      if (data.success) {
        let findPosts = data.posts;
        // successEmitter(data.message);
        setAllPosts(findPosts);
      } else errorEmitter(data.message);
      // console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setShowBtnLoader(false);
    }
  };

  let postNotifications = async (postId, typeofnotification) => {
    try {
      let response = await fetch(
        `${baseURL}/notification/api/postnotifications/${user?._id}/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            userToken: localStorage.getItem("userToken"),
          },
          body: JSON.stringify({
            typeofnotification,
            addedMs: Date.now(),
          }),
        },
      );
      let data = await response.json();
      console.log(data);
      if (data.success) {
        // successEmitter(data.message);
        let totalNots = await getNotifications(postId);
        setAllNotifications(totalNots);
        localStorage.setItem("totalNot", Number(totalNots));
      } else errorEmitter(data.message);
    } catch (error) {
      console.log(error);
    }
  };
  let getNotifications = async () => {
    if (user) {
      try {
        let response = await fetch(
          `${baseURL}/notification/api/gettotalnotifications/${user?._id}`,
          {
            method: "GET",
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
          // console.log("All notifications is actually : ", allNotifications);
          setAllNotifications([...data.allNotifications]);
          setAllNotifications(data.totalNotifications);
          localStorage.setItem("totalNot", Number(data.totalNotifications));
          localStorage.setItem("actualNot", data.showNotifications);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  let getAllNotifications = async () => {
    if (user) {
      try {
        let response = await fetch(
          `${baseURL}/notification/api/getallnotifications/${user?._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              userToken,
            },
          },
        );
        let data = await response.json();
        //console.log(data);
        if (data.success) {
          let flag = true;
          if (flag) {
            //  successEmitter(data.message);
            flag = false;
          }
          // console.log("All notifications is actually : ", allNotifications);
          setAllNotifications([...data.allNotifications]);
          // localStorage.setItem("totalNot", Number(data.totalNotifications));
          localStorage.setItem("actualNot", data.showNotifications);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  let getNotificationsCount = async () => {
    if (user) {
      try {
        let response = await fetch(
          `${baseURL}/notification/api/countnotifications/${user?._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              userToken,
            },
          },
        );
        let data = await response.json();
        // console.log(data);
        if (data.success) {
          //  successEmitter(data.message);
          setTotalNot(Number(data.totalNotifications));
          localStorage.setItem("totalNot", Number(data.totalNotifications));
          localStorage.setItem("actualNot", data.showNotifications);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  let searchUser = async (keyword) => {
    try {
      let response = await fetch(
        `${baseURL}/user/api/searchuser?keyword=${keyword}`,
      );
      let data = await response.json();
      if (data.success) {
        successEmitter(data.message);
        setAllSearchUser(data.users);
      } else errorEmitter(data.message);
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  let getUnreadMessages = async () => {
    try {
      let response = await fetch(
        `${baseURL}/message/api/countunreadforuser/${user?._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            userToken,
          },
        },
      );
      let unreadData = await response.json();
      if (unreadData.success) {
        // successEmitter(unreadData.message);
        setUnReadMsg(unreadData.totalunread);
      } else errorEmitter(unreadData.message);
      //console.log(unreadData);
    } catch (error) {
      console.log(error);
    }
  };
  let sendMessage = async (messageto, message) => {
    if (message) {
      try {
        let response = await fetch(
          `${baseURL}/message/api/sendmessage/${user?._id}/${messageto}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              userToken,
            },
            body: JSON.stringify({
              message,
              addedMs: Date.now(),
            }),
          },
        );
        let sentMsgData = await response.json();
        if (sentMsgData.success) {
          // successEmitter(sentMsgData.message);
          await getAllMessages(messageto);
        } else errorEmitter(sentMsgData.message);
        //console.log(sentMsgData);
      } catch (error) {
        console.log(error);
      }
    } else errorEmitter("Cannot send empty message");
  };
  let getAllMessages = async (messageto) => {
    try {
      let response = await fetch(
        `${baseURL}/message/api/getallmessages/${user?._id}/${messageto}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            userToken,
          },
        },
      );
      let allMsgData = await response.json();
      if (allMsgData.success) {
        //successEmitter(allMsgData.message);
        setAllMessages(allMsgData.allMessages);
      } else errorEmitter(allMsgData.message);
      // console.log(allMsgData);
    } catch (error) {
      console.log(error);
    }
  };
  let getAllUserPosts = async (userId) => {
    try {
      let response = await fetch(`${baseURL}/posts/api/getuserpost/${userId}`);
      let allPostsData = await response.json();
      if (allPostsData.success) {
        // successEmitter(allPostsData.message);
        setAllPosts(allPostsData.allPosts);
      } else {
        errorEmitter(allPostsData.message);
        setAllPosts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  let getAllConvos = async () => {
    if (isLogin) {
      try {
        let response = await fetch(
          `${baseURL}/conversation/api/getallconvo/${user?._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              userToken,
            },
          },
        );
        let convoData = await response.json();
        if (convoData.success) {
          // successEmitter(convoData.message);
          setAllConvos(convoData.allConvo);
        } else {
          errorEmitter(convoData.message);
          setAllConvos([]);
        }
        //  console.log("All Convos : ", convoData.allConvo);
      } catch (error) {
        console.log(error);
      }
    }
  };
  let findAllUnreadMsgs = async (messageto) => {
    try {
      let response = await fetch(
        `${baseURL}/message/api/countunreadmessages/${user._id}/${messageto}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            userToken,
          },
        },
      );
      let data = await response.json();
      //console.log(data);
      //console.log("Total unread messages are : ", data.totalUnreadMsgs);
      return data.totalUnreadMsgs;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };
  let readAllMessages = async (messageto) => {
    try {
      let response = await fetch(
        `${baseURL}/message/api/readmessages/${user._id}/${messageto}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            userToken,
          },
        },
      );
      let readData = await response.json();
      if (readData.success) {
        // successEmitter(readData.message);
        await getUnreadMessages();
      } else errorEmitter(readData.message);
      // console.log(readData);
    } catch (error) {
      console.log(error);
    }
  };
  let editMessage = async (messageId, newMessage) => {
    if (newMessage) {
      try {
        let response = await fetch(
          `${baseURL}/message/api/editmessage/${messageId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              userToken,
            },
            body: JSON.stringify({
              newMessage,
              addedMs: Date.now(),
            }),
          },
        );
        let editMsgData = await response.json();
        if (editMsgData.success) {
          // successEmitter(editMsgData.message);
        } else errorEmitter(editMsgData.message);
        //console.log(editMsgData);
      } catch (error) {
        console.log(error);
      }
    } else errorEmitter("Cannot send empty message");
  };
  let deleteMessage = async (messageId) => {
    try {
      let response = await fetch(
        `${baseURL}/message/api/deletemessage/${messageId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            userToken,
          },
        },
      );
      let deleteMsgData = await response.json();
      if (deleteMsgData.success) {
        // successEmitter(deleteMsgData.message);
      } else errorEmitter(deleteMsgData.message);
      //console.log(deleteMsgData);
    } catch (error) {
      console.log(error);
    }
  };
  let typingReq = async (receiverId) => {
    try {
      let response = await fetch(
        `${baseURL}/conversation/api/typing/${user._id}/${receiverId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            userToken,
          },
        },
      );
      let typingData = await response.json();
      if (typingData.success) {
        // successEmitter(typingData.message);
        setTypers(typingData.updatedConvo.isTyping);
      } else errorEmitter(typingData.message);
      //console.log(typingData);
    } catch (error) {
      console.log(error);
    }
  };
  let stopTypingReq = async (receiverId) => {
    try {
      let response = await fetch(
        `${baseURL}/conversation/api/nottyping/${user._id}/${receiverId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            userToken,
          },
        },
      );
      let typingData = await response.json();
      if (typingData.success) {
        // successEmitter(typingData.message);
        setTypers([]);
      } else errorEmitter(typingData.message);
      //console.log(typingData);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <allContexts.Provider
      value={{
        lightModeFunc,
        darkModeFunc,
        theme,
        setTheme,
        themeIcon,
        setThemeIcon,
        userToken,
        setUserToken,
        isLogin,
        setIsLogin,
        currPost,
        setCurrPost,
        user,
        setUser,
        allPosts,
        setAllPosts,
        sideBarAnim,
        setSideBarAnim,
        allComments,
        setAllComments,
        getAllPosts,
        getMyPosts,
        storeLike,
        removeLike,
        getLikes,
        getOnePost,
        likeFunc,
        dislikeFunc,
        setLikesFunc,
        getCmtCounts,
        getAllComments,
        editComment,
        blockEditComment,
        isUser,
        setIsUser,
        getAllPostsHome,
        showMyPosts,
        setShowMyPosts,
        updateProfile,
        userFound,
        setUserFound,
        updatePassByEnter,
        updateEmail,
        updatePassByOtp,
        otpSent,
        setOtpSent,
        searchPost,
        totalNot,
        setTotalNot,
        postNotifications,
        getNotifications,
        allNotifications,
        setAllNotifications,
        actualNot,
        setActualNot,
        gotNotifications,
        setGotNotifications,
        postState,
        setPostState,
        userState,
        setUserState,
        getNotificationsCount,
        getAllNotifications,
        getUnreadMessages,
        unReadMsg,
        setUnReadMsg,
        sendMessage,
        allMessages,
        setAllMessages,
        getAllMessages,
        searchUser,
        allSearchUser,
        setAllSearchUser,
        getAllUserPosts,
        allConvos,
        setAllConvos,
        getAllConvos,
        findAllUnreadMsgs,
        readAllMessages,
        isHome,
        setIsHome,
        showFooter,
        setShowFooter,
        latestMsgId,
        setLatestMsgId,
        isTyping,
        setIsTyping,
        editMessage,
        deleteMessage,
        typingReq,
        stopTypingReq,
        typers,
        setTypers,
        forgotPassword,
      }}
    >
      {children}
    </allContexts.Provider>
  );
}
export const useAllContexts = () => {
  return useContext(allContexts);
};
export default AllContexts;
