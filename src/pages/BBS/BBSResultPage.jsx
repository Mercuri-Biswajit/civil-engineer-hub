// src/pages/BBS/BBSResultPage.jsx
// ─── BBS Result / Report view ─────────────────────────────────────────────────

import { useState } from "react";
import Card from "@/components/ui/Card.jsx";
import Button from "@/components/ui/Button.jsx";
import {
  BBSTable,
  GroupedBBSTable,
  CostTable,
} from "@/components/BBS/BBSResults.jsx";
import { downloadPDF, sendViaWhatsApp } from "@/utils/BBS/pdfReport.js";
import { downloadExcel } from "@/utils/BBS/excelExport.js";
import {
  generateBarPurchaseMessage,
  cuttingLengthSummary,
  generateBarTagSchedule,
  generateLapSpliceSchedule,
  BAR_WEIGHT,
} from "@/utils/BBS/calculations.js";
import { TABS } from "@/utils/BBS/constants.js";

export default function ResultPage({
  result,
  rates,
  details,
  onRateChange,
  onBack,
}) {
  const [sending, setSending] = useState(false);
  const [sentMsg, setSentMsg] = useState("");
  const [dlBusy, setDlBusy] = useState(false);
  const [xlBusy, setXlBusy] = useState(false);
  const [activeView, setActiveView] = useState("bbs");

  const { byType, allRows, costs } = result;
  const totalWt = allRows.reduce((s, r) => s + r.weight, 0);
  const totalCost = costs.reduce((s, r) => s + r.cost, 0);
  const totalRods = costs.reduce((s, r) => s + r.rods12m, 0);

  const cutLengthData = cuttingLengthSummary(allRows);
  const barTagData = generateBarTagSchedule(allRows);
  const lapSpliceData = generateLapSpliceSchedule(allRows);

  const handleDownload = () => {
    setDlBusy(true);
    setTimeout(() => {
      downloadPDF(details, byType, allRows, costs);
      setDlBusy(false);
    }, 100);
  };

  const handleExcel = () => {
    setXlBusy(true);
    setTimeout(() => {
      downloadExcel(details, byType, allRows, costs, cutLengthData, barTagData);
      setXlBusy(false);
    }, 100);
  };

  const handleWhatsApp = () => {
    if (!details.engineerPhone || details.engineerPhone.length < 10) {
      alert(
        "Please enter a valid 10-digit WhatsApp number in Project Details.",
      );
      return;
    }
    setSending(true);
    setTimeout(() => {
      const fname = sendViaWhatsApp(details, byType, allRows, costs);
      setSending(false);
      setSentMsg(
        `PDF saved as "${fname}" · WhatsApp opened — attach the file and hit Send!`,
      );
    }, 200);
  };

  const handleSendBarOrder = () => {
    if (!details.engineerPhone || details.engineerPhone.length < 10) {
      alert(
        "Please enter a valid 10-digit WhatsApp number in Project Details.",
      );
      return;
    }
    const message = encodeURIComponent(
      generateBarPurchaseMessage(costs, details),
    );
    window.open(
      `https://wa.me/91${details.engineerPhone}?text=${message}`,
      "_blank",
    );
  };

  const ActionBar = ({ className = "" }) => (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Button
        variant="primary"
        size="sm"
        onClick={handleDownload}
        isLoading={dlBusy}
        className="bg-primary-600 border-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-100"
      >
        {dlBusy ? "Generating…" : "Download PDF"}
      </Button>
      <button
        onClick={handleExcel}
        disabled={xlBusy}
        className="h-10 px-6 rounded-lg flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-100 disabled:opacity-50 active:scale-95"
      >
        <span>📊</span>
        {xlBusy ? "Exporting…" : "Excel"}
      </button>
      <button
        onClick={handleWhatsApp}
        disabled={sending}
        className="h-10 px-6 rounded-lg flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all bg-[#25D366] text-white hover:bg-[#128C7E] shadow-xl shadow-green-100 disabled:opacity-50 active:scale-95"
      >
        <span>💬</span>
        {sending ? "Opening…" : "WhatsApp"}
      </button>
    </div>
  );

  const VIEW_TABS = [
    { id: "bbs", icon: "📋", label: "BBS Tables" },
    { id: "cutting", icon: "📏", label: "Cutting" },
    { id: "bartag", icon: "🏷️", label: "Bar Tags" },
    { id: "lapsplice", icon: "🔗", label: "Laps" },
    { id: "cost", icon: "💰", label: "Costing" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12 animate-in fade-in duration-700">
      {/* Result Banner */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="w-16 h-16 rounded-lg bg-primary-600 text-white flex items-center justify-center text-4xl shadow-2xl shadow-primary-200">📄</span>
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Structural Report</h1>
                <p className="text-slate-400 mt-2 font-black uppercase tracking-[0.2em] text-[10px]">Reinforcement Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">
                Ref: {details.projectName || "BBS-HUB"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="text-slate-400 text-[11px] font-medium">Auto-generated for procurement planning</span>
            </div>
          </div>
          <ActionBar />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Steel Weight", value: `${totalWt.toFixed(1)}`, unit: "kg", icon: "⚖️" },
            { label: "Total Cost", value: `${totalCost.toLocaleString("en-IN")}`, unit: "₹", icon: "💰" },
            { label: "12m Rods", value: `${totalRods}`, unit: "pcs", icon: "📏" },
            { label: "Bar Tag Counts", value: `${allRows.length}`, unit: "items", icon: "📋" },
          ].map((k, i) => (
            <div key={i} className="bg-white border border-slate-200/50 p-7 rounded-lg shadow-sm relative overflow-hidden group hover:shadow-luxury hover:-translate-y-1 transition-all duration-500">
              <div className="absolute top-6 right-6 text-3xl opacity-10 group-hover:scale-125 group-hover:opacity-30 transition-all">{k.icon}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{k.label}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{k.value}</span>
                <span className="text-[11px] font-black text-slate-400 uppercase">{k.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {sentMsg && (
        <div className="mb-8 p-6 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-between shadow-lg shadow-emerald-50/50 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
            <span className="w-10 h-10 rounded-lg bg-white text-emerald-600 flex items-center justify-center shadow-sm">💬</span>
            <span className="text-sm font-bold text-emerald-800">{sentMsg}</span>
          </div>
          <button
            className="w-10 h-10 rounded-lg bg-white text-emerald-300 hover:text-emerald-500 transition-colors shadow-sm text-lg font-black"
            onClick={() => setSentMsg("")}
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-col gap-12">
        {/* View Switcher */}
        <div className="flex flex-wrap items-center bg-slate-100/50 p-2 rounded-lg gap-2 w-fit border border-slate-200/50 backdrop-blur-md self-center shadow-inner">
          {VIEW_TABS.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              className={`px-8 py-3 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3
                         ${activeView === v.id 
                            ? "bg-white text-primary-600 shadow-xl shadow-slate-200/40 border border-slate-200/60 scale-105" 
                            : "text-slate-400 hover:text-slate-700 active:scale-95"}`}
            >
              <span className="text-lg">{v.icon}</span>
              {v.label}
            </button>
          ))}
        </div>

        {/* ── BBS TABLES ── */}
        {activeView === "bbs" && (
          <div className="flex flex-col gap-10">
            {byType.map(
              (t) =>
                t.rows.length > 0 && (
                  <Card key={t.type} className="border border-slate-200/60 shadow-luxury overflow-hidden rounded-lg">
                    <div className="px-8 py-6 bg-slate-50 border-b border-slate-200/60 flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <span className="text-3xl bg-white w-14 h-14 rounded-lg flex items-center justify-center shadow-xl shadow-slate-200/40 border border-slate-100">
                          {TABS.find((x) => x.id === t.type)?.icon}
                        </span>
                        <div>
                          <div className="font-black text-slate-800 tracking-tight text-lg italic">
                            {TABS.find((x) => x.id === t.type)?.label} Reinforcement
                          </div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                            {t.items.length} Elements · {t.items.reduce((s, i) => s + (+i.count || 1), 0)} Instances
                          </div>
                        </div>
                      </div>
                      <span className="px-4 py-2 bg-primary-50 text-primary-600 text-xs font-black rounded-lg border border-primary-100/50 shadow-sm">
                        {t.rows.reduce((s, r) => s + r.weight, 0).toFixed(2)} kg
                      </span>
                    </div>
                    <GroupedBBSTable rows={t.rows} />
                  </Card>
                ),
            )}
            
            <Card className="border border-slate-200/60 shadow-luxury overflow-hidden rounded-lg">
              <div className="px-8 py-6 bg-slate-50 border-b border-slate-200/60 flex items-center gap-5">
                <span className="text-3xl bg-white w-14 h-14 rounded-lg flex items-center justify-center shadow-xl shadow-slate-200/40 border border-slate-100">📑</span>
                <div>
                  <div className="font-black text-slate-800 tracking-tight text-lg italic">Master BBS Schedule</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Aggregate reinforcement · All Components</div>
                </div>
              </div>
              <div className="p-4 sm:p-8">
                <BBSTable rows={allRows} showSource={true} />
              </div>
            </Card>
          </div>
        )}

        {/* ── CUTTING LENGTH ── */}
        {activeView === "cutting" && (
          <Card className="border border-slate-200/60 shadow-luxury overflow-hidden rounded-lg p-4 lg:p-10">
            <div className="flex flex-col gap-12">
              {cutLengthData.map((d) => (
                <div key={d.dia}>
                  <div className="flex flex-wrap items-center gap-6 mb-6 bg-white border border-slate-200/60 p-6 rounded-lg shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-600" />
                    <span className="px-5 py-2 bg-primary-50 text-primary-600 rounded-lg text-lg font-black tracking-tight italic border border-primary-100/50">φ{d.dia}mm</span>
                    <div className="flex-1 h-px bg-white/10 hidden sm:block" />
                    <div className="flex gap-10">
                      <div className="text-right">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Length</div>
                        <div className="text-lg font-black tracking-tight">{d.totalLen.toFixed(3)} <span className="text-xs text-slate-500">m</span></div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Weight</div>
                        <div className="text-lg font-black text-emerald-400 tracking-tight">{d.weight.toFixed(2)} <span className="text-xs text-slate-500">kg</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="px-5 py-4">Source</th>
                          <th className="px-5 py-4">Mark</th>
                          <th className="px-5 py-4">Description</th>
                          <th className="px-5 py-4 text-center">Nos</th>
                          <th className="px-5 py-4 text-right">Cut Len (m)</th>
                          <th className="px-5 py-4 text-right">Total Len (m)</th>
                          <th className="px-5 py-4 text-right">Weight (kg)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {d.entries.map((e, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-5 py-4 font-black text-slate-800">{e.source}</td>
                            <td className="px-5 py-4">
                              <span className="px-2 py-1 bg-primary-50 text-primary-600 rounded text-[10px] font-black uppercase">{e.mark}</span>
                            </td>
                            <td className="px-5 py-4 text-slate-500 italic">{e.desc}</td>
                            <td className="px-5 py-4 text-center font-black">{e.nos}</td>
                            <td className="px-5 py-4 text-right font-mono">{e.cutLen.toFixed(3)}</td>
                            <td className="px-5 py-4 text-right font-mono font-black text-slate-900">{e.totalLen.toFixed(3)}</td>
                            <td className="px-5 py-4 text-right font-mono font-black text-emerald-600">
                              {(e.nos * e.cutLen * BAR_WEIGHT[d.dia]).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── BAR TAGS ── */}
        {activeView === "bartag" && (
          <Card className="border border-slate-200/60 shadow-luxury overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-6">Unique Tag ID</th>
                    <th className="px-8 py-6">Component</th>
                    <th className="px-8 py-6 text-center">Mark</th>
                    <th className="px-8 py-6">Reinforcement Detail</th>
                    <th className="px-8 py-6 text-center">Nos</th>
                    <th className="px-8 py-6 text-right">Cut Len</th>
                    <th className="px-8 py-6 text-right text-rose-600">Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 capitalize-tds">
                  {barTagData.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-5">
                        <span className="px-3 py-1.5 bg-primary-50 text-primary-600 text-[10px] font-black rounded-lg border border-primary-100/50 shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all whitespace-nowrap">
                          {r.tag}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-black text-slate-800 italic">{r.source}</td>
                      <td className="px-8 py-5 text-center">
                        <span className="px-2.5 py-1 bg-primary-50 text-primary-600 rounded-lg text-[10px] font-black uppercase">{r.mark}</span>
                      </td>
                      <td className="px-8 py-5 text-slate-500 italic max-w-xs">{r.desc} (φ{r.dia})</td>
                      <td className="px-8 py-5 text-center font-black">{r.nos}</td>
                      <td className="px-8 py-5 text-right font-mono">{r.cutLen.toFixed(3)}m</td>
                      <td className="px-8 py-5 text-right font-mono font-black text-rose-600">{r.weight.toFixed(2)} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-8 bg-amber-50/40 text-center border-t border-amber-100">
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest flex items-center justify-center gap-3">
                <span className="animate-pulse">⚠️</span>
                Attach tags to bar bundles before site placement to avoid execution errors
              </p>
            </div>
          </Card>
        )}

        {/* ── LAPS ── */}
        {activeView === "lapsplice" && (
          <Card className="border border-slate-200/60 shadow-luxury overflow-hidden rounded-lg p-8 lg:p-12">
            <div className="flex flex-col gap-12">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-10 relative overflow-hidden group shadow-inner">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 via-primary-500 to-emerald-500" />
                <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-lg shadow-rose-500/50" />
                  IS 456 Typical Lap Splice Diagram
                </h4>
                <div className="max-w-xl mx-auto drop-shadow-[0_10px_30px_rgba(255,255,255,0.05)]">
                  <svg viewBox="0 0 600 120" className="w-full">
                    <line x1="20" y1="40" x2="340" y2="40" stroke="#f43f5e" strokeWidth="8" strokeLinecap="round" />
                    <line x1="180" y1="60" x2="580" y2="60" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
                    <rect x="180" y="28" width="160" height="44" fill="rgba(0,0,0,0.02)" stroke="rgba(0,0,0,0.1)" strokeWidth="1" rx="4" />
                    <text x="260" y="15" textAnchor="middle" fill="#64748b" className="text-[10px] font-black uppercase tracking-widest">Tension Lap = 40d</text>
                  </svg>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-5">Source</th>
                      <th className="px-6 py-5">Mark</th>
                      <th className="px-6 py-5 text-center">Dia</th>
                      <th className="px-6 py-5 text-right">Lap Len (m)</th>
                      <th className="px-6 py-5 text-right text-rose-500 whitespace-nowrap">Lap Len (mm)</th>
                      <th className="px-6 py-5 text-center">Zone Condition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lapSpliceData.length > 0 ? (
                      lapSpliceData.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-5 font-black text-slate-800">{r.source}</td>
                          <td className="px-6 py-5 italic text-slate-500">{r.mark}</td>
                          <td className="px-6 py-5 text-center font-black">φ{r.dia}</td>
                          <td className="px-6 py-5 text-right font-mono font-bold">{r.lapLen.toFixed(3)} m</td>
                          <td className="px-6 py-5 text-right font-black text-rose-500 bg-rose-50/20">{r.lapLenMm} mm</td>
                          <td className="px-6 py-5 text-center">
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border
                                            ${r.zone.includes("Tension") 
                                              ? "bg-rose-50 text-rose-600 border-rose-100" 
                                              : "bg-blue-50 text-blue-600 border-blue-100"}`}>
                              {r.zone}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-bold italic uppercase tracking-widest text-[10px]">
                           No critical lap splices in configuration
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}

        {/* ── COSTING ── */}
        {activeView === "cost" && (
          <Card className="border border-slate-200/60 shadow-luxury overflow-hidden rounded-lg">
            <CostTable
              costs={costs}
              onRateChange={onRateChange}
              details={details}
              onSendBarOrder={handleSendBarOrder}
            />
          </Card>
        )}

        {/* Bottom CTA */}
        <div className="mt-8 bg-white border border-slate-200/60 rounded-lg p-10 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-luxury relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-lg text-center md:text-left">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-4 italic">Complete Structural Dossier</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Finalize your procurement plan. Download professional PDF reports, Excel schedules, or share direct order details via WhatsApp.
            </p>
          </div>
          <ActionBar className="relative z-10 scale-125 origin-center lg:origin-right" />
        </div>

        <div className="p-8 bg-slate-100/50 border border-slate-200/60 rounded-lg flex items-start gap-5">
          <span className="text-2xl bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow-sm border border-slate-100">💡</span>
          <div className="flex-1">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-loose">
              <b>Reinforcement Standards (IS 456:2000):</b> Footing/Raft (75mm Cover) · 
              Beam/Column (40mm) · Slab (20mm) · Lap: 40d · Stirrup Hook: 9d · stirrups dense zone L/4 at ends. 
              Verify all estimates against site drawings before bar cutting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
