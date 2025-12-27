import { NavLink, useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <nav style={navBar}>
      {/* LEFT */}
      <div style={logo} onClick={() => navigate("/dashboard")}>
        🧱 Glass Shop
      </div>

      {/* CENTER MENU */}
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

      {/* RIGHT PROFILE */}
      <div style={profileWrapper}>
        <ProfileMenu />
      </div>
    </nav>
  );
}

export default Navbar;

/* ================= STYLES ================= */

const navBar = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: "64px",
  zIndex: 10000,   // 🔥 ABOVE PageWrapper
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 30px",
  background: "rgba(0,0,0,0.85)",
  backdropFilter: "blur(10px)",
};


const logo = {
  color: "#f9fafb",
  fontWeight: "800",
  fontSize: "18px",
  cursor: "pointer",
};

const menu = {
  display: "flex",
  gap: "22px",
};

const link = {
  color: "#d1d5db",
  textDecoration: "none",
  fontSize: "14px",
};

const profileWrapper = {
  display: "flex",
  alignItems: "center",
};
