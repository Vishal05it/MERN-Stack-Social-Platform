import { useEffect, useState } from "react";

import "./App.css";
import Navbar from "./Components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Components/Render Components/Sidebar";
import RenderLoader from "./Components/Render Components/RenderLoader";
import { useLoader } from "./Contexts/LoaderState";
import ButtonLoader from "./Components/Render Components/ButtonLoader";
import { useAllContexts } from "./Contexts/AllContexts";
function App() {
  let { showLoader, setShowLoader } = useLoader();
  let { showFooter, setShowFooter } = useAllContexts();
  useEffect(() => {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
    }, 600);
  }, []);
  return (
    <>
      <Navbar />

      {showLoader ? <RenderLoader /> : <Outlet />}
      <Sidebar />
      {showFooter ? <Footer /> : ""}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
