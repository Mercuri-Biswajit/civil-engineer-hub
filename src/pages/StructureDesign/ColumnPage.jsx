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
import { analyzeColumn } from "@/utils/StructureDesign/engines/structuralEngine.js";


function ColumnSketch({ b, d, material, P, Mx, My, Le }) {
  const fill = material === "concrete" ? "url(#concrete)" : "url(#steel)";
  const stroke = material === "concrete" ? "#475569" : "#94a3b8"; // slate-600, slate-400

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-12 p-4">
      {/* Elevation View */}
      <div className="text-center group">
        <p className="text-[10px] text-slate-400 font-mono mb-4 tracking-[0.2em] font-black uppercase">
          Elevation
        </p>
        <svg viewBox="0 0 160 260" className="w-full max-w-[160px] h-auto overflow-visible mx-auto">
          {/* Main Column Body */}
          <motion.rect
            layout
            initial={{ height: 0 }}
            animate={{ height: 200 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            x={55}
            y={30}
            width={50}
            height={200}
            fill={fill}
            stroke={stroke}
            strokeWidth={2.5}
            rx={material === "concrete" ? 2 : 0}
            filter="url(#shadow)"
          />

          {/* Rebar visualization for concrete */}
          <AnimatePresence>
            {material === "concrete" && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.8 }}
              >
                {/* Vertical bars */}
                <motion.line
                  x1={62}
                  y1={30}
                  x2={62}
                  y2={230}
                  stroke="#4338ca" // indigo-700
                  strokeWidth={2}
                  opacity={0.6}
                  strokeDasharray="3,3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                />
                <motion.line
                  x1={98}
                  y1={30}
                  x2={98}
                  y2={230}
                  stroke="#4338ca"
                  strokeWidth={2}
                  opacity={0.6}
                  strokeDasharray="3,3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.1, duration: 1 }}
                />
                {/* Ties/Stirrups */}
                {[50, 80, 110, 140, 170, 200].map((ty, i) => (
                  <motion.line
                    key={ty}
                    x1={55}
                    y1={ty}
                    x2={105}
                    y2={ty}
                    stroke="#475569" // slate-600
                    strokeWidth={1.5}
                    opacity={0.4}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.5 + i * 0.1, duration: 0.5 }}
                  />
                ))}
              </motion.g>
            )}
          </AnimatePresence>

          {/* Steel section details */}
          <AnimatePresence>
            {material === "steel" && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1 }}
              >
                <rect
                  x={55}
                  y={30}
                  width={50}
                  height={16}
                  fill={stroke}
                  opacity={0.8}
                />
                <rect
                  x={55}
                  y={214}
                  width={50}
                  height={16}
                  fill={stroke}
                  opacity={0.8}
                />
                <rect
                  x={76}
                  y={46}
                  width={10}
                  height={168}
                  fill={stroke}
                  opacity={0.4}
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Load Vector */}
          <motion.g
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: [0, -4, 0] }}
            transition={{
              opacity: { delay: 0.5, duration: 0.5 },
              y: { repeat: Infinity, duration: 2, delay: 1 },
            }}
          >
            <line
              x1={80}
              y1={0}
              x2={80}
              y2={28}
              stroke="#ef4444"
              strokeWidth={4}
              strokeLinecap="round"
            />
            <polygon points="80,30 72,16 88,16" fill="#ef4444" />
            <text
              x={92}
              y={12}
              fill="#ef4444"
              fontSize={12}
              fontWeight={800}
              className="font-mono"
            >
              {P} kN
            </text>
          </motion.g>

          {/* Moment Arrow (Elevation) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: Mx > 0 ? 1 : 0 }}
            transition={{ delay: 1.5 }}
          >
            <motion.path
              d="M 115 130 Q 140 115 125 100"
              stroke="#f59e0b"
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            />
            <motion.polygon
              points="125,98 116,108 128,110"
              fill="#f59e0b"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            />
            <motion.text
              x={120}
              y={150}
              fill="#f59e0b"
              fontSize={11}
              fontWeight={800}
              className="font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            >
              Mx={Mx}
            </motion.text>
          </motion.g>

          {/* Dimension Label */}
          <motion.line
            x1={20}
            y1={30}
            x2={20}
            y2={230}
            stroke="#94a3b8" // slate-400
            strokeWidth={1.5}
            strokeDasharray="4,4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
          <motion.text
            x={14}
            y={130}
            fill="#475569" // slate-600
            fontSize={11}
            fontWeight={700}
            className="font-mono"
            transform="rotate(-90,14,130)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Le = {Le} m
          </motion.text>

          <motion.text
            x={80}
            y={252}
            textAnchor="middle"
            fill="#475569" // slate-600
            fontSize={12}
            fontWeight={800}
            className="font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {b}×{d} mm
          </motion.text>
        </svg>
      </div>

      {/* Plan View */}
      <div className="text-center group">
        <p className="text-[10px] text-slate-400 font-mono mb-4 tracking-[0.2em] font-black uppercase">
          Plan View
        </p>
        <svg viewBox="0 0 120 130" className="w-full max-w-[120px] h-auto overflow-visible mx-auto">
          <motion.rect
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            x={10}
            y={10}
            width={100}
            height={100}
            fill={fill}
            stroke={stroke}
            strokeWidth={2.5}
            rx={material === "concrete" ? 4 : 0}
            filter="url(#shadow)"
          />

          {/* Concrete Reinforcing Bars (Plan) */}
          <AnimatePresence>
            {material === "concrete" && (
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ delay: 0.5 }}
              >
                {[
                  [22, 22],
                  [98, 22],
                  [22, 98],
                  [98, 98],
                  [60, 22],
                  [60, 98],
                  [22, 60],
                  [98, 60],
                ].map(([cx, cy], i) => (
                  <motion.circle
                    key={i}
                    layout
                    cx={cx}
                    cy={cy}
                    r={4.5}
                    fill="#4f46e5" // indigo-600
                    filter="url(#glow)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.05 }}
                  />
                ))}
                {/* Internal tie */}
                <motion.rect
                  x={22}
                  y={22}
                  width={76}
                  height={76}
                  fill="none"
                  stroke="#475569" // slate-600
                  strokeWidth={1}
                  opacity={0.4}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.2, duration: 1 }}
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Center Lines */}
          <motion.line
            x1={0}
            y1={60}
            x2={120}
            y2={60}
            stroke="#94a3b8" // slate-400
            strokeWidth={1}
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          />
          <motion.line
            x1={60}
            y1={0}
            x2={60}
            y2={120}
            stroke="#94a3b8" // slate-400
            strokeWidth={1}
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          />

          {/* Moments (Plan) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: Mx > 0 ? 1 : 0 }}
            transition={{ delay: 1.5 }}
          >
            <motion.path
              d="M 115 60 Q 125 50 115 40"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            />
            <motion.polygon
              points="115,38 108,46 120,47"
              fill="#f59e0b"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1 }}
            />
            <motion.text
              x={122}
              y={54}
              fill="#f59e0b"
              fontSize={9}
              fontWeight={800}
              className="font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1 }}
            >
              Mx
            </motion.text>
          </motion.g>

          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: My > 0 ? 1 : 0 }}
            transition={{ delay: 1.5 }}
          >
            <motion.path
              d="M 60 5 Q 72 1 76 9"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.7, duration: 0.6 }}
            />
            <motion.polygon
              points="76,10 66,7 70,15"
              fill="#8b5cf6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.3 }}
            />
            <motion.text
              x={78}
              y={6}
              fill="#8b5cf6"
              fontSize={9}
              fontWeight={800}
              className="font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.3 }}
            >
              My
            </motion.text>
          </motion.g>

          <motion.text
            x={60}
            y={124}
            textAnchor="middle"
            fill="#475569" // slate-600
            fontSize={10}
            fontWeight={700}
            className="font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {b} mm
          </motion.text>
        </svg>
      </div>
    </div>
  );
}


export default function ColumnPage({ onDataChange }) {
  const [P, setP] = useState(800);
  const [Mx, setMx] = useState(60);
  const [My, setMy] = useState(30);
  const [b, setB] = useState(400);
  const [d, setD] = useState(400);
  const [Le, setLe] = useState(3.5);
  const [material, setMaterial] = useState("concrete");
  const [fck, setFck] = useState(25);
  const [fy, setFy] = useState(415);
  const [steelPct, setSteelPct] = useState(2);

  const result = analyzeColumn({
    P,
    Mx,
    My,
    b,
    d,
    Le,
    material,
    fck,
    fy,
    steelPct,
  });

  useEffect(() => {
    onDataChange?.({ P, Mx, My, b, d, Le, material, fck, fy, steelPct, result });
  }, [P, Mx, My, b, d, Le, material, fck, fy, steelPct]);


  return (
    <div className="pb-20 pt-4 px-4 max-w-7xl mx-auto space-y-6">
      <TwoCol
        left={
          <div className="space-y-6">
            <Card className="p-6">
              <SectionTitle>Material System</SectionTitle>
              <div className="flex gap-3 mt-4">
                <TabBtn
                  active={material === "concrete"}
                  onClick={() => setMaterial("concrete")}
                  className="flex-1"
                >
                  Concrete
                </TabBtn>
                <TabBtn
                  active={material === "steel"}
                  onClick={() => setMaterial("steel")}
                  className="flex-1 transition-all duration-300 active:scale-95"
                  color="#f59e0b"
                >
                  Steel
                </TabBtn>
              </div>
            </Card>

            <Card className="p-6">
              <SectionTitle>Applied Loading</SectionTitle>
              <div className="space-y-4 mt-6">
                <Inp
                  label="Axial Load P (kN)"
                  value={P}
                  onChange={setP}
                  min={0}
                  className="bg-slate-50/50"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </Card>

            <Card className="p-6">
              <SectionTitle>Section Geometry</SectionTitle>
              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <Inp
                    label="Width b (mm)"
                    value={b}
                    onChange={setB}
                    min={100}
                  />
                  <Inp
                    label="Depth d (mm)"
                    value={d}
                    onChange={setD}
                    min={100}
                  />
                </div>
                <Inp
                  label="Effective Length Le (m)"
                  value={Le}
                  onChange={setLe}
                  min={0.5}
                  step={0.1}
                />
              </div>
            </Card>

            {material === "concrete" && (
              <Card className="p-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-12 -mt-12" />
                <SectionTitle>Material Grades</SectionTitle>
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
                    label="Steel Reinforcement"
                    value={fy}
                    onChange={setFy}
                    options={[
                      { v: 250, l: "Fe250" },
                      { v: 415, l: "Fe415" },
                      { v: 500, l: "Fe500" },
                      { v: 550, l: "Fe550" },
                    ]}
                  />
                  <Inp
                    label="Reinforcement Percentage"
                    value={steelPct}
                    onChange={setSteelPct}
                    options={[
                      { v: 0.8, l: "0.8%" },
                      { v: 1, l: "1.0%" },
                      { v: 1.5, l: "1.5%" },
                      { v: 2, l: "2.0%" },
                      { v: 2.5, l: "2.5%" },
                      { v: 3, l: "3.0%" },
                      { v: 4, l: "4.0%" },
                      { v: 5, l: "5.0%" },
                      { v: 6, l: "6.0%" },
                    ]}
                  />
                </div>
              </Card>
            )}
          </div>
        }
        right={
          <div className="space-y-6">

            <Card className="p-0 overflow-hidden border-slate-200">
              <div className="bg-white p-3 border-b border-slate-100 flex items-center justify-between">
                <SectionTitle className="!mt-0 !mb-0 text-sm">
                  Structural Visualization
                </SectionTitle>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75" />
                </div>
              </div>
              <div className="p-8 bg-white">
                <ColumnSketch
                  b={b}
                  d={d}
                  material={material}
                  P={P}
                  Mx={Mx}
                  My={My}
                  Le={Le}
                />
              </div>
            </Card>

            <Card className="p-6">
              <SectionTitle>Section Status</SectionTitle>
              <div className="mt-4">
                <StatGrid cols={3}>
                  <StatBox
                    label="Axial Capacity"
                    value={result.Pu_cap}
                    unit="kN"
                    color="#3b82f6"
                  />
                  <StatBox
                    label="Slenderness (λ)"
                    value={result.lx}
                    color={result.isSlender ? "#f43f5e" : "#10b981"}
                  />
                  <StatBox
                    label="Column Type"
                    value={result.isSlender ? "SLENDER" : "SHORT"}
                    color={result.isSlender ? "#f59e0b" : "#10b981"}
                  />
                </StatGrid>
              </div>
            </Card>

            <Card
              className="p-6 relative overflow-hidden"
              accentColor={result.pass ? "#10b981" : "#f43f5e"}
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 -mr-16 -mt-16 ${
                  result.pass ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              <PassFail
                pass={P <= parseFloat(result.Pu_cap)}
                code={`${result.code} Cl. 39.3 — Axial Capacity`}
              />
              <div className="mt-6 space-y-6">
                <StatGrid cols={2}>
                  <StatBox
                    label="Applied Axial P"
                    value={P}
                    unit="kN"
                    color="#64748b" // slate-500
                  />
                  <StatBox
                    label="Ultimate Capacity Pu"
                    value={result.Pu_cap}
                    unit="kN"
                    color={result.pass ? "#10b981" : "#f43f5e"}
                  />
                </StatGrid>
                <UtilBar
                  pct={((P / parseFloat(result.Pu_cap)) * 100).toFixed(1)}
                  label="Axial Capacity Utilization"
                />
              </div>
            </Card>

            {material === "concrete" && (
              <Card
                className="p-6"
                accentColor={result.biaxialPass ? "#10b981" : "#f43f5e"}
              >
                <PassFail
                  pass={result.biaxialPass}
                  code={`${result.code} Cl. 39.6 — Biaxial Bending Interaction`}
                />
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ResultRow
                      label="Design Mx (incl. emin)"
                      value={result.Mx_design}
                      unit="kNm"
                    />
                    <ResultRow
                      label="Design My (incl. emin)"
                      value={result.My_design}
                      unit="kNm"
                    />
                  </div>
                  <Divider />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ResultRow
                      label="Capacity Mux1"
                      value={result.Mux1}
                      unit="kNm"
                    />
                    <ResultRow
                      label="Capacity Muy1"
                      value={result.Muy1}
                      unit="kNm"
                    />
                  </div>
                  <Divider />
                  <ResultRow
                    label="Exponent αn"
                    value={result.alphaN}
                    className="opacity-70"
                  />
                  <ResultRow
                    label="Interaction (IR ≤ 1.0)"
                    value={result.biaxial_lhs}
                    highlight
                  />
                  <UtilBar
                    pct={(parseFloat(result.biaxial_lhs) * 100).toFixed(1)}
                    label="Biaxial Interaction Ratio"
                  />
                </div>
              </Card>
            )}

            {material === "concrete" && (
              <Card className="p-6">
                <SectionTitle>Geometric Constraints</SectionTitle>
                <p className="text-[10px] text-slate-500 font-mono mb-4">
                  IS 456 Cl. 25.4 — Minimum Eccentricity
                </p>
                <div className="space-y-3">
                  <ResultRow label="Eccentricity emin_x" value={`${result.emin_x} mm`} />
                  <ResultRow label="Eccentricity emin_y" value={`${result.emin_y} mm`} />
                  <Divider className="opacity-30" />
                  <div className="grid grid-cols-2 gap-4">
                    <ResultRow label="Slenderness λx" value={result.lx} />
                    <ResultRow label="Slenderness λy" value={result.ly} />
                  </div>
                  {result.isSlender && (
                    <div className="mt-4">
                      <InfoBox color="#ef4444" lightColor="rgba(239, 68, 68, 0.1)">
                        <span className="font-bold">Slender Column Alert:</span> λ ={" "}
                        {result.lambda} exceeds limits. Additional second-order moments
                        must be applied per IS 456 Cl. 39.7.
                      </InfoBox>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <Card
              className="p-6 border-b-4"
              accentColor={result.pass ? "#10b981" : "#f43f5e"}
            >
              <PassFail
                pass={result.pass}
                code={`${result.code} — Final Design Statement`}
              />
              {material === "concrete" && (
                <div className="mt-6">
                  <InfoBox color="#3b82f6" lightColor="rgba(59, 130, 246, 0.1)">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs opacity-70">Reinforcement Details</span>
                      <span className="text-sm font-medium">
                        Total Area: <strong className="text-blue-400">{result.Asc} mm²</strong>
                      </span>
                      <span className="text-[11px] opacity-60">
                        ({result.steelPct}% of Ag) | Range: {(b * d * 0.008).toFixed(0)} –{" "}
                        {(b * d * 0.06).toFixed(0)} mm²
                      </span>
                    </div>
                  </InfoBox>
                </div>
              )}
            </Card>
          </div>
        }
      />
    </div>
  );
}


