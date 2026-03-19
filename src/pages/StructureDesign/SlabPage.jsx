import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { analyzeSlab } from "@/utils/StructureDesign/engines/structuralEngine.js";


function SlabPlan({ Lx, Ly, isTwoWay, r }) {
  const sc = Math.min(260 / Math.max(Lx, 1), 180 / Math.max(Ly, 1));
  const sw = Math.max(Lx * sc, 10),
    sh = Math.max(Ly * sc, 10);
  const ox = (320 - sw) / 2,
    oy = (220 - sh) / 2;

  return (
    <div className="relative w-full flex justify-center py-4 bg-slate-50/50 rounded-xl border border-slate-100/50">
      <motion.svg
        width={320}
        height={220}
        className="block overflow-visible drop-shadow-2xl"
      >
        <defs>
          <pattern
            id="concrete-pattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.05)" />
          </pattern>
          <filter id="glow-emerald">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <motion.rect
          layout
          initial={{ pathLength: 0, fillOpacity: 0 }}
          animate={{ pathLength: 1, fillOpacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          x={ox}
          y={oy}
          width={sw}
          height={sh}
          fill="url(#concrete-pattern)"
          className="stroke-emerald-600 fill-slate-100/10"
          strokeWidth={3}
          rx={8}
        />

        {/* Horizontal reinforcement lines */}
        <AnimatePresence>
          {Array.from({ length: 7 }, (_, i) => (
            <motion.line
              key={`h${i}`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1 + i * 0.1, duration: 0.6 }}
              x1={ox + 8}
              y1={oy + ((i + 1) * sh) / 8}
              x2={ox + sw - 8}
              y2={oy + ((i + 1) * sh) / 8}
              className="stroke-emerald-400 opacity-20"
              strokeWidth={1.5}
              strokeDasharray="4,4"
            />
          ))}
        </AnimatePresence>

        {/* Vertical reinforcement lines for two-way */}
        <AnimatePresence>
          {isTwoWay &&
            Array.from({ length: 7 }, (_, i) => (
              <motion.line
                key={`v${i}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.5 + i * 0.1, duration: 0.6 }}
                x1={ox + ((i + 1) * sw) / 8}
                y1={oy + 8}
                x2={ox + ((i + 1) * sw) / 8}
                y2={oy + sh - 8}
                className="stroke-emerald-400 opacity-20"
                strokeWidth={1.5}
                strokeDasharray="4,4"
              />
            ))}
        </AnimatePresence>

        <motion.g
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <text
            x={ox + sw / 2}
            y={oy - 16}
            className="text-center fill-slate-400 font-mono text-[11px] font-bold tracking-wider"
            textAnchor="middle"
          >
            LX = {Lx}m
          </text>
          <text
            x={ox - 24}
            y={oy + sh / 2}
            className="text-center fill-slate-400 font-mono text-[11px] font-bold tracking-wider"
            textAnchor="middle"
            transform={`rotate(-90, ${ox - 24}, ${oy + sh / 2})`}
          >
            LY = {Ly}m
          </text>
        </motion.g>

        <motion.g
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.2 }}
          key={isTwoWay ? "two" : "one"}
        >
          <text
            x={ox + sw / 2}
            y={oy + sh / 2}
            className={`fill-current font-black text-lg ${
              isTwoWay ? "text-amber-500" : "text-emerald-500"
            }`}
            textAnchor="middle"
            filter="url(#glow-emerald)"
          >
            {isTwoWay ? "TWO-WAY" : "ONE-WAY"}
          </text>
          <text
            x={ox + sw / 2}
            y={oy + sh / 2 + 18}
            className="fill-slate-500 font-mono text-[10px] font-bold uppercase tracking-widest"
            textAnchor="middle"
          >
            Ratio: {r}
          </text>
        </motion.g>
      </motion.svg>
    </div>
  );
}

function SlabSection({ thickness, wDL, wLL, dEff }) {
  return (
    <div className="relative w-full flex justify-center py-6 bg-slate-50/50 rounded-xl border border-slate-100/50 mt-4">
      <motion.svg
        width={320}
        height={130}
        className="block overflow-visible"
      >
        {/* Load Arrows */}
        {[60, 110, 160, 210, 260].map((ax, i) => (
          <motion.g
            key={ax}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 + i * 0.1 }}
          >
            <motion.line
              x1={ax}
              y1={5}
              x2={ax}
              y2={22}
              className="stroke-rose-500 opacity-60"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <motion.path
              d={`M ${ax - 3} 18 L ${ax} 22 L ${ax + 3} 18`}
              className="fill-none stroke-rose-500 opacity-60"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </motion.g>
        ))}
        <motion.text
          x={160}
          y={0}
          className="fill-rose-400 font-mono text-[10px] font-bold"
          textAnchor="middle"
        >
          W_ULT = {wDL + wLL} kN/m²
        </motion.text>

        {/* Slab Cross Section */}
        <motion.rect
          layout
          initial={{ pathLength: 0, fillOpacity: 0 }}
          animate={{ pathLength: 1, fillOpacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          x={40}
          y={30}
          width={240}
          height={48}
          className="stroke-sky-600 fill-slate-100/10"
          strokeWidth={2}
          rx={4}
        />

        {/* Main Reinforcement (Dots) */}
        <AnimatePresence>
          {[60, 100, 140, 180, 220, 260].map((rx, i) => (
            <motion.circle
              key={rx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.0 + i * 0.05 }}
              cx={rx}
              cy={68}
              r={4}
              className="fill-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
            />
          ))}
        </AnimatePresence>

        <motion.g
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <text
            x={160}
            y={105}
            className="fill-slate-400 font-mono text-[11px] font-bold"
            textAnchor="middle"
          >
            D = {thickness}mm
          </text>
          <text
            x={160}
            y={122}
            className="fill-slate-500 font-mono text-[10px]"
            textAnchor="middle"
          >
            D_EFF = {dEff}mm
          </text>
        </motion.g>
      </motion.svg>
    </div>
  );
}

export default function SlabPage({ onDataChange }) {
  const [Lx, setLx] = useState(4);
  const [Ly, setLy] = useState(6);
  const [wDL, setWDL] = useState(5);
  const [wLL, setWLL] = useState(3);
  const [thickness, setThickness] = useState(150);
  const [fck, setFck] = useState(25);
  const [fy, setFy] = useState(415);

  const result = analyzeSlab({ Lx, Ly, wDL, wLL, thickness, fck, fy });

  useEffect(() => {
    onDataChange?.({ Lx, Ly, wDL, wLL, thickness, fck, fy, result });
  }, [Lx, Ly, wDL, wLL, thickness, fck, fy]);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <TwoCol
        left={
          <div className="space-y-6">
            <Card className="p-6">
              <SectionTitle>Slab Geometry</SectionTitle>
              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <Inp
                    label="Short Span Lx (m)"
                    value={Lx}
                    onChange={setLx}
                    min={0.5}
                    step={0.5}
                  />
                  <Inp
                    label="Long Span Ly (m)"
                    value={Ly}
                    onChange={setLy}
                    min={0.5}
                    step={0.5}
                  />
                </div>
                <Inp
                  label="Overall Thickness (mm)"
                  value={thickness}
                  onChange={setThickness}
                  min={80}
                  step={10}
                />
              </div>
            </Card>

            <Card className="p-6">
              <SectionTitle>Loading Parameters</SectionTitle>
              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <Inp
                    label="Dead Load wDL (kN/m²)"
                    value={wDL}
                    onChange={setWDL}
                    min={0}
                    step={0.5}
                  />
                  <Inp
                    label="Live Load wLL (kN/m²)"
                    value={wLL}
                    onChange={setWLL}
                    min={0}
                    step={0.5}
                  />
                </div>
                <div className="bg-white p-3 rounded-lg flex justify-between items-center border border-slate-200">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Total Ultimate Load
                  </span>
                  <span className="text-sm font-mono font-bold text-emerald-600">
                    {wDL + wLL} kN/m²
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <SectionTitle>Material System</SectionTitle>
              <div className="space-y-4 mt-6">
                <Inp
                  label="Concrete Grade"
                  value={fck}
                  onChange={setFck}
                  options={[
                    { v: 20, l: "M20" },
                    { v: 25, l: "M25" },
                    { v: 30, l: "M30" },
                    { v: 35, l: "M35" },
                    { v: 40, l: "M40" },
                  ]}
                />
                <Inp
                  label="Steel Grade"
                  value={fy}
                  onChange={setFy}
                  options={[
                    { v: 250, l: "Fe250" },
                    { v: 415, l: "Fe415" },
                    { v: 500, l: "Fe500" },
                    { v: 550, l: "Fe550" },
                  ]}
                />
                <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 mt-4 space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Effective Depth (d_eff)</span>
                    <span className="text-blue-400 font-bold">{result.d_eff} mm</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500 italic">Nominal Cover</span>
                    <span className="text-slate-500">20 mm (IS 456)</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        }
        right={
          <div className="space-y-6">

            <Card className="p-0 overflow-hidden border-slate-200">
              <div className="bg-white p-3 border-b border-slate-100 flex items-center justify-between">
                <SectionTitle className="!mt-0 !mb-0 text-sm">
                  Plan & Section Analysis
                </SectionTitle>
                <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">
                  Verified IS 456
                </div>
              </div>
              <div className="p-6 space-y-8 bg-white">
                <SlabPlan
                  Lx={Lx}
                  Ly={Ly}
                  isTwoWay={result.isTwoWay}
                  r={result.r}
                />
                <SlabSection
                  thickness={thickness}
                  wDL={wDL}
                  wLL={wLL}
                  dEff={result.d_eff}
                />
              </div>
            </Card>

            <Card className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
              <SectionTitle>Bending Analysis</SectionTitle>
              <p className="text-[10px] text-slate-500 font-mono mb-4">
                IS 456 Table 26 — Bending Moment Coefficients
              </p>
              <div className="mt-4">
                <StatGrid cols={result.isTwoWay ? 4 : 2}>
                  <StatBox
                    label="Short Span Mx"
                    value={result.Mx}
                    unit="kNm/m"
                    color="#10b981"
                  />
                  {result.isTwoWay && (
                    <StatBox
                      label="Long Span My"
                      value={result.My}
                      unit="kNm/m"
                      color="#f59e0b"
                    />
                  )}
                  <StatBox
                    label="Limiting Mu"
                    value={result.Mulim}
                    unit="kNm/m"
                    color="#3b82f6"
                  />
                  <StatBox label="Ly/Lx Ratio" value={result.r} color="#64748b" />
                </StatGrid>
                <div className="mt-6">
                  <UtilBar
                    pct={result.util}
                    label="Design Moment Utilization (Lx)"
                  />
                </div>
              </div>
            </Card>

            <Card
              className="p-6 border-b-4"
              accentColor={result.pass ? "#10b981" : "#f43f5e"}
            >
              <PassFail pass={result.pass} code="Cl. 24 — Structural Safety" />
            </Card>

            <Card className="p-6 overflow-hidden">
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -mr-12 -mb-12" />
              <SectionTitle>Reinforcement Design</SectionTitle>
              <div className="space-y-4 mt-6">
                <ResultRow
                  label="Req. Ast_x (Short Span)"
                  value={result.Ast_x}
                  unit="mm²/m"
                />
                <ResultRow
                  label="Min. Ast (Distribution)"
                  value={result.Ast_min}
                  unit="mm²/m"
                  className="opacity-60"
                />
                <Divider />
                <div className="bg-white p-4 rounded-xl border border-slate-200/50">
                  <ResultRow
                    label={`Dia T${result.selDiaX} @ ${result.spcX}mm c/c (Main)`}
                    value={Math.round(
                      (((Math.PI * result.selDiaX * result.selDiaX) / 4) * 1000) /
                        result.spcX,
                    )}
                    unit="mm²/m"
                    highlight
                  />
                </div>

                {result.isTwoWay && (
                  <>
                    <Divider className="opacity-30" />
                    <ResultRow
                      label="Req. Ast_y (Long Span)"
                      value={result.Ast_y}
                      unit="mm²/m"
                    />
                    <div className="bg-white p-4 rounded-xl border border-slate-200/50">
                      <ResultRow
                        label={`Dia T${result.selDiaY} @ ${result.spcY}mm c/c (Dist)`}
                        value={Math.round(
                          (((Math.PI * result.selDiaY * result.selDiaY) / 4) *
                            1000) /
                            result.spcY,
                        )}
                        unit="mm²/m"
                        highlight
                      />
                    </div>
                  </>
                )}
              </div>
            </Card>

            <Card
              className="p-6"
              accentColor={result.deflPass ? "#10b981" : "#f43f5e"}
            >
              <PassFail
                pass={result.deflPass}
                code="Cl. 23.2 — Limit State of Serviceability"
              />
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <ResultRow label="Actual L/d" value={result.ldActual} />
                  <ResultRow label="Allowable L/d" value={result.ldAllow} highlight />
                </div>
                {!result.deflPass && (
                  <div className="mt-4">
                    <InfoBox color="#ef4444" lightColor="rgba(239, 68, 68, 0.1)">
                      <strong>Deflection Fail:</strong> Cl. 23.2 criteria not met.
                      Increase depth (thickness) or reduce span.
                    </InfoBox>
                  </div>
                )}
              </div>
            </Card>
          </div>
        }
      />
    </div>
  );
}


