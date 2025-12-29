// import { useEffect, useState } from "react";
// import api from "../api/api";
// import PageWrapper from "../components/PageWrapper";

// function AuditLogs() {
//   const [logs, setLogs] = useState([]);

//  useEffect(() => {
//   api.get("/audit/recent")
//     .then(res => {
//       console.log("AUDIT LOGS:", res.data);
//       setLogs(res.data);
//     })
//     .catch(err => {
//       console.error("AUDIT ERROR", err.response?.status);
//     });
// }, []);


//   return (
//     <PageWrapper>
//       <div style={{ width: "90%", margin: "auto" }}>
//         {/* <button
//   style={downloadBtn}
//   onClick={() => window.open("http://localhost:8080/audit/download")}
// >
//   ⬇ Download Report
// </button> */}

//         <h2 style={{ textAlign: "center" }}>📜 Staff Activity Log</h2>

//         <table style={tableStyle}>
//           <thead>
//   <tr>
//     <th>User</th>
//     <th>Role</th>
//     <th>Action</th>
//     <th>Glass</th>

//     {/* ✅ NEW COLUMNS */}
//     <th>Height</th>
//     <th>Width</th>

//     <th>Qty</th>
//     <th>Stand</th>
//     <th>Time</th>
//   </tr>
// </thead>


//           <tbody>
//   {logs.map((log, i) => (
//     <tr key={i}>
//       <td>{log.username}</td>
//       <td>{log.role}</td>
//       <td>{log.action}</td>
//       <td>{log.glassType}</td>

//       {/* ✅ HEIGHT */}
//       <td>{log.height}{log.unit}</td>

//       {/* ✅ WIDTH */}
//       <td>{log.width}{log.unit}</td>

//       <td>{log.quantity}</td>
//       {/* <td>{log.standNo}</td> */}
//       <td>
//   {log.action === "TRANSFER"
//     ? `${log.fromStand} → ${log.toStand}`
//     : log.standNo}
// </td>

//       <td>{new Date(log.timestamp).toLocaleString()}</td>
//     </tr>
//   ))}
// </tbody>

//         </table>
//       </div>
//     </PageWrapper>
//   );
// }

// const tableStyle = {
//   width: "100%",
//   color: "white",
//   borderCollapse: "collapse",
//   textAlign: "center"
// };
// // const downloadBtn = {
// //   padding: "10px 18px",
// //   borderRadius: "10px",
// //   background: "linear-gradient(135deg, #22c55e, #16a34a)",
// //   color: "white",
// //   fontWeight: "600",
// //   border: "none",
// //   cursor: "pointer",
// //   marginBottom: "15px",
// // };


// export default AuditLogs;

import { useEffect, useState } from "react";
import api from "../api/api";
import PageWrapper from "../components/PageWrapper";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    api.get("/audit/recent")
      .then(res => setLogs(res.data))
      .catch(err => {
        if (err.response?.status === 403) {
          setError("You are not authorized to view audit logs");
        } else {
          setError("Failed to load audit logs");
        }
      });
  }, []);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <PageWrapper>
      <div style={container}>

        {/* HEADER */}
        <h2 style={title}>📜 Staff Activity Log</h2>
        <p style={subtitle}>
          Track all stock actions done by staff
        </p>

        {/* ERROR / EMPTY STATE */}
        {error && (
          <div style={emptyCard}>
            🚫 {error}
          </div>
        )}

        {!error && logs.length === 0 && (
          <div style={emptyCard}>
            No activity logs available
          </div>
        )}

        {/* DESKTOP TABLE */}
        {!isMobile && logs.length > 0 && (
          <div style={tableWrap}>
            <table style={table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th>Glass</th>
                  <th>Size</th>
                  <th>Qty</th>
                  <th>Stand</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i}>
                    <td>{log.username}</td>
                    <td>{log.role}</td>
                    <td>
                      <span style={badge(log.action)}>
                        {log.action}
                      </span>
                    </td>
                    <td>{log.glassType}</td>
                    <td>{log.height} × {log.width} {log.unit}</td>
                    <td>{log.quantity}</td>
                    <td>
                      {log.action === "TRANSFER"
                        ? `${log.fromStand} → ${log.toStand}`
                        : log.standNo}
                    </td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MOBILE CARDS */}
        {isMobile && logs.length > 0 && (
          <div style={cardList}>
            {logs.map((log, i) => (
              <div key={i} style={card}>
                <div style={cardTop}>
                  <div style={avatar}>
                    {log.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <b>{log.username}</b>
                    <div style={role}>{log.role}</div>
                  </div>
                  <span style={badge(log.action)}>
                    {log.action}
                  </span>
                </div>

                <div style={row}><span>Glass</span><span>{log.glassType}</span></div>
                <div style={row}><span>Size</span><span>{log.height} × {log.width} {log.unit}</span></div>
                <div style={row}><span>Qty</span><span>{log.quantity}</span></div>
                <div style={row}><span>Stand</span>
                  <span>
                    {log.action === "TRANSFER"
                      ? `${log.fromStand} → ${log.toStand}`
                      : log.standNo}
                  </span>
                </div>

                <div style={time}>
                  🕒 {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </PageWrapper>
  );
}

export default AuditLogs;

/* ================= STYLES ================= */

const container = {
  maxWidth: "1100px",
  margin: "auto",
  padding: "12px",
};

const title = {
  textAlign: "center",
  fontSize: "22px",
  fontWeight: "700",
};

const subtitle = {
  textAlign: "center",
  fontSize: "13px",
  opacity: 0.75,
  marginBottom: "16px",
};

const emptyCard = {
  marginTop: "40px",
  textAlign: "center",
  padding: "20px",
  background: "rgba(0,0,0,0.55)",
  borderRadius: "14px",
  color: "white",
};

const tableWrap = {
  background: "rgba(0,0,0,0.6)",
  padding: "14px",
  borderRadius: "14px",
};

const table = {
  width: "100%",
  color: "white",
  borderCollapse: "collapse",
  textAlign: "center",
};

const cardList = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const card = {
  background: "rgba(0,0,0,0.65)",
  padding: "16px",
  borderRadius: "16px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
};

const cardTop = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  marginBottom: "10px",
};

const avatar = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "linear-gradient(135deg,#6366f1,#22c55e)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "800",
};

const role = {
  fontSize: "12px",
  opacity: 0.7,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "13px",
  marginBottom: "6px",
};

const time = {
  fontSize: "11px",
  opacity: 0.65,
  marginTop: "8px",
  textAlign: "right",
};

const badge = (action) => ({
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: "700",
  color: "white",
  background:
    action === "ADD"
      ? "linear-gradient(135deg,#22c55e,#16a34a)"
      : action === "TRANSFER"
      ? "linear-gradient(135deg,#3b82f6,#2563eb)"
      : "linear-gradient(135deg,#ef4444,#dc2626)",
});
