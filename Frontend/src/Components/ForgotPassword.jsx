import React, { useEffect } from "react";
import { useState } from "react";
import { useAllContexts } from "../Contexts/AllContexts";
import { errorEmitter, successEmitter } from "../emitter";
import { useLoader } from "../Contexts/LoaderState";
import ButtonLoader from "./Render Components/ButtonLoader";

function ForgotPassword() {
  let {
    forgotPassword,
    user,
    otpSent,
    setOtpSent,
    theme,
    setIsHome,
    setShowFooter,
  } = useAllContexts();
  let { showBtnLoader, setShowBtnLoader, showLoader, setShowLoader } =
    useLoader();
  let [userState, setUserState] = useState({
    email: "",
    otpUser: "",
    password: "",
  });
  let [OTP, setOTP] = useState(
    Math.floor(Math.random() * 9) * 10000 +
      Math.floor(Math.random() * 9) * 1000 +
      Math.floor(Math.random() * 9) * 100 +
      Math.floor(Math.random() * 9) * 10 +
      Math.floor(Math.random() * 9),
  );
  let genOTP = async () => {
    await forgotPassword(userState.email, OTP, "", "");
    setTimeout(() => {
      let newOTP2 =
        Math.floor(Math.random() * 9) * 10000 +
        Math.floor(Math.random() * 9) * 1000 +
        Math.floor(Math.random() * 9) * 100 +
        Math.floor(Math.random() * 9) * 10 +
        Math.floor(Math.random() * 9);
      setOTP(newOTP2);
    }, 120000);
  };

  let onChangeFunc = (e) => {
    setUserState({ ...userState, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    setIsHome(false);
  }, []);
  useEffect(() => {
    setShowFooter(true);
  }, []);
  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* HEADER */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Reset Password
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter OTP and your new password
            </p>
          </div>

          {/* OTP INPUT */}
          <input
            type="email"
            name="email"
            value={userState.email}
            onChange={onChangeFunc}
            placeholder="Enter Email"
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="otpUser"
            value={userState.otpUser}
            onChange={onChangeFunc}
            placeholder="Enter OTP"
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* PASSWORD INPUT */}
          <input
            type="text"
            name="password"
            value={userState.password}
            onChange={onChangeFunc}
            placeholder="New Password"
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* UPDATE BUTTON */}
          <button
            onClick={async (e) => {
              e.preventDefault();
              await forgotPassword(
                userState?.email,
                OTP,
                userState?.otpUser,
                userState?.password,
              );
            }}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex justify-center items-center"
          >
            {showBtnLoader ? <ButtonLoader /> : "Update Password"}
          </button>

          {/* DIVIDER */}
          <div className="text-center text-xs text-gray-400">OR</div>

          {/* SEND OTP BUTTON */}
          <button
            onClick={async (e) => {
              e.preventDefault();
              try {
                setShowBtnLoader(true);

                if (!otpSent) {
                  genOTP();
                  successEmitter(`OTP sent at registered email.`);
                  setOtpSent(true);
                  localStorage.setItem("otpSent", true);

                  setTimeout(() => {
                    setOtpSent(false);
                    localStorage.setItem("otpSent", false);
                    successEmitter("You can request new OTP now!");
                  }, 2000);
                } else {
                  errorEmitter("Wait for a minute before requesting new OTP!");
                }
              } catch (error) {
                console.log(error);
              } finally {
                setShowBtnLoader(false);
              }
            }}
            className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition flex justify-center items-center"
          >
            {showBtnLoader ? <ButtonLoader /> : "Send OTP"}
          </button>
        </div>
      </section>
    </>
  );
}

export default ForgotPassword;
