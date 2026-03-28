import React, { use, useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { errorEmitter, successEmitter } from "../emitter";
import { useLoader } from "../Contexts/LoaderState";
import { useAllContexts } from "../Contexts/AllContexts";
function Signup() {
  let navigate = useNavigate();
  let { setShowLoader } = useLoader();
  let { setIsHome, setShowFooter, isLogin } = useAllContexts();
  useEffect(() => {
    setIsHome(false);
  }, []);
  let [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    zipcode: "",
    state: "",
    gender: "",
    phoneno: "",
    bio: "",
    age: 0,
    profilepic: "",
  });
  let onChangeFunc = (e) => {
    if (user.password) {
    }
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    setShowFooter(true);
  }, []);
  let signUpFunction = async () => {
    if (!isLogin) {
      try {
        let formData = new FormData();
        formData.append("name", user.name);
        formData.append("email", user.email);
        formData.append("password", user.password);
        formData.append("city", user.city);
        formData.append("zipcode", user.zipcode);
        formData.append("state", user.state);
        formData.append("gender", user.gender);
        formData.append("phoneno", user.phoneno);
        formData.append("bio", user.bio);
        formData.append("age", user.age);
        formData.append("profilepic", user.profilepic);
        if (user.password.length < 8) {
          errorEmitter("Password must be at least 8 characters long");
          return;
        }
        if (user.name.length < 2 || !user.email) {
          errorEmitter("Name and Email are required!");
          return;
        }
        setShowLoader(true);
        let sendData = await fetch(`http://localhost:5000/user/api/signup`, {
          method: "POST",
          body: formData,
        });
        let response = await sendData.json();
        //console.log(response.userCreated);
        if (response.success) {
          setUser({
            password: "",
            city: "",
            zipcode: "",
            state: "",
            name: "",
            bio: "",
            age: 0,
            gender: "",
            phoneno: "",
            profilepic: "",
            email: "",
          });
          successEmitter(response.message);
          navigate("/login");
        } else errorEmitter(response.message);
      } catch (error) {
        console.log(error);
      } finally {
        setShowLoader(false);
      }
    } else errorEmitter("Log out first to create a new account!");
  };
  return (
    <section className="min-h-screen flex items-center justify-center py-10 bg-gray-50 dark:bg-gray-900 px-3 sm:px-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-6">
        {/* HEADER */}
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Join the platform
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signUpFunction();
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
        >
          <input
            type="text"
            name="name"
            required
            value={user.name}
            onChange={onChangeFunc}
            placeholder="Full Name"
            className="input"
          />

          <input
            type="number"
            name="age"
            value={user.age}
            onChange={onChangeFunc}
            placeholder="Age"
            className="input"
          />

          <input
            type="email"
            name="email"
            required
            value={user.email}
            onChange={onChangeFunc}
            placeholder="Email"
            className="input sm:col-span-2"
          />

          <input
            type="password"
            name="password"
            required
            value={user.password}
            onChange={onChangeFunc}
            placeholder="Password"
            className="input sm:col-span-2"
          />

          <input
            type="text"
            name="city"
            value={user.city}
            onChange={onChangeFunc}
            placeholder="City"
            className="input"
          />

          <input
            type="text"
            name="state"
            value={user.state}
            onChange={onChangeFunc}
            placeholder="State"
            className="input"
          />

          <input
            type="text"
            name="zipcode"
            value={user.zipcode}
            onChange={onChangeFunc}
            placeholder="ZIP"
            className="input"
          />

          <input
            type="text"
            name="phoneno"
            value={user.phoneno}
            onChange={onChangeFunc}
            placeholder="Phone"
            className="input"
          />

          <select
            name="gender"
            value={user.gender}
            onChange={onChangeFunc}
            className="input sm:col-span-2"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>

          <textarea
            name="bio"
            value={user.bio}
            onChange={onChangeFunc}
            placeholder="Bio"
            className="input sm:col-span-2"
          />

          <input
            type="file"
            name="profilepic"
            onChange={(e) => {
              let file = e.target.files[0];
              setUser({ ...user, profilepic: file });
            }}
            placeholder="Profile Image URL"
            className="input sm:col-span-2"
          />

          {/* BUTTON */}
          <button className="col-span-1 sm:col-span-2 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
            Create Account
          </button>
        </form>

        {/* LOGIN */}
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <NavLink to="/login" className="text-indigo-600 font-medium">
            Login
          </NavLink>
        </p>
      </div>
    </section>
  );
}

export default Signup;
