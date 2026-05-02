import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MenuBar from "../components/MenuBar";
import api from "../utils/axios";
import { useLanguage } from "../context/LanguageContext";
import "../styles/CreateTicket.css";

function CreateTicketPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { t } = useLanguage();
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
          <h1>{t("submitRequest")}</h1>
          <p>{t("fillDetailsBelow")}</p>
        </div>

        <div className="ticket-form-card">
          {success && (
            <div className="success-msg">
              ✅ {t("ticketSubmittedSuccess")}
            </div>
          )}
          {error && <div className="error-msg">{error}</div>}

          <div className="form-group">
            <label>{t("yourName")}</label>
            <input
              value={`${user?.firstname} ${user?.lastname}`}
              disabled
              className="input-disabled"
            />
          </div>

          <div className="form-group">
            <label>{t("ticketTitle")}</label>
            <input
              placeholder="e.g. Need a new laptop"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>{t("ticketDescription")}</label>
            <textarea
              placeholder={t("describeInDetail")}
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              rows={5}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t("priority")}</label>
              <select
                value={form.priority}
                onChange={e => setForm({...form, priority: e.target.value})}
              >
                <option value="low">{t("low")}</option>
                <option value="medium">{t("medium")}</option>
                <option value="high">{t("high")}</option>
                <option value="critical">{t("critical")}</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-cancel" onClick={() => navigate("/services")}>
              {t("cancel")}
            </button>
            <button className="btn-save" onClick={handleSubmit}>
              {t("submitRequest")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTicketPage;