// ─── User Dashboard ──────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserProjects,
  deleteProjectFromFirestore,
} from "@/services/projectService";

// Reusable Components
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";

// Constants
import { TOOL_COLORS, LOCAL_USER_ID } from "@/utils/constants";

const TOOL_LABELS = { bbs: "BBS", boq: "BOQ", structure: "Structure" };

const TOOL_CARDS = [
  {
    id: "bbs",
    title: "Bar Bending Schedule",
    description:
      "Calculate reinforcement steel quantities and generate detailed BBS reports",
    icon: "📊",
    color: "from-indigo-500 to-indigo-600",
    path: "/bbs",
  },
  {
    id: "boq",
    title: "Bill of Quantities",
    description: "Create comprehensive BOQ for your construction projects",
    icon: "📋",
    color: "from-cyan-500 to-cyan-600",
    path: "/boq",
  },
  {
    id: "structure",
    title: "Structural Design",
    description:
      "Design and analyze structural elements like beams, columns, slabs",
    icon: "🏗️",
    color: "from-amber-500 to-orange-500",
    path: "/structure",
  },
];

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
    if (!window.confirm("Delete this project?")) return;
    await deleteProjectFromFirestore(id);
    setProjects((p) => p.filter((pr) => pr.id !== id));
  };

  const formatDate = (ts) => {
    if (!ts) return "—";
    const d = new Date(ts);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout>
      {/* ── Hero Section ── */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
              Welcome to Civil Engineer Hub
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl leading-relaxed">
              Professional calculators and tools for civil engineering
              calculations. Design structures, generate BOQs, and manage your
              projects efficiently.
            </p>

            {/* Quick Access Cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TOOL_CARDS.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => navigate(tool.path)}
                  className={`p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-left transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] hover:border-white/30 group`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tool.icon}</span>
                    <span className="font-bold text-white group-hover:text-indigo-200 transition-colors">
                      {tool.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── My Projects ── */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Projects
          </h2>
          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
        </div>

        {loadingProjects ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium">
              Loading projects...
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-800 mb-2">
              No saved projects yet
            </p>
            <p className="text-slate-500 max-w-sm mb-6">
              Open a calculator tool and save your work to see it here.
            </p>
            <div className="flex gap-3">
              <Button variant="primary" onClick={() => navigate("/bbs")}>
                Try BBS Calculator
              </Button>
              <Button variant="secondary" onClick={() => navigate("/boq")}>
                Try BOQ Builder
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {projects.map((p, index) => {
              const isStruct = p.tool.startsWith("structure-");
              const subTool = isStruct ? p.tool.split("-")[1] : null;
              const badgeLabel = isStruct
                ? `Structure: ${subTool}`
                : TOOL_LABELS[p.tool] || p.tool;
              const badgeColor = isStruct
                ? "#f59e0b"
                : TOOL_COLORS[p.tool] || "#64748b";
              const openPath = isStruct
                ? `/structure/${subTool}?id=${p.id}`
                : `/${p.tool}?id=${p.id}`;

              return (
                <div
                  key={p.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="flex flex-wrap sm:flex-nowrap items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  <span
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-white flex-shrink-0"
                    style={{ background: badgeColor }}
                  >
                    {badgeLabel}
                  </span>
                  <span className="flex-1 text-base font-semibold text-slate-900 min-w-0 truncate">
                    {p.project_name}
                  </span>
                  <span className="text-sm text-slate-400 font-medium whitespace-nowrap hidden sm:block">
                    {formatDate(p.created_at)}
                  </span>
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
