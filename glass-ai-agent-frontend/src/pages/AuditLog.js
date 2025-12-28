import { useEffect, useState } from "react";
import api from "../api/api";
import PageWrapper from "../components/PageWrapper";

function AuditLogs() {
  const [logs, setLogs] = useState([]);

 useEffect(() => {
  api.get("/audit/recent")
    .then(res => {
      console.log("AUDIT LOGS:", res.data);
      setLogs(res.data);
    })
    .catch(err => {
      console.error("AUDIT ERROR", err.response?.status);
    });
}, []);


  return (
    <PageWrapper>
      <div style={{ width: "90%", margin: "auto" }}>
        {/* <button
  style={downloadBtn}
  onClick={() => window.open("http://localhost:8080/audit/download")}
>
  ⬇ Download Report
</button> */}

        <h2 style={{ textAlign: "center" }}>📜 Staff Activity Log</h2>

        <table style={tableStyle}>
          <thead>
  <tr>
    <th>User</th>
    <th>Role</th>
    <th>Action</th>
    <th>Glass</th>

    {/* ✅ NEW COLUMNS */}
    <th>Height</th>
    <th>Width</th>

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
      <td>{log.action}</td>
      <td>{log.glassType}</td>

      {/* ✅ HEIGHT */}
      <td>{log.height}{log.unit}</td>

      {/* ✅ WIDTH */}
      <td>{log.width}{log.unit}</td>

      <td>{log.quantity}</td>
      {/* <td>{log.standNo}</td> */}
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
    </PageWrapper>
  );
}

const tableStyle = {
  width: "100%",
  color: "white",
  borderCollapse: "collapse",
  textAlign: "center"
};
// const downloadBtn = {
//   padding: "10px 18px",
//   borderRadius: "10px",
//   background: "linear-gradient(135deg, #22c55e, #16a34a)",
//   color: "white",
//   fontWeight: "600",
//   border: "none",
//   cursor: "pointer",
//   marginBottom: "15px",
// };


export default AuditLogs;

