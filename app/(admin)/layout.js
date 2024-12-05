"use client";
import { useState, createContext } from "react";
export const GlobalStateContext = createContext(null);

export default function RootLayout({ children }) {
  const [globalState, setglobalState] = useState({
    mediaItems: [],
  });

  return (
    <div>
      <GlobalStateContext.Provider value={{ globalState, setglobalState }}>
        {children}
      </GlobalStateContext.Provider>
    </div>
  );
}
