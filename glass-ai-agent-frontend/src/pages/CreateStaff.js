

import api from "../api/api";
import { useState } from "react";

function CreateStaff() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const createStaff = async () => {
    try {
      await api.post("/auth/create-staff", {
        username: username,
        password: password,
      });

      setMsg("✅ Staff created successfully");
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to create staff");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Create Staff</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={createStaff}>Create</button>

      {msg && <p>{msg}</p>}
    </div>
  );
}

export default CreateStaff;
