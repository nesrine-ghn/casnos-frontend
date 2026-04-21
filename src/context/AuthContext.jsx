import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 1. Create Context
export const AuthContext = createContext();

// 2. Provider
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate(); // ✅ for redirect

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. Check localStorage when app starts
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // 4. LOGIN + REDIRECT 🎯
  const login = (token, userData) => {
    setToken(token);
    setUser(userData);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    // ✅ ROLE-BASED REDIRECT
    if (userData.role === "agent") {
      navigate("/agent");
    } else if (userData.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard"); // default user
    }
  };

  // 5. LOGOUT
  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login"); // redirect after logout
  };

  // 6. HELPERS
  const isAdmin = () => {
    return user?.role === "admin";
  };

  const isAgent = () => {
    return user?.role === "Technician";
  };

  // 7. VALUES SHARED
  const value = {
    user,
    token,
    login,
    logout,
    isAdmin,
    isAgent,
    isAuthenticated: !!token,// convert token to boolean (true if exists, false if null)
  };

  // 8. WAIT BEFORE RENDER
  if (loading) {
    return <div>Loading...</div>;
  }

  // 9. PROVIDE CONTEXT
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};