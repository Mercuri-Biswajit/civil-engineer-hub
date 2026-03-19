import { useState, useEffect, useMemo } from 'react'
import { Card, TwoCol, StatGrid, StatBox, UtilBar, PassFail, Inp, SectionTitle, InfoBox, ResultRow, Divider } from '@/components/StructureDesign/ui'
import { analyzeBridge } from '@/utils/StructureDesign/engines/roadEngine'
import { motion } from 'framer-motion'

function BridgeElevation({ span, vcClass }) {
  const lx = 20, rx = 260, bW = rx - lx, bY = 90
  const piers = span > 30 ? [lx + bW / 3, lx + 2 * bW / 3] : []
  
  return (
    <div className="relative w-full aspect-[1.75/1] bg-white rounded-xl overflow-hidden border border-slate-200 group">
      <svg viewBox="0 0 280 160" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="bridgeSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
          <linearGradient id="bridgeWater" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="concreteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>

        {/* Sky / Background */}
        <rect width="280" height="160" fill="url(#bridgeSky)" />

        {/* Water Area */}
        <rect x={lx} y={bY + 25} width={bW} height={45} fill="url(#bridgeWater)" className="animate-pulse" />
        {[0, 1, 2, 3, 4, 5].map(i => (
          <motion.path
            key={i}
            d={`M ${lx + i * 45} ${bY + 40} Q ${lx + 22 + i * 45} ${bY + 35} ${lx + 45 + i * 45} ${bY + 40}`}
            stroke="#38bdf8"
            strokeWidth="0.5"
            strokeOpacity="0.4"
            fill="none"
            animate={{
              d: [
                `M ${lx + i * 45} ${bY + 40} Q ${lx + 22 + i * 45} ${bY + 35} ${lx + 45 + i * 45} ${bY + 40}`,
                `M ${lx + i * 45} ${bY + 42} Q ${lx + 22 + i * 45} ${bY + 37} ${lx + 45 + i * 45} ${bY + 42}`,
                `M ${lx + i * 45} ${bY + 40} Q ${lx + 22 + i * 45} ${bY + 35} ${lx + 45 + i * 45} ${bY + 40}`
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}

        {/* Piers */}
        {piers.map(px => (
          <g key={px}>
            <rect x={px - 8} y={bY + 4} width={16} height={55} fill="url(#concreteGrad)" className="filter drop-shadow-md" rx="2" />
            <rect x={px - 10} y={bY} width={20} height={6} fill="#64748b" rx="1" />
          </g>
        ))}

        {/* Abutments */}
        <g>
          <rect x={lx - 15} y={bY - 15} width={18} height={55} fill="url(#concreteGrad)" rx="2" />
          <rect x={rx - 3} y={bY - 15} width={18} height={55} fill="url(#concreteGrad)" rx="2" />
        </g>

        {/* Deck */}
        <rect x={lx} y={bY - 8} width={bW} height={12} fill="#64748b" stroke="#94a3b8" strokeWidth="1" rx="2" />
        <rect x={lx} y={bY - 12} width={bW} height={4} fill="#475569" />

        {/* Class vehicle indicator */}
        <motion.g
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          key={vcClass}
        >
          <rect x={lx + bW / 2 - 35} y={bY - 35} width={70} height={18} fill="#f59e0b" rx="4" className="filter drop-shadow-lg" />
          <text x={lx + bW / 2} y={bY - 23} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" className="uppercase tracking-wider">
            IRC CLASS {vcClass}
          </text>
        </motion.g>

        {/* Dimension Line */}
        <g className="text-slate-400">
          <line x1={lx} y1={bY + 65} x2={rx} y2={bY + 65} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1={lx} y1={bY + 60} x2={lx} y2={bY + 70} stroke="currentColor" strokeWidth="1" />
          <line x1={rx} y1={bY + 60} x2={rx} y2={bY + 70} stroke="currentColor" strokeWidth="1" />
          <text x={(lx + rx) / 2} y={bY + 82} textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="600" className="font-mono">
            {span}m Span
          </text>
        </g>
      </svg>

      {/* HUD Info */}
      <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 pointer-events-none">
        <div className="px-2 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-bold rounded-md border border-sky-100 backdrop-blur-md uppercase tracking-tighter">
          BRIDGE LOADS
        </div>
        <div className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-medium rounded-md border border-slate-200">
          IRC:6-2017 STANDARDS
        </div>
      </div>
    </div>
  )
}

export default function BridgePage({ onDataChange }) {
  const [span, setSpan] = useState(20)
  const [vc, setVc] = useState('AA')
  const [lanes, setLanes] = useState(2)
  const [wDL, setWDL] = useState(12)
  const [fck, setFck] = useState(30)
  const [fy, setFy] = useState(500)
  const [b, setB] = useState(800)
  const [d, setD] = useState(1200)

  const result = useMemo(
    () => analyzeBridge({ span, vc, lanes, wDL, fck, fy, b, d }),
    [span, vc, lanes, wDL, fck, fy, b, d]
  )

  useEffect(() => {
    onDataChange?.({ span, vc, lanes, wDL, fck, fy, b, d, result })
  }, [span, vc, lanes, wDL, fck, fy, b, d, result])

  return (
    <div className="pb-20 pt-4 px-4 max-w-7xl mx-auto space-y-6">
      <TwoCol
        left={
          <div className="flex flex-col gap-6">
            <Card>
              <SectionTitle>Bridge Geometry</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Inp label="Effective Span (m)" value={span} onChange={setSpan} min={2} />
                <Inp label="Number of Lanes" value={lanes} onChange={setLanes} 
                  options={[
                    { v: 1, l: '1 Lane' }, 
                    { v: 2, l: '2 Lanes' }, 
                    { v: 3, l: '3 Lanes' }, 
                    { v: 4, l: '4 Lanes' }
                  ]} 
                />
              </div>
            </Card>

            <Card>
              <SectionTitle>IRC Vehicle Classification (IRC 6)</SectionTitle>
              <div className="flex flex-col gap-4">
                <Inp label="Vehicle Class" value={vc} onChange={setVc}
                  options={[
                    { v: 'AA', l: 'Class AA — 70T tracked / 40T wheeled' },
                    { v: 'A', l: 'Class A — 55T train' },
                    { v: 'B', l: 'Class B — 45T train' },
                    { v: '70R', l: 'Class 70R — 70T tracked' },
                  ]} 
                />
                <Inp label="Dead Load wDL (kN/m)" value={wDL} onChange={setWDL} min={5} step={0.5} />
              </div>
            </Card>

            <Card>
              <SectionTitle>Girder Section</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Inp label="Width b (mm)" value={b} onChange={setB} min={200} step={50} />
                <Inp label="Depth d (mm)" value={d} onChange={setD} min={400} step={50} />
              </div>
            </Card>

            <Card>
              <SectionTitle>Material Grade</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Inp label="Concrete fck (MPa)" value={fck} onChange={setFck}
                  options={[{ v: 25, l: 'M25' }, { v: 30, l: 'M30' }, { v: 35, l: 'M35' }, { v: 40, l: 'M40' }]} />
                <Inp label="Steel fy (MPa)" value={fy} onChange={setFy}
                  options={[{ v: 415, l: 'Fe415' }, { v: 500, l: 'Fe500' }, { v: 550, l: 'Fe550' }]} />
              </div>
            </Card>
          </div>
        }

        right={
          <div className="flex flex-col gap-6">

            <Card className="overflow-hidden p-0 border-slate-200">
              <div className="px-5 py-3 border-b border-slate-100 bg-white">
                 <SectionTitle className="m-0">Bridge Elevation</SectionTitle>
              </div>
              <div className="p-4">
                <BridgeElevation span={span} vcClass={vc} />
              </div>
            </Card>

            <Card>
              <StatGrid cols={3}>
                <StatBox label="Impact Factor" value={`${result.impactPct}%`} color="#d97706" />
                <StatBox label="Total Mdl" value={result.Mdl} unit="kNm" color="#2563eb" />
                <StatBox label="Total Mtotal" value={result.Mtotal} unit="kNm" color="#4f46e5" />
              </StatGrid>
            </Card>

            <Card className="border-l-4 border-purple-500/50">
              <SectionTitle>Load Effects (IRC 6)</SectionTitle>
              <div className="space-y-1">
                <ResultRow label="Dead Load Moment Mdl" value={result.Mdl} unit="kNm" />
                <ResultRow label="Live Load Moment Mll" value={result.Mll} unit="kNm" />
                <ResultRow label="Impact Factor If" value={`${result.impactPct}%`} />
                <ResultRow label="Impact Moment Mimp" value={result.Mimp} unit="kNm" />
                <Divider />
                <ResultRow label="Design Moment Mtotal" value={result.Mtotal} unit="kNm" highlight />
                <ResultRow label="Design Shear Vtotal" value={result.Vtotal} unit="kN" highlight />
              </div>
            </Card>

            <Card className={`border-l-4 ${result.passM ? 'border-emerald-500/50' : 'border-rose-500/50'}`}>
              <PassFail pass={result.passM} code="IS 456:2000 — Girder Flexure Design" />
              <div className="space-y-3 mt-4">
                <ResultRow label="Applied Mu" value={result.Mtotal} unit="kNm" />
                <ResultRow label="Capacity Mu,lim" value={result.Mulim} unit="kNm" highlight />
                <UtilBar pct={result.utilM} label="Moment Utilization" />
                <Divider />
                <ResultRow label="Ast required" value={result.Ast_req} unit="mm²" />
                <ResultRow label={`${result.nBars}⌀${result.barDia} bars`} value={result.Ast_prov} unit="mm²" highlight />
              </div>
            </Card>

            <Card className={`border-l-4 ${result.passV ? 'border-emerald-500/50' : 'border-rose-500/50'}`}>
              <PassFail pass={result.passV} code="IS 456:2000 — Girder Shear Design" />
              <div className="space-y-3 mt-4">
                <ResultRow label="Design shear Vd" value={result.Vtotal} unit="kN" />
                <ResultRow label="τv" value={result.tau_v} unit="N/mm²" />
                <ResultRow label="τc" value={result.tau_c} unit="N/mm²" highlight />
                <UtilBar pct={result.utilV} label="Shear Utilization" color="#f59e0b" />
                <Divider />
                {result.needLinks ? (
                  <InfoBox color="#f59e0b" lightColor="#f59e0b1a">
                    Shear links required: ⌀{result.stirrupDia} @ <span className="font-bold text-amber-500">{result.stirrupSpc} mm</span>
                  </InfoBox>
                ) : (
                  <InfoBox color="#10b981" lightColor="#10b9811a">
                    Nominal links only: ⌀{result.stirrupDia} @ <span className="font-bold text-emerald-500">{result.stirrupSpc} mm</span>
                  </InfoBox>
                )}
              </div>
            </Card>
          </div>
        }
      />
    </div>
  )
}

