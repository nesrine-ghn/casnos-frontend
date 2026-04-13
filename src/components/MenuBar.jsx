import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/MenuBar.css";

function MenuBar() {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="menu-bar">
      <div className="menu-left">
        <div className="logo">
          <h2>CASNOS</h2>
        </div>
        
        <div className="nav-links">
          {isAdmin() && (
            <>
              <Link to="/admin" className="nav-link">Dashboard</Link>
              <Link to="/admin/users" className="nav-link">Users</Link>
              <Link to="/admin/departments" className="nav-link">Departments</Link>
              <Link to="/admin/roles" className="nav-link">Roles</Link>
              <Link to="/admin/settings" className="nav-link">Settings</Link>
            </>
          )}
        </div>
      </div>

      <div className="menu-right">
        <div className="user-info">
          <span className="user-name">{user?.firstname} {user?.lastname}</span>
          <span className="user-role">{user?.role}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default MenuBar;