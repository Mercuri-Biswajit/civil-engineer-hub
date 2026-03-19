// ─── Protected Route (No-op — always passes through) ─────────────────────────
import { Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  return <Outlet />;
}
