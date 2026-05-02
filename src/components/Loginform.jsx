import api from "../utils/axios";
import { useState, useContext } from "react"; 
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import "../styles/Regiform.css";

function Loginform() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false); // ← Added
  const [message, setMessage] = useState(""); // ← Added
  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const res = await api.post("/users/login", {
        email,
        password,
      });

      console.log("🔍 Login response:", res.data);
      console.log("🔍 User role:", res.data.user.role);

      // ✅ Use context login
      login(res.data.token, res.data.user);
      
      console.log("🔍 After context login");
      
      // ✅ Redirect based on role
      if (res.data.user.role === "admin") {
        console.log("🔍 Navigating to /admin");
        navigate("/admin");
      } else if (res.data.user.role === "Technician") {
        console.log("🔍 Navigating to /agent");
        navigate("/agent");
      } else {
        console.log("🔍 Navigating to /dashboard");
        navigate("/tickets/my");
      }

    } catch (err) {
      console.error("❌ Login error:", err);
      
      // ✅ Extract error message from backend
      const errorMsg = err.response?.data?.message || "Invalid email or password";
      setMessage(errorMsg);
      setOpen(true);
    }
  };

  return (
    <div className="reg-form">
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div className="field">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Sign in</button>
      </form>

      {/* ✅ Snackbar for error messages */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message={message}
      />
    </div>
  );
}

export default Loginform;