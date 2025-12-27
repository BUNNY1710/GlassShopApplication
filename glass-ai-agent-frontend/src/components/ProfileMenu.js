
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  const [showChange, setShowChange] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const menuRef = useRef(null);
  const navigate = useNavigate();

  /* ===== LOAD PROFILE ===== */
  useEffect(() => {
    api.get("/auth/profile")
      .then(res => setProfile(res.data))
      .catch(() => {});
  }, []);

  /* ===== CLOSE ON OUTSIDE CLICK ===== */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!profile) return null;

  return (
    <>
      <div style={wrapper} ref={menuRef}>
        {/* PROFILE ICON */}
        <div style={icon} onClick={() => setOpen(!open)}>
          {profile.username.charAt(0).toUpperCase()}
        </div>

        {/* DROPDOWN */}
        {open && (
          <div style={dropdown}>
            <div style={userBlock}>
              <b>{profile.username}</b>
              <span>{profile.role.replace("ROLE_", "")}</span>
              <small>🏪 {profile.shopName}</small>
            </div>

            <div style={divider} />

            {profile.role === "ROLE_ADMIN" && (
              <div
                style={item}
                onClick={() => {
                  setOpen(false);
                  navigate("/staff");
                }}
              >
                👥 Manage Staff
              </div>
            )}

            <div
              style={item}
              onClick={() => {
                setShowChange(true);
                setOpen(false);
              }}
            >
              🔐 Change Password
            </div>

            <div style={divider} />

            <div style={{ ...item, color: "#ef4444" }} onClick={logout}>
              🚪 Logout
            </div>
          </div>
        )}
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showChange && (
  <div style={modalOverlay}>
    <div style={modalCard}>
      <h3 style={{ marginBottom: "15px" }}>🔐 Change Password</h3>

      <input
        type="password"
        placeholder="Old password"
        value={oldPass}
        onChange={(e) => setOldPass(e.target.value)}
        style={input}
      />

      <input
        type="password"
        placeholder="New password"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
        style={input}
      />

      <div style={buttonRow}>
        <button
          style={saveBtn}
          onClick={() => {
            api
              .post("/auth/change-password", {
                oldPassword: oldPass,
                newPassword: newPass,
              })
              .then(() => {
                alert("Password changed successfully");
                setShowChange(false);
                setOldPass("");
                setNewPass("");
              })
              .catch((err) => {
                alert(err.response?.data || "Failed");
              });
          }}
        >
          Save
        </button>

        <button style={cancelBtn} onClick={() => setShowChange(false)}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}

export default ProfileMenu;

/* ===== STYLES ===== */

const wrapper = {
  position: "relative",
};

const icon = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #6366f1, #22c55e)",
  border: "2px solid rgba(255,255,255,0.25)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "800",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(0,0,0,0.7)",
};

const dropdown = {
  position: "absolute",
  right: 0,
  top: "52px",
  width: "260px",
  background: "rgba(18,18,18,0.97)",
  backdropFilter: "blur(14px)",
  borderRadius: "14px",
  boxShadow: "0 30px 70px rgba(0,0,0,0.9)",
  color: "white",
  zIndex: 20000,
};


const userBlock = {
  padding: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const divider = {
  height: "1px",
  background: "rgba(255,255,255,0.1)",
};

const item = {
  padding: "12px 14px",
  cursor: "pointer",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 99999, // ABOVE EVERYTHING
};

const modalCard = {
  width: "340px",
  background: "rgba(15,15,15,0.95)",
  borderRadius: "16px",
  padding: "25px",
  color: "white",
  boxShadow: "0 30px 80px rgba(0,0,0,0.9)",
  animation: "fadeIn 0.25s ease-in-out",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "none",
  outline: "none",
};

const buttonRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "15px",
};

const saveBtn = {
  background: "#22c55e",
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  color: "black",
  fontWeight: "600",
};

const cancelBtn = {
  background: "#ef4444",
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  color: "white",
};


