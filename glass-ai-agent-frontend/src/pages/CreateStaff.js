

// import api from "../api/api";
// import { useState } from "react";

// function CreateStaff() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [msg, setMsg] = useState("");

//   const createStaff = async () => {
//     try {
//       await api.post("/auth/create-staff", {
//         username: username,
//         password: password,
//       });

//       setMsg("✅ Staff created successfully");
//       setUsername("");
//       setPassword("");
//     } catch (err) {
//       console.error(err);
//       setMsg("❌ Failed to create staff");
//     }
//   };

//   return (
//     <div style={{ padding: "30px" }}>
//       <h2>Create Staff</h2>

//       <input
//         placeholder="Username"
//         value={username}
//         onChange={e => setUsername(e.target.value)}
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={e => setPassword(e.target.value)}
//       />

//       <button onClick={createStaff}>Create</button>

//       {msg && <p>{msg}</p>}
//     </div>
//   );
// }

// export default CreateStaff;

import api from "../api/api";
import { useState } from "react";
import PageWrapper from "../components/PageWrapper";

function CreateStaff() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const createStaff = async () => {
    if (!username || !password) {
      setMsg("❌ Username and password are required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/create-staff", {
        username,
        password,
      });

      setMsg("✅ Staff created successfully");
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to create staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div style={page}>
        <div style={card}>
          <h2 style={title}>👤 Create Staff</h2>
          <p style={subtitle}>Add a new staff member to your shop</p>

          <div style={field}>
            <label style={label}>Username</label>
            <input
              style={input}
              placeholder="Enter staff username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div style={field}>
            <label style={label}>Password</label>
            <input
              type="password"
              style={input}
              placeholder="Enter secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button style={button} onClick={createStaff} disabled={loading}>
            {loading ? "Creating..." : "➕ Create Staff"}
          </button>

          {msg && (
            <p
              style={{
                ...message,
                color: msg.includes("❌") ? "#f87171" : "#4ade80",
              }}
            >
              {msg}
            </p>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

/* ===== STYLES ===== */

const page = {
  minHeight: "calc(100vh - 80px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const card = {
  width: "420px",
  padding: "30px",
  borderRadius: "18px",
  background: "rgba(0,0,0,0.65)",
  backdropFilter: "blur(14px)",
  boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
  color: "white",
};

const title = {
  textAlign: "center",
  fontSize: "24px",
  fontWeight: "700",
  marginBottom: "5px",
};

const subtitle = {
  textAlign: "center",
  fontSize: "13px",
  opacity: 0.8,
  marginBottom: "25px",
};

const field = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "16px",
};

const label = {
  fontSize: "12px",
  marginBottom: "6px",
  opacity: 0.85,
};

const input = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  outline: "none",
  fontSize: "14px",
};

const button = {
  width: "100%",
  marginTop: "10px",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
  color: "white",
};

const message = {
  marginTop: "15px",
  textAlign: "center",
  fontWeight: "600",
  fontSize: "14px",
};

export default CreateStaff;
