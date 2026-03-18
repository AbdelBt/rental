import { Navigate } from "react-router-dom";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useSupabaseAuth();

  if (loading) {
    return null;
  }

  if (!user) return <Navigate to="/agence" replace />;
  if (user.user_metadata?.role !== "agency") return <Navigate to="/agence" replace />;

  return children;
}
