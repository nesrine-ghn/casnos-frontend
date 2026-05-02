import MenuBar from "../components/MenuBar";
import UserTable from "../components/UserTable";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../utils/axios";
import { useLanguage } from "../context/LanguageContext";
import "../styles/UsersPage.css";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // ✅ Read filter from URL
  const queryParams = new URLSearchParams(location.search);
  const initialFilter = queryParams.get("filter") || "all";
  
  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Update filter when URL changes (when clicking StatCards)
  useEffect(() => {
    const urlFilter = queryParams.get("filter") || "all";
    setFilter(urlFilter);
  }, [location.search]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Update URL when filter changes
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === "all") {
      navigate("/admin/users"); // No query param for "all"
    } else {
      navigate(`/admin/users?filter=${newFilter}`);
    }
  };

  // ✅ Filter users based on current filter
  const filteredUsers = users.filter(user => {
    if (filter === "all") return true;
    if (filter === "active") return user.is_active === 1;
    if (filter === "pending") return user.is_active === 0;
    return true;
  });

  return (
    <>
      <div className="admin-dashboard">
        <MenuBar />
        <div className="filter-buttons">
          <button 
            className={filter === "all" ? "active" : ""}
            onClick={() => handleFilterChange("all")}
          >
            {t("all")}
          </button>

          <button 
            className={filter === "active" ? "active" : ""}
            onClick={() => handleFilterChange("active")}
          >
            {t("active")}
          </button>

          <button 
            className={filter === "pending" ? "active" : ""}
            onClick={() => handleFilterChange("pending")}
          >
            {t("pending")}
          </button>
        </div>
        <div className="dashboard-content">
          <UserTable users={filteredUsers} onRefresh={fetchUsers} />
        </div>
      </div>
    </>
  );
}

export default UsersPage;