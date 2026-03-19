import React from "react";
import { FiCheck } from "react-icons/fi";

export default function Sidebar({
  tabs,
  activeTab,
  setActiveTab,
  elementSets,
  totalNos,
}) {
  return (
    <aside className="w-full lg:w-80 lg:sticky lg:top-8 flex flex-col gap-8 no-print z-30">
      <div className="bg-white border border-slate-100 rounded-lg p-8 shadow-sm relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
         
         <div className="flex items-center gap-4 mb-10 px-2 relative z-10">
            <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
              <span className="text-xl">📐</span>
            </div>
            <div>
               <h2 className="text-lg font-extrabold text-slate-900 leading-none tracking-tighter">BBS Engine</h2>
               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-1.5">v3.1 — Smart Calc</p>
            </div>
         </div>

         <nav className="flex flex-col gap-3 relative z-10">
           {/* Project Details */}
           <button
             onClick={() => setActiveTab("project_details")}
             className={`flex items-center gap-5 p-4 rounded-lg transition-all text-left group relative ${
               activeTab === "project_details"
                 ? "bg-indigo-50 border-indigo-100 shadow-sm" 
                 : "border border-transparent hover:bg-slate-50"
             }`}
           >
             <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
               activeTab === "project_details"
                 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110" 
                 : "bg-slate-50 text-slate-400 border border-slate-100"
             }`}>
               📋
             </div>
             <div className={`text-[11px] flex-1 font-black uppercase tracking-widest transition-colors ${
               activeTab === "project_details" ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
             }`}>
               Project Details
             </div>
             {activeTab === "project_details" && (
               <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
             )}
           </button>

           <div className="h-px w-full bg-slate-100 my-2" />

           {tabs.map((t) => {
             const nos = elementSets[t.id].items.reduce((s, it) => s + (+it.count || 1), 0);
             const isActive = activeTab === t.id;

             return (
               <button
                 key={t.id}
                 onClick={() => setActiveTab(t.id)}
                 className={`flex items-center gap-5 p-4 rounded-lg transition-all text-left group relative ${
                   isActive 
                     ? "bg-indigo-50 border-indigo-100 shadow-sm" 
                     : "border border-transparent hover:bg-slate-50"
                 }`}
               >
                 <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
                   isActive 
                     ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110" 
                     : "bg-slate-50 text-slate-400 border border-slate-100"
                 }`}>
                   {t.icon}
                 </div>
                 <div className={`text-[11px] flex-1 font-black uppercase tracking-widest transition-colors ${
                   isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                 }`}>
                   {t.label}
                 </div>
                 {nos > 0 && (
                   <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${isActive ? "bg-indigo-200 text-indigo-800" : "bg-slate-100 text-slate-500"}`}>
                     {nos}
                   </span>
                 )}
                 {isActive && (
                   <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                 )}
               </button>
             );
           })}
         </nav>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-lg p-8 group">
         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
           Total Elements
         </span>
         <strong className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
           {totalNos} 
           <span className="text-xs font-bold text-slate-400 uppercase tracking-normal">
             nos
           </span>
         </strong>
      </div>
    </aside>
  );
}
