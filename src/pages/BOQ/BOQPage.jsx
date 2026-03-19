import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ToolLayout from "@/components/layout/ToolLayout.jsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronRight,
  FiChevronLeft,
  FiInfo,
  FiRefreshCw,
  FiExternalLink,
  FiAlertTriangle,
} from "react-icons/fi";

// Import extracted components
import StepIndicator, { STEPS } from "@/components/BOQ/Steps.jsx";
import FormGroup, {
  PageHeader,
  NavBar,
  Banner,
  ResultSection,
} from "@/components/BOQ/FormGroups.jsx";
import { ROOM_TYPES } from "@/components/BOQ/RoomSelector.jsx";
import FloorManager, {
  FLOOR_NAMES,
  initializeFloorRooms,
} from "@/components/BOQ/FloorManager.jsx";
import RoomSelector from "@/components/BOQ/RoomSelector.jsx";
import CostSummary from "@/components/BOQ/CostSummary.jsx";

// ─────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────

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

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
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
  const floorArea = Math.max(0, totalBU - stairArea * numFloors);
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
            rate:
              (numFloors - 1) * (staircaseType === "custom" ? 65000 : 50000),
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

  const inputCls = (err) =>
    `w-full bg-slate-50 border ${err ? "border-rose-500/50 focus:ring-rose-500/10" : "border-slate-200 focus:ring-indigo-500/10"} rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white focus:border-indigo-500/50 transition-all font-semibold text-sm shadow-sm`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
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
              onChange={(e) =>
                setData((p) => ({ ...p, bldUse: e.target.value }))
              }
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

  const inputCls = (err) =>
    `w-full bg-slate-50 border ${err ? "border-rose-500/50 focus:ring-rose-500/10" : "border-slate-200 focus:ring-indigo-500/10"} rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white focus:border-indigo-500/50 transition-all font-semibold text-sm shadow-sm`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <PageHeader
        step="02"
        title="Plot Dimensions & Floors"
        desc="Column grid and structural layout will be calculated automatically"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        <FormGroup
          label="Plot Length (m) *"
          error={errors.plotL}
          hint="Length along the road"
        >
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
        <FormGroup
          label="Plot Width (m) *"
          error={errors.plotW}
          hint="Breadth of the plot"
        >
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
          animate={{ opacity: 1, height: "auto" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 p-8 bg-purple-500/[0.03] rounded-lg border border-purple-500/20 border-dashed"
        >
          <FormGroup label="Staircase Length (m)">
            <input
              type="number"
              className={inputCls()}
              value={data.stairL || ""}
              onChange={(e) =>
                setData((p) => ({ ...p, stairL: +e.target.value }))
              }
              placeholder="e.g. 4.9"
              step="0.1"
            />
          </FormGroup>
          <FormGroup label="Staircase Width (m)">
            <input
              type="number"
              className={inputCls()}
              value={data.stairW || ""}
              onChange={(e) =>
                setData((p) => ({ ...p, stairW: +e.target.value }))
              }
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
            onChange={(e) =>
              setData((p) => ({ ...p, useSetback: e.target.checked }))
            }
          />
          <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 shadow-inner"></div>
          <span className="ml-4 text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors">
            Add Setback / Marginal Distances
          </span>
        </label>
      </div>

      <AnimatePresence>
        {data.useSetback && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <PageHeader
        step="03"
        title="Rooms — Architecture"
        desc="Switch floor tabs to define rooms for each level. We calculate interior wall volume based on this."
      />

      {/* Using FloorManager component */}
      <FloorManager
        numFloors={data.numFloors}
        activeFloor={activeFloor}
        onFloorChange={setActiveFloor}
      />

      {/* Using RoomSelector component */}
      <RoomSelector
        floorRooms={floorRooms}
        activeFloor={activeFloor}
        onToggleRoom={toggleRoom}
        onUpdateCount={updateCount}
      />

      {error && (
        <Banner type="err">
          At least one room must be selected on at least one floor!
        </Banner>
      )}
      <Banner type="info">
        Need multiple rooms of the same type? Just increase the count field —
        for example, 3 bedrooms → count = 3
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

  const inputCls = (err) =>
    `w-full bg-slate-900/40 border ${err ? "border-rose-500/50 focus:ring-rose-500/20" : "border-white/10 focus:ring-purple-500/30"} rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:bg-slate-900/60 transition-all font-semibold text-sm shadow-inner appearance-none cursor-pointer`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
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

      <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-5 px-1">
        Seismic / Soil Profile
      </div>
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
            <div
              className={`text-xl transition-transform group-hover:scale-110 duration-500 ${data.soilType === o.key ? "opacity-100" : "opacity-40 group-hover:opacity-100"}`}
            >
              {o.icon}
            </div>
            <div>
              <div
                className={`text-[10px] font-bold tracking-widest uppercase mb-0.5 ${data.soilType === o.key ? "text-indigo-600" : "text-slate-900"}`}
              >
                {o.label}
              </div>
              <div className="text-[9px] text-slate-500 font-semibold leading-tight uppercase tracking-tight">
                {o.desc}
              </div>
            </div>
            {data.soilType === o.key && (
              <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-indigo-600 flex items-center justify-center rounded-full shadow-lg">
                <FiChevronRight size={12} className="text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {soilWarn && (
        <Banner type="warn">
          <strong>Soil Consistency Alert:</strong> The selected SBC value is
          unusual for this soil type. Please verify with your Soil Investigation
          Report.
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
  // Using the extracted CostSummary component
  return (
    <CostSummary formData={formData} result={result} onRestart={onRestart} />
  );
}

function LoadingOverlay({ show }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="bg-white border border-slate-100 p-12 rounded-lg shadow-2xl flex flex-col items-center gap-8 max-w-sm text-center animate-in fade-in zoom-in duration-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
        <div className="relative z-10 space-y-4">
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tighter">
            Analyzing…
          </h3>
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

  const initRooms = initializeFloorRooms(formData.numFloors);
  const [floorRooms, setFloorRooms] = useState(initRooms);

  const goTo = (n) => {
    setStep(n);
    scrollTop();
  };

  const handleSaveToCloud = async (pName) => {
    const { saveProjectToFirestore } =
      await import("@/services/projectService");
    const projectData = {
      formData: { ...formData, projName: pName },
      floorRooms,
      result,
    };
    await saveProjectToFirestore("local-user", {
      tool: "boq",
      projectName: pName,
      projectData,
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
    const rooms = initializeFloorRooms(formData.numFloors);
    setFloorRooms(rooms);
    scrollTop();
  };

  const setDataAndFloors = (updater) => {
    setFormData((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (next.numFloors !== prev.numFloors) {
        const rooms = initializeFloorRooms(next.numFloors);
        setFloorRooms(rooms);
      }
      return next;
    });
  };

  return (
    <ToolLayout
      title="CivilHub — Smart BOQ"
      subtitle={
        formData.projName
          ? `PROJ: ${formData.projName}`
          : "AI-Powered structural estimation"
      }
      onSave={handleSaveToCloud}
    >
      <div className="flex flex-col lg:flex-row gap-12 items-start relative pb-32">
        {/* ── SIDEBAR ── */}
        <aside className="w-full lg:w-56 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto flex flex-col gap-8 no-print">
          {/* Using extracted StepIndicator component */}
          <StepIndicator currentStep={step} />

          <div className="bg-slate-50 border border-slate-100 rounded-lg p-8 group">
            <div className="flex items-center gap-3 mb-4 text-indigo-600">
              <FiInfo className="group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Quick Insight
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
              Our algorithm calculates the{" "}
              <span className="text-slate-700">Effective Span</span> and{" "}
              <span className="text-slate-700">Net Moment Resistance</span> to
              provide precise material quantities.
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
