// ─── Admin Route (Removed — redirects to home) ────────────────────────────────
import { Navigate } from 'react-router-dom';

export default function AdminRoute() {
  return <Navigate to="/" replace />;
}
