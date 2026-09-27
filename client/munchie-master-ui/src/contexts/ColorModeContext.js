import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "colorMode";

const ColorModeContext = createContext({ mode: "light", toggleMode: () => {} });

// The saved choice wins; otherwise follow the device's light/dark setting
const initialMode = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch (error) {
    // Storage can be unavailable (e.g. private browsing); fall through
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (error) {
      // Not saving the preference is fine
    }
  }, [mode]);

  const toggleMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  return useContext(ColorModeContext);
}
