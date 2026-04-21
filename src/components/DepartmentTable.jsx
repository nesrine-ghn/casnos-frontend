import { useEffect, useState } from "react";
import api from "../utils/axios";
import "../styles/DepartmentTable.css";

function DepartmentTable() {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { fetchDepts(); }, []);

  const fetchDepts = async () => {
    const res = await api.get("/departments");
    setDepartments(res.data);
  };

  const openAdd = () => {
    setEditing(null);
    setName("");
    setError("");
    setShowModal(true);
  };

  const openEdit = (dept) => {
    setEditing(dept);
    setName(dept.name);
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Department name is required."); return; }
    try {
      if (editing) {
        await api.put(`/departments/${editing.id}`, { name });
      } else {
        await api.post("/departments", { name });
      }
      setShowModal(false);
      fetchDepts();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      await api.delete(`/departments/${id}`);
      fetchDepts();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot delete — department may have users assigned.");
    }
  };

  return (
    <div className="dept-table-container">
      <div className="table-header">
        <h2>Department Management</h2>
        <button className="btn-add" onClick={openAdd}>+ Add Department</button>
      </div>

      <table className="dept-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Department Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d, i) => (
            <tr key={d.id}>
              <td>{i + 1}</td>
              <td>{d.name}</td>
              <td className="action-btns">
                <button className="btn-edit" onClick={() => openEdit(d)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(d.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {departments.length === 0 && (
            <tr><td colSpan="3" style={{textAlign:"center", padding:"2rem"}}>No departments yet</td></tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editing ? "Edit Department" : "Add Department"}</h3>
            {error && <p className="modal-error">{error}</p>}
            <input
              placeholder="Department name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{width:"100%", padding:"0.6rem 0.9rem", borderRadius:"8px", border:"1px solid #e2e8f0", fontSize:"0.9rem", marginBottom:"1.5rem", outline:"none"}}
            />
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSubmit}>{editing ? "Save Changes" : "Add"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentTable;