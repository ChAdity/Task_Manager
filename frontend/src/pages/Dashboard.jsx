import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location = "/";
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: token }
      });
      setTasks(res.data);
    } catch {
      alert("Failed to fetch tasks");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: token }
      });
      setUsers(res.data);
    } catch {
      alert("Failed to fetch users");
    }
  };

  const createTask = async () => {
    if (!title) return alert("Enter task title");

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        { title, status: "todo", assignedTo },
        { headers: { Authorization: token } }
      );
      setTitle("");
      setAssignedTo("");
      fetchTasks();
    } catch (err) {
      alert(err.response?.data || "Error creating task");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { status },
        { headers: { Authorization: token } }
      );
      fetchTasks();
    } catch {
      alert("Error updating task");
    }
  };

  useEffect(() => {
    if (!token) {
      window.location = "/";
    } else {
      fetchTasks();
      fetchUsers();
    }
  }, []);

  const btnStyle = {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#111",
    color: "white",
    cursor: "pointer"
  };

  const smallBtn = {
    padding: "5px 8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer"
  };

  const inputStyle = {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    outline: "none"
  };

  return (
    <div style={{ padding: "30px", background: "#f5f5f5", minHeight: "100vh" }}>

      {}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h2>Dashboard</h2>
        <button onClick={logout} style={btnStyle}>Logout</button>
      </div>

      <p style={{ color: "#555" }}>Role: {role}</p>

      {}
      {role === "admin" && (
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          
          <input
            placeholder="Task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={inputStyle}
          />

          <select
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            style={inputStyle}
          >
            <option value="">Assign to</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>

          <button onClick={createTask} style={btnStyle}>
            Add
          </button>
        </div>
      )}

      <h3>Tasks</h3>

      {tasks.length === 0 && <p>No tasks available</p>}

      {}
      {tasks.map(t => (
        <div key={t._id} style={{
          background: "white",
          padding: "15px",
          marginTop: "10px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
        }}>
          
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            
            {}
            <div>
              <h4 style={{ margin: 0 }}>{t.title}</h4>

              <div style={{
                display: "flex",
                gap: "10px",
                marginTop: "5px",
                fontSize: "13px",
                color: "#666"
              }}>
                <span>
                  Status:
                  <span style={{
                    marginLeft: "5px",
                    padding: "2px 6px",
                    borderRadius: "5px",
                    background:
                      t.status === "done"
                        ? "#d4edda"
                        : t.status === "in-progress"
                        ? "#fff3cd"
                        : "#eee"
                  }}>
                    {t.status}
                  </span>
                </span>

                <span>|</span>

                <span>
                  Assigned: <b>{t.assignedTo?.name || "N/A"}</b>
                </span>
              </div>
            </div>

            {}
            {role === "member" && (
              <div style={{ display: "flex", gap: "5px" }}>
                <button onClick={() => updateStatus(t._id, "todo")} style={smallBtn}>Todo</button>
                <button onClick={() => updateStatus(t._id, "in-progress")} style={smallBtn}>In Progress</button>
                <button onClick={() => updateStatus(t._id, "done")} style={smallBtn}>Done</button>
              </div>
            )}

          </div>
        </div>
      ))}
    </div>
  );
}