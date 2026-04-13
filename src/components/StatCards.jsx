import "../styles/StatCards.css";

function StatCards({ stats }) {
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      color: "#3b82f6" // blue
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: "✅",
      color: "#10b981" // green
    },
    {
      title: "Pending Activation",
      value: stats.pendingUsers,
      icon: "⏳",
      color: "#f59e0b" // orange
    }
  ];

  return (
    <div className="stat-cards">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className="stat-card"
          style={{ borderTopColor: card.color }}
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