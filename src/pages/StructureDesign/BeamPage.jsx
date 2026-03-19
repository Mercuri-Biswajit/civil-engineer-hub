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
import { DiagramCanvas } from "@/components/StructureDesign/charts/DiagramCanvas.jsx";
import { analyzeBeam, checkBeamSection } from "@/utils/StructureDesign/engines/beamEngine.js";

function BeamSchematic({ span, loads, support, material }) {
  const W = 560,
    H = 110,
    lx = 40,
    rx = W - 20,
    pw = rx - lx,
    bY = 56;
  const toX = (v) => lx + (v / Math.max(span, 0.01)) * pw;
  
  const fill = material === 'concrete' ? 'url(#concrete)' : 'url(#steel)'
  const stroke = material === 'concrete' ? '#94a3b8' : '#475569'

  return (
    <motion.svg
      width="100%"
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="font-mono overflow-visible"
    >
      {/* Beam Body */}
      <motion.rect
        layout
        initial={{ pathLength: 0, fillOpacity: 0 }}
        animate={{ pathLength: 1, fillOpacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        x={lx}
        y={bY - 8}
        width={pw}
        height={16}
        fill={fill}
        stroke={stroke}
        strokeWidth={2.5}
        rx={material === 'concrete' ? 2 : 0}
        filter="url(#shadow)"
      />

      {/* Supports */}
      <AnimatePresence>
        {support === "simply" && (
          <motion.g 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            transition={{ delay: 1 }}
          >
            <polygon
              points={`${lx},${bY + 8} ${lx - 12},${bY + 28} ${lx + 12},${bY + 28}`}
              fill="#f8fafc"
              stroke="#64748b"
              strokeWidth={2}
            />
            <polygon
              points={`${rx},${bY + 8} ${rx - 12},${bY + 28} ${rx + 12},${bY + 28}`}
              fill="#f8fafc"
              stroke="#64748b"
              strokeWidth={2}
            />
          </motion.g>
        )}
        {support === "cantilever" && (
          <motion.rect
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 44, opacity: 0.3 }}
            transition={{ delay: 0.8 }}
            x={lx - 18} y={bY - 22} width={18} height={44}
            fill="url(#soil)" opacity={0.3} stroke="#64748b" strokeWidth={2} rx={2}
          />
        )}
        {support === "fixed" && (
          <motion.g 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <rect x={lx - 14} y={bY - 20} width={14} height={40} fill="url(#soil)" opacity={0.3} stroke="#64748b" strokeWidth={2} rx={2} />
            <rect x={rx} y={bY - 20} width={14} height={40} fill="url(#soil)" opacity={0.3} stroke="#64748b" strokeWidth={2} rx={2} />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Loads */}
      <AnimatePresence>
        {loads.map((l, i) => {
          if (l.type === "udl") {
            const x1 = toX(l.start), x2 = toX(l.end);
            const cnt = Math.max(3, Math.floor((x2 - x1) / 32));
            return (
              <motion.g 
                key={l.id || i}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ delay: 1.5 + i * 0.1 }}
              >
                <motion.line 
                    x1={x1} y1={14} x2={x2} y2={14} 
                    stroke="#f97316" strokeWidth={3} strokeLinecap="round" 
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.5 + i*0.1, duration: 0.8 }}
                />
                {Array.from({ length: cnt + 1 }, (_, j) => {
                  const ax = x1 + (j / cnt) * (x2 - x1);
                  return (
                    <g key={j}>
                      <motion.line 
                        x1={ax} y1={14} x2={ax} y2={40}
                        stroke="#f97316" strokeWidth={2} 
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.8 + i*0.1, duration: 0.3 }}
                      />
                      <motion.polygon 
                        points={`${ax},40 ${ax - 4.5},28 ${ax + 4.5},28`}
                        fill="#f97316" 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 + i*0.1 }}
                      />
                    </g>
                  );
                })}
                <motion.text 
                    x={(x1 + x2) / 2} y={10} textAnchor="middle" fill="#f97316" fontSize={11} fontWeight={900}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 + i*0.1 }}
                >
                    {l.w} kN/m
                </motion.text>
              </motion.g>
            );
          }
          const ax = toX(l.pos);
          return (
            <motion.g 
              key={l.id || i}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ delay: 1.5 + i * 0.1 }}
            >
              <motion.line 
                x1={ax} y1={4} x2={ax} y2={40} stroke="#8b5cf6" strokeWidth={3.5} strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.5 + i*0.1, duration: 0.5 }}
              />
              <motion.polygon 
                points={`${ax},40 ${ax - 6},26 ${ax + 6},26`} fill="#8b5cf6"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 + i*0.1 }}
              />
              <motion.text 
                x={ax} y={2} textAnchor="middle" fill="#8b5cf6" fontSize={11} fontWeight={900}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 + i*0.1 }}
              >
                  {l.p}kN
              </motion.text>
            </motion.g>
          );
        })}
      </AnimatePresence>

      <motion.line 
        x1={lx} y1={H - 12} x2={rx} y2={H - 12} stroke="#cbd5e1" strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 1 }}
      />
      <motion.text 
        x={(lx + rx) / 2} y={H - 4} textAnchor="middle" fill="#64748b" fontSize={11} fontWeight={900}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
      >
        L = {span} m
      </motion.text>
    </motion.svg>
  );
}

function SectionPreview({ b, d, material }) {
  const scale = Math.min(60 / b, 80 / d, 0.3);
  const sw = Math.min(b * scale, 60), sh = Math.min(d * scale, 80);
  const ox = (70 - sw) / 2, oy = (85 - sh) / 2;
  
  const fill = material === "concrete" ? 'url(#concrete)' : 'url(#steel)'
  const stroke = material === "concrete" ? '#94a3b8' : '#475569'

  return (
    <motion.svg width={70} height={85} className="block mx-auto overflow-visible">
      <motion.rect
        layout
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        x={ox} y={oy} width={sw} height={sh}
        fill={fill} stroke={stroke} strokeWidth={2.5}
        rx={material === 'concrete' ? 3 : 0}
        filter="url(#shadow)"
      />
      
      <AnimatePresence>
        {material === "concrete" && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {[ [ox + 6, oy + 6], [ox + sw - 6, oy + 6], [ox + 6, oy + sh - 6], [ox + sw - 6, oy + sh - 6] ].map(([cx, cy], i) => (
              <motion.circle 
                key={i} 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                cx={cx} cy={cy} r={3} 
                fill="#334155" 
                filter="url(#glow)"
              />
            ))}
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {material === "steel" && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* I-Beam Shape with premium gradients */}
            <defs>
              <linearGradient id="steelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>
            {/* Top Flange */}
            <motion.rect 
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              x={ox} y={oy} width={sw} height={Math.max(4, sh * 0.12)} 
              fill="url(#steelGrad)" rx={1} 
            />
            {/* Bottom Flange */}
            <motion.rect 
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              x={ox} y={oy + sh - Math.max(4, sh * 0.12)} width={sw} height={Math.max(4, sh * 0.12)} 
              fill="url(#steelGrad)" rx={1} 
            />
            {/* Web */}
            <motion.rect 
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              x={ox + sw / 2 - Math.max(2, sw * 0.08)} y={oy + Math.max(4, sh * 0.12)} 
              width={Math.max(4, sw * 0.16)} height={sh - 2 * Math.max(4, sh * 0.12)} 
              fill="#64748b" opacity={0.9} 
            />
          </motion.g>
        )}
      </AnimatePresence>

      <text x={35} y={82} textAnchor="middle" fill="#64748b" fontSize={9} fontWeight={900} className="font-mono">
        {b}×{d}
      </text>
    </motion.svg>
  );
}

function LoadCard({ load, onUpdate, onRemove }) {
  const isUdl = load.type === "udl";
  return (
    <div className="bg-white/80 border border-slate-200/60 rounded-lg p-3 relative transition-all duration-300 hover:border-slate-300 hover:shadow-sm group">
      <div className="flex justify-between items-center mb-3">
        <span
          className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest uppercase shadow-sm ${
            isUdl ? "bg-orange-100 text-orange-600 ring-1 ring-orange-200/50" : "bg-indigo-100 text-indigo-600 ring-1 ring-indigo-200/50"
          }`}
        >
          {isUdl ? "UDL" : "POINT LOAD"}
        </span>
        <button
          onClick={onRemove}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-500 hover:bg-red-500 hover:text-white transition-all duration-200 text-lg leading-none"
        >
          ×
        </button>
      </div>
      {isUdl ? (
        <div className="grid grid-cols-3 gap-4">
          {[
            ["w (kN/m)", "w"],
            ["from (m)", "start"],
            ["to (m)", "end"],
          ].map(([lbl, key]) => (
            <div key={key}>
              <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5 tracking-widest px-0.5">
                {lbl}
              </label>
              <input
                className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-[11px] font-mono font-semibold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-sm"
                type="number"
                value={load[key]}
                onChange={(e) => onUpdate(key, parseFloat(e.target.value) || 0)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {[
            ["P (kN)", "p"],
            ["at (m)", "pos"],
          ].map(([lbl, key]) => (
            <div key={key}>
              <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5 tracking-widest px-0.5">
                {lbl}
              </label>
              <input
                className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-[11px] font-mono font-semibold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                type="number"
                value={load[key]}
                onChange={(e) => onUpdate(key, parseFloat(e.target.value) || 0)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BeamPage({ onDataChange }) {
  const [span, setSpan] = useState(6);
  const [support, setSupport] = useState("simply");
  const [material, setMaterial] = useState("concrete");
  const [b, setB] = useState(300);
  const [d, setD] = useState(500);
  const [fck, setFck] = useState(25);
  const [fy, setFy] = useState(415);
  const [loads, setLoads] = useState([
    { id: 1, type: "udl", w: 20, start: 0, end: 6 },
  ]);
  const [result, setResult] = useState(null);
  const [check, setCheck] = useState(null);

  useEffect(() => {
    if (!loads.length || span <= 0) return;
    const res = analyzeBeam(span, loads, support);
    const chk = checkBeamSection(
      material,
      b,
      d,
      res.maxM,
      res.maxV,
      span,
      fck,
      fy,
    );
    setResult(res);
    setCheck(chk);
    onDataChange?.({
      span,
      support,
      material,
      b,
      d,
      fck,
      fy,
      loads,
      result: res,
      check: chk,
    });
  }, [span, support, material, b, d, fck, fy, loads]);

  const addLoad = (type) =>
    setLoads((prev) => [
      ...prev,
      type === "udl"
        ? { id: Date.now(), type: "udl", w: 10, start: 0, end: span }
        : { id: Date.now(), type: "point", p: 50, pos: span / 2 },
    ]);
  const updateLoad = (id, key, val) =>
    setLoads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [key]: val } : l)),
    );
  const removeLoad = (id) =>
    setLoads((prev) => prev.filter((l) => l.id !== id));


  return (
    <div className="pb-20 pt-4 px-4 max-w-7xl mx-auto space-y-6">
      <TwoCol
        left={
          <div className="space-y-5">
            <Card>
              <SectionTitle>Geometry</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <Inp
                  label="Span (m)"
                  value={span}
                  onChange={setSpan}
                  min={1}
                  max={100}
                />
                <Inp
                  label="Support Type"
                  value={support}
                  onChange={setSupport}
                  options={[
                    { v: "simply", l: "Simply Supported" },
                    { v: "cantilever", l: "Cantilever" },
                    { v: "fixed", l: "Fixed-Fixed" },
                  ]}
                />
              </div>
            </Card>

            <Card shadow>
              <SectionTitle>Cross Section</SectionTitle>
              <div className="flex bg-white p-1 rounded-lg w-fit gap-1 mb-4 mt-3 border border-slate-200">
                <TabBtn
                  active={material === "concrete"}
                  onClick={() => setMaterial("concrete")}
                >
                  Concrete
                </TabBtn>
                <TabBtn
                  active={material === "steel"}
                  onClick={() => setMaterial("steel")}
                  color="#f59e0b"
                >
                  Steel
                </TabBtn>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
                <div className="space-y-3">
                  <Inp label="Width b (mm)" value={b} onChange={setB} min={50} />
                  <Inp label="Depth d (mm)" value={d} onChange={setD} min={50} />
                </div>
                <div className="sm:col-span-1 lg:col-span-2 flex justify-center py-3 bg-white rounded-xl border border-slate-200 shadow-inner">
                  <SectionPreview b={b} d={d} material={material} />
                </div>
              </div>
            </Card>

            {material === "concrete" && (
              <Card>
                <SectionTitle>Material Grade</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <Inp
                    label="Concrete fck (MPa)"
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
                    label="Steel fy (MPa)"
                    value={fy}
                    onChange={setFy}
                    options={[
                      { v: 250, l: "Fe250" },
                      { v: 415, l: "Fe415" },
                      { v: 500, l: "Fe500" },
                      { v: 550, l: "Fe550" },
                    ]}
                  />
                </div>
              </Card>
            )}

            <Card>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 mt-1">
                <SectionTitle style={{ marginBottom: 0, marginTop: 0 }}>Loads</SectionTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => addLoad("udl")}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 hover:shadow-sm active:scale-95 transition-all text-[11px] font-bold tracking-widest uppercase"
                  >
                    + UDL
                  </button>
                  <button
                    onClick={() => addLoad("point")}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:shadow-sm active:scale-95 transition-all text-[11px] font-bold tracking-widest uppercase"
                  >
                    + POINT
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {loads.map((l) => (
                  <LoadCard
                    key={l.id}
                    load={l}
                    onUpdate={(key, val) => updateLoad(l.id, key, val)}
                    onRemove={() => removeLoad(l.id)}
                  />
                ))}
                {loads.length === 0 && (
                  <div className="py-12 text-center bg-white rounded-lg border-2 border-dashed border-slate-200 group hover:border-slate-300 transition-colors">
                    <div className="text-slate-400 text-4xl mb-2">⚖️</div>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                      No loads added yet
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        }
        right={
          <div className="space-y-5">

            <Card>
              <SectionTitle>Structural Schematic</SectionTitle>
              <div className="mt-6 bg-slate-50/50 rounded-lg p-8 border border-slate-100 shadow-inner group transition-all duration-500 hover:bg-white overflow-visible">
                <BeamSchematic
                  span={span}
                  loads={loads}
                  support={support}
                  material={material}
                />
              </div>
            </Card>

            {result && (
              <Card>
                <SectionTitle>Analysis Summary</SectionTitle>
                <div className="mt-6">
                  <StatGrid cols={2} className="sm:grid-cols-4">
                    <StatBox
                      label="Ra"
                      value={result.Ra.toFixed(2)}
                      unit="kN"
                      color="#3b82f6"
                    />
                    <StatBox
                      label="Rb"
                      value={result.Rb.toFixed(2)}
                      unit="kN"
                      color="#3b82f6"
                    />
                    <StatBox
                      label="Max Shear"
                      value={result.maxV.toFixed(2)}
                      unit="kN"
                      color="#f59e0b"
                    />
                    <StatBox
                      label="Max Moment"
                      value={result.maxM.toFixed(2)}
                      unit="kNm"
                      color="#10b981"
                    />
                  </StatGrid>
                </div>
              </Card>
            )}

            {result && (
              <Card>
                <div className="space-y-10 mt-2">
                  <div className="group">
                    <SectionTitle>Shear Force Diagram (SFD)</SectionTitle>
                    <div className="mt-6 bg-white rounded-lg p-6 border border-slate-200 shadow-inner overflow-hidden transition-all duration-500 group-hover:shadow-md">
                      <DiagramCanvas
                        x={result.x}
                        values={result.sfd}
                        span={span}
                        color="#f59e0b"
                        label="SFD"
                        unit="kN"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <SectionTitle>Bending Moment Diagram (BMD)</SectionTitle>
                    <div className="mt-6 bg-white rounded-lg p-6 border border-slate-200 shadow-inner overflow-hidden transition-all duration-500 group-hover:shadow-md">
                      <DiagramCanvas
                        x={result.x}
                        values={result.bmd}
                        span={span}
                        color="#3b82f6"
                        label="BMD"
                        unit="kNm"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {check && result && material === "concrete" && (
              <div className="space-y-8">
                <Card accentColor={check.pass ? "#10b981" : "#ef4444"}>
                  <PassFail
                    pass={check.pass}
                    code={`${check.code} Cl. G-1 — Flexure`}
                  />
                  <div className="mt-6">
                    <StatGrid cols={3}>
                      <StatBox
                        label="Applied Mu"
                        value={result.maxM.toFixed(2)}
                        unit="kNm"
                        color="#334155"
                      />
                      <StatBox
                        label="Capacity Mulim"
                        value={check.Mulim}
                        unit="kNm"
                        color="#10b981"
                      />
                      <StatBox
                        label="d effective"
                        value={check.d_eff}
                        unit="mm"
                        color="#64748b"
                      />
                    </StatGrid>
                  </div>
                  <UtilBar pct={check.util} label="Moment Utilization" />
                </Card>

                <Card accentColor="#f59e0b">
                  <SectionTitle>
                    Flexural Reinforcement (IS 456 Cl. 26.5)
                  </SectionTitle>
                  <div className="space-y-3 mt-6">
                    <ResultRow
                      label="Ast required"
                      value={check.Ast_req}
                      unit="mm²"
                    />
                    <ResultRow
                      label="Ast minimum (IS 456 Cl. 26.5.1.1)"
                      value={check.Ast_min}
                      unit="mm²"
                    />
                    <ResultRow
                      label="Ast maximum (0.04·b·d)"
                      value={check.Ast_max}
                      unit="mm²"
                    />
                    <Divider />
                    <ResultRow
                      label={`Provide: ${check.nBars} bars ⌀${check.barDia} mm`}
                      value={check.Ast_prov}
                      unit="mm² (provided)"
                      highlight
                    />
                    <ResultRow label="Steel ratio pt" value={`${check.pt}%`} />
                  </div>
                </Card>

                <Card accentColor={check.shearPass ? "#10b981" : "#ef4444"}>
                  <PassFail
                    pass={check.shearPass}
                    code="IS 456:2000 Cl. 40 — Shear Design"
                  />
                  <div className="space-y-3 mt-6">
                    <ResultRow
                      label="Nominal shear stress τv"
                      value={check.tau_v}
                      unit="N/mm²"
                    />
                    <ResultRow
                      label="Design shear strength τc"
                      value={check.tau_c}
                      unit="N/mm²"
                    />
                    <ResultRow
                      label="Max permissible τmax"
                      value={check.tau_max}
                      unit="N/mm²"
                      highlight
                    />
                    <Divider />
                    {check.needsLinks ? (
                      <InfoBox color="#f59e0b">
                        Shear reinforcement required: ⌀{check.stirrupDia} 2-legged
                        @ <strong className="text-amber-700">{check.stirrupSpc} mm</strong> c/c (IS 456 Cl.
                        40.4)
                      </InfoBox>
                    ) : (
                      <InfoBox color="#10b981">
                        Nominal links only: ⌀{check.stirrupDia} 2-legged @{" "}
                        <strong className="text-emerald-700">{check.stirrupSpc} mm</strong> c/c
                      </InfoBox>
                    )}
                  </div>
                </Card>

                <Card accentColor={check.deflPass ? "#10b981" : "#ef4444"}>
                  <PassFail
                    pass={check.deflPass}
                    code="IS 456:2000 Cl. 23.2 — Deflection (L/d check)"
                  />
                  <div className="space-y-3 mt-6">
                    <ResultRow label="Actual L/d" value={check.ldActual} />
                    <ResultRow
                      label="Allowable L/d"
                      value={check.ldAllow}
                      highlight
                    />
                    {!check.deflPass && (
                      <div className="mt-4">
                        <InfoBox color="#ef4444">
                          ✗ L/d exceeded — increase beam depth or reduce span.
                        </InfoBox>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {check && result && material === "steel" && (
              <Card accentColor={check.pass ? "#10b981" : "#ef4444"}>
                <PassFail pass={check.pass} code={check.code} />
                <div className="mt-6">
                  <StatGrid cols={3}>
                    <StatBox
                      label="Applied Mu"
                      value={result.maxM.toFixed(2)}
                      unit="kNm"
                      color="#334155"
                    />
                    <StatBox
                      label="Capacity Md"
                      value={check.Mulim}
                      unit="kNm"
                      color="#10b981"
                    />
                    <StatBox
                      label="Shear Vd"
                      value={check.Vd}
                      unit="kN"
                      color="#f59e0b"
                    />
                  </StatGrid>
                </div>
                <div className="space-y-6 mt-8">
                  <UtilBar pct={check.util} label="Moment Utilization" />
                  <UtilBar
                    pct={check.shearUtil}
                    label="Shear Utilization"
                    color="#f59e0b"
                  />
                </div>
              </Card>
            )}
          </div>
        }
      />
    </div>
  );
}


