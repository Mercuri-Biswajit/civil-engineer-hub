// ─── App Shell — Root Component ──────────────────────────────────────────────
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/auth/AuthContext.jsx';

import Dashboard from '@/pages/Dashboard/Dashboard.jsx';

// Tool wrappers
import BBSPage from '@/pages/BBS/BBSPage.jsx';
import BOQPage from '@/pages/BOQ/BOQPage.jsx';
import StructureWrapper from '@/pages/StructureDesign/StructureWrapper.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bbs/*" element={<BBSPage />} />
          <Route path="/boq/*" element={<BOQPage />} />
          <Route path="/structure/*" element={<StructureWrapper />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

