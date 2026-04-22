import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuBar from "../components/MenuBar";
import api from "../utils/axios";
import "../styles/MyTickets.css";

function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/tickets/my");
      setTickets(res.data);
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

  return (
    <div className="admin-dashboard">
      <MenuBar />
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>My Tickets</h1>
          <p>Track all your submitted requests</p>
        </div>

        <button className="btn-add" onClick={() => navigate("/services")} style={{marginBottom:"1.5rem"}}>
          + New Request
        </button>

        <div className="tickets-list">
          {tickets.map(ticket => (
            <div key={ticket.id} className="ticket-item">
              <div className="ticket-left">
                <div className="ticket-priority" style={{background: priorityColors[ticket.priority]}}></div>
                <div className="ticket-info">
                  <h3>{ticket.title}</h3>
                  <p>{ticket.service_name || "General Request"} • {new Date(ticket.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <span
                className="ticket-status"
                style={{
                  background: statusColors[ticket.status]?.bg,
                  color: statusColors[ticket.status]?.color
                }}
              >
                {ticket.status.replace("_", " ")}
              </span>
            </div>
          ))}
          {tickets.length === 0 && (
            <div className="no-tickets">
              <p>No tickets yet. Submit your first request!</p>
              <button className="btn-add" onClick={() => navigate("/services")}>Browse Services</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyTicketsPage;