// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./auth/ProtectedRoute";

// import Dashboard from "./pages/Dashboard";
// import StockManager from "./pages/StockManager";
// import StockDashboard from "./pages/StockDashboard";
// import AiAssistant from "./pages/AiAssistant";
// import AuditLog from "./pages/AuditLog";

// import Login from "./auth/Login";
// import Register from "./auth/Register";

// function App() {
//   const isLoggedIn = localStorage.getItem("token");

//   return (
//     <BrowserRouter>
//       {isLoggedIn && <Navbar />}

//       <Routes>
//         {/* AUTH */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* PROTECTED */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/manage-stock"
//           element={
//             <ProtectedRoute>
//               <StockManager />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/view-stock"
//           element={
//             <ProtectedRoute>
//               <StockDashboard />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//   path="/ai"
//   element={
//     <ProtectedRoute allowedRoles={["ADMIN"]}>
//       <AiAssistant />
//     </ProtectedRoute>
//   }
// />

// <Route
//   path="/audit"
//   element={
//     <ProtectedRoute allowedRoles={["ADMIN"]}>
//       <AuditLog />
//     </ProtectedRoute>
//   }
// />



//         {/* DEFAULT */}
//         <Route
//           path="*"
//           element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./auth/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import StockManager from "./pages/StockManager";
import StockDashboard from "./pages/StockDashboard";
import AiAssistant from "./pages/AiAssistant";
import CreateStaff from "./pages/CreateStaff";
import AuditLog from "./pages/AuditLog";

import Login from "./auth/Login";
import Register from "./auth/Register";

const RequireAdmin = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "ROLE_ADMIN"
    ? children
    : <Navigate to="/dashboard" />;
};


function App() {
  const isLoggedIn = localStorage.getItem("token");

  return (
    <BrowserRouter>
      {isLoggedIn && <Navbar />}

      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* COMMON (ADMIN + STAFF) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-stock"
          element={
            <ProtectedRoute>
              <StockManager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-stock"
          element={
            <ProtectedRoute>
              <StockDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ONLY */}
        <Route
  path="/create-staff"
  element={
    <RequireAdmin>
      <CreateStaff />
    </RequireAdmin>
  }
/>

<Route
  path="/audit"
  element={
    <RequireAdmin>
      <AuditLog />
    </RequireAdmin>
  }
/>

<Route
  path="/ai"
  element={
    <RequireAdmin>
      <AiAssistant />
    </RequireAdmin>
  }
/>


        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
