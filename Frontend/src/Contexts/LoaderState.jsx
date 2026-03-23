import React, { createContext, useContext, useState } from "react";
const loaderState = createContext();
function LoaderState({ children }) {
  let [showLoader, setShowLoader] = useState(false);
  let [showBtnLoader, setShowBtnLoader] = useState(false);
  return (
    <loaderState.Provider
      value={{ showLoader, setShowLoader, showBtnLoader, setShowBtnLoader }}
    >
      {children}
    </loaderState.Provider>
  );
}
export const useLoader = () => {
  return useContext(loaderState);
};
export default LoaderState;
