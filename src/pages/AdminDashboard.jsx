import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import MenuBar from "../components/MenuBar";
import StatCards from "../components/StatCards";
import api from "../utils/axios";
import { useLanguage } from "../context/LanguageContext";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
  });
    const { t } = useLanguage();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/users");
      const users = res.data;
      setStats({
        totalUsers: users.length,
        activeUsers: users.filter(u => u.is_active === 1).length,
        pendingUsers: users.filter(u => u.is_active === 0).length,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <MenuBar />
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>{t("welcome")}, {user?.firstname}!</h1>
          <p>{t("manageOrganization")}</p>
        </div>
        <StatCards stats={stats} />
      </div>
    </div>
  );
}

export default AdminDashboard;