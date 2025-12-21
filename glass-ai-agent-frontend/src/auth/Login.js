import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      /*
        Backend response MUST be:
        {
          token: "jwt-token",
          role: "ROLE_ADMIN" | "ROLE_STAFF"
        }
      */

      const { token, role } = res.data;

      if (!token || !role) {
        throw new Error("Invalid login response");
      }

      // ✅ STORE EXACT VALUES (DO NOT MODIFY ROLE)
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // 🔍 Debug (remove later)
      console.log("Logged in as:", role);

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={container}>
      <h2>🔐 Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        New user? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

const container = {
  width: "300px",
  margin: "100px auto",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export default Login;
