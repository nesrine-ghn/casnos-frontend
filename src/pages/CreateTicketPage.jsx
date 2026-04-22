import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MenuBar from "../components/MenuBar";
import api from "../utils/axios";
import "../styles/CreateTicket.css";

function CreateTicketPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: searchParams.get("name") || "",
    description: "",
    priority: "medium",
    service_id: searchParams.get("service") || "",
  });

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      setError("Title and description are required.");
      return;
    }
    try {
      await api.post("/tickets", form);
      setSuccess(true);
      setTimeout(() => navigate("/tickets/my"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="admin-dashboard">
      <MenuBar />
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Submit a Request</h1>
          <p>Fill in the details below to submit your IT request</p>
        </div>

        <div className="ticket-form-card">
          {success && (
            <div className="success-msg">
              ✅ Ticket submitted successfully! Redirecting...
            </div>
          )}
          {error && <div className="error-msg">{error}</div>}

          <div className="form-group">
            <label>Your Name</label>
            <input
              value={`${user?.firstname} ${user?.lastname}`}
              disabled
              className="input-disabled"
            />
          </div>

          <div className="form-group">
            <label>Request Title</label>
            <input
              placeholder="e.g. Need a new laptop"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Describe your request in detail..."
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              rows={5}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm({...form, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-cancel" onClick={() => navigate("/services")}>
              Cancel
            </button>
            <button className="btn-save" onClick={handleSubmit}>
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTicketPage;