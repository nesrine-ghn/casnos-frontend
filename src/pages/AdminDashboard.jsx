import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import MenuBar from "../components/MenuBar";
import StatCards from "../components/StatCards";
//import UserTable from "../components/UserTable";
import api from "../utils/axios";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

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

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="admin-dashboard">
      <MenuBar />
      
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome, {user?.firstname}!</h1>
          <p>Manage your organization from this dashboard</p>
        </div>

        <StatCards stats={stats} />

        <div className="management-section">
          
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;