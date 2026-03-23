import React, { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { errorEmitter, successEmitter } from "../emitter";
import { useAllContexts } from "../Contexts/AllContexts";
import { baseURL } from "../../baseurl";
import { useLoader } from "../Contexts/LoaderState";
function Login() {
  let navigate = useNavigate();
  let {
    isLogin,
    setIsLogin,
    user,
    setUser,
    userToken,
    setIsHome,
    setShowFooter,
  } = useAllContexts();
  let { showLoader, setShowLoader } = useLoader();
  useEffect(() => {
    setShowFooter(true);
  }, []);
  let [currUser, setCurrUser] = useState({ email: "", password: "" });
  let onChangeFunc = (e) => {
    setCurrUser({ ...currUser, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    setIsHome(false);
  }, []);
  let loginFunc = async () => {
    try {
      setShowLoader(true);
      let response = await fetch(`${baseURL}/user/api/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(currUser),
      });
      let dataPosted = await response.json();
      // console.log(dataPosted);
      if (dataPosted.success) {
        successEmitter(dataPosted.message);
        localStorage.setItem("userToken", dataPosted.token);
        localStorage.setItem("isLogin", true);
        setIsLogin(true);
        setUser(dataPosted.userExist);
        localStorage.setItem("user", JSON.stringify(dataPosted.userExist));
        // console.log("User found : ", user);
        navigate("/");
      } else {
        errorEmitter(dataPosted.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 space-y-6">
        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Login to continue
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginFunc(currUser.email, currUser.password);
          }}
          className="space-y-4"
        >
          <input
            type="email"
            name="email"
            value={currUser.email}
            onChange={onChangeFunc}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
          />

          <input
            type="password"
            name="password"
            value={currUser.password}
            onChange={onChangeFunc}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
          />

          {/* FORGOT PASSWORD */}
          <div className="text-right text-xs">
            <NavLink to="/forgotpassword" className="text-indigo-600">
              Forgot Password?
            </NavLink>
          </div>

          {/* BUTTON */}
          <button className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
            Sign In
          </button>
        </form>

        {/* SIGNUP */}
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Don’t have an account?{" "}
          <NavLink to="/signup" className="text-indigo-600 font-medium">
            Sign up
          </NavLink>
        </p>
      </div>
    </section>
  );
}

export default Login;
