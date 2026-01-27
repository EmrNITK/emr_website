import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function ProtectedRoute({ children }) {
  const auth = isAuthenticated();

  if (!auth) {
    return <Navigate to="/events" replace />;
  }

  return children;
}
