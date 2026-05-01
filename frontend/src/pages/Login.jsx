import { useState } from "react";
import axios from "axios";

export default function Login() {
  const API = import.meta.env.VITE_API_URL;

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (isSignup && !name)) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      if (isSignup) {
        await axios.post(`${API}/api/auth/register`, {
          name,
          email,
          password,
          role
        });

        alert("Signup successful");
        setIsSignup(false);
      } else {
        const res = await axios.post(`${API}/api/auth/login`, {
          email,
          password
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        window.location = "/dashboard";
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none"
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f5f5"
    }}>
      <div style={{
        width: "320px",
        padding: "30px",
        borderRadius: "12px",
        background: "white",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        {isSignup && (
          <>
            <input
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
            />

            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              style={inputStyle}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </>
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            background: "#111",
            color: "white",
            cursor: "pointer"
          }}
        >
          {loading ? "Processing..." : isSignup ? "Signup" : "Login"}
        </button>

        <p
          onClick={() => setIsSignup(!isSignup)}
          style={{
            marginTop: "15px",
            textAlign: "center",
            cursor: "pointer",
            fontSize: "14px",
            color: "#555"
          }}
        >
          {isSignup ? "Already have an account? Login" : "New user? Signup"}
        </p>
      </div>
    </div>
  );
}