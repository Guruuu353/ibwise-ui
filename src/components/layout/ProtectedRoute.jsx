import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Gate for dashboard routes: no session -> back to login; wrong role for
// this branch of the tree -> sent to their own dashboard instead of a dead end.
export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={`/${user.role.toLowerCase()}`} replace />;

  return <Outlet />;
}
