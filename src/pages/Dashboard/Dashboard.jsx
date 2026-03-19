// ─── User Dashboard ──────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProjects, deleteProjectFromFirestore } from '@/services/projectService';

// Reusable Components
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';


const TOOL_LABELS = { bbs: 'BBS', boq: 'BOQ', structure: 'Structure' };
const TOOL_COLORS = { bbs: '#6366f1', boq: '#06b6d4', structure: '#f59e0b' };
const LOCAL_USER_ID = 'local-user';

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    setLoadingProjects(true);
    getUserProjects(LOCAL_USER_ID)
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoadingProjects(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await deleteProjectFromFirestore(id);
    setProjects((p) => p.filter((pr) => pr.id !== id));
  };

  const formatDate = (ts) => {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <DashboardLayout>
      {/* ── Projects ── */}
      <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6 tracking-tight">My Projects</h2>
        {loadingProjects ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">Loading projects…</div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500 bg-white rounded-lg border border-dashed border-slate-200">
            <p className="text-base font-semibold mb-1">No saved projects yet.</p>
            <p className="text-sm text-slate-400">Open a calculator tool and save your work to see it here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map((p) => {
              const isStruct = p.tool.startsWith('structure-');
              const subTool = isStruct ? p.tool.split('-')[1] : null;
              const badgeLabel = isStruct ? `Structure: ${subTool}` : (TOOL_LABELS[p.tool] || p.tool);
              const badgeColor = isStruct ? '#f59e0b' : (TOOL_COLORS[p.tool] || '#64748b');
              const openPath = isStruct ? `/structure/${subTool}?id=${p.id}` : `/${p.tool}?id=${p.id}`;

              return (
                <div key={p.id} className="flex flex-wrap sm:flex-nowrap items-center gap-4 p-4 bg-white rounded-lg border border-slate-100 transition-all duration-200 hover:border-slate-300 hover:shadow-card">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold text-white flex-shrink-0 uppercase tracking-tighter"
                    style={{ background: badgeColor }}
                  >
                    {badgeLabel}
                  </span>
                  <span className="flex-1 text-sm font-bold text-slate-900 min-w-0 truncate">{p.project_name}</span>
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap hidden sm:block">{formatDate(p.created_at)}</span>
                  <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(openPath)}
                      className="flex-1 sm:flex-none"
                    >
                      Open
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 sm:flex-none"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
