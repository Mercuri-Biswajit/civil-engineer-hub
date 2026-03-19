import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ToolLayout from "@/components/layout/ToolLayout.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronRight, FiChevronLeft, FiCheck, FiInfo, FiAlertTriangle, FiDownload, FiRefreshCw, FiExternalLink, FiBox, FiLayers, FiList, FiAlertCircle } from "react-icons/fi";
import { SaveToast } from "@/components/StructureDesign/SavePanel.jsx";

// ─────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────
const ROOM_TYPES = [
  { id: "master-bedroom", icon: "🛏️", name: "Master Bedroom" },
  { id: "bedroom", icon: "🛏️", name: "Bedroom" },
  { id: "hall", icon: "🛋️", name: "Hall / Drawing Room" },
  { id: "dining", icon: "🍽️", name: "Dining Room" },
  { id: "kitchen", icon: "🍳", name: "Kitchen" },
  { id: "toilet", icon: "🚿", name: "Toilet / Bathroom" },
  { id: "balcony", icon: "🏞️", name: "Balcony / Verandah" },
  { id: "store", icon: "📦", name: "Store / Utility" },
  { id: "garage", icon: "🚗", name: "Garage / Parking" },
  { id: "office", icon: "💼", name: "Office Room" },
  { id: "pooja", icon: "🪔", name: "Pooja Room" },
  { id: "servant", icon: "🛏️", name: "Servant Quarter" },
];

const FLOOR_NAMES = [
  "Ground Floor (G)",
  "1st Floor",
  "2nd Floor",
  "3rd Floor",
  "4th Floor",
];

const BRICK_RATES = {
  "1st": [6200, 5800],
  flyash: [5800, 5400],
  aac: [4800, 4500],
};

const BRICK_LABELS = {
  "1st": "1st Class Brick",
  flyash: "Fly Ash Brick",
  aac: "AAC Block",
};

const STEPS = [
  { num: 1, label: "Project Brief" },
  { num: 2, label: "Geometry & Extent" },
  { num: 3, label: "Floor Architecture" },
  { num: 4, label: "Structural Profile" },
  { num: 5, label: "Official Estimate" },
];

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ─────────────────────────────────────────────────────────────────────────
// UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────

function FormGroup({ label, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4 group">
      <div className="flex items-center justify-between px-0.5">
        <label className="text-[11px] font-semibold text-slate-500 group-focus-within:text-indigo-600 transition-colors uppercase tracking-wide">
          {label}
        </label>
        {hint && !error && (
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <span className="text-[10px] text-rose-500 font-bold px-1 flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
          <FiAlertTriangle size={12} /> {error}
        </span>
      )}
    </div>
  );
}

function PageHeader({ step, title, desc }) {
  return (
    <div className="mb-6 relative">
       <div className="absolute -left-6 top-0 w-1.5 h-full bg-gradient-to-b from-indigo-600 to-transparent rounded-full opacity-50 blur-[1px]" />
       <div className="flex items-center gap-3 mb-2">
         <div className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
           STEP {step} / {STEPS.length.toString().padStart(2, '0')}
         </div>
       </div>
       <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
         {title}
       </h2>
       <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
         {desc}
       </p>
    </div>
  );
}

function NavBar({ onNext, onBack, hideBack, nextLabel = "Continue", nextCta }) {
  return (
    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100">
      {!hideBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-slate-500 text-xs font-bold uppercase tracking-widest border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95 group"
        >
          <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      )}
      <button
        onClick={onNext}
        className={`flex-1 flex items-center justify-center gap-3 px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] group ${
          nextCta
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5"
            : "bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-200 hover:-translate-y-0.5"
        }`}
      >
        {nextLabel} <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

function Banner({ type, children }) {
  const isErr = type === "err";
  const isWarn = type === "warn";
  const colorCls = isErr 
    ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
    : isWarn 
      ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
      : "bg-purple-500/10 border-purple-500/20 text-purple-400";
  
  return (
    <div className={`p-6 rounded-lg border text-xs font-black uppercase tracking-tight flex items-center gap-4 mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-left-2 ${colorCls}`}>
      <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-100">
        {isErr ? <FiAlertTriangle className="w-4 h-4 text-rose-500" /> : <FiInfo className="w-4 h-4 text-indigo-500" />}
      </div>
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}

function ResultSection({ icon, title, sub, badge, children }) {
  return (
    <div className="bg-white rounded-lg border border-slate-100 overflow-hidden mb-10 shadow-sm transition-all hover:shadow-md">
      <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-xl border border-indigo-100/50 text-indigo-600">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">{title}</h3>
          {sub && <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{sub}</div>}
        </div>
        {badge && (
          <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-black uppercase tracking-tighter">
            {badge}
          </div>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// MAIN CALCULATION (unchanged)
// ─────────────────────────────────────────────────────────────────────────
function runBOQCalculation(formData, floorRooms) {
  const {
    plotL,
    plotW,
    numFloors,
    floorH,
    sbc,
    soilType,
    concGrade,
    steelGrd,
    brickKey,
    sfFront,
    sfBack,
    sfSide,
    hasStair,
    staircaseType,
    stairL,
    stairW,
  } = formData;

  const plotArea = plotL * plotW;
  const builtL = plotL - 2 * sfSide;
  const builtW = plotW - sfFront - sfBack;
  const builtArea = builtL * builtW;
  const totalBU = builtArea * numFloors;
  const totalH = numFloors * floorH;

  const maxSpan = 4.5;
  const cL = Math.max(2, Math.ceil(builtL / maxSpan) + 1);
  const cW = Math.max(2, Math.ceil(builtW / maxSpan) + 1);
  const totalCols = cL * cW;
  const spanL = builtL / (cL - 1);
  const spanW = builtW / (cW - 1);

  const fck = concGrade === "M20" ? 20 : concGrade === "M25" ? 25 : 30;
  const colLoad = spanL * spanW * 12 * numFloors * 1.5;
  const AgReq = (colLoad * 1000) / (0.4 * fck + 0.67 * 500 * 0.02);
  let colSize = Math.max(
    Math.ceil(Math.sqrt(AgReq) / 50) * 50,
    numFloors <= 2 ? 230 : numFloors <= 3 ? 300 : 375,
  );
  colSize = Math.min(colSize, 600);
  const cornerSz = Math.max(230, colSize - 50);
  const edgeSz = Math.max(230, colSize - 25);
  const numCorner = 4;
  const numEdgeL = Math.max(0, (cL - 2) * 2);
  const numEdgeW = Math.max(0, (cW - 2) * 2);
  const numEdge = numEdgeL + numEdgeW;
  const numInner = Math.max(0, (cL - 2) * (cW - 2));

  const colLoadUnf = colLoad / 1.5;
  const fSzC = Math.max(
    0.9,
    Math.ceil(Math.sqrt((colLoadUnf * 0.6) / sbc) * 10) / 10,
  );
  const fSzE = Math.max(
    1.0,
    Math.ceil(Math.sqrt((colLoadUnf * 0.8) / sbc) * 10) / 10,
  );
  const fSzI = Math.max(1.2, Math.ceil(Math.sqrt(colLoadUnf / sbc) * 10) / 10);
  const soilDepth =
    { black: 1.5, sandy: 1.2, murrum: 1.0, rock: 0.6 }[soilType] || 1.2;
  const ftgThk = Math.max(300, Math.round((fSzI * 100) / 2 / 50) * 50);
  const fVolC = fSzC * fSzC * (ftgThk / 1000) * numCorner;
  const fVolE = fSzE * fSzE * (ftgThk / 1000) * numEdge;
  const fVolI = fSzI * fSzI * ((ftgThk + 50) / 1000) * numInner;
  const fVolTotal = fVolC + fVolE + fVolI;
  const pccVol =
    (fSzC * fSzC * numCorner + fSzE * fSzE * numEdge + fSzI * fSzI * numInner) *
    0.15;

  const mainBD = Math.ceil((Math.max(spanL, spanW) * 1000) / 12 / 50) * 50;
  const mainBB = Math.max(230, Math.ceil((mainBD * 0.4) / 50) * 50);
  const secBD = Math.ceil((Math.min(spanL, spanW) * 1000) / 15 / 50) * 50;
  const secBB = Math.max(230, Math.ceil((secBD * 0.4) / 50) * 50);
  const slabThk = Math.max(
    120,
    Math.ceil((Math.min(spanL, spanW) * 1000) / 32 / 10) * 10,
  );

  const colVol =
    totalCols * (colSize / 1000) * (colSize / 1000) * floorH * numFloors;
  const beamVol =
    (cL * builtW * (mainBB / 1000) * (mainBD / 1000) +
      cW * builtL * (secBB / 1000) * (secBD / 1000)) *
    numFloors;
    
  let stairArea = 0;
  if (staircaseType !== "none") {
      stairArea = stairL * stairW;
  }
  
  // Deduct stair area from slab
  const slabAreaPerFloor = builtArea - stairArea;
  const slabVol = Math.max(0, slabAreaPerFloor * (slabThk / 1000) * numFloors);

  const plinthBeamLen = cL * (cW - 1) * spanW + cW * (cL - 1) * spanL;
  const plinthBeamVol = plinthBeamLen * 0.23 * 0.45;
  const wallPerim = 2 * (builtL + builtW);
  const dpcArea = wallPerim * 0.23 + builtL * builtW * 0.5;
  const dpcVol = dpcArea * 0.075;
  const totalRCC = fVolTotal + colVol + beamVol + slabVol + plinthBeamVol;
  const earthVol = (builtL + 1) * (builtW + 1) * (soilDepth + 0.3) * 1.2;

  let totalRoomCnt = 0;
  Object.values(floorRooms).forEach((fr) =>
    Object.values(fr).forEach((c) => (totalRoomCnt += c)),
  );
  const intWall = totalRoomCnt * 3.0;
  const wallArea = (wallPerim + intWall * 0.5) * floorH * numFloors;
  const brickVolExt = Math.max(0, wallPerim * floorH * numFloors * 0.85 * 0.23);
  const brickVolInt = Math.max(
    0,
    intWall * 0.5 * floorH * numFloors * 0.85 * 0.115,
  );
  const plInt = wallArea * 1.6;
  const plExt = wallPerim * floorH * numFloors;

  const parapetLen = 2 * (builtL + builtW);
  const parapetVol = parapetLen * 1.0 * 0.115;
  const parapetPlaster = parapetLen * 1.0 * 2;
  const terraceArea = builtArea;

  let totalToilets = 0,
    totalDoors = 0,
    totalWindows = 0;
  Object.values(floorRooms).forEach((fr) =>
    Object.entries(fr).forEach(([id, cnt]) => {
      if (id === "toilet") totalToilets += cnt;
      totalDoors += cnt;
      if (id !== "toilet" && id !== "store") totalWindows += cnt;
    }),
  );
  const toiletWPArea = totalToilets * (4.5 + 4.0);
  totalWindows = Math.ceil(totalWindows * 1.5);

  const steelKg = totalRCC * 90;
  const floorArea = Math.max(0, totalBU - (stairArea * numFloors));
  const [rateExtWall, rateIntWall] = BRICK_RATES[brickKey];

  const boqItems = [
    { sno: "A", desc: "CIVIL WORKS — SUBSTRUCTURE", head: true },
    {
      sno: "A.1",
      desc: "Earthwork excavation in ordinary soil, depth upto 1.5m, all lifts, disposal upto 50m lead",
      unit: "m³",
      qty: earthVol,
      rate: 180,
    },
    {
      sno: "A.2",
      desc: "Anti-termite treatment to bottom & sides of excavation (pre-construction, IS:6313)",
      unit: "m²",
      qty: (builtL + 1) * (builtW + 1),
      rate: 65,
    },
    {
      sno: "A.3",
      desc: "PCC M10 (1:3:6) below footings 150mm thick, curing",
      unit: "m³",
      qty: pccVol,
      rate: 5200,
    },
    {
      sno: "A.4",
      desc: `Isolated RCC ${concGrade} footings incl. formwork & ${steelGrd} TMT reinforcement, curing`,
      unit: "m³",
      qty: fVolTotal,
      rate: 9200,
    },
    {
      sno: "A.5",
      desc: `RCC ${concGrade} plinth beam 230×450mm connecting all column bases incl. formwork & reinforcement`,
      unit: "m³",
      qty: plinthBeamVol,
      rate: 10200,
    },
    {
      sno: "A.6",
      desc: "Damp Proof Course (DPC) 75mm thick CM 1:1.5:3 at plinth level on all walls, including curing",
      unit: "m²",
      qty: dpcArea,
      rate: 185,
    },
    {
      sno: "A.7",
      desc: "Backfilling excavated earth in 150mm layers, watering & compaction to 95% Proctor density",
      unit: "m³",
      qty: earthVol * 0.7,
      rate: 120,
    },

    { sno: "B", desc: "CIVIL WORKS — SUPERSTRUCTURE", head: true },
    {
      sno: "B.1",
      desc: `RCC ${concGrade} columns ${colSize}×${colSize}mm incl. formwork, all ${numFloors} floor(s), H=${totalH.toFixed(1)}m`,
      unit: "m³",
      qty: colVol,
      rate: 10800,
    },
    {
      sno: "B.2",
      desc: `RCC ${concGrade} main beams ${mainBB}×${mainBD}mm & secondary beams ${secBB}×${secBD}mm incl. formwork`,
      unit: "m³",
      qty: beamVol,
      rate: 10200,
    },
    {
      sno: "B.3",
      desc: `RCC ${concGrade} suspended slab ${slabThk}mm thick incl. formwork, props & curing, all floors`,
      unit: "m³",
      qty: slabVol,
      rate: 9800,
    },
    {
      sno: "B.4",
      desc: `${steelGrd} TMT reinforcement in all RCC works incl. bending, binding, placing & binding wire`,
      unit: "MT",
      qty: steelKg / 1000,
      rate: 62000,
    },
    {
      sno: "B.5",
      desc: `${BRICK_LABELS[brickKey]} masonry CM 1:6 — 230mm thick external walls, all floors`,
      unit: "m³",
      qty: brickVolExt,
      rate: rateExtWall,
    },
    {
      sno: "B.6",
      desc: `${BRICK_LABELS[brickKey]} masonry CM 1:4 — 115mm thick internal partition walls, all floors`,
      unit: "m³",
      qty: brickVolInt,
      rate: rateIntWall,
    },
    {
      sno: "B.7",
      desc: `RCC ${concGrade} parapet wall 115mm thick, 1.0m ht on top floor terrace incl. formwork & coping`,
      unit: "m³",
      qty: parapetVol,
      rate: 10500,
    },

    { sno: "C", desc: "FINISHING WORKS", head: true },
    {
      sno: "C.1",
      desc: "12mm cement plaster 1:4 to internal walls & soffits incl. scaffolding, curing",
      unit: "m²",
      qty: plInt,
      rate: 185,
    },
    {
      sno: "C.2",
      desc: "15mm cement plaster 1:6 to external walls incl. scaffolding, chicken mesh at RCC-brick junction",
      unit: "m²",
      qty: plExt + parapetPlaster,
      rate: 210,
    },
    {
      sno: "C.3",
      desc: "Vitrified tiles 600×600mm flooring incl. 25mm CM 1:3 bedding, grouting, curing, all floors",
      unit: "m²",
      qty: floorArea,
      rate: 840,
    },
    ...(totalToilets > 0
      ? [
          {
            sno: "C.4",
            desc: "Vitrified tiles 300×600mm toilet/bathroom wall cladding upto 2.1m ht incl. CM 1:3 fixing",
            unit: "m²",
            qty: totalToilets * 12,
            rate: 780,
          },
        ]
      : []),
    {
      sno: "C.5",
      desc: "Acrylic waterproofing treatment 2 coats on terrace slab (exposed)",
      unit: "m²",
      qty: terraceArea,
      rate: 165,
    },
    ...(totalToilets > 0
      ? [
          {
            sno: "C.6",
            desc: "Integral cement waterproofing in toilets/bathrooms — floor & 300mm wall upstand",
            unit: "m²",
            qty: toiletWPArea,
            rate: 145,
          },
        ]
      : []),
    {
      sno: "C.7",
      desc: "Emulsion paint 2 coats over 1 coat primer — internal plastered surfaces",
      unit: "m²",
      qty: plInt,
      rate: 128,
    },
    {
      sno: "C.8",
      desc: "Exterior weather-shield paint 2 coats over primer — external surfaces & parapet",
      unit: "m²",
      qty: plExt + parapetPlaster,
      rate: 148,
    },
    {
      sno: "C.9",
      desc: "Cement plinth skirting 50mm ht × 10mm thk, neat cement finish",
      unit: "m",
      qty: (wallPerim + intWall * 0.5) * numFloors,
      rate: 32,
    },

    { sno: "D", desc: "DOORS, WINDOWS & MEP SERVICES", head: true },
    {
      sno: "D.1",
      desc: "Panelled flush door 1.0×2.1m, sal wood frame 100×75mm with SS fittings, 2 coats enamel paint",
      unit: "Nos",
      qty: totalDoors + 2,
      rate: 8500,
    },
    {
      sno: "D.2",
      desc: "Aluminium sliding window 1.2×1.2m with mosquito mesh & painted MS grills",
      unit: "Nos",
      qty: totalWindows,
      rate: 6200,
    },
    ...(staircaseType !== "none" && numFloors > 1
      ? [
          {
            sno: "D.3",
            desc: `RCC staircase M20 (waist slab type) incl. all materials, nosing tiles, handrail & finishing (${stairL}m × ${stairW}m)`,
            unit: "LS",
            qty: 1,
            rate: (numFloors - 1) * (staircaseType === "custom" ? 65000 : 50000),
          },
        ]
      : []),
    ...(totalToilets > 0
      ? [
          {
            sno: "D.4",
            desc: "Sanitary fittings — EWC, washbasin, CP taps, shower set, PTMT fittings per toilet/bathroom",
            unit: "Nos",
            qty: totalToilets,
            rate: 28000,
          },
        ]
      : []),
    {
      sno: "D.5",
      desc: "Concealed electrical conduit & wiring, MCB DB, switches, sockets, earthing (IS:732, CPWD spec)",
      unit: "Floor",
      qty: numFloors,
      rate: 75000,
    },
    {
      sno: "D.6",
      desc: "CPVC water supply piping, UPVC drainage system, PVC overhead tank connection (IS:4985)",
      unit: "Floor",
      qty: numFloors,
      rate: 55000,
    },
    {
      sno: "D.7",
      desc: "PVC Sintex overhead water tank 10,000L with MS structural staging, ball valve & plumbing",
      unit: "Nos",
      qty: 1,
      rate: 48000,
    },
    {
      sno: "D.8",
      desc: "Compound wall 1.5m ht — brick masonry on RCC strip footing, plaster both sides, colour wash",
      unit: "m",
      qty: Math.max(0, 2 * (plotL + plotW) - 4),
      rate: 3200,
    },
    {
      sno: "D.9",
      desc: "Main gate — MS fabricated gate with angle iron frame, 2 coats primer + enamel paint",
      unit: "Nos",
      qty: 1,
      rate: 18000,
    },
  ];

  let subTotal = 0;
  boqItems.forEach((i) => {
    if (!i.head && +i.qty > 0) subTotal += +i.qty * +i.rate;
  });
  const contingency = subTotal * 0.03;
  const overhead = subTotal * 0.12;
  const gst = (subTotal + overhead) * 0.12;
  const grandTotal = subTotal + contingency + overhead + gst;
  const floorStr = numFloors === 1 ? "G" : `G+${numFloors - 1}`;

  return {
    boqItems,
    subTotal,
    contingency,
    overhead,
    gst,
    grandTotal,
    plotArea,
    builtArea,
    totalBU,
    totalH,
    totalCols,
    cL,
    cW,
    spanL,
    spanW,
    colSize,
    cornerSz,
    edgeSz,
    numCorner,
    numEdge,
    numInner,
    fSzC,
    fSzE,
    fSzI,
    soilDepth,
    ftgThk,
    totalRCC,
    steelKg,
    brickVolExt,
    brickVolInt,
    plInt,
    plExt,
    slabThk,
    floorArea,
    terraceArea,
    toiletWPArea,
    floorStr,
    mainBB,
    mainBD,
    secBB,
    secBD,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// PAGES
// ─────────────────────────────────────────────────────────────────────────
function Page1({ data, setData, onNext }) {
  const [errors, setErrors] = useState({});
  const validate = () => {
    const e = {};
    if (!data.projName.trim()) e.projName = "Building name required";
    if (!data.ownerName.trim()) e.ownerName = "Owner name required";
    if (!data.location.trim()) e.location = "Location required";
    if (!data.engName.trim()) e.engName = "Engineer name required";
    setErrors(e);
    if (Object.keys(e).length === 0) {
      scrollTop();
      onNext();
    }
  };

  const inputCls = (err) => `w-full bg-slate-50 border ${err ? 'border-rose-500/50 focus:ring-rose-500/10' : 'border-slate-200 focus:ring-indigo-500/10'} rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white focus:border-indigo-500/50 transition-all font-semibold text-sm shadow-sm`;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <PageHeader
        step="01"
        title="Project Details"
        desc="This information will appear in your official BOQ document"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <FormGroup label="Project / Building Name *" error={errors.projName}>
          <input
            className={inputCls(errors.projName)}
            value={data.projName}
            onChange={(e) =>
              setData((p) => ({ ...p, projName: e.target.value }))
            }
            placeholder="e.g. Kumar Residence"
          />
        </FormGroup>
        <FormGroup label="Owner Name *" error={errors.ownerName}>
          <input
            className={inputCls(errors.ownerName)}
            value={data.ownerName}
            onChange={(e) =>
              setData((p) => ({ ...p, ownerName: e.target.value }))
            }
            placeholder="e.g. Rajesh Kumar"
          />
        </FormGroup>
        <FormGroup label="Project Location / Address *" error={errors.location}>
          <input
            className={inputCls(errors.location)}
            value={data.location}
            onChange={(e) =>
              setData((p) => ({ ...p, location: e.target.value }))
            }
            placeholder="e.g. Salt Lake, Kolkata - 700091"
          />
        </FormGroup>
        <FormGroup label="Date of Estimate">
          <input
            type="date"
            className={inputCls()}
            value={data.estDate}
            onChange={(e) =>
              setData((p) => ({ ...p, estDate: e.target.value }))
            }
          />
        </FormGroup>
        <FormGroup
          label="Prepared By (Engineer / Firm) *"
          error={errors.engName}
        >
          <input
            className={inputCls(errors.engName)}
            value={data.engName}
            onChange={(e) =>
              setData((p) => ({ ...p, engName: e.target.value }))
            }
            placeholder="e.g. Er. Sunil Sharma, M.Tech Civil"
          />
        </FormGroup>
        <FormGroup label="Building Use">
          <div className="relative">
            <select
              className={`${inputCls()} appearance-none cursor-pointer`}
              value={data.bldUse}
              onChange={(e) => setData((p) => ({ ...p, bldUse: e.target.value }))}
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Mixed Use">Mixed Use</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <FiChevronRight className="rotate-90" />
            </div>
          </div>
        </FormGroup>
      </div>
      <FormGroup
        label="Drawing Reference No. (optional)"
        hint="This will be printed in the BOQ as 'As per Drawing No.'"
      >
        <input
          className={inputCls()}
          value={data.drawingRef}
          onChange={(e) =>
            setData((p) => ({ ...p, drawingRef: e.target.value }))
          }
          placeholder="e.g. Drg. No. AR-01/2024"
        />
      </FormGroup>
      <NavBar onNext={validate} hideBack />
    </motion.div>
  );
}

function Page2({ data, setData, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const validate = () => {
    const e = {};
    if (!data.plotL || data.plotL < 3)
      e.plotL = "Valid length required (min 3m)";
    if (!data.plotW || data.plotW < 3)
      e.plotW = "Valid width required (min 3m)";
    if (data.useSetback) {
      const bL = data.plotL - 2 * data.sfSide;
      const bW = data.plotW - data.sfFront - data.sfBack;
      if (bL < 3 || bW < 3)
        e.setback = "Built-up area is too small. Please reduce setback values.";
    }
    setErrors(e);
    if (Object.keys(e).length === 0) {
      scrollTop();
      onNext();
    }
  };

  const inputCls = (err) => `w-full bg-slate-50 border ${err ? 'border-rose-500/50 focus:ring-rose-500/10' : 'border-slate-200 focus:ring-indigo-500/10'} rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white focus:border-indigo-500/50 transition-all font-semibold text-sm shadow-sm`;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <PageHeader
        step="02"
        title="Plot Dimensions & Floors"
        desc="Column grid and structural layout will be calculated automatically"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        <FormGroup label="Plot Length (m) *" error={errors.plotL} hint="Length along the road">
          <input
            type="number"
            className={inputCls(errors.plotL)}
            value={data.plotL || ""}
            onChange={(e) => setData((p) => ({ ...p, plotL: +e.target.value }))}
            placeholder="e.g. 12"
            step="0.5"
            min="3"
          />
        </FormGroup>
        <FormGroup label="Plot Width (m) *" error={errors.plotW} hint="Breadth of the plot">
          <input
            type="number"
            className={inputCls(errors.plotW)}
            value={data.plotW || ""}
            onChange={(e) => setData((p) => ({ ...p, plotW: +e.target.value }))}
            placeholder="e.g. 9"
            step="0.5"
            min="3"
          />
        </FormGroup>
        <FormGroup label="Number of Floors" hint="Total floors (G+N)">
          <div className="relative">
            <select
              className={`${inputCls()} appearance-none cursor-pointer`}
              value={data.numFloors}
              onChange={(e) =>
                setData((p) => ({ ...p, numFloors: +e.target.value }))
              }
            >
              <option value={1}>G (Ground Only)</option>
              <option value={2}>G+1</option>
              <option value={3}>G+2</option>
              <option value={4}>G+3</option>
              <option value={5}>G+4</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <FiChevronRight className="rotate-90" />
            </div>
          </div>
        </FormGroup>
        <FormGroup label="Floor Height" hint="Floor-to-floor height">
          <div className="relative">
            <select
              className={`${inputCls()} appearance-none cursor-pointer`}
              value={data.floorH}
              onChange={(e) =>
                setData((p) => ({ ...p, floorH: +e.target.value }))
              }
            >
              <option value={2.75}>2.75 m (Economy)</option>
              <option value={3.0}>3.0 m (Standard)</option>
              <option value={3.2}>3.2 m (Premium)</option>
              <option value={3.5}>3.5 m (High Ceiling)</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <FiChevronRight className="rotate-90" />
            </div>
          </div>
        </FormGroup>
        <FormGroup label="Staircase Type" hint="Standard size: 2.4m × 4.9m">
          <div className="relative">
            <select
              className={`${inputCls()} appearance-none cursor-pointer`}
              value={data.staircaseType}
              onChange={(e) =>
                setData((p) => ({ ...p, staircaseType: e.target.value }))
              }
            >
              <option value="standard">Standard Staircase</option>
              <option value="custom">Custom Dimensions</option>
              <option value="none">No Staircase</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <FiChevronRight className="rotate-90" />
            </div>
          </div>
        </FormGroup>
      </div>
      
      {data.staircaseType === "custom" && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 p-8 bg-purple-500/[0.03] rounded-lg border border-purple-500/20 border-dashed"
        >
           <FormGroup label="Staircase Length (m)">
            <input
              type="number"
              className={inputCls()}
              value={data.stairL || ""}
              onChange={(e) => setData((p) => ({ ...p, stairL: +e.target.value }))}
              placeholder="e.g. 4.9"
              step="0.1"
            />
          </FormGroup>
           <FormGroup label="Staircase Width (m)">
            <input
              type="number"
              className={inputCls()}
              value={data.stairW || ""}
              onChange={(e) => setData((p) => ({ ...p, stairW: +e.target.value }))}
              placeholder="e.g. 2.4"
              step="0.1"
            />
          </FormGroup>
        </motion.div>
      )}

      <div className="flex items-center gap-4 mb-8 p-4 bg-white/[0.02] border border-white/5 rounded-lg w-fit">
        <label className="relative inline-flex items-center cursor-pointer group">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={data.useSetback}
            onChange={(e) => setData((p) => ({ ...p, useSetback: e.target.checked }))}
          />
          <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 shadow-inner"></div>
          <span className="ml-4 text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors">Add Setback / Marginal Distances</span>
        </label>
      </div>

      <AnimatePresence>
        {data.useSetback && (
          <motion.div 
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-8 bg-slate-900/60 rounded-lg border border-white/5 mb-10 overflow-hidden"
          >
            <FormGroup label="Front Setback (m)">
              <input
                type="number"
                className={inputCls()}
                value={data.sfFront}
                onChange={(e) =>
                  setData((p) => ({ ...p, sfFront: +e.target.value }))
                }
                step="0.5"
                min="0"
              />
            </FormGroup>
            <FormGroup label="Back Setback (m)">
              <input
                type="number"
                className={inputCls()}
                value={data.sfBack}
                onChange={(e) =>
                  setData((p) => ({ ...p, sfBack: +e.target.value }))
                }
                step="0.5"
                min="0"
              />
            </FormGroup>
            <FormGroup label="Side Setback each (m)">
              <input
                type="number"
                className={inputCls()}
                value={data.sfSide}
                onChange={(e) =>
                  setData((p) => ({ ...p, sfSide: +e.target.value }))
                }
                step="0.5"
                min="0"
              />
            </FormGroup>
          </motion.div>
        )}
      </AnimatePresence>
      
      {errors.setback && <Banner type="err">{errors.setback}</Banner>}
      <NavBar
        onNext={validate}
        onBack={() => {
          scrollTop();
          onBack();
        }}
      />
    </motion.div>
  );
}

function Page3({ data, floorRooms, setFloorRooms, onNext, onBack }) {
  const [activeFloor, setActiveFloor] = useState(0);
  const [error, setError] = useState(false);
  const floors = Array.from({ length: data.numFloors }, (_, i) => i);

  const toggleRoom = (f, roomId) => {
    setFloorRooms((prev) => {
      const next = { ...prev, [f]: { ...(prev[f] || {}) } };
      if (next[f][roomId]) delete next[f][roomId];
      else next[f][roomId] = 1;
      return next;
    });
    setError(false);
  };

  const updateCount = (f, roomId, val) =>
    setFloorRooms((prev) => ({
      ...prev,
      [f]: { ...(prev[f] || {}), [roomId]: Math.max(1, val) },
    }));

  const validate = () => {
    const hasAny = Object.values(floorRooms).some(
      (fr) => Object.keys(fr).length > 0,
    );
    setError(!hasAny);
    if (hasAny) {
      scrollTop();
      onNext();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <PageHeader
        step="03"
        title="Rooms — Architecture"
        desc="Switch floor tabs to define rooms for each level. We calculate interior wall volume based on this."
      />

      <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-slate-50 rounded-lg border border-slate-100 shadow-inner">
        {floors.map((f) => (
          <button
            key={f}
            className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeFloor === f 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                : "text-slate-400 hover:text-slate-600 hover:bg-white"
            }`}
            onClick={() => setActiveFloor(f)}
          >
            {FLOOR_NAMES[f] || `Floor ${f}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
        {ROOM_TYPES.map((rt) => {
          const selected = !!floorRooms[activeFloor]?.[rt.id];
          return (
            <button
              key={rt.id}
              onClick={() => toggleRoom(activeFloor, rt.id)}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-lg border transition-all active:scale-[0.97] group relative overflow-hidden ${
                selected 
                  ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500/10" 
                  : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
              }`}
            >
              <div className={`text-2xl transition-transform group-hover:scale-110 duration-500 ${selected ? "opacity-100 drop-shadow-[0_0_8px_rgba(79,70,229,0.3)]" : "grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0"}`}>
                {rt.icon}
              </div>
              <span className={`text-[10px] font-bold tracking-wider uppercase leading-tight text-center transition-colors ${selected ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                {rt.name}
              </span>
              {selected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-300">
                  <FiCheck className="text-white" size={12} strokeWidth={4} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {Object.keys(floorRooms[activeFloor] || {}).length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
          >
            {Object.entries(floorRooms[activeFloor] || {}).map(
              ([roomId, cnt]) => {
                const rt = ROOM_TYPES.find((r) => r.id === roomId);
                return (
                  <div key={roomId} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-slate-100 group transition-all hover:border-indigo-500/30 hover:shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-lg border border-slate-100 shadow-inner">
                      {rt?.icon}
                    </div>
                    <div className="flex-1 text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                      {rt?.name}
                    </div>
                    <div className="flex items-center bg-slate-50 rounded-lg border border-slate-100 p-1 shadow-inner">
                      <span className="text-[10px] font-bold text-slate-400 px-2 select-none">×</span>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={cnt}
                        onChange={(e) =>
                          updateCount(activeFloor, roomId, +e.target.value)
                        }
                        className="w-10 bg-transparent text-center text-sm font-black text-indigo-600 focus:outline-none"
                      />
                    </div>
                  </div>
                );
              },
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <Banner type="err">
          At least one room must be selected on at least one floor!
        </Banner>
      )}
      <Banner type="info">
        Need multiple rooms of the same type? Just increase the count field — for example, 3 bedrooms → count = 3
      </Banner>
      <NavBar
        onNext={validate}
        onBack={() => {
          scrollTop();
          onBack();
        }}
      />
    </motion.div>
  );
}

function Page4({ data, setData, onNext, onBack }) {
  const soilWarn =
    ((data.soilType === "rock" || data.soilType === "murrum") &&
      data.sbc < 150) ||
    ((data.soilType === "black" || data.soilType === "sandy") &&
      data.sbc > 250);

  const soilOpts = [
    {
      key: "black",
      icon: "⬛",
      label: "Black Cotton",
      desc: "Expansive, deep footing",
    },
    { key: "sandy", icon: "🟡", label: "Sandy Soil", desc: "Standard footing" },
    { key: "murrum", icon: "🟤", label: "Murrum / Hard", desc: "Good SBC" },
    { key: "rock", icon: "⛰️", label: "Rock", desc: "Minimal footing depth" },
  ];

  const brickHint = `WB PWD: ₹${BRICK_RATES[data.brickKey][0].toLocaleString("en-IN")}/m³`;

  const inputCls = (err) => `w-full bg-slate-900/40 border ${err ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-white/10 focus:ring-purple-500/30'} rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:bg-slate-900/60 transition-all font-semibold text-sm shadow-inner appearance-none cursor-pointer`;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <PageHeader
        step="04"
        title="Engineering Parameters"
        desc="Safe Bearing Capacity (SBC) and material grades determine the structural cost as per IS:456"
      />

      <div className="max-w-md mb-10">
        <FormGroup label="Safe Bearing Capacity — SBC" hint="In kN/m²">
          <div className="relative">
            <select
              className={inputCls()}
              value={data.sbc}
              onChange={(e) => setData((p) => ({ ...p, sbc: +e.target.value }))}
            >
              <option value={50}>50 — Very Soft Clay</option>
              <option value={75}>75 — Soft Clay</option>
              <option value={100}>100 — Medium Clay</option>
              <option value={150}>150 — Stiff Clay / Loose Sand</option>
              <option value={200}>200 — Dense Sand</option>
              <option value={300}>300 — Hard Murrum</option>
              <option value={400}>400 — Rock</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <FiChevronRight className="rotate-90" />
            </div>
          </div>
        </FormGroup>
      </div>

      <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-5 px-1">Seismic / Soil Profile</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {soilOpts.map((o) => (
          <button
            key={o.key}
            onClick={() => setData((p) => ({ ...p, soilType: o.key }))}
            className={`flex flex-col gap-2 p-4 rounded-lg border transition-all text-left group overflow-hidden relative ${
              data.soilType === o.key 
                ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500/10 shadow-sm" 
                : "bg-white border-slate-100 hover:bg-slate-50"
            }`}
          >
            <div className={`text-xl transition-transform group-hover:scale-110 duration-500 ${data.soilType === o.key ? "opacity-100" : "opacity-40 group-hover:opacity-100"}`}>
              {o.icon}
            </div>
            <div>
              <div className={`text-[10px] font-bold tracking-widest uppercase mb-0.5 ${data.soilType === o.key ? "text-indigo-600" : "text-slate-900"}`}>{o.label}</div>
              <div className="text-[9px] text-slate-500 font-semibold leading-tight uppercase tracking-tight">{o.desc}</div>
            </div>
            {data.soilType === o.key && (
               <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-indigo-600 flex items-center justify-center rounded-full shadow-lg">
                  <FiCheck size={12} className="text-white" />
               </div>
            )}
          </button>
        ))}
      </div>

      {soilWarn && (
        <Banner type="warn">
          <strong>Soil Consistency Alert:</strong> The selected SBC value is unusual for this soil type. Please verify with your Soil Investigation Report.
        </Banner>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <FormGroup label="Concrete Grade">
          <div className="relative">
            <select
              className={inputCls()}
              value={data.concGrade}
              onChange={(e) =>
                setData((p) => ({ ...p, concGrade: e.target.value }))
              }
            >
              <option value="M20">M20 — Standard (IS min.)</option>
              <option value="M25">M25 — Preferred</option>
              <option value="M30">M30 — High Rise</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <FiChevronRight className="rotate-90" />
            </div>
          </div>
        </FormGroup>
        <FormGroup label="Steel Grade">
          <div className="relative">
            <select
              className={inputCls()}
              value={data.steelGrd}
              onChange={(e) =>
                setData((p) => ({ ...p, steelGrd: e.target.value }))
              }
            >
              <option value="Fe415">Fe415</option>
              <option value="Fe500">Fe500 TMT</option>
              <option value="Fe550">Fe550</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <FiChevronRight className="rotate-90" />
            </div>
          </div>
        </FormGroup>
        <FormGroup label="Masonry Material" hint={brickHint}>
          <div className="relative">
            <select
              className={inputCls()}
              value={data.brickKey}
              onChange={(e) =>
                setData((p) => ({ ...p, brickKey: e.target.value }))
              }
            >
              <option value="1st">1st Class Brick</option>
              <option value="flyash">Fly Ash Brick</option>
              <option value="aac">AAC Block</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <FiChevronRight className="rotate-90" />
            </div>
          </div>
        </FormGroup>
      </div>

      <NavBar
        onNext={() => {
          scrollTop();
          onNext();
        }}
        onBack={() => {
          scrollTop();
          onBack();
        }}
        nextLabel="GENERATE FULL BOQ"
        nextCta
      />
    </motion.div>
  );
}

function Page5({ formData, result, onRestart }) {
  const fmt = (n) => Math.round(n).toLocaleString("en-IN");
  const fmtD = (n, d = 2) => (+n).toFixed(d);
  const { boqItems, subTotal, contingency, overhead, gst, grandTotal } = result;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
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
                  <div className="text-[10px] font-black text-indigo-200/50 uppercase tracking-[0.2em]">{lbl}</div>
                  <div className="text-sm font-black text-white tracking-tight">{val || 'Not Specified'}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full xl:w-auto flex flex-col items-center xl:items-end gap-3 bg-white/10 border border-white/10 p-8 rounded-lg backdrop-blur-md shadow-inner group/money transition-transform hover:scale-[1.02] duration-500">
            <div className="text-[10px] font-black text-indigo-100/50 uppercase tracking-[0.3em] mb-2 px-2">Total Project Value</div>
            <div className="text-5xl md:text-7xl font-black text-white tracking-tighter tabular-nums py-1 group-hover/money:tracking-normal transition-all duration-700">
              ₹{(grandTotal / 100000).toFixed(2)}<span className="text-lg md:text-xl ml-2 opacity-50 uppercase">Lacs</span>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <div className="text-[11px] font-black text-indigo-600 bg-white px-4 py-2 rounded-lg shadow-xl">
                ≈ ₹{Math.round(grandTotal / result.totalBU / 10.764).toLocaleString("en-IN")}/sqft
              </div>
            </div>
          </div>
        </div>
      </div>

      <ResultSection icon={<FiBox className="text-purple-400" />} title="Spatial Metrics" sub="Calculated built-up area and structural volume">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
          {[
            ["Built-up Area", result.totalBU.toFixed(1) + " m²", (result.totalBU * 10.764).toFixed(0) + " sqft"],
            ["Plot Size", result.plotArea.toFixed(1) + " m²", (result.plotArea * 10.764).toFixed(0) + " sqft"],
            ["Built height", result.totalH.toFixed(2) + " m", "~" + (result.totalH * 3.28).toFixed(1) + " ft"],
            ["Columns", result.totalCols, "Total grid units"],
            ["Avg Span", result.spanL.toFixed(2) + " m", "Structural grid"],
            ["Ground BU", result.builtArea.toFixed(1) + " m²", "Base footprint"],
          ].map(([lbl, val, sub]) => (
            <div key={lbl} className="bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-indigo-500/30 transition-all text-center space-y-1.5">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lbl}</div>
               <div className="text-xl font-black text-slate-900 tabular-nums">{val}</div>
               <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{sub}</div>
            </div>
          ))}
        </div>
      </ResultSection>

      <ResultSection icon={<FiLayers className="text-indigo-400" />} title="Resource Takeoff" sub="Gross material requirements as per IS:10262">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            ["Concrete (RCC)", result.totalRCC.toFixed(2) + " m³", "Grade " + formData.concGrade],
            ["Steel Reinforce.", (result.steelKg / 1000).toFixed(2) + " MT", result.steelKg.toFixed(0) + " KG"],
            ["Cement Bags", Math.ceil(result.totalRCC * 8.5) + " Bags", "OPC 43/53"],
            ["Fine Aggregate", (result.totalRCC * 0.45).toFixed(1) + " m³", "M-Sand / Sand"],
            ["Masonry Volume", (result.brickVolExt + result.brickVolInt).toFixed(1) + " m³", formData.brickKey + " Class"],
            ["Plaster area", (result.plInt + result.plExt).toFixed(0) + " m²", "12mm / 18mm thk"],
            ["Floor Tiles", result.floorArea.toFixed(0) + " m²", "Net surfaced"],
            ["Internal Paint", (result.plInt).toFixed(0) + " m²", "Net surfaced"],
          ].map(([lbl, val, sub], idx) => (
            <div key={lbl} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg shadow-sm border border-slate-100">
                  {idx === 0 ? "🏗️" : idx === 1 ? "🔗" : idx === 2 ? "🧱" : idx === 3 ? "⌛" : idx === 4 ? "🧱" : idx === 5 ? "🎨" : idx === 6 ? "💠" : "🖌️"}
                </div>
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{lbl}</div>
                   <div className="text-base font-black text-slate-900 tabular-nums">{val}</div>
                   <div className="text-[9px] font-bold text-slate-500 uppercase">{sub}</div>
                </div>
            </div>
          ))}
        </div>
      </ResultSection>

      <ResultSection icon={<FiList className="text-emerald-400" />} title="Bill of Quantities" sub="Itemized PWD structural estimates" badge="West Bengal PWD 2024">
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-900/60 border-y border-white/10">
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] w-16 text-center">#</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Work Description</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] w-20 text-center">Unit</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] w-32 text-right">Quantity</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] w-32 text-right">Rate (₹)</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] w-40 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {boqItems.map((item, idx) => {
                if (item.head) {
                  return (
                    <tr key={idx} className="bg-indigo-500/5">
                      <td colSpan={6} className="px-6 py-4 text-[12px] font-black text-indigo-400 uppercase tracking-widest italic">
                       {item.sno}. {item.desc}
                      </td>
                    </tr>
                  );
                }
                if (+item.qty <= 0) return null;
                const amt = +item.qty * +item.rate;
                return (
                  <tr key={idx} className="hover:bg-white/[0.03] transition-colors group border-white/5">
                    <td className="px-6 py-4 text-[11px] font-black text-slate-600 text-center">{item.sno}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-black text-slate-300 group-hover:text-white transition-colors leading-relaxed uppercase pr-8">{item.desc}</div>
                    </td>
                    <td className="px-6 py-4 text-[11px] font-black text-slate-500 text-center">{item.unit}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-400 text-right tabular-nums">{fmtD(item.qty)}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-400 text-right tabular-nums">{item.rate.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 text-sm font-black text-slate-100 text-right tabular-nums">₹{fmt(amt)}</td>
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
              ].map(([lbl, val], idx) => (
                <tr key={lbl}>
                  <td colSpan={5} className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{lbl}</td>
                  <td className="px-6 py-4 text-right text-sm font-black text-slate-600 tabular-nums">₹{fmt(val)}</td>
                </tr>
              ))}
              <tr className="bg-indigo-600 shadow-2xl">
                <td colSpan={5} className="px-6 py-8 text-right text-xs font-black text-indigo-100 uppercase tracking-[0.3em]">Net Project Estimate (Round Off)</td>
                <td className="px-6 py-8 text-right text-3xl font-black text-white tabular-nums">
                  ₹{(Math.round(grandTotal / 10000) * 10000).toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-12 p-10 bg-slate-950/60 rounded-lg border border-white/5 border-dashed space-y-6">
          <div className="flex items-center gap-3">
             <FiAlertCircle className="text-purple-400" size={20} />
             <div className="text-[12px] font-black text-slate-300 uppercase tracking-[0.3em]">Engineer's Notes</div>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
             {[
               "Rates based on WB PWD SOR 2024 (Building Works).",
               `SBC adjusted for ${formData.soilType} soil at ${formData.sbc} kN/m².`,
               "Structural analysis follows IS:456 and IS:875 standards.",
               "Estimate excludes statutory fees, land cost and landscaping.",
               "Labour costs include safety overheads and insurance markers.",
               "Quantities are net — add 5-8% for site wastage on RCC."
             ].map((txt, i) => (
                <div key={i} className="flex gap-4 items-start">
                   <span className="text-purple-500 font-black text-[10px] mt-0.5">{i+1}.</span>
                   <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-tight">{txt}</p>
                </div>
             ))}
          </div>
        </div>
      </ResultSection>
    </motion.div>
  );
}

function LoadingOverlay({ show }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="bg-white border border-slate-100 p-12 rounded-lg shadow-2xl flex flex-col items-center gap-8 max-w-sm text-center animate-in fade-in zoom-in duration-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse" />
          <FiRefreshCw className="text-7xl text-indigo-600 animate-spin relative z-10 duration-1000" />
        </div>
        <div className="relative z-10 space-y-4">
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tighter">Analyzing…</h3>
          <div className="space-y-1.5">
            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.3em] leading-relaxed">
              Synthesizing IS:456 parameters
            </p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Extracting PWD SOR rates & material takeoff
            </p>
          </div>
        </div>
        <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden relative z-10">
           <motion.div 
             initial={{ x: "-100%" }}
             animate={{ x: "100%" }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
             className="w-1/2 h-full bg-gradient-to-r from-transparent via-indigo-600 to-transparent"
           />
        </div>
      </div>
    </div>
  );
}

export default function BOQPage() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    projName: "",
    ownerName: "",
    location: "",
    estDate: today,
    engName: "",
    bldUse: "Residential",
    drawingRef: "",
    plotL: null,
    plotW: null,
    numFloors: 2,
    floorH: 3.0,
    hasStair: true,
    staircaseType: "standard", // "standard", "custom", "none"
    stairL: 4.9,
    stairW: 2.4,
    useSetback: false,
    sfFront: 1.5,
    sfBack: 1.0,
    sfSide: 1.0,
    sbc: 150,
    soilType: "black",
    concGrade: "M20",
    steelGrd: "Fe500",
    brickKey: "1st",
  });

  const initRooms = {};
  for (let i = 0; i < formData.numFloors; i++) initRooms[i] = {};
  const [floorRooms, setFloorRooms] = useState(initRooms);

  const goTo = (n) => {
    setStep(n);
    scrollTop();
  };

  const handleSaveToCloud = async (pName) => {
    const { saveProjectToFirestore } = await import('@/services/projectService');
    const projectData = {
      formData: { ...formData, projName: pName },
      floorRooms,
      result
    };
    await saveProjectToFirestore("local-user", {
      tool: 'boq',
      projectName: pName,
      projectData
    });
  };

  const handleGenerate = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const res = runBOQCalculation(formData, floorRooms);
      setResult(res);
      setLoading(false);
      setStep(5);
      scrollTop();
    }, 2800);
  }, [formData, floorRooms]);

  const handleRestart = () => {
    setStep(1);
    setResult(null);
    const rooms = {};
    for (let i = 0; i < formData.numFloors; i++) rooms[i] = {};
    setFloorRooms(rooms);
    scrollTop();
  };

  const setDataAndFloors = (updater) => {
    setFormData((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (next.numFloors !== prev.numFloors) {
        const rooms = {};
        for (let i = 0; i < next.numFloors; i++) rooms[i] = {};
        setFloorRooms(rooms);
      }
      return next;
    });
  };

  return (
    <ToolLayout
      title="CivilHub — Smart BOQ"
      subtitle={formData.projName ? `PROJ: ${formData.projName}` : "AI-Powered structural estimation"}
      onSave={handleSaveToCloud}
    >
      <div className="flex flex-col lg:flex-row gap-12 items-start relative pb-32">
        {/* ── SIDEBAR ── */}
        <aside className="w-full lg:w-80 lg:sticky lg:top-8 flex flex-col gap-8 no-print">
          <div className="bg-white border border-slate-100 rounded-lg p-8 shadow-sm relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             
             <div className="flex items-center gap-4 mb-10 px-2 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                  <FiBox size={24} />
                </div>
                <div>
                   <h2 className="text-lg font-extrabold text-slate-900 leading-none tracking-tighter">BOQ Engine</h2>
                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-1.5">v2.4 — PWD 2024</p>
                </div>
             </div>

             <nav className="flex flex-col gap-3 relative z-10">
              {[
                { num: 1, label: "Project Brief" },
                { num: 2, label: "Geometry & Extent" },
                { num: 3, label: "Floor Architecture" },
                { num: 4, label: "Structural Profile" },
                { num: 5, label: "Official Estimate" },
              ].map((s) => (
                <button
                  key={s.num}
                  className={`flex items-center gap-5 p-4 rounded-lg transition-all text-left group relative ${
                    step === s.num 
                      ? "bg-indigo-50 border-indigo-100 shadow-sm" 
                      : "border border-transparent hover:bg-slate-50"
                  }`}
                  disabled={s.num > step && step !== 5}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[11px] font-black transition-all ${
                    step === s.num 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110" 
                      : step > s.num 
                        ? "bg-slate-900 text-indigo-400 border border-indigo-500/20 ring-4 ring-indigo-500/5" 
                        : "bg-slate-50 text-slate-400 border border-slate-100"
                  }`}>
                    {step > s.num ? <FiCheck strokeWidth={4} /> : `0${s.num}`}
                  </div>
                  <div className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                    step === s.num ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                  }`}>
                    {s.label}
                  </div>
                  {step === s.num && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-lg p-8 group">
             <div className="flex items-center gap-3 mb-4 text-indigo-600">
                <FiInfo className="group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Quick Insight</span>
             </div>
             <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                Our algorithm calculates the <span className="text-slate-700">Effective Span</span> and <span className="text-slate-700">Net Moment Resistance</span> to provide precise material quantities.
             </p>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 min-w-0 w-full relative">
          <LoadingOverlay show={loading} />

          <AnimatePresence mode="wait">
             <div className="max-w-[1000px] mx-auto min-h-[600px]">
                {step === 1 && (
                  <Page1
                    data={formData}
                    setData={setFormData}
                    onNext={() => goTo(2)}
                  />
                )}
                {step === 2 && (
                  <Page2
                    data={formData}
                    setData={setDataAndFloors}
                    onNext={() => goTo(3)}
                    onBack={() => goTo(1)}
                  />
                )}
                {step === 3 && (
                  <Page3
                    data={formData}
                    floorRooms={floorRooms}
                    setFloorRooms={setFloorRooms}
                    onNext={() => goTo(4)}
                    onBack={() => goTo(2)}
                  />
                )}
                {step === 4 && (
                  <Page4
                    data={formData}
                    setData={setFormData}
                    onNext={handleGenerate}
                    onBack={() => goTo(3)}
                  />
                )}
                {step === 5 && result && (
                  <Page5
                    formData={formData}
                    result={result}
                    onRestart={handleRestart}
                  />
                )}
             </div>
          </AnimatePresence>
        </main>
      </div>
    </ToolLayout>
  );
}
