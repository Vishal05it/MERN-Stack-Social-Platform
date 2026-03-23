import React from "react";

function Typing() {
  return (
    <>
      <section className="container w-full px-40 py-6 mx-auto rounded-lg shadow-sm dark:bg-gray-50">
        <div
          className="flex items-center justify-center space-x-2"
          bis_skin_checked="1"
        >
          <div
            className="w-4 h-4 rounded-full animate-pulse dark:bg-gray-800"
            bis_skin_checked="1"
          ></div>
          <div
            className="w-4 h-4 rounded-full animate-pulse dark:bg-gray-800"
            bis_skin_checked="1"
          ></div>
          <div
            className="w-4 h-4 rounded-full animate-pulse dark:bg-gray-800"
            bis_skin_checked="1"
          ></div>
        </div>
      </section>
    </>
  );
}

export default Typing;
