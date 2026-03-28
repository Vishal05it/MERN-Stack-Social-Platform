import React, { useEffect } from "react";
import { useAllContexts } from "../Contexts/AllContexts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../Contexts/LoaderState";

function UpdateProfile() {
  let { user, updateProfile, setUser, setIsHome, setShowFooter } =
    useAllContexts();
  useEffect(() => {
    setIsHome(false);
  }, []);
  useEffect(() => {
    setShowFooter(true);
  }, []);
  const navigate = useNavigate();
  let [userState, setUserState] = useState({
    name: user?.name || "",
    age: user?.age || "",
    city: user?.city || "",
    zipcode: user?.zipcode || "",
    bio: user?.bio || "",
    gender: user?.gender || "",
    state: user?.state || "",
    profilepic: user?.profilepic || "",
    phoneno: user?.phoneno || "",
  });
  useEffect(() => {
    setUserState({
      name: user?.name || "",
      age: user?.age || "",
      city: user?.city || "",
      zipcode: user?.zipcode || "",
      state: user?.state || "",
      bio: user?.bio || "",
      gender: user?.gender || "",
      profilepic: user?.profilepic || "",
      phoneno: user?.phoneno || "",
    });
  }, [user]);

  let onChangeFunc = (e) => {
    setUserState({ ...userState, [e.target.name]: e.target.value });
  };
  return (
    <>
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 flex justify-center">
        <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 space-y-8">
          {/* HEADER */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Edit Profile
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update your personal information
            </p>
          </div>

          {/* FORM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* NAME */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={userState?.name}
                onChange={onChangeFunc}
                className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
              />
            </div>

            {/* AGE */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={userState?.age}
                onChange={onChangeFunc}
                className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
              />
            </div>

            {/* GENDER */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Gender
              </label>
              <select
                name="gender"
                value={userState?.gender}
                onChange={onChangeFunc}
                className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Phone
              </label>
              <input
                type="number"
                name="phoneno"
                value={userState?.phoneno}
                onChange={onChangeFunc}
                className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
              />
            </div>

            {/* CITY */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                City
              </label>
              <input
                type="text"
                name="city"
                value={userState?.city}
                onChange={onChangeFunc}
                className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
              />
            </div>

            {/* STATE */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                State
              </label>
              <input
                type="text"
                name="state"
                value={userState?.state}
                onChange={onChangeFunc}
                className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
              />
            </div>

            {/* ZIP */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                ZIP
              </label>
              <input
                type="text"
                name="zipcode"
                value={userState?.zipcode}
                onChange={onChangeFunc}
                className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
              />
            </div>
            {/* BIO */}
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Bio
              </label>
              <textarea
                name="bio"
                value={userState?.bio}
                onChange={onChangeFunc}
                rows={4}
                className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
              />
            </div>
          </div>

          {/* PROFILE PREVIEW */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <img
              src={
                userState?.profilepic ? userState?.profilepic : user?.profilepic
              }
              className="w-16 h-16 rounded-full object-cover"
            />

            <input
              type="file"
              onChange={(e) => {
                let file = e.target.files[0];
                setUserState({ ...userState, profilepic: file });
              }}
              className="text-sm text-gray-500 dark:text-gray-400"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={async () => {
              let goodResponse = await updateProfile(userState);
              if (goodResponse) navigate(`/profilepage/${user._id}`);
            }}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow"
          >
            Save Changes
          </button>
        </div>
      </section>
    </>
  );
}

export default UpdateProfile;
