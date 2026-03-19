import { NavLink, useLocation } from "react-router-dom";
import { ROUTES } from "@/utils/StructureDesign/routes/index.js";

const CATEGORIES = [
  { label: "Project", ids: ["details"] },
  { label: "Structure", ids: ["beam", "column", "slab", "foundation"] },
  { label: "Transport", ids: ["road", "bridge"] },
  { label: "Costing", ids: ["boq", "report"] },
];

export default function Navbar() {
  return (
    <aside className="w-full lg:w-52 lg:min-w-[208px] lg:max-w-[220px] lg:sticky lg:top-4 flex flex-col gap-3 no-print z-30 shrink-0">
      <div className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm relative overflow-hidden">

         <div className="flex items-center gap-3 mb-4 px-1">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <span className="text-base">🏗️</span>
            </div>
            <div>
               <h2 className="text-sm font-extrabold text-slate-900 leading-none tracking-tight">Structure</h2>
               <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.15em] mt-1">IS & IRC Codes</p>
            </div>
         </div>

         <nav className="flex flex-col gap-0.5">
            {CATEGORIES.map((cat) => (
              <div key={cat.label} className="flex flex-col">
                <div className="flex items-center gap-2 px-2 mt-3 mb-1">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{cat.label}</span>
                   <div className="h-[1px] flex-1 bg-slate-100" />
                </div>
                
                {ROUTES.filter((r) => cat.ids.includes(r.id)).map((route) => {
                  const Icon = route.icon;
                  return (
                    <NavLink
                      key={route.id}
                      to={`/structure/${route.path}`}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-left group relative ${
                          isActive 
                            ? "bg-indigo-50 border border-indigo-100 shadow-sm" 
                            : "border border-transparent hover:bg-indigo-50/30"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            isActive 
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                              : "bg-slate-50 text-slate-400 border border-slate-100"
                          }`}>
                            {Icon && <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />}
                          </div>
                          <div className={`text-[10px] flex-1 font-bold uppercase tracking-wider transition-colors ${
                            isActive ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"
                          }`}>
                            {route.label}
                          </div>
                          {isActive && (
                            <div className="w-1 h-1 rounded-full bg-indigo-600 animate-pulse" />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
         </nav>
      </div>
      
      <div className="bg-white border border-slate-100 rounded-lg px-3 py-2 flex gap-2 justify-center items-center">
        <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">IS 456</span>
        <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider bg-amber-50 text-amber-600 border border-amber-100">IRC 112</span>
      </div>
    </aside>
  );
}
