import { useEffect, useState } from "react";
import api from "../utils/axios";
//import "../styles/UserTable.css";

function UserTable({ onRefresh }) {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    firstname: "", lastname: "", email: "",
    phone: "", department_id: "", role_id: "", password: ""
  });
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [usersRes, depsRes, rolesRes] = await Promise.all([
        api.get("/users"),
        api.get("/departments"),
        api.get("/roles")
      ]);
      setUsers(usersRes.data);
      setDepartments(depsRes.data);
      setRoles(rolesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setForm({ firstname: "", lastname: "", email: "", phone: "", department_id: "", role_id: "", password: "" });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      department_id: user.department_id,
      role_id: user.role_id,
      password: ""
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!form.firstname || !form.lastname || !form.email || !form.phone || !form.department_id || !form.role_id) {
      setError("All fields are required.");
      return;
    }
    if (!editingUser && !form.password) {
      setError("Password is required for new users.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Invalid email format.");
      return;
    }
    const phoneRegex = /^(05|06|07)[0-9]{8}$/;
    if (!phoneRegex.test(form.phone)) {
      setError("Invalid phone number (must start with 05, 06, or 07).");
      return;
    }

    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, form);
      } else {
        await api.post("/users/register", form);
      }
      setShowModal(false);
      fetchAll();
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleActivate = async (id) => {
    await api.put(`/users/${id}/activate`);
    fetchAll(); onRefresh();
  };

  const handleDeactivate = async (id) => {
    await api.put(`/users/${id}/deactivate`);
    fetchAll(); onRefresh();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await api.delete(`/users/${id}`);
    fetchAll(); onRefresh();
  };

  const getDeptName = (id) => departments.find(d => d.id === id)?.name || "—";
  const getRoleName = (id) => roles.find(r => r.id === id)?.name || "—";

  const filtered = users.filter(u =>
    `${u.firstname} ${u.lastname} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-table-container">
      <div className="table-header">
        <h2>User Management</h2>
        <div className="table-actions">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          <button className="btn-add" onClick={openAddModal}>+ Add User</button>
        </div>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u.id}>
              <td>{u.firstname} {u.lastname}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>{getDeptName(u.department_id)}</td>
              <td>{getRoleName(u.role_id)}</td>
              <td>
                <span className={`badge ${u.is_active ? "badge-active" : "badge-pending"}`}>
                  {u.is_active ? "Active" : "Pending"}
                </span>
              </td>
              <td className="action-btns">
                <button className="btn-edit" onClick={() => openEditModal(u)}>Edit</button>
                {u.is_active
                  ? <button className="btn-deactivate" onClick={() => handleDeactivate(u.id)}>Deactivate</button>
                  : <button className="btn-activate" onClick={() => handleActivate(u.id)}>Activate</button>
                }
                <button className="btn-delete" onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan="7" style={{textAlign:"center", padding:"2rem"}}>No users found</td></tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
            {error && <p className="modal-error">{error}</p>}
            <div className="modal-grid">
              <input placeholder="First Name" value={form.firstname} onChange={e => setForm({...form, firstname: e.target.value})} />
              <input placeholder="Last Name" value={form.lastname} onChange={e => setForm({...form, lastname: e.target.value})} />
              <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              <input placeholder="Phone (05/06/07...)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              {!editingUser && (
                <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              )}
              <select value={form.department_id} onChange={e => setForm({...form, department_id: e.target.value})}>
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select value={form.role_id} onChange={e => setForm({...form, role_id: e.target.value})}>
                <option value="">Select Role</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSubmit}>{editingUser ? "Save Changes" : "Add User"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTable;