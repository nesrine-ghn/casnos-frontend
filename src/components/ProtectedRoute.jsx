import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  console.log("🔍 ProtectedRoute check:");
  console.log("  - isAuthenticated:", isAuthenticated);
  console.log("  - adminOnly:", adminOnly);
  console.log("  - isAdmin():", isAdmin());

  // 1. Not logged in at all → go to login
  if (!isAuthenticated) {
    console.log("❌ Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in, but trying to access admin route without admin role
  if (adminOnly && !isAdmin()) {
    console.log("❌ Not admin, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />; // Or wherever non-admins should go
  }

  console.log("✅ Access granted");
  // 3. All checks passed → show the page
  return children;
}

export default ProtectedRoute;