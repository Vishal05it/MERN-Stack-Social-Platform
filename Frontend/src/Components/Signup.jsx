import React, { use, useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { errorEmitter, successEmitter } from "../emitter";
import { useLoader } from "../Contexts/LoaderState";
import { useAllContexts } from "../Contexts/AllContexts";
function Signup() {
  let navigate = useNavigate();
  let { setShowLoader } = useLoader();
  let { setIsHome, setShowFooter } = useAllContexts();
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
    phone: "",
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
    try {
      if (user.password.length < 8) {
        errorEmitter("Password must be at least 8 characters long");
        return;
      }
      setShowLoader(true);
      let sendData = await fetch(`http://localhost:5000/user/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password,
          city: user.city,
          zipcode: user.zipcode,
          state: user.state,
          gender: user.gender,
          phone: user.phone,
          bio: user.bio,
          age: user.age,
          profilepic: user.profilepic,
        }),
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
          phone: "",
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
  };
  return (
    <section className="min-h-screen flex items-center justify-center py-20 bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 space-y-6">
        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
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
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="name"
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
            value={user.email}
            onChange={onChangeFunc}
            placeholder="Email"
            className="input sm:col-span-2"
          />

          <input
            type="password"
            name="password"
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
            name="phone"
            value={user.phone}
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
            type="text"
            name="profilepic"
            value={user.profilepic}
            onChange={onChangeFunc}
            placeholder="Profile Image URL"
            className="input sm:col-span-2"
          />

          {/* BUTTON */}
          <button className="col-span-2 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
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
