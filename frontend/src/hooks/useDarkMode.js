// src/hooks/useDarkMode.js
// ==========================================
// Custom Hook: useDarkMode
// ==========================================
// Manages dark mode toggle. Saves preference to localStorage
// so the user's choice is remembered across page refreshes.
 
import { useState, useEffect } from "react";
 
const useDarkMode = () => {
  // Initialize state from localStorage, or default to false (light mode)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
 
  // Whenever isDark changes, update the HTML class and save to localStorage
  useEffect(() => {
    const root = document.documentElement; // The <html> element
    if (isDark) {
      root.classList.add("dark");    // Activates dark mode CSS variables
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(isDark));
  }, [isDark]);
 
  // Toggle function to flip dark mode on/off
  const toggleDarkMode = () => setIsDark((prev) => !prev);
 
  return { isDark, toggleDarkMode };
};
 
export default useDarkMode;