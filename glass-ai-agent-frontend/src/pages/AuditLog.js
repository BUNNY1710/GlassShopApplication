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
        <h2 style={{ textAlign: "center" }}>📜 Staff Activity Log</h2>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Action</th>
              <th>Glass</th>
              <th>Qty</th>
              <th>Stand</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {
            logs.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No activity found
              </td>
            </tr>
          ) : (logs.map((l, i) => (
              <tr key={i}>
                <td>{l.username}</td>
                <td>{l.role}</td>
                <td>{l.action}</td>
                <td>{l.glassType}</td>
                <td>{l.quantity}</td>
                <td>{l.standNo}</td>
                <td>{new Date(l.timestamp).toLocaleString()}</td>
              </tr>
            ))
            )}
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

export default AuditLogs;


// import { useEffect, useState } from "react";
// import api from "../api/api";
// import PageWrapper from "../components/PageWrapper";
// import dashboardBg from "../assets/dashboard-bg.jpg";

// function AuditLogs() {
//   const [logs, setLogs] = useState([]);

//   useEffect(() => {
//     api.get("/audit/recent")
//       .then(res => setLogs(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <PageWrapper background={dashboardBg}>
//       <div style={card}>
//         <h2>📝 Recent Staff Activity</h2>

//         {logs.length === 0 ? (
//           <p>No activity found</p>
//         ) : (
//           <table style={table}>
//             <thead>
//               <tr>
//                 <th>User</th>
//                 <th>Role</th>
//                 <th>Action</th>
//                 <th>Glass</th>
//                 <th>Qty</th>
//                 <th>Stand</th>
//                 <th>Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {logs.map((l, i) => (
//                 <tr key={i}>
//                   <td>{l.username}</td>
//                   <td>{l.role}</td>
//                   <td>{l.action}</td>
//                   <td>{l.glassType}</td>
//                   <td>{l.quantity}</td>
//                   <td>{l.standNo}</td>
//                   <td>{new Date(l.timestamp).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </PageWrapper>
//   );
// }

// export default AuditLogs;

// const card = {
//   width: "90%",
//   margin: "auto",
//   background: "rgba(0,0,0,0.6)",
//   padding: "20px",
//   borderRadius: "12px",
//   color: "white"
// };

// const table = {
//   width: "100%",
//   borderCollapse: "collapse",
//   textAlign: "center"
// };
