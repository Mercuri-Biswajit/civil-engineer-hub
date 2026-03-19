import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  TwoCol,
  StatGrid,
  StatBox,
  TabBtn,
  Inp,
  SectionTitle,
  ResultRow,
  Divider,
  PassFail,
  UtilBar,
} from "@/components/StructureDesign/ui/index.js";
import {
  analyzeHorizontalCurve,
  analyzeVerticalCurve,
  analyzePavement,
} from "@/utils/StructureDesign/engines/roadEngine.js";


function RoadPlanSketch({ R, delta, V }) {
  const cx = 140,
    cy = 100,
    r = 70;
  const ang = Math.min(((delta || 30) * Math.PI) / 180, Math.PI * 0.8);
  const half = ang / 2;
  const x1 = cx - r * Math.sin(half) * 2.2,
    y1 = cy + r * Math.cos(half) * 0.8;
  const x2 = cx + r * Math.sin(half) * 2.2,
    y2 = cy + r * Math.cos(half) * 0.8;
  const midX = cx,
    midY = cy - r * 0.7;

  return (
    <div className="relative w-full aspect-[28/18] bg-white rounded-xl border border-slate-200/50 overflow-hidden p-4">
      <motion.svg
        viewBox="0 0 280 180"
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#475569" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>

        {/* Background road surface */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <line
            x1={x1}
            y1={y1}
            x2={midX - 8}
            y2={midY + 8}
            stroke="url(#roadGrad)"
            strokeWidth={20}
            strokeLinecap="round"
          />
          <line
            x1={x2}
            y1={y2}
            x2={midX + 8}
            y2={midY + 8}
            stroke="url(#roadGrad)"
            strokeWidth={20}
            strokeLinecap="round"
          />
          <path
            d={`M ${x1} ${y1} Q ${midX} ${midY - 20} ${x2} ${y2}`}
            stroke="url(#roadGrad)"
            strokeWidth={20}
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* Tracing Centerline Animation */}
        <AnimatePresence>
          <motion.path
            key={delta}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d={`M ${x1} ${y1} Q ${midX} ${midY - 20} ${x2} ${y2}`}
            stroke="#8b5cf6"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
            filter="url(#glow)"
          />
        </AnimatePresence>

        {/* Dashed Centerline */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d={`M ${x1} ${y1} Q ${midX} ${midY - 20} ${x2} ${y2}`}
          stroke="#94a3b8"
          strokeWidth={1.5}
          strokeDasharray="8,8"
          fill="none"
          opacity={0.5}
        />

        {/* Radius Indicator */}
        <motion.g layout>
          <line
            x1={midX}
            y1={cy + 50}
            x2={midX}
            y2={midY - 14}
            stroke="#f97316"
            strokeWidth={1.5}
            strokeDasharray="5,4"
            opacity={0.6}
          />
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            cx={midX}
            cy={cy + 50}
            r={5}
            fill="#f97316"
            filter="url(#glow)"
          />
          <text
            x={midX + 12}
            y={(cy + 50 + midY - 14) / 2}
            fill="#fb923c"
            fontSize={11}
            fontWeight={700}
            className="font-mono"
          >
            R = {R}m
          </text>
        </motion.g>

        {/* HUD Info */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transform="translate(140, 30)"
        >
          <text
            textAnchor="middle"
            fill="#a78bfa"
            fontSize={16}
            fontWeight={900}
            className="font-sans"
            style={{ letterSpacing: "-0.5px" }}
          >
            Δ = {delta}°
          </text>
          <text
            y={18}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={10}
            fontWeight={700}
            className="font-mono uppercase"
            style={{ letterSpacing: "1.5px" }}
          >
            V = {V} km/h
          </text>
        </motion.g>
      </motion.svg>
    </div>
  );
}

export default function RoadPage({ onDataChange }) {
  const [tab, setTab] = useState("hcurve");
  const [V, setV] = useState(80);
  const [R, setR] = useState(360);
  const [delta, setDelta] = useState(40);
  const [e, setE] = useState(7);
  const [road, setRoad] = useState("NH");

  // Vert curve
  const [g1, setG1] = useState(-3);
  const [g2, setG2] = useState(2);
  const [L, setL] = useState(200);

  // Pavement
  const [msaLog, setMsaLog] = useState(7.5);
  const [cbr, setCbr] = useState(5);
  const [layers, setLayers] = useState([
    { name: "BC", t: 40 },
    { name: "DBM", t: 60 },
    { name: "WMM", t: 250 },
    { name: "GSB", t: 200 },
  ]);

  const hCurve = useMemo(() => analyzeHorizontalCurve({ V, R, delta, e, road }), [V, R, delta, e, road]);
  const vCurve = useMemo(() => analyzeVerticalCurve({ g1, g2, L, V }), [g1, g2, L, V]);
  const pavement = useMemo(() => analyzePavement({ msaLog, cbr, layers }), [msaLog, cbr, layers]);

  useEffect(() => {
    onDataChange?.({
      V,
      R,
      delta,
      e,
      road,
      g1,
      g2,
      L,
      msaLog,
      cbr,
      layers,
      hCurve,
      vCurve,
      pavement,
    });
  }, [V, R, delta, e, road, g1, g2, L, msaLog, cbr, layers, hCurve, vCurve, pavement]);

  return (
    <div className="pb-20 pt-4 px-4 max-w-7xl mx-auto space-y-6">
      <TwoCol
        left={
          <div className="space-y-4">
            <Card>
              <SectionTitle>Road Class & Speed</SectionTitle>
              <div className="grid grid-cols-1 gap-4">
                <Inp
                  label="Design Speed V (km/h)"
                  value={V}
                  onChange={setV}
                  options={[
                    { v: 30, l: "30" },
                    { v: 40, l: "40" },
                    { v: 50, l: "50" },
                    { v: 60, l: "60" },
                    { v: 80, l: "80" },
                    { v: 100, l: "100" },
                    { v: 120, l: "120" },
                  ]}
                />
                <Inp
                  label="Road Classification"
                  value={road}
                  onChange={setRoad}
                  options={[
                    { v: "NH", l: "NH — National Highway" },
                    { v: "SH", l: "SH — State Highway" },
                    { v: "MDR", l: "MDR — Major District Road" },
                    { v: "ODR", l: "ODR — Other District Road" },
                  ]}
                />
              </div>
            </Card>

            <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
              {[
                ["hcurve", "Horizontal Curve"],
                ["vcurve", "Vertical Curve"],
                ["pavement", "Pavement"],
              ].map(([t, lbl]) => (
                <TabBtn
                  key={t}
                  active={tab === t}
                  onClick={() => setTab(t)}
                  className={`flex-1 min-w-[120px] transition-all duration-200 ${
                    tab === t
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                  }`}
                >
                  {lbl}
                </TabBtn>
              ))}
            </div>

            {tab === "hcurve" && (
              <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <SectionTitle>Horizontal Curve (IRC 73)</SectionTitle>
                <div className="space-y-4">
                  <Inp
                    label="Radius R (m)"
                    value={R}
                    onChange={setR}
                    min={10}
                  />
                  <Inp
                    label="Deflection Angle Δ (°)"
                    value={delta}
                    onChange={setDelta}
                    min={1}
                    max={180}
                  />
                  <Inp
                    label="Superelevation e (%)"
                    value={e}
                    onChange={setE}
                    min={1}
                    max={10}
                    step={0.5}
                  />
                </div>
              </Card>
            )}

            {tab === "vcurve" && (
              <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <SectionTitle>Vertical Curve (IRC 52)</SectionTitle>
                <div className="space-y-4">
                  <Inp
                    label="Grade g1 (%)"
                    value={g1}
                    onChange={setG1}
                    min={-10}
                    max={10}
                    step={0.5}
                  />
                  <Inp
                    label="Grade g2 (%)"
                    value={g2}
                    onChange={setG2}
                    min={-10}
                    max={10}
                    step={0.5}
                  />
                  <Inp
                    label="Curve Length L (m)"
                    value={L}
                    onChange={setL}
                    min={20}
                  />
                </div>
              </Card>
            )}

            {tab === "pavement" && (
              <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <SectionTitle>Flexible Pavement (IRC 37)</SectionTitle>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <Inp
                      label="Traffic (log MSA)"
                      value={msaLog}
                      onChange={setMsaLog}
                      options={[
                        { v: 6, l: "1 MSA" },
                        { v: 6.5, l: "3 MSA" },
                        { v: 7, l: "10 MSA" },
                        { v: 7.5, l: "30 MSA" },
                        { v: 8, l: "100 MSA" },
                        { v: 8.5, l: "300 MSA" },
                      ]}
                    />
                    <Inp
                      label="Subgrade CBR (%)"
                      value={cbr}
                      onChange={setCbr}
                      options={[
                        { v: 3, l: "3%" },
                        { v: 4, l: "4%" },
                        { v: 5, l: "5%" },
                        { v: 7, l: "7%" },
                        { v: 10, l: "10%" },
                        { v: 15, l: "15%" },
                      ]}
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                      Layer Thicknesses (mm)
                    </h4>
                    <div className="space-y-3">
                      {layers.map((layer, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl transition-all hover:border-purple-300 hover:bg-white"
                        >
                          <div className="w-12 text-xs font-bold text-slate-400 font-mono">
                            {layer.name}
                          </div>
                          <input
                            type="number"
                            value={layer.t}
                            onChange={(e) =>
                              setLayers((prev) =>
                                prev.map((l, j) =>
                                  j === i
                                    ? {
                                        ...l,
                                        t: parseFloat(e.target.value) || 0,
                                      }
                                    : l
                                )
                              )
                            }
                            className="flex-1 bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 p-0"
                          />
                          <span className="text-[10px] font-bold text-slate-500 font-mono">
                            mm
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        }
        right={
          <div className="space-y-4">

            <Card className="overflow-hidden p-0 border-slate-200">
              <div className="px-5 py-3 border-b border-slate-100 bg-white">
                 <SectionTitle className="m-0">
                   {tab === "hcurve" ? "Alignment Plan" : tab === "vcurve" ? "Vertical Profile" : "Pavement Structure"}
                 </SectionTitle>
              </div>
              <div className="p-4 bg-slate-50/30">
                {tab === "hcurve" && <RoadPlanSketch R={R} delta={delta} V={V} />}
                {tab === "vcurve" && (
                  <div className="w-full aspect-[28/18] bg-white rounded-xl border border-slate-200/50 flex flex-col items-center justify-center p-6">
                    <div className="w-full h-1 bg-slate-100 relative mb-8">
                       <motion.div 
                         initial={{ pathLength: 0 }}
                         animate={{ pathLength: 1 }}
                         className="absolute inset-0 bg-indigo-500"
                         style={{ clipPath: `polygon(0% 50%, 50% 0%, 100% 50%)` }}
                       />
                       <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
                         <path d={`M 0 40 Q 100 ${40 - (vCurve.type === 'SAG' ? -20 : 20)} 200 40`} stroke="#6366f1" strokeWidth="3" fill="none" />
                         <line x1="0" y1="40" x2="100" y2="40" stroke="#cbd5e1" strokeDasharray="4" />
                       </svg>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Vertical Curve Schema</div>
                  </div>
                )}
                {tab === "pavement" && (
                  <div className="w-full aspect-[28/18] bg-white rounded-xl border border-slate-200/50 p-6 flex flex-col gap-1">
                    {layers.map((l, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="w-full rounded-md border border-slate-200 flex items-center justify-between px-4 text-[10px] font-bold uppercase tracking-wider"
                        style={{ 
                          height: `${Math.max(20, (l.t / pavement.total) * 150)}px`,
                          backgroundColor: i === 0 ? '#334155' : i === 1 ? '#475569' : i === 2 ? '#94a3b8' : '#e2e8f0',
                          color: i < 3 ? 'white' : '#64748b'
                        }}
                      >
                        <span>{l.name}</span>
                        <span>{l.t}mm</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <Card className="border-slate-200">
              <StatGrid cols={3}>
                <StatBox
                  label="Min Radius"
                  value={hCurve.Rmin}
                  unit="m"
                  color="text-purple-400"
                />
                <StatBox
                  label="Curve L"
                  value={hCurve.L}
                  unit="m"
                  color="text-sky-400"
                />
                <StatBox
                  label="Sight Dist"
                  value={hCurve.SSD}
                  unit="m"
                  color="text-emerald-400"
                />
              </StatGrid>
            </Card>

            <Card className={`border-l-4 ${hCurve.passRadius ? 'border-emerald-500/50' : 'border-rose-500/50'}`}>
              <PassFail
                pass={hCurve.passRadius}
                code="IRC 73 — Minimum Radius Check"
              />
              <div className="space-y-2 mt-4 text-slate-600">
                <ResultRow label="Provided radius R" value={R} unit="m" />
                <ResultRow
                  label="Minimum Rmin"
                  value={hCurve.Rmin}
                  unit="m"
                  highlight
                />
                <Divider />
                <ResultRow
                  label="Transition length Ls"
                  value={hCurve.Ls}
                  unit="m"
                />
                <ResultRow label="Curve length Lc" value={hCurve.L} unit="m" />
                <ResultRow label="Superelevation e" value={`${e}%`} />
              </div>
            </Card>

            {tab === "vcurve" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Card>
                  <StatGrid cols={3}>
                    <StatBox
                      label="Algebraic diff A"
                      value={Math.abs(g2 - g1).toFixed(1)}
                      unit="%"
                      color="text-amber-400"
                    />
                    <StatBox label="K-value" value={vCurve.K} color="text-sky-400" />
                    <StatBox
                      label="Min L req."
                      value={vCurve.Lmin}
                      unit="m"
                      color="text-purple-400"
                    />
                  </StatGrid>
                </Card>
                <Card className={`border-l-4 ${vCurve.pass ? 'border-emerald-500/50' : 'border-rose-500/50'}`}>
                  <PassFail
                    pass={vCurve.pass}
                    code="IRC 52 — Vertical Curve Design"
                  />
                  <div className="space-y-2 mt-4 text-slate-600">
                    <ResultRow label="Provided L" value={L} unit="m" />
                    <ResultRow
                      label="Min L (sight)"
                      value={vCurve.Lmin}
                      unit="m"
                      highlight
                    />
                    <ResultRow label="K-value" value={vCurve.K} />
                    <ResultRow label="Curve type" value={vCurve.type} />
                  </div>
                </Card>
              </div>
            )}

            {tab === "pavement" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Card>
                  <SectionTitle>Pavement Layer Summary</SectionTitle>
                  <div className="space-y-2 text-slate-600">
                    {layers.map((layer, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0"
                      >
                        <span className="text-sm font-medium text-slate-500">
                          {layer.name}
                        </span>
                        <span className="text-sm font-bold text-slate-700 font-mono">
                          {layer.t} mm
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 mt-2 border-t border-slate-100">
                      <span className="text-sm font-bold text-slate-700">
                        Total Provided
                      </span>
                      <span className="text-base font-black text-indigo-600 font-mono">
                        {pavement.total} mm
                      </span>
                    </div>
                  </div>
                </Card>
                <Card className={`border-l-4 ${pavement.pass ? 'border-emerald-500/50' : 'border-rose-500/50'}`}>
                  <PassFail
                    pass={pavement.pass}
                    code="IRC 37:2018 — Pavement Thickness"
                  />
                  <div className="space-y-4 mt-4 text-slate-600">
                    <ResultRow
                      label="Required total thickness"
                      value={pavement.required}
                      unit="mm"
                    />
                    <ResultRow
                      label="Provided thickness"
                      value={pavement.total}
                      unit="mm"
                      highlight
                    />
                    <UtilBar
                      pct={Math.min(
                        (pavement.required / pavement.total) * 100,
                        100
                      ).toFixed(1)}
                      label="Pavement Utilization"
                    />
                  </div>
                </Card>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}
