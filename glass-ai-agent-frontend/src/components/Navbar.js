import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role")

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav style={navBar}>
      <div style={logo} onClick={() => navigate("/dashboard")}>
        🧱 Glass Shop
      </div>

      <div style={menu}>
        <NavLink to="/dashboard" style={link}>Dashboard</NavLink>
        <NavLink to="/manage-stock" style={link}>Manage Stock</NavLink>
        <NavLink to="/view-stock" style={link}>View Stock</NavLink>

        {role === "ROLE_ADMIN" && (
          <>
            <NavLink to="/ai" style={link}>AI Assistant</NavLink>
            <NavLink to="/audit" style={link}>Audit Logs</NavLink>
            <NavLink to="/create-staff" style={link}>Create Staff</NavLink>
          </>
        )}
      </div>

      <button style={logoutBtn} onClick={logout}>Logout</button>
    </nav>
  );
}

export default Navbar;

const navBar = {
  display: "flex",
  justifyContent: "space-between",
  padding: "14px 30px",
  background: "rgba(0,0,0,0.75)",
  position: "sticky",
  top: 0,
};

const logo = {
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

const menu = {
  display: "flex",
  gap: "20px",
};

const link = {
  color: "#d1d5db",
  textDecoration: "none",
};

const logoutBtn = {
  background: "#dc2626",
  border: "none",
  color: "white",
  padding: "8px 14px",
  cursor: "pointer",
};
