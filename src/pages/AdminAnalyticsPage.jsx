import { useEffect, useState } from "react";
import MenuBar from "../components/MenuBar";
import { useLanguage } from "../context/LanguageContext";
import api from "../utils/axios";
import "../styles/Analytics.css";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from "recharts";


function AdminAnalyticsPage() {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState({
    tickets: {
      total: 0,
      new: 0,
      assigned: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
      lowCount: 0,
      mediumCount: 0,
      highCount: 0,
      criticalCount: 0
    },
    users: { total: 0 },
    topServices: [],
    agentPerformance: [],
    trends: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/analytics/admin");
      console.log("ANALYTICS DATA:", res.data); // 👈 ADD THIS
      setAnalytics(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setLoading(false);
    }
  }
  // STATUS DATA (Pie)
  const statusData = [
    { name: "New", value: Number(analytics.tickets.new) },
    { name: "Assigned", value: Number(analytics.tickets.assigned) },
    { name: "In Progress", value: Number(analytics.tickets.in_progress) },
    { name: "Resolved", value: Number(analytics.tickets.resolved) },
    { name: "Closed", value: Number(analytics.tickets.closed) }
  ];
  console.log("TICKETS:", analytics.tickets);
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  // PRIORITY DATA (Bar)
  const priorityData = [
    { name: "Low", value: Number(analytics.tickets.lowCount) },
    { name: "Medium", value: Number(analytics.tickets.mediumCount) },
    { name: "High", value: Number(analytics.tickets.highCount) },
    { name: "Critical", value: Number(analytics.tickets.criticalCount) }
  ];

  //trend data
  const daysMap = {};
  analytics.trends.forEach(item => {
    const day = new Date(item.day).toLocaleDateString("en-US", { weekday: "short" });
    daysMap[day] = item.count;
  });

  const allDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const trendData = allDays.map(day => ({
    day,
    tickets: daysMap[day] || 0
  }));
    
 ;



  if (loading) return <div className="waiting-anim">Loading analytics...</div>;
  if (!analytics) return <div className="waiting-anim">No data available</div>;

  return (
    <div className="admin-dashboard">
      <MenuBar />
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>{t("analytics")}</h1>
          <p>Comprehensive system analytics and insights</p>
        </div>

        {/* OVERVIEW CARDS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{analytics.users.total}</h3>
            <p>{t("totalUsers")}</p>
          </div>
          <div className="stat-card">
            <h3>{analytics.tickets.total}</h3>
            <p>{t("totalTickets")}</p>
          </div>
          <div className="stat-card">
            <h3>{analytics.agentPerformance.length}</h3>
            <p>Active Agents</p>
          </div>
          <div className="stat-card">
            <h3>18.5 hrs</h3>
            <p>Avg Resolution Time</p>
          </div>
        </div>

        {/* TICKET STATISTICS */}
        <div className="analytics-section">
          <h2>Visual Analytics</h2>

          <div className="chart-grid">

            {/* PIE CHART */}
            <div className="chart-card">
              <h3>Tickets by Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" outerRadius={80}>
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* BAR CHART */}
            <div className="chart-card">
              <h3>Tickets by Priority</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={priorityData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb"/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* LINE CHART */}
            <div className="chart-card">
              <h3>Tickets Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="tickets" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>

        {/* TOP SERVICES */}
        <div className="analytics-section">
          <h2>Most Requested Services</h2>
          <div className="services-list">
            {analytics.topServices.map((service, index) => (
              <div key={index} className="service-item">
                <span className="service-rank">#{index + 1}</span>
                <span className="service-name">{service.name}</span>
                <span className="service-count">{service.request_count} requests</span>
              </div>
            ))}
          </div>
        </div>

        {/* AGENT PERFORMANCE */}
        <div className="analytics-section">
          <h2>Agent Performance</h2>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Active Tickets</th>
                <th>Resolved Tickets</th>
              </tr>
            </thead>
            <tbody>
              {analytics.agentPerformance.map((agent, index) => (
                <tr key={index}>
                  <td>{agent.firstname} {agent.lastname}</td>
                  <td>{agent.active_tickets}</td>
                  <td>{agent.resolved_tickets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalyticsPage;