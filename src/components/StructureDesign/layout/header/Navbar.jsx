import { NavLink } from "react-router-dom";
import { ROUTES } from "@/utils/StructureDesign/routes/index.js";

const CATEGORIES = [
  { label: "Project", ids: ["details"] },
  { label: "Structure", ids: ["beam", "column", "slab", "foundation"] },
  { label: "Transport", ids: ["road", "bridge"] },
  { label: "Costing", ids: ["boq", "report"] },
];

export default function Navbar() {
  return (
    <aside className="w-full lg:w-56 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto flex flex-col gap-4 no-print z-30 shrink-0">
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <span className="text-sm">🏗️</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-none">
              Structure
            </h2>
            <p className="text-[8px] font-semibold text-indigo-600 uppercase tracking-wider mt-0.5">
              IS & IRC Codes
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <div key={cat.label} className="flex flex-col">
              <div className="flex items-center gap-2 px-2 mt-2 mb-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  {cat.label}
                </span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              {ROUTES.filter((r) => cat.ids.includes(r.id)).map((route) => {
                const Icon = route.icon;
                return (
                  <NavLink
                    key={route.id}
                    to={`/structure/${route.path}`}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-left group ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                            isActive
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {Icon && <Icon size={12} />}
                        </div>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wide ${
                            isActive ? "text-slate-800" : "text-slate-500"
                          }`}
                        >
                          {route.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 flex gap-1.5 justify-center">
        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
          IS 456
        </span>
        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
          IRC 112
        </span>
      </div>
    </aside>
  );
}
