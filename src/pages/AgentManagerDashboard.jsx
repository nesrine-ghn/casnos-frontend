import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import MenuBar from "../components/MenuBar";
import api from "../utils/axios";
import "../styles/AdminDashboard.css";

function AgentManagerDashboard() {
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();
  
  // ✅ SINGLE analytics state with default structure
  const [analytics, setAnalytics] = useState({
    teamWorkload: {
      unassigned: 0,
      in_progress: 0,
      highPriorityCount: 0,
      total_active: 0
    },
    agents: [],
    unassignedTickets: []
  });
  
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, agentsRes] = await Promise.all([
        api.get("/analytics/manager"),
        api.get("/tickets/agents")
      ]);
      setAnalytics(analyticsRes.data);
      setAgents(agentsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching manager data:", err);
      setLoading(false);
    }
  };

  const handleAssignTicket = async (ticketId, agentId) => {
    try {
      await api.put(`/tickets/${ticketId}/assign`, { assigned_to: agentId });
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Error assigning ticket:", err);
      alert("Failed to assign ticket");
    }
  };

  const priorityColors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
    critical: "#7c3aed",
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <MenuBar />
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome, {user?.firstname}!</h1>
          <p>Manage your IT team and ticket assignments</p>
        </div>

        {/* TEAM WORKLOAD CARDS */}
        <div className="stats-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem"
        }}>
          <div className="stat-card" style={{background: "#f8fafc", padding: "1rem", borderRadius: "8px"}}>
            <p style={{color: "#64748b", fontSize: "0.875rem"}}>Unassigned Tickets</p>
            <h3 style={{fontSize: "1.5rem", margin: "0.5rem 0", color: "#ef4444"}}>
              {analytics.teamWorkload.unassigned}
            </h3>
          </div>
          <div className="stat-card" style={{background: "#fef9c3", padding: "1rem", borderRadius: "8px"}}>
            <p style={{color: "#ca8a04", fontSize: "0.875rem"}}>In Progress</p>
            <h3 style={{fontSize: "1.5rem", margin: "0.5rem 0"}}>
              {analytics.teamWorkload.in_progress}
            </h3>
          </div>
          <div className="stat-card" style={{background: "#fee2e2", padding: "1rem", borderRadius: "8px"}}>
            <p style={{color: "#dc2626", fontSize: "0.875rem"}}>High Priority</p>
            <h3 style={{fontSize: "1.5rem", margin: "0.5rem 0"}}>
              {analytics.teamWorkload.highPriorityCount}
            </h3>
          </div>
          <div className="stat-card" style={{background: "#e0f2fe", padding: "1rem", borderRadius: "8px"}}>
            <p style={{color: "#0369a1", fontSize: "0.875rem"}}>Total Active</p>
            <h3 style={{fontSize: "1.5rem", margin: "0.5rem 0"}}>
              {analytics.teamWorkload.total_active}
            </h3>
          </div>
        </div>

        {/* AGENT PERFORMANCE TABLE */}
        <div className="analytics-section" style={{marginBottom: "2rem"}}>
          <h2>Team Performance</h2>
          <table className="user-table" style={{marginTop: "1rem"}}>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Active Tickets</th>
                <th>Resolved Today</th>
                <th>Resolved This Week</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics.agents && analytics.agents.length > 0 ? (
                analytics.agents.map(agent => (
                  <tr key={agent.id}>
                    <td>{agent.firstname} {agent.lastname}</td>
                    <td>
                      <span style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        background: agent.active_tickets > 10 ? "#fee2e2" : agent.active_tickets > 5 ? "#fef9c3" : "#dcfce7",
                        color: agent.active_tickets > 10 ? "#dc2626" : agent.active_tickets > 5 ? "#ca8a04" : "#16a34a"
                      }}>
                        {agent.active_tickets}
                      </span>
                    </td>
                    <td>{agent.resolved_today}</td>
                    <td>{agent.resolved_this_week}</td>
                    <td>
                      {agent.active_tickets > 10 ? "🔴 Overloaded" : 
                       agent.active_tickets > 5 ? "🟡 Busy" : "🟢 Available"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{textAlign: "center", padding: "2rem"}}>
                    No agents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* UNASSIGNED TICKETS QUEUE */}
        <div className="analytics-section">
          <h2>Unassigned Tickets - Assign Now</h2>
          {!analytics.unassignedTickets || analytics.unassignedTickets.length === 0 ? (
            <p style={{textAlign: "center", padding: "2rem", color: "#64748b"}}>
              ✅ All tickets are assigned!
            </p>
          ) : (
            <div style={{overflowX: "auto"}}>
              <table className="user-table" style={{marginTop: "1rem"}}>
                <thead>
                  <tr>
                    <th>Priority</th>
                    <th>Title</th>
                    <th>Service</th>
                    <th>Submitted By</th>
                    <th>Waiting Time</th>
                    <th>Assign To</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.unassignedTickets.map(ticket => (
                    <tr key={ticket.id}>
                      <td>
                        <span style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "12px",
                          background: priorityColors[ticket.priority] + "20",
                          color: priorityColors[ticket.priority],
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "uppercase"
                        }}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td>{ticket.title}</td>
                      <td>{ticket.service_name || "General"}</td>
                      <td>{ticket.firstname} {ticket.lastname}</td>
                      <td>{new Date(ticket.created_at).toLocaleString()}</td>
                      <td>
                        <select
                          onChange={(e) => handleAssignTicket(ticket.id, e.target.value)}
                          style={{
                            padding: "0.5rem",
                            borderRadius: "6px",
                            border: "1px solid #e2e8f0",
                            cursor: "pointer"
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>Select Agent</option>
                          {agents.map(agent => (
                            <option key={agent.id} value={agent.id}>
                              {agent.firstname} {agent.lastname}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentManagerDashboard;