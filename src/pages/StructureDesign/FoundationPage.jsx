import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, F } from "@/styles/StructureDesign/tokens";
import {
  Card,
  TwoCol,
  StatGrid,
  StatBox,
  TabBtn,
  Inp,
  SectionTitle,
  InfoBox,
  ResultRow,
  Divider,
  PassFail,
  UtilBar,
} from "@/components/StructureDesign/ui/index.js";
import { analyzeFoundation } from "@/utils/StructureDesign/engines/structuralEngine.js";


function FoundationSketch({ B, L, D, type }) {
  const sc = Math.min(240 / Math.max(B, 1), 140 / Math.max(L, 1));
  const fw = Math.max(B * sc, 10);
  const fh = Math.max(L * sc, 10);
  const ox = (320 - fw) / 2;
  const oy = (180 - fh) / 2;
  const col = type === "isolated" ? 50 : fw;

  return (
    <div className="relative w-full aspect-[4/3] bg-white rounded-lg border border-slate-200 overflow-hidden group">
      <motion.svg
        viewBox="0 0 320 240"
        className="w-full h-full drop-shadow-2xl overflow-visible px-4"
      >
        <defs>
          <linearGradient id="concrete" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="soil" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#1c0a00" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Soil / Excavation background */}
        <motion.rect
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          x={0}
          y={oy + fh}
          width={320}
          height={60}
          fill="url(#soil)"
          className="opacity-20"
        />

        {/* Soil hatch lines */}
        <AnimatePresence>
          {Array.from({ length: 12 }, (_, i) => (
            <motion.line
              key={i}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
              x1={(i * 320) / 11}
              y1={oy + fh}
              x2={(i * 320) / 11 - 15}
              y2={oy + fh + 20}
              className="stroke-amber-900/40"
              strokeWidth={1}
            />
          ))}
        </AnimatePresence>

        <motion.line
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          x1={0}
          y1={oy + fh}
          x2={320}
          y2={oy + fh}
          className="stroke-amber-700/50"
          strokeWidth={2}
        />

        {/* Main Footing Body */}
        <motion.rect
          layout
          initial={{ pathLength: 0, fillOpacity: 0 }}
          animate={{ pathLength: 1, fillOpacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          x={ox}
          y={oy}
          width={fw}
          height={fh}
          fill="url(#concrete)"
          className="stroke-slate-400"
          strokeWidth={2}
          rx={4}
        />

        {/* Column Stub */}
        <motion.rect
          layout
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          x={ox + (fw - col) / 2}
          y={oy - 40}
          width={col}
          height={46}
          fill="url(#concrete)"
          className="stroke-cyan-500"
          strokeWidth={2}
          rx={2}
        />

        {/* Rebar visualization (bottom mesh) */}
        <AnimatePresence>
          {[ox + 15, ox + fw / 2, ox + fw - 15].map((rx, i) => (
            <motion.circle
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.8 + i * 0.1 }}
              cx={rx}
              cy={oy + fh - 8}
              r={4}
              className="fill-indigo-600"
              filter="url(#glow)"
            />
          ))}
        </AnimatePresence>

        {/* Load Arrow */}
        <motion.g
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: [0, -6, 0] }}
          transition={{
            opacity: { delay: 1.5 },
            y: { repeat: Infinity, duration: 2, delay: 2 },
          }}
        >
          <line
            x1={ox + fw / 2}
            y1={oy - 70}
            x2={ox + fw / 2}
            y2={oy - 42}
            className="stroke-rose-500"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <path
            d={`M ${ox + fw / 2 - 6} ${oy - 52} L ${ox + fw / 2} ${oy - 42} L ${ox + fw / 2 + 6} ${oy - 52}`}
            className="fill-none stroke-rose-500"
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <text
            x={ox + fw / 2 + 12}
            y={oy - 58}
            className="fill-rose-400 text-[10px] font-bold font-mono italic"
          >
            Pu
          </text>
        </motion.g>

        {/* Dimension Labels */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-[9px] font-mono fill-slate-400 font-bold"
        >
          <text x={ox + fw / 2} y={oy + fh + 15} textAnchor="middle">
            B = {B}m
          </text>
          <text
            x={ox - 10}
            y={oy + fh / 2}
            textAnchor="middle"
            transform={`rotate(-90,${ox - 10},${oy + fh / 2})`}
          >
            L = {L}m
          </text>
          <text x={ox + fw + 8} y={oy + fh / 2} className="fill-slate-500">
            D = {D}m
          </text>
        </motion.g>
      </motion.svg>

      <div className="absolute top-4 right-4 flex flex-col gap-1 text-right">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
          Type
        </span>
        <span className="text-xs font-mono font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-100 capitalize">
          {type}
        </span>
      </div>
    </div>
  );
}

export default function FoundationPage({ onDataChange }) {
  const [type, setType] = useState("isolated");
  const [P, setP] = useState(600);
  const [Mx, setMx] = useState(40);
  const [My, setMy] = useState(20);
  const [SBC, setSBC] = useState(150);
  const [D, setD] = useState(1.5);
  const [B, setB] = useState(2);
  const [L, setL] = useState(2);
  const [fck, setFck] = useState(25);
  const [fy, setFy] = useState(415);
  const [gamma, setGamma] = useState(18);

  const result = analyzeFoundation({
    type,
    P,
    Mx,
    My,
    SBC,
    D,
    B,
    L,
    fck,
    fy,
    gamma,
  });

  useEffect(() => {
    onDataChange?.({ type, P, Mx, My, SBC, D, B, L, fck, fy, gamma, result });
  }, [type, P, Mx, My, SBC, D, B, L, fck, fy, gamma]);

  return (
    <div className="pb-20 pt-4 px-4 max-w-7xl mx-auto space-y-6">
      <UtilBar title="Foundation Design" lastSaved="Just now" />
      <TwoCol
        left={
          <div className="space-y-6">
            <Card className="p-6">
              <SectionTitle className="mb-4">Foundation Type</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                {["isolated", "combined", "strip", "raft"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`
                      px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm font-bold capitalize flex items-center justify-center
                      ${
                        type === t
                          ? "bg-cyan-50 border-cyan-500 text-cyan-600 shadow-sm"
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-600"
                      }
                    `}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <SectionTitle className="mb-4">Applied Loads</SectionTitle>
              <div className="space-y-4">
                <Inp
                  label="Column Load P (kN)"
                  value={P}
                  onChange={setP}
                  min={0}
                />
                <Inp
                  label="Moment Mx (kNm)"
                  value={Mx}
                  onChange={setMx}
                  min={0}
                />
                <Inp
                  label="Moment My (kNm)"
                  value={My}
                  onChange={setMy}
                  min={0}
                />
              </div>
            </Card>

            <Card className="p-6">
              <SectionTitle className="mb-4">Soil & Depth</SectionTitle>
              <div className="space-y-4">
                <Inp
                  label="Safe Bearing Capacity (kN/m²)"
                  value={SBC}
                  onChange={setSBC}
                  min={50}
                />
                <Inp
                  label="Foundation Depth D (m)"
                  value={D}
                  onChange={setD}
                  min={0.5}
                  step={0.1}
                />
                <Inp
                  label="Soil Unit Weight γ (kN/m³)"
                  value={gamma}
                  onChange={setGamma}
                  min={14}
                  step={0.5}
                />
              </div>
            </Card>

            <Card className="p-6">
              <SectionTitle className="mb-4">Footing Size</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Inp
                  label="Width B (m)"
                  value={B}
                  onChange={setB}
                  min={0.5}
                  step={0.1}
                />
                <Inp
                  label="Length L (m)"
                  value={L}
                  onChange={setL}
                  min={0.5}
                  step={0.1}
                />
              </div>
            </Card>

            <Card className="p-6">
              <SectionTitle className="mb-4">Material Grade</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Inp
                  label="Concrete fck"
                  value={fck}
                  onChange={setFck}
                  options={[
                    { v: 20, l: "M20" },
                    { v: 25, l: "M25" },
                    { v: 30, l: "M30" },
                    { v: 35, l: "M35" },
                  ]}
                />
                <Inp
                  label="Steel fy"
                  value={fy}
                  onChange={setFy}
                  options={[
                    { v: 250, l: "Fe250" },
                    { v: 415, l: "Fe415" },
                    { v: 500, l: "Fe500" },
                  ]}
                />
              </div>
            </Card>
          </div>
        }
        right={
          <div className="space-y-6">

            <Card className="p-6">
              <SectionTitle className="mb-4">Foundation Schematic</SectionTitle>
              <FoundationSketch B={result.B} L={result.L} D={D} type={type} />
            </Card>

            <Card className="p-6">
              <StatGrid cols={3}>
                <StatBox
                  label="Net Pressure"
                  value={result.qnet}
                  unit="kN/m²"
                  color="#0ea5e9"
                />
                <StatBox
                  label="Gross qmax"
                  value={result.qmax}
                  unit="kN/m²"
                  color="#f59e0b"
                />
                <StatBox
                  label="Depth d_eff"
                  value={result.d_eff}
                  unit="mm"
                  color="#64748b"
                />
              </StatGrid>
            </Card>

            <Card
              className="p-6"
              accentColor={result.passSBC ? "#10b981" : "#f43f5e"}
            >
              <PassFail
                pass={result.passSBC}
                code="IS 1904:1986 — Bearing Capacity Check"
              />
              <div className="mt-6 space-y-3">
                <ResultRow
                  label="Net soil pressure qnet"
                  value={result.qnet}
                  unit="kN/m²"
                />
                <ResultRow
                  label="Safe Bearing Capacity"
                  value={SBC}
                  unit="kN/m²"
                  highlight
                />
                <div className="pt-2">
                  <UtilBar
                    pct={((result.qnet / SBC) * 100).toFixed(1)}
                    label="Bearing Pressure Utilization"
                  />
                </div>
              </div>
            </Card>

            <Card
              className="p-6"
              accentColor={result.passM ? "#10b981" : "#f43f5e"}
            >
              <PassFail
                pass={result.passM}
                code="IS 456:2000 Cl. 34 — Flexure Design"
              />
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <ResultRow
                    label="Design Moment Mu"
                    value={result.Mu}
                    unit="kNm/m"
                  />
                  <ResultRow
                    label="Capacity Mulim"
                    value={result.Mulim}
                    unit="kNm/m"
                    highlight
                  />
                </div>
                <Divider className="opacity-30" />
                <div className="grid grid-cols-2 gap-4">
                  <ResultRow
                    label="Ast required"
                    value={result.Ast_req}
                    unit="mm²/m"
                  />
                  <ResultRow
                    label="Ast minimum"
                    value={result.Ast_min}
                  />
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <ResultRow
                    label={`⌀${result.barDia} @ ${result.spcOk} mm c/c`}
                    value={result.Ast_prov}
                    unit="mm²/m"
                    highlight
                  />
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                className="p-6"
                accentColor={result.punchPass ? "#10b981" : "#f43f5e"}
              >
                <PassFail
                  pass={result.punchPass}
                  code="IS 456:2000 Cl. 31.6"
                />
                <div className="mt-6 space-y-3">
                  <ResultRow
                    label="Punching stress"
                    value={result.tau_v_punch}
                    unit="N/mm²"
                  />
                  <ResultRow
                    label="Permissible"
                    value={result.tau_c_punch}
                    unit="N/mm²"
                    highlight
                  />
                </div>
              </Card>

              <Card
                className="p-6"
                accentColor={result.shearPass ? "#10b981" : "#f43f5e"}
              >
                <PassFail
                  pass={result.shearPass}
                  code="IS 456:2000 Cl. 31.7"
                />
                <div className="mt-6 space-y-3">
                  <ResultRow
                    label="Shear stress τv"
                    value={result.tau_v_shear}
                    unit="N/mm²"
                  />
                  <ResultRow
                    label="Permissible τc"
                    value={result.tau_c_shear}
                    unit="N/mm²"
                    highlight
                  />
                </div>
              </Card>
            </div>
          </div>
        }
      />
    </div>
  );
}


