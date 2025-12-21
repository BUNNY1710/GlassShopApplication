// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  // 🔐 Role-based access
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default ProtectedRoute;


// import { Navigate } from "react-router-dom";

// function ProtectedRoute({ children, allowedRoles }) {
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   // Role-based protection
//   if (allowedRoles && !allowedRoles.includes(role)) {
//     return <Navigate to="/dashboard" />;
//   }

//   return children;
// }

// export default ProtectedRoute;
