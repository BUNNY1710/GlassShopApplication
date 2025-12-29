// import { useEffect, useState } from "react";
// import PageWrapper from "../components/PageWrapper";
// import dashboardBg from "../assets/dashboard-bg.jpg";
// import api from "../api/api";


// function Dashboard() {
//   const role = localStorage.getItem("role");
//   const [auditLogs, setAuditLogs] = useState([]);

//   useEffect(() => {
//     if (role !== "ROLE_ADMIN") return;

//     api
//       .get("/stock/recent")
//       .then((res) => {
//         setAuditLogs(res.data.slice(0, 3));
//       })
//       .catch(() => {
//         console.log("Audit logs not allowed for this role");
//       });
//   }, [role]);

//   return (
//     <PageWrapper background={dashboardBg}>
//       <div style={centerWrapper}>
//         <div style={glassCard}>
//           <h1 style={title}>📊 Glass Shop Dashboard</h1>

//           <p style={subtitle}>
//             Welcome to your smart inventory management system
//           </p>

//           <div style={quickInfo}>
//             <span>✔ Real-time Stock</span>
//             <span>✔ AI Assistance</span>
//             <span>✔ Easy Management</span>
//           </div>

//           {/* 🔐 ADMIN ONLY */}
//           {role === "ROLE_ADMIN" && (
//             <div style={auditCard}>
//               <div style={auditHeader}>
//                 <h3 style={{ margin: 0 }}>🧾 Recent Stock Activity</h3>
//                 <span style={auditSub}>Last 3 updates</span>
//               </div>

//               {auditLogs.length === 0 ? (
//                 <p style={{ textAlign: "center", opacity: 0.7 }}>
//                   No recent activity
//                 </p>
//               ) : (
//                 auditLogs.map((log, i) => (
//                   <div key={i} style={auditItem}>
//                     <div style={avatar}>
//                       {log.username?.charAt(0).toUpperCase()}
//                     </div>

//                     <div style={auditContent}>
//                       <div style={auditTop}>
//                         <strong>{log.username}</strong>
//                         <span style={badge(log.action)}>
//                           {log.action}
//                         </span>
//                       </div>

//                       <div style={auditMid}>
//                         <span>
//                           <b>{log.quantity}</b> × {log.glassType}
//                         </span>
//                         <span style={{ marginLeft: 10, opacity: 0.8 }}>
//                           Stand #{log.standNo}
//                         </span>
//                       </div>

//                       <div style={auditSize}>
//                         Size: {log.height} × {log.width} {log.unit}
//                       </div>

//                       <div style={auditBottom}>
//                         Role: {log.role} •{" "}
//                         {new Date(log.timestamp).toLocaleString()}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </PageWrapper>
//   );
// }

// /* ---------- STYLES ---------- */

// const centerWrapper = {
//   minHeight: "calc(100vh - 60px)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// };

// const glassCard = {
//   width: "650px",
//   padding: "40px",
//   borderRadius: "16px",
//   background: "rgba(0, 0, 0, 0.45)",
//   backdropFilter: "blur(14px)",
//   color: "white",
//   textAlign: "center",
//   boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
// };

// const title = {
//   fontSize: "32px",
//   marginBottom: "10px",
// };

// const subtitle = {
//   fontSize: "16px",
//   opacity: 0.9,
//   marginBottom: "25px",
// };

// const quickInfo = {
//   display: "flex",
//   justifyContent: "space-around",
//   fontSize: "14px",
//   opacity: 0.85,
// };

// const auditCard = {
//   marginTop: "35px",
//   padding: "25px",
//   background: "linear-gradient(145deg, rgba(0,0,0,0.7), rgba(25,25,25,0.7))",
//   borderRadius: "18px",
// };

// const auditHeader = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginBottom: "20px",
// };

// const auditSub = {
//   fontSize: "12px",
//   opacity: 0.7,
// };

// const auditItem = {
//   display: "flex",
//   gap: "14px",
//   padding: "14px",
//   borderRadius: "14px",
//   background: "rgba(255,255,255,0.06)",
//   marginBottom: "14px",
// };

// const avatar = {
//   width: "42px",
//   height: "42px",
//   borderRadius: "50%",
//   background: "linear-gradient(135deg, #22c55e, #16a34a)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   fontWeight: "700",
// };

// const auditContent = { flex: 1 };

// const auditTop = {
//   display: "flex",
//   justifyContent: "space-between",
// };

// const auditMid = { fontSize: "14px" };

// const auditSize = { fontSize: "13px", opacity: 0.85 };

// const auditBottom = { fontSize: "12px", opacity: 0.65 };

// const badge = (action) => ({
//   padding: "4px 10px",
//   borderRadius: "999px",
//   fontSize: "12px",
//   fontWeight: "600",
//   color: "white",
//   background:
//     action === "ADD"
//       ? "linear-gradient(135deg, #22c55e, #16a34a)"
//       : "linear-gradient(135deg, #ef4444, #dc2626)",
// });

// export default Dashboard;

import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import dashboardBg from "../assets/dashboard-bg.jpg";
import api from "../api/api";

function Dashboard() {
  const role = localStorage.getItem("role");
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    if (role !== "ROLE_ADMIN") return;

    api.get("/audit/recent")

      .then(res => setAuditLogs(res.data.slice(0, 3)))
      .catch(() => {
        console.log("Audit logs not allowed for this role");
      });
  }, [role]);

  return (
    <PageWrapper background={dashboardBg}>
      <div style={page}>
        <div style={card}>
          <h1 style={title}>📊 Glass Shop Dashboard</h1>

          <p style={subtitle}>
            Welcome to your smart inventory management system
          </p>

          {/* QUICK INFO */}
          <div style={quickInfo}>
            <div>✔ Real-time Stock</div>
            <div>✔ AI Assistance</div>
            <div>✔ Easy Management</div>
          </div>

          {/* ADMIN ONLY */}
          {role === "ROLE_ADMIN" && (
            <div style={auditCard}>
              <div style={auditHeader}>
                <h3 style={{ margin: 0 }}>🧾 Recent Stock Activity</h3>
                <span style={auditSub}>Last 3 updates</span>
              </div>

              {auditLogs.length === 0 ? (
                <p style={{ textAlign: "center", opacity: 0.7 }}>
                  No recent activity
                </p>
              ) : (
                auditLogs.map((log, i) => (
                  <div key={i} style={auditItem}>
                    <div style={avatar}>
                      {log.username?.charAt(0).toUpperCase()}
                    </div>

                    <div style={auditContent}>
                      <div style={auditTop}>
                        <strong>{log.username}</strong>
                        <span style={badge(log.action)}>
                          {log.action}
                        </span>
                      </div>

                      <div style={auditMid}>
                        <span>
                          <b>{log.quantity}</b> × {log.glassType}
                        </span>
                        <span style={{ opacity: 0.75 }}>
                          {" "}• Stand #{log.standNo}
                        </span>
                      </div>

                      {/* <div style={auditSize}>
                        Size: {log.height} × {log.width} {log.unit}
                      </div> */}
                      <div style={auditSize}>
  Size:{" "}
  {log.height && log.width ? (
    <>
      {log.height} × {log.width}{" "}
      {log.unit || log.glassUnit || "MM"}
    </>
  ) : (
    <span style={{ opacity: 0.6 }}>Not specified</span>
  )}
</div>


                      <div style={auditBottom}>
                        {log.role} •{" "}
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

export default Dashboard;

/* ================= STYLES ================= */

const page = {
  minHeight: "calc(100vh - 64px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingTop: "40px",
};

const card = {
  width: "100%",
  maxWidth: "760px",
  padding: "22px",
  borderRadius: "18px",
  background: "rgba(0,0,0,0.45)",
  backdropFilter: "blur(14px)",
  color: "white",
  boxShadow: "0 15px 45px rgba(0,0,0,0.55)",
};

const title = {
  textAlign: "center",
  fontSize: "26px",
  marginBottom: "8px",
};

const subtitle = {
  textAlign: "center",
  fontSize: "14px",
  opacity: 0.9,
  marginBottom: "20px",
};

const quickInfo = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "10px",
  textAlign: "center",
  fontSize: "13px",
  opacity: 0.85,
  marginBottom: "25px",
};

const auditCard = {
  marginTop: "25px",
  padding: "18px",
  background: "rgba(0,0,0,0.65)",
  borderRadius: "16px",
};

const auditHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px",
};

const auditSub = {
  fontSize: "12px",
  opacity: 0.7,
};

const auditItem = {
  display: "flex",
  gap: "12px",
  padding: "12px",
  borderRadius: "14px",
  background: "rgba(255,255,255,0.07)",
  marginBottom: "12px",
};

const avatar = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
};

const auditContent = {
  flex: 1,
  fontSize: "13px",
};

const auditTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const auditMid = {
  marginTop: "4px",
};

const auditSize = {
  fontSize: "12px",
  opacity: 0.8,
};

const auditBottom = {
  fontSize: "11px",
  opacity: 0.6,
};

const badge = (action) => ({
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: "600",
  background:
    action === "ADD"
      ? "linear-gradient(135deg, #22c55e, #16a34a)"
      : "linear-gradient(135deg, #ef4444, #dc2626)",
});
