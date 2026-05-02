import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MenuBar from "../components/MenuBar";
import api from "../utils/axios";
import { useLanguage } from "../context/LanguageContext";
import "../styles/ServiceCatalog.css";

function ServiceCatalogPage() {
  const { isAdmin } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const { t } = useLanguage();
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ["All", "Hardware", "Software", "Access"];

  const filtered = filter === "All"
    ? services
    : services.filter(s => s.category === filter);

  const categoryIcons = {
    Hardware: "🖥️",
    Software: "💿",
    Access: "🔑",
  };

  return (
    <div className="admin-dashboard">
      <MenuBar />
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>{t("serviceCatalog")}</h1>
          <p>{isAdmin() ? t("browseServices") : t("selectService")}</p>
        </div>

        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="services-grid">
          {filtered.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-icon">
                {categoryIcons[service.category] || "📋"}
              </div>
              <div className="service-info">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="service-meta">
                  <span className="service-category">{service.category}</span>
                  <span className="service-sla">⏱ {service.sla_hours}{t("slaHours")}</span>
                </div>
              </div>
              {!isAdmin() && (
                <button
                  className="request-btn"
                  onClick={() => navigate(`/tickets/create?service=${service.id}&name=${service.name}`)}
                >
                  {t("requestService")}
                </button>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p style={{color: "#64748b"}}>{t("noServicesAvailable")}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceCatalogPage;