import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PROJECT } from "@/components/BBS/ProjectDetails.jsx";
import { newItem, ItemManager } from "@/components/BBS/ItemManager.jsx";
// Removed ReportsHistory as requested - usage is now via main Dashboard
import {
  calcSingleFooting,
  calcSingleColumn,
  calcSingleBeam,
  calcSingleSlab,
  calcSingleStaircase,
  calcSingleLintel,
  calcSingleRaft,
  calcSinglePileCap,
  buildBBS,
  aggregateBBS,
  costSummary,
  DEFAULT_RATES_PER_PIECE,
} from "@/utils/BBS/calculations.js";

import Sidebar from "@/components/BBS/Sidebar.jsx";
import BBSResultPage from "./BBSResultPage.jsx";
import { TABS } from "@/utils/BBS/constants.js";
import ProjectDetails from "@/components/BBS/ProjectDetails.jsx";
import ToolLayout from "@/components/layout/ToolLayout.jsx";
import Button from "@/components/ui/Button.jsx";

// ─── Styles ───────────────────────────────────────────────────────────────────
// Migrated to Tailwind. layout.css is no longer needed.

// ─── helper ───────────────────────────────────────────────────────────────────
function calcItems(type, items) {
  return items.map((item) => {
    let rawRows;
    if (type === "footing") rawRows = calcSingleFooting(item);
    else if (type === "column") rawRows = calcSingleColumn(item);
    else if (type === "plinthBeam")
      rawRows = calcSingleBeam(item, "plinthBeam");
    else if (type === "wallBeam") rawRows = calcSingleBeam(item, "wallBeam");
    else if (type === "slab") rawRows = calcSingleSlab(item);
    else if (type === "staircase") rawRows = calcSingleStaircase(item);
    else if (type === "lintel") rawRows = calcSingleLintel(item);
    else if (type === "raft") rawRows = calcSingleRaft(item);
    else if (type === "pileCap") rawRows = calcSinglePileCap(item);
    return {
      label: item.label,
      count: +item.count || 1,
      bbs: buildBBS(rawRows),
    };
  });
}

import { MetricCard, SectionTitle, Modal } from "@/components/BBS/ui.jsx";

// Recreated CalculatorPage component
function BBSCalculatorView({
  activeTab,
  setActiveTab,
  elementSets,
  projectReady,
  onCalculate,
}) {
  if (activeTab === "dashboard" || activeTab === "project_details") return null;

  const currentSet = elementSets[activeTab];

  // Navigation logic
  const currentIndex = TABS.findIndex((t) => t.id === activeTab);
  const nextTab = TABS[currentIndex + 1];
  const isLastTab = currentIndex === TABS.length - 1;

  const handleNext = () => {
    if (nextTab) {
      setActiveTab(nextTab.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 animate-in fade-in duration-500 pb-24">
      <div className="relative">
        <ItemManager
          type={activeTab}
          items={currentSet.items}
          setItems={currentSet.setItems}
        />
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/40 p-3 rounded-lg shadow-lg flex flex-row items-center gap-6 sm:gap-12">
          <div className="flex flex-col pl-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Step {currentIndex + 1} of {TABS.length}
            </span>
            <span className="text-slate-900 text-sm font-semibold truncate max-w-[120px] sm:max-w-none">
              {TABS[currentIndex]?.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isLastTab ? (
              <Button
                variant="primary"
                onClick={handleNext}
                className="bg-primary-600 text-white border-primary-600 hover:bg-primary-700 h-12 px-8 rounded-lg font-black uppercase tracking-wider text-xs shadow-xl shadow-primary-200 active:scale-95"
              >
                Next Element →
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={onCalculate}
                disabled={!projectReady}
                className="bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 h-12 px-8 rounded-lg font-black uppercase tracking-wider text-xs shadow-xl shadow-emerald-100 active:scale-95"
              >
                Finish & Generate Report ✨
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BBSPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("calculator"); // "calculator" | "result"
  const [details, setDetails] = useState(DEFAULT_PROJECT);
  const [rates, setRates] = useState({ ...DEFAULT_RATES_PER_PIECE });
  const [result, setResult] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [activeTab, setActiveTab] = useState("project_details");
  const [showRates, setShowRates] = useState(false);

  // ─── Element state ─────────────────────────────────────────────────────────
  const [footings, setFootings] = useState([
    { ...newItem("footing"), label: "Footing F1", count: 4 },
  ]);
  const [columns, setColumns] = useState([
    { ...newItem("column"), label: "Column C1 (Int.)", count: 6 },
  ]);
  const [plinthBeams, setPlinthBeams] = useState([
    { ...newItem("plinthBeam"), label: "Plinth Beam PB1", count: 4 },
  ]);
  const [wallBeams, setWallBeams] = useState([
    { ...newItem("wallBeam"), label: "Wall Beam WB1", count: 3 },
  ]);
  const [slabs, setSlabs] = useState([
    { ...newItem("slab"), label: "Slab S1", count: 1 },
  ]);
  const [staircases, setStaircases] = useState([]);
  const [lintels, setLintels] = useState([]);
  const [rafts, setRafts] = useState([]);
  const [pileCaps, setPileCaps] = useState([]);

  const elementSets = {
    footing: { items: footings, setItems: setFootings },
    column: { items: columns, setItems: setColumns },
    plinthBeam: { items: plinthBeams, setItems: setPlinthBeams },
    wallBeam: { items: wallBeams, setItems: setWallBeams },
    slab: { items: slabs, setItems: setSlabs },
    staircase: { items: staircases, setItems: setStaircases },
    lintel: { items: lintels, setItems: setLintels },
    raft: { items: rafts, setItems: setRafts },
    pileCap: { items: pileCaps, setItems: setPileCaps },
  };

  const allItemsByType = [
    { type: "footing", items: footings },
    { type: "column", items: columns },
    { type: "plinthBeam", items: plinthBeams },
    { type: "wallBeam", items: wallBeams },
    { type: "slab", items: slabs },
    { type: "staircase", items: staircases },
    { type: "lintel", items: lintels },
    { type: "raft", items: rafts },
    { type: "pileCap", items: pileCaps },
  ];

  const projectReady = details.projectName.trim().length > 0;
  const updateRate = (dia, val) => setRates((p) => ({ ...p, [dia]: val }));

  const totalNos = Object.values(elementSets)
    .flatMap((s) => s.items)
    .reduce((sum, it) => sum + (+it.count || 1), 0);

  // ─── Actions ────────────────────────────────────────────────────────────────
  const handleCalculate = useCallback(() => {
    const byType = allItemsByType.map(({ type, items }) => ({
      type,
      items,
      rows: aggregateBBS(calcItems(type, items)),
    }));
    const allRows = byType.flatMap((t) => t.rows);
    const costs = costSummary(allRows, rates);
    const data = { byType, allRows, costs };

    setResult(data);
    setViewMode("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [
    footings,
    columns,
    plinthBeams,
    wallBeams,
    slabs,
    staircases,
    lintels,
    rafts,
    pileCaps,
    rates,
    details,
  ]);

  const handleRateChange = useCallback(
    (dia, val) => {
      const newRates = { ...rates, [dia]: val };
      setRates(newRates);
      if (result) {
        const costs = costSummary(result.allRows, newRates);
        setResult((prev) => ({ ...prev, costs }));
      }
    },
    [rates, result],
  );

  const handleLoadReport = (report) => {
    setResult({
      byType: report.byType,
      allRows: report.allRows,
      costs: report.costs,
    });
    setDetails(report.details);
    if (report.rates) setRates(report.rates);
    setViewMode("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveToCloud = async (pName) => {
    if (!user) throw new Error("User not logged in");
    const byType = allItemsByType.map(({ type, items }) => ({
      type,
      items: items.map((item) => {
        const copy = { ...item };
        delete copy.blueprintImage;
        return copy;
      }),
      rows: aggregateBBS(calcItems(type, items)),
    }));
    const allRows = byType.flatMap((t) => t.rows);
    const costs = costSummary(allRows, rates);

    const projectData = {
      details: { ...details, projectName: pName },
      byType,
      allRows,
      costs,
      rates: { ...rates },
    };

    const { saveProjectToFirestore } =
      await import("@/services/projectService");
    await saveProjectToFirestore("local-user", {
      tool: "bbs",
      projectName: pName,
      projectData,
    });
  };

  const subtitle = details.projectName
    ? `📌 ${details.projectName}`
    : "Bar Bending Schedule Calculator";

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <ToolLayout
      title="BBS Calculator"
      subtitle={subtitle}
      onSave={handleSaveToCloud}
      headerAction={
        viewMode === "calculator" && (
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowRates(true)}
              className="bg-white/50 border-white/60 text-slate-700 hover:bg-white/80"
            >
              💰 Market Rates
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCalculate}
              disabled={!projectReady}
            >
              📄 Generate Report
            </Button>
          </div>
        )
      }
    >
      {/* Storage error banner */}
      {saveError && (
        <div
          style={{
            background: "#fffbeb",
            borderBottom: "1px solid #fde68a",
            padding: "10px 28px",
            fontSize: 12,
            color: "#92400e",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span>{saveError}</span>
          <button
            onClick={() => setSaveError(null)}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#92400e",
              fontSize: 16,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main BBS layout */}
      <div className="flex flex-col lg:flex-row gap-12 items-start relative pb-32">
        {viewMode === "calculator" && (
          <Sidebar
            tabs={TABS}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            elementSets={elementSets}
            totalNos={totalNos}
          />
        )}

        <main className="flex-1 min-w-0 w-full relative">
          <div className="w-full max-w-[1400px] mx-auto">
            {viewMode === "result" && result && (
              <BBSResultPage
                result={result}
                rates={rates}
                details={details}
                onRateChange={handleRateChange}
                onBack={() => setViewMode("calculator")}
              />
            )}

            {viewMode === "calculator" && activeTab === "project_details" && (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-full max-w-5xl bg-white/60 backdrop-blur-xl border border-slate-200/50 p-2 rounded-lg shadow-2xl">
                  <ProjectDetails
                    details={details}
                    setDetails={setDetails}
                    onStart={() => setActiveTab("footing")}
                    projectReady={projectReady}
                  />
                </div>
              </div>
            )}

            {viewMode === "calculator" && activeTab !== "project_details" && (
              <>
                <BBSCalculatorView
                  details={details}
                  setDetails={setDetails}
                  elementSets={elementSets}
                  projectReady={projectReady}
                  onCalculate={handleCalculate}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />

                <Modal
                  isOpen={showRates}
                  onClose={() => setShowRates(false)}
                  title="Market Rates Dashboard"
                  subtitle="Update pricing for standard 12m TMT Reinforcement Rods"
                  icon="💰"
                  maxWidth="max-w-6xl"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(rates).map(([dia, r]) => (
                      <MetricCard
                        key={dia}
                        label={`Rod ${dia}mm`}
                        icon="⚖️"
                        value={r}
                        unit="₹/pc"
                        onChange={(v) => updateRate(dia, +v)}
                      />
                    ))}
                  </div>
                  <div className="mt-8 p-4 bg-primary-50/50 rounded-lg border border-primary-100 flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <p className="text-xs text-primary-800 leading-relaxed font-medium">
                      Rates specified here are used to calculate the{" "}
                      <b>Total Cost Summary</b> in the final report. Standard
                      weights are used for theoretical calculations.
                    </p>
                  </div>
                </Modal>
              </>
            )}
          </div>
        </main>
      </div>
    </ToolLayout>
  );
}
