import { useNavigate } from "react-router-dom";
import "../styles/StatCards.css";
import { useLanguage } from "../context/LanguageContext";

function StatCards({ stats }) {
  const navigate = useNavigate();
  const { t } = useLanguage(); // Get translation function
  const cards = [
    {
      title: t("totalUsers"),
      value: stats.totalUsers,
      icon: "👥",
      color: "#3b82f6", // blue
      filter: "all"
    },
    {
      title: t("activeUsers"),
      value: stats.activeUsers,
      icon: "✅",
      color: "#10b981", // green
      filter: "active"
    },
    {
      title: t("pendingActivation"),
      value: stats.pendingUsers,
      icon: "⏳",
      color: "#f59e0b", // orange
      filter: "pending"
    }
  ];

  return (
    <div className="stat-cards">
      {cards.map((card, index) => (
        <div 
            key={index} 
            className="stat-card"
            style={{ borderTopColor: card.color }}
            onClick={() => {
              if (card.filter === "all") {
                navigate("/admin/users");
              } else {
                navigate(`/admin/users?filter=${card.filter}`);
              }
            }}
          >
          <div className="stat-icon">{card.icon}</div>
          <div className="stat-info">
            <p className="stat-title">{card.title}</p>
            <h2 className="stat-value">{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatCards;