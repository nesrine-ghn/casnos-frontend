import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


// 1. Create the "box" (Context)
export const AuthContext = createContext();

// 2. Create the "box manager" (Provider)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Important for initial load

  // 3. When app loads, check if user was logged in before (from localStorage)
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser)); // Convert string back to object
    }
    setLoading(false); // Done checking
  }, []);

  // 4. Login function - stores token + user
  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 5. Logout function - clears everything
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // 6. Check if user is admin
  const isAdmin = () => {
    return user?.role === "admin";
  };

  // 7. What we're sharing with the rest of the app
  const value = {
    user,
    token,
    login,
    logout,
    isAdmin,
    isAuthenticated: !!token, // !! converts to boolean (true if token exists)
  };

  // Don't render children until we've checked localStorage
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // 8. Provide the "box" to all children
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};