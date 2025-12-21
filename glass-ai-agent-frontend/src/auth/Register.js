
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/api";

// function Register() {
//   const [userName, setUserName] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("STAFF"); // ✅ DEFAULT
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   const handleRegister = async () => {
//     try {
//       await api.post("/auth/register", {
//         userName,
//         password,
//         role
//       });

//       navigate("/login");
//     } catch (err) {
//       setError("Registration failed");
//     }
//   };

//   return (
//     <div style={container}>
//       <h2>📝 Register</h2>

//       <input
//         placeholder="Username"
//         value={userName}
//         onChange={(e) => setUserName(e.target.value)}
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       {/* ✅ ROLE SELECTOR */}
//       <select value={role} onChange={(e) => setRole(e.target.value)}>
//         <option value="STAFF">Staff</option>
//         <option value="ADMIN">Admin</option>
//       </select>

//       <button onClick={handleRegister}>Register</button>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// }

// const container = {
//   width: "320px",
//   margin: "100px auto",
//   display: "flex",
//   flexDirection: "column",
//   gap: "10px"
// };

// export default Register;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Register() {
  const [shopName, setShopName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/auth/register-shop", {
        shopName,
        username,
        password
      });

      navigate("/login");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div style={container}>
      <h2>🏬 Register Your Shop</h2>

      <input
        placeholder="Shop Name"
        value={shopName}
        onChange={e => setShopName(e.target.value)}
      />

      <input
        placeholder="Admin Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Admin Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Register Shop</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Register;

const container = {
  width: "320px",
  margin: "100px auto",
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};
