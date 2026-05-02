import { useEffect, useState } from "react";
import api from "../utils/axios";
import { useLanguage } from "../context/LanguageContext";

function RolesTable() {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { t } = useLanguage(); // Get translation function
  useEffect(() => { fetchRoles(); }, []);

  const fetchRoles = async () => {
    const res = await api.get("/roles");
    setRoles(res.data);
  };

  const openAdd = () => {
    setEditing(null);
    setName("");
    setError("");
    setShowModal(true);
  };

  const openEdit = (role) => {
    setEditing(role);
    setName(role.name);
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Role name is required."); return; }
    try {
      if (editing) {
        await api.put(`/roles/${editing.id}`, { name });
      } else {
        await api.post("/roles", { name });
      }
      setShowModal(false);
      fetchRoles();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this role?")) return;
    try {
      await api.delete(`/roles/${id}`);
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot delete — role may have users assigned.");
    }
  };

  return (
    <div className="dept-table-container">
      <div className="table-header">
        <h2>{t("roleManagement")}</h2>
        <button className="btn-add" onClick={openAdd}>+ {t("addRole")}</button>
      </div>

      <table className="dept-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t("roleName")}</th>
            <th>{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((r, i) => (
            <tr key={r.id}>
              <td>{i + 1}</td>
              <td>{r.name}</td>
              <td className="action-btns">
                <button className="btn-edit" onClick={() => openEdit(r)}>{t("edit")}</button>
                <button className="btn-delete" onClick={() => handleDelete(r.id)}>{t("delete")}</button>
              </td>
            </tr>
          ))}
          {roles.length === 0 && (
            <tr><td colSpan="3" style={{textAlign:"center", padding:"2rem"}}>{t("noRoles")}</td></tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editing ? t("editRole") : t("addRole")}</h3>
            {error && <p className="modal-error">{error}</p>}
            <input
              placeholder={t("roleName")}
              value={name}
              onChange={e => setName(e.target.value)}
              style={{width:"100%", padding:"0.6rem 0.9rem", borderRadius:"8px", border:"1px solid #e2e8f0", fontSize:"0.9rem", marginBottom:"1.5rem", outline:"none"}}
            />
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>{t("cancel")}</button>
              <button className="btn-save" onClick={handleSubmit}>{editing ? t("save") : t("add")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RolesTable;