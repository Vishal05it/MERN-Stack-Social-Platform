import React, { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAllContexts } from "../Contexts/AllContexts";
import { errorEmitter } from "../emitter";

function ChangePasswordEmail() {
  useEffect(() => {
    setIsHome(false);
  }, []);
  let { updatePassByEnter, updateEmail, setIsHome, setShowFooter } =
    useAllContexts();
  let [user, setUser] = useState({
    oldpassword: "",
    password: "",
    email: "",
  });
  let onChangeFunc = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    setShowFooter(true);
  }, []);
  return (
    <>
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 flex justify-center">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 space-y-8">
          {/* HEADER */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Account Settings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update your password or email securely
            </p>
          </div>

          {/* PASSWORD SECTION */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Change Password
            </h3>

            <input
              type="password"
              name="oldpassword"
              value={user.oldpassword}
              onChange={onChangeFunc}
              placeholder="Old Password"
              className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
            />

            <input
              type="text"
              name="password"
              value={user.password}
              onChange={onChangeFunc}
              placeholder="New Password"
              className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
            />
          </div>

          {/* EMAIL SECTION */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Change Email
            </h3>

            <input
              type="email"
              name="email"
              value={user.email}
              onChange={onChangeFunc}
              placeholder="New Email"
              className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
            />
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={async () => {
              if (user?.email) {
                await updateEmail(user.oldpassword, user.email);
              }

              if (user?.password) {
                if (user?.password.length < 8) {
                  errorEmitter("Password too short!");
                  return;
                }
                await updatePassByEnter(user.oldpassword, user.password);
              }
            }}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow"
          >
            Update Changes
          </button>

          {/* DIVIDER */}
          <div className="text-center text-xs text-gray-400">or</div>

          {/* OTP OPTION */}
          <NavLink to="/updatepassotp">
            <button className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition">
              Change Password via OTP
            </button>
          </NavLink>
        </div>
      </section>
    </>
  );
}

export default ChangePasswordEmail;
