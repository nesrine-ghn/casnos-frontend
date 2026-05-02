import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import "../styles/MenuBar.css";

function MenuBar() {
  const { user, logout, isAdmin, isAgent } = useContext(AuthContext);
   const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ar", name: "العربية", flag: "🇩🇿" }
  ];
  
  return (
    <nav className="menu-bar">
      <div className="menu-left">
        <div className="logo">
          <h2>CASNOS</h2>
        </div>

        <div className="nav-links">
          {/* ADMIN links */}
          {isAdmin() && (
            <>
              <Link to="/admin" className="nav-link">{t("dashboard")}</Link>
              <Link to="/admin/users" className="nav-link">{t("users")}</Link>
              <Link to="/admin/departments" className="nav-link">{t("departments")}</Link>
              <Link to="/admin/roles" className="nav-link">{t("roles")}</Link>
              <Link to="/services" className="nav-link">{t("services")}</Link>
            </>
          )}

          {/* AGENT links */}
          {isAgent() && (
            <>
              <Link to="/tickets" className="nav-link">{t("myTickets")}</Link>
              {/*<Link to="/" className="nav-link">Analytics</Link>*/}
              <Link to="/agent" className="nav-link">{t("dashboard")}</Link>
              <Link to="/services" className="nav-link">{t("services")}</Link>
            </>
          )}

          {/* EMPLOYEE links */}
          {!isAdmin() && !isAgent() && (
            <>
              {/*<Link to="/dashboard" className="nav-link">{t("dashboard")}</Link>*/}
              <Link to="/services" className="nav-link">{t("services")}</Link>
              <Link to="/tickets/my" className="nav-link">{t("myTickets")}</Link>
            </>
          )}
        </div>
      </div>

      <div className="menu-right">
        <div className="language-selector" style={{marginRight: "1rem"}}>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              background: "white",
              cursor: "pointer",
              fontSize: "0.875rem"
            }}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
        <div className="user-info">
          <span className="user-name">{user?.firstname} {user?.lastname}</span>
          <span className="user-role">{user?.role}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          {t("logout")}
        </button>
      </div>
    </nav>
  );
}

export default MenuBar;