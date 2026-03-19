import {
  FiBox,
  FiLayers,
  FiList,
  FiAlertCircle,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";
import { motion } from "framer-motion";

/**
 * Format number with Indian locale
 *
 * @param {number} n - Number to format
 * @returns {string} Formatted number string
 */
const fmt = (n) => Math.round(n).toLocaleString("en-IN");

/**
 * Format number with decimal places
 *
 * @param {number} n - Number to format
 * @param {number} d - Decimal places
 * @returns {string} Formatted number string
 */
const fmtD = (n, d = 2) => (+n).toFixed(d);

/**
 * ProjectHeader - Header section showing project details and total cost
 *
 * @param {Object} props
 * @param {Object} props.formData - Form data containing project details
 * @param {Object} props.result - Calculation result containing totals
 * @returns {JSX.Element}
 */
export function ProjectHeader({ formData, result }) {
  const { grandTotal, totalBU } = result;

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-lg p-8 md:p-10 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[120px] rounded-full -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/10 blur-[120px] rounded-full -ml-32 -mb-32" />

      <div className="relative flex flex-col xl:flex-row gap-16 items-start">
        <div className="flex-1 space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20 text-[9px] font-black text-indigo-50 uppercase tracking-[0.2em] mb-4">
              Certified Engineering Estimate
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9] mb-3">
              {formData.projName || "Untitled Project"}
            </h2>
            <div className="text-indigo-100/60 text-sm font-bold uppercase tracking-widest flex items-center gap-3">
              <span>{formData.location || "Earth"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span>{formData.estDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-12">
            {[
              ["Owner", formData.ownerName],
              ["Engineer", formData.engName],
              ["Building Use", formData.bldUse],
              ["Floors", result.floorStr],
              ["Concrete", formData.concGrade],
              ["Steel", formData.steelGrd],
            ].map(([lbl, val]) => (
              <div key={lbl} className="space-y-1">
                <div className="text-[10px] font-black text-indigo-200/50 uppercase tracking-[0.2em]">
                  {lbl}
                </div>
                <div className="text-sm font-black text-white tracking-tight">
                  {val || "Not Specified"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full xl:w-auto flex flex-col items-center xl:items-end gap-3 bg-white/10 border border-white/10 p-8 rounded-lg backdrop-blur-md shadow-inner group/money transition-transform hover:scale-[1.02] duration-500">
          <div className="text-[10px] font-black text-indigo-100/50 uppercase tracking-[0.3em] mb-2 px-2">
            Total Project Value
          </div>
          <div className="text-5xl md:text-7xl font-black text-white tracking-tighter tabular-nums py-1 group-hover/money:tracking-normal transition-all duration-700">
            ₹{(grandTotal / 100000).toFixed(2)}
            <span className="text-lg md:text-xl ml-2 opacity-50 uppercase">
              Lacs
            </span>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <div className="text-[11px] font-black text-indigo-600 bg-white px-4 py-2 rounded-lg shadow-xl">
              ≈ ₹
              {Math.round(grandTotal / totalBU / 10.764).toLocaleString(
                "en-IN",
              )}
              /sqft
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * SpatialMetrics - Section showing spatial/area metrics
 *
 * @param {Object} props
 * @param {Object} props.result - Calculation result
 * @returns {JSX.Element}
 */
export function SpatialMetrics({ result }) {
  return (
    <div className="bg-white rounded-lg border border-slate-100 overflow-hidden mb-10 shadow-sm transition-all hover:shadow-md">
      <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-xl border border-indigo-100/50 text-indigo-600">
          <FiBox className="text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">
            Spatial Metrics
          </h3>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Calculated built-up area and structural volume
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
          {[
            [
              "Built-up Area",
              result.totalBU.toFixed(1) + " m²",
              (result.totalBU * 10.764).toFixed(0) + " sqft",
            ],
            [
              "Plot Size",
              result.plotArea.toFixed(1) + " m²",
              (result.plotArea * 10.764).toFixed(0) + " sqft",
            ],
            [
              "Built height",
              result.totalH.toFixed(2) + " m",
              "~" + (result.totalH * 3.28).toFixed(1) + " ft",
            ],
            ["Columns", result.totalCols, "Total grid units"],
            ["Avg Span", result.spanL.toFixed(2) + " m", "Structural grid"],
            [
              "Ground BU",
              result.builtArea.toFixed(1) + " m²",
              "Base footprint",
            ],
          ].map(([lbl, val, sub]) => (
            <div
              key={lbl}
              className="bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-indigo-500/30 transition-all text-center space-y-1.5"
            >
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {lbl}
              </div>
              <div className="text-xl font-black text-slate-900 tabular-nums">
                {val}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                {sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * ResourceTakeoff - Section showing material requirements
 *
 * @param {Object} props
 * @param {Object} props.formData - Form data
 * @param {Object} props.result - Calculation result
 * @returns {JSX.Element}
 */
export function ResourceTakeoff({ formData, result }) {
  return (
    <div className="bg-white rounded-lg border border-slate-100 overflow-hidden mb-10 shadow-sm transition-all hover:shadow-md">
      <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-xl border border-indigo-100/50 text-indigo-600">
          <FiLayers className="text-indigo-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">
            Resource Takeoff
          </h3>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Gross material requirements as per IS:10262
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            [
              "Concrete (RCC)",
              result.totalRCC.toFixed(2) + " m³",
              "Grade " + formData.concGrade,
            ],
            [
              "Steel Reinforce.",
              (result.steelKg / 1000).toFixed(2) + " MT",
              result.steelKg.toFixed(0) + " KG",
            ],
            [
              "Cement Bags",
              Math.ceil(result.totalRCC * 8.5) + " Bags",
              "OPC 43/53",
            ],
            [
              "Fine Aggregate",
              (result.totalRCC * 0.45).toFixed(1) + " m³",
              "M-Sand / Sand",
            ],
            [
              "Masonry Volume",
              (result.brickVolExt + result.brickVolInt).toFixed(1) + " m³",
              formData.brickKey + " Class",
            ],
            [
              "Plaster area",
              (result.plInt + result.plExt).toFixed(0) + " m²",
              "12mm / 18mm thk",
            ],
            [
              "Floor Tiles",
              result.floorArea.toFixed(0) + " m²",
              "Net surfaced",
            ],
            ["Internal Paint", result.plInt.toFixed(0) + " m²", "Net surfaced"],
          ].map(([lbl, val, sub], idx) => (
            <div
              key={lbl}
              className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100"
            >
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg shadow-sm border border-slate-100">
                {idx === 0
                  ? "🏗️"
                  : idx === 1
                    ? "🔗"
                    : idx === 2
                      ? "🧱"
                      : idx === 3
                        ? "⌛"
                        : idx === 4
                          ? "🧱"
                          : idx === 5
                            ? "🎨"
                            : idx === 6
                              ? "💠"
                              : "🖌️"}
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                  {lbl}
                </div>
                <div className="text-base font-black text-slate-900 tabular-nums">
                  {val}
                </div>
                <div className="text-[9px] font-bold text-slate-500 uppercase">
                  {sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * BOQTable - Bill of Quantities table
 *
 * @param {Object} props
 * @param {Array} props.boqItems - Array of BOQ items
 * @param {number} props.subTotal - Subtotal amount
 * @param {number} props.contingency - Contingency amount
 * @param {number} props.overhead - Overhead amount
 * @param {number} props.gst - GST amount
 * @param {number} props.grandTotal - Grand total amount
 * @returns {JSX.Element}
 */
export function BOQTable({
  boqItems,
  subTotal,
  contingency,
  overhead,
  gst,
  grandTotal,
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-100 overflow-hidden mb-10 shadow-sm transition-all hover:shadow-md">
      <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-xl border border-indigo-100/50 text-indigo-600">
          <FiList className="text-emerald-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">
            Bill of Quantities
          </h3>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Itemized PWD structural estimates
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-black uppercase tracking-tighter">
          West Bengal PWD 2024
        </div>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-900/60 border-y border-white/10">
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] w-16 text-center">
                  #
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  Work Description
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] w-20 text-center">
                  Unit
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] w-32 text-right">
                  Quantity
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] w-32 text-right">
                  Rate (₹)
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] w-40 text-right">
                  Total (₹)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {boqItems.map((item, idx) => {
                if (item.head) {
                  return (
                    <tr key={idx} className="bg-indigo-500/5">
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-[12px] font-black text-indigo-400 uppercase tracking-widest italic"
                      >
                        {item.sno}. {item.desc}
                      </td>
                    </tr>
                  );
                }
                if (+item.qty <= 0) return null;
                const amt = +item.qty * +item.rate;
                return (
                  <tr
                    key={idx}
                    className="hover:bg-white/[0.03] transition-colors group border-white/5"
                  >
                    <td className="px-6 py-4 text-[11px] font-black text-slate-600 text-center">
                      {item.sno}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-black text-slate-300 group-hover:text-white transition-colors leading-relaxed uppercase pr-8">
                        {item.desc}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[11px] font-black text-slate-500 text-center">
                      {item.unit}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-400 text-right tabular-nums">
                      {fmtD(item.qty)}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-400 text-right tabular-nums">
                      {item.rate.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-slate-100 text-right tabular-nums">
                      ₹{fmt(amt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200">
              {[
                ["Sub Total (Base Construction Value)", subTotal],
                ["Contingency @ 3%", contingency],
                ["Contractor Profit & OH @ 12%", overhead],
                ["GST @ 12%", gst],
              ].map(([lbl, val]) => (
                <tr key={lbl}>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"
                  >
                    {lbl}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-black text-slate-600 tabular-nums">
                    ₹{fmt(val)}
                  </td>
                </tr>
              ))}
              <tr className="bg-indigo-600 shadow-2xl">
                <td
                  colSpan={5}
                  className="px-6 py-8 text-right text-xs font-black text-indigo-100 uppercase tracking-[0.3em]"
                >
                  Net Project Estimate (Round Off)
                </td>
                <td className="px-6 py-8 text-right text-3xl font-black text-white tabular-nums">
                  ₹
                  {(Math.round(grandTotal / 10000) * 10000).toLocaleString(
                    "en-IN",
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * EngineersNotes - Engineer's notes section
 *
 * @param {Object} props
 * @param {Object} props.formData - Form data containing soil type and SBC
 * @returns {JSX.Element}
 */
export function EngineersNotes({ formData }) {
  return (
    <div className="mt-12 p-10 bg-slate-950/60 rounded-lg border border-white/5 border-dashed space-y-6">
      <div className="flex items-center gap-3">
        <FiAlertCircle className="text-purple-400" size={20} />
        <div className="text-[12px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Engineer's Notes
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
        {[
          "Rates based on WB PWD SOR 2024 (Building Works).",
          `SBC adjusted for ${formData.soilType} soil at ${formData.sbc} kN/m².`,
          "Structural analysis follows IS:456 and IS:875 standards.",
          "Estimate excludes statutory fees, land cost and landscaping.",
          "Labour costs include safety overheads and insurance markers.",
          "Quantities are net — add 5-8% for site wastage on RCC.",
        ].map((txt, i) => (
          <div key={i} className="flex gap-4 items-start">
            <span className="text-purple-500 font-black text-[10px] mt-0.5">
              {i + 1}.
            </span>
            <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-tight">
              {txt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * CostSummary - Complete cost summary component with all sections
 *
 * @param {Object} props
 * @param {Object} props.formData - Form data
 * @param {Object} props.result - Calculation result
 * @param {Function} props.onRestart - Handler for restart button
 * @returns {JSX.Element}
 */
export default function CostSummary({ formData, result, onRestart }) {
  const { boqItems, subTotal, contingency, overhead, gst, grandTotal } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 py-6 border-b border-white/5 no-print">
        <button
          className="flex items-center gap-2 px-8 py-4 rounded-lg bg-purple-600 text-white text-[12px] font-black uppercase tracking-widest shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-1 transition-all active:scale-95"
          onClick={() => window.print()}
        >
          <FiDownload size={18} /> Download BOQ (PDF)
        </button>
        <button
          className="flex items-center gap-2 px-8 py-4 rounded-lg bg-slate-800/80 text-slate-300 text-[12px] font-black uppercase tracking-widest border border-white/10 hover:bg-slate-700 hover:text-white transition-all active:scale-95 backdrop-blur-md"
          onClick={onRestart}
        >
          <FiRefreshCw size={18} /> New Estimate
        </button>
        <div className="ml-auto hidden xl:flex items-center gap-3 px-5 py-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20 leading-none">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-[10px] text-indigo-300 font-black uppercase tracking-widest">
            Print hack: Select "Save as PDF"
          </span>
        </div>
      </div>

      {/* Project Header */}
      <ProjectHeader formData={formData} result={result} />

      {/* Spatial Metrics */}
      <SpatialMetrics result={result} />

      {/* Resource Takeoff */}
      <ResourceTakeoff formData={formData} result={result} />

      {/* BOQ Table */}
      <BOQTable
        boqItems={boqItems}
        subTotal={subTotal}
        contingency={contingency}
        overhead={overhead}
        gst={gst}
        grandTotal={grandTotal}
      />

      {/* Engineer's Notes */}
      <EngineersNotes formData={formData} />
    </motion.div>
  );
}
