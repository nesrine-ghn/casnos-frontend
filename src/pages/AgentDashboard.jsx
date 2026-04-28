import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MenuBar from "../components/MenuBar";
import api from "../utils/axios";
import "../styles/AgentDashboard.css";

function AgentDashboard() {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/tickets");
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/tickets/${id}`, { status });
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssign = async (id) => {
    try {
      await api.put(`/tickets/${id}`, { status: "assigned", assigned_to: user.id });
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors = {
    new: { bg: "#e0f2fe", color: "#0369a1" },
    assigned: { bg: "#f3e8ff", color: "#7c3aed" },
    in_progress: { bg: "#fef9c3", color: "#ca8a04" },
    resolved: { bg: "#dcfce7", color: "#16a34a" },
    closed: { bg: "#f1f5f9", color: "#64748b" },
  };

  const priorityColors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
    critical: "#7c3aed",
  };

  const filtered = filter === "all"
    ? tickets
    : tickets.filter(t => t.status === filter);

  const counts = {
    all: tickets.length,
    new: tickets.filter(t => t.status === "new").length,
    assigned: tickets.filter(t => t.status === "assigned").length,
    in_progress: tickets.filter(t => t.status === "in_progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
  };

  return (
    <div className="admin-dashboard">
      <MenuBar />
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Agent Dashboard</h1>
          <p>Manage and resolve IT support tickets</p>
        </div>

        {/* Stat Cards */}
        <div className="agent-stats">
          {Object.entries(counts).map(([key, val]) => (
            <div
              key={key}
              className={`agent-stat-card ${filter === key ? "active" : ""}`}
              onClick={() => setFilter(key)}
            >
              <h3>{val}</h3>
              <p>{key.replace("_", " ")}</p>
            </div>
          ))}
        </div>

        {/* Tickets Table */}
        <div className="tickets-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Title</th>
                <th>Submitted By</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ticket => (
                <tr key={ticket.id}>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: priorityColors[ticket.priority]
                      }}
                    ></span>
                    {" "}{ticket.priority}
                  </td>
                  <td>{ticket.title}</td>
                  <td>{ticket.firstname} {ticket.lastname}</td>
                  <td>{ticket.service_name || "—"}</td> 
                  <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: statusColors[ticket.status]?.bg,
                        color: statusColors[ticket.status]?.color
                      }}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="action-btns">
                    {ticket.status === "new" && (
                      <button className="btn-activate" onClick={() => handleAssign(ticket.id)}>
                        Assign to me
                      </button>
                    )}
                    {ticket.status === "assigned" && (
                      <button className="btn-edit" onClick={() => handleStatusChange(ticket.id, "in_progress")}>
                        Start
                      </button>
                    )}
                    {ticket.status === "in_progress" && (
                      <button className="btn-activate" onClick={() => handleStatusChange(ticket.id, "resolved")}>
                        Resolve
                      </button>
                    )}
                    {ticket.status === "resolved" && (
                      <button className="btn-deactivate" onClick={() => handleStatusChange(ticket.id, "closed")}>
                        Close
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" style={{textAlign:"center", padding:"2rem"}}>No tickets found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AgentDashboard;