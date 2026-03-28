import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./Components/Home.jsx";
import AllContexts from "./Contexts/AllContexts.jsx";
import { LogIn } from "lucide-react";
import Login from "./Components/Login.jsx";
import Signup from "./Components/Signup.jsx";
import ProfilePage from "./Components/ProfilePage.jsx";
import OnePost from "./Components/OnePost.jsx";
import CreatePost from "./Components/CreatePost.jsx";
import EditPost from "./Components/EditPost.jsx";
import UpdateProfile from "./Components/UpdateProfile.jsx";
import LoaderState from "./Contexts/LoaderState.jsx";
import ChangePasswordEmail from "./Components/ChangePasswordEmail.jsx";
import PasswordOTP from "./Components/PasswordOTP.jsx";
import OthersProfile from "./Components/OthersProfile.jsx";
import NotificationsSection from "./Components/NotificationsSection.jsx";

import ChatSection from "./Components/ChatSection.jsx";
import SearchProfiles from "./Components/SearchProfiles.jsx";
import AllChats from "./Components/AllChats.jsx";
import ForgotPassword from "./Components/ForgotPassword.jsx";
import NoProfile from "./Components/NoProfile.jsx";
let myRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/createpost" element={<CreatePost />} />
      <Route
        path="/editpost/:postId/:title/:description"
        element={<EditPost />}
      />
      <Route path="/profilepage/:userId" element={<ProfilePage />} />
      <Route path="/othersprofile/:userId" element={<OthersProfile />} />
      <Route path="/updateprofile" element={<UpdateProfile />} />
      <Route path="/updateemailpass" element={<ChangePasswordEmail />} />
      <Route path="/updatepassotp" element={<PasswordOTP />} />
      <Route path="/allchats" element={<AllChats />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/searchuser/:keyword" element={<SearchProfiles />} />
      <Route path="/onepost/:postId" element={<OnePost />} />
      <Route path="/noprofile" element={<NoProfile />} />
      <Route path="/messages/:toUserId" element={<ChatSection />} />
      <Route path="/notifications" element={<NotificationsSection />} />
    </Route>,
  ),
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoaderState>
      <AllContexts>
        <RouterProvider router={myRouter} />
      </AllContexts>
    </LoaderState>
  </StrictMode>,
);
