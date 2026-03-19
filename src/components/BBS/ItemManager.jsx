// src/components/ItemManager.jsx
// ALL dimensions in METRES. ALL spacings in mm.

import React, { useState } from "react";
import { Card, Field, DiaSelect, Button, Badge, FormSection } from "@/components/BBS/ui.jsx";
import { DrawingFooting } from "@/components/BBS/DrawingFooting.jsx";
import { DrawingColumn } from "@/components/BBS/DrawingColumn.jsx";
import { DrawingBeam } from "@/components/BBS/DrawingBeam.jsx";
import { DrawingSlab } from "@/components/BBS/DrawingSlab.jsx";
import { DrawingStaircase } from "@/components/BBS/DrawingStaircase.jsx";
import { DrawingLintel } from "@/components/BBS/DrawingLintel.jsx";
import { DrawingRaft } from "@/components/BBS/DrawingRaft.jsx";
import { DrawingPileCap } from "@/components/BBS/DrawingPileCap.jsx";

export const DEFAULTS = {
  footing: {
    label: "Footing F1",
    count: 1,
    L: "1.5",
    B: "1.5",
    D: "0.45",
    mainDia: "12",
    distDia: "12",
    spacing: "150",
    hasStub: false,
    stubH: "0.45",
    colDia: "16",
    colNos: "4",
  },
  column: {
    label: "Column C1",
    count: 1,
    H: "3",
    B: "0.3",
    D: "0.3",
    mainDia: "16",
    mainNos: "4",
    tieDia: "8",
    tieSpacing: "150",
  },
  plinthBeam: {
    label: "Plinth Beam PB1",
    count: 1,
    L: "4",
    B: "0.23",
    D: "0.45",
    botDia: "16",
    botNos: "3",
    topDia: "12",
    topNos: "2",
    exTopDia: "12",
    exTopNos: "1",
    stirDia: "8",
    stirSpacing: "150",
    hasTorsion: false,
    torsDia: "12",
    torsNos: "0",
  },
  wallBeam: {
    label: "Wall Beam WB1",
    count: 1,
    L: "4",
    B: "0.23",
    D: "0.35",
    botDia: "12",
    botNos: "3",
    topDia: "10",
    topNos: "2",
    exTopDia: "10",
    exTopNos: "0",
    stirDia: "8",
    stirSpacing: "200",
    hasTorsion: false,
    torsDia: "10",
    torsNos: "0",
  },
  slab: {
    label: "Slab S1",
    count: 1,
    L: "4",
    B: "3",
    D: "0.125",
    mainDia: "10",
    distDia: "8",
    mainSp: "150",
    distSp: "200",
    topDia: "8",
    topSp: "150",
    slabType: "2-way",
  },
  staircase: {
    label: "Staircase ST1",
    count: 1,
    flightLen: "3.5",
    width: "1.2",
    waistThick: "0.15",
    mainDia: "10",
    mainSp: "150",
    distDia: "8",
    distSp: "200",
  },
  lintel: {
    label: "Lintel L1",
    count: 1,
    L: "1.5",
    B: "0.23",
    D: "0.15",
    botDia: "12",
    botNos: "2",
    topDia: "10",
    topNos: "2",
    stirDia: "8",
    stirSpacing: "150",
    hasChajja: false,
    chajjaL: "0.6",
    chajjaD: "0.1",
    chajjaDia: "8",
    chajjaSp: "150",
  },
  raft: {
    label: "Raft RF1",
    count: 1,
    L: "8",
    B: "6",
    D: "0.3",
    mainDia: "12",
    distDia: "12",
    mainSp: "150",
    distSp: "150",
    hasCrank: true,
    crankDia: "12",
    crankSp: "150",
  },
  pileCap: {
    label: "Pile Cap PC1",
    count: 1,
    L: "2",
    B: "2",
    D: "0.6",
    mainDia: "16",
    distDia: "16",
    spacing: "150",
    nPiles: "4",
    pileDia: "300",
  },
};

// FIX #6 — use crypto.randomUUID() so IDs are stable even in React 18 StrictMode
// double-invocation, avoiding the stale module-level counter problem.
const genId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const newItem = (type) => ({ id: genId(), ...DEFAULTS[type] });

const MF = ({ label, value, onChange }) => (
  <Field
    label={label}
    value={value}
    onChange={onChange}
    unit="m"
    step="0.01"
    min="0"
  />
);
const MMF = ({ label, value, onChange }) => (
  <Field
    label={label}
    value={value}
    onChange={onChange}
    unit="mm"
    step="10"
    min="50"
  />
);
const NF = ({ label, value, onChange }) => (
  <Field
    label={label}
    value={value}
    onChange={onChange}
    unit="nos"
    step="1"
    min="1"
  />
);

// ─── FORMS ────────────────────────────────────────────────────────────────────

function FootingForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div className="flex flex-col gap-6">
      <FormSection title="Geometry" icon="📐">
        <MF label="Length L" value={item.L} onChange={u("L")} />
        <MF label="Width B" value={item.B} onChange={u("B")} />
        <MF label="Depth D" value={item.D} onChange={u("D")} />
      </FormSection>

      <FormSection title="Reinforcement" icon="🔩">
        <DiaSelect
          label="Main Bar Dia"
          value={item.mainDia}
          onChange={u("mainDia")}
        />
        <MMF label="Spacing" value={item.spacing} onChange={u("spacing")} />
        <DiaSelect
          label="Dist Bar Dia"
          value={item.distDia}
          onChange={u("distDia")}
        />
      </FormSection>

      <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-lg transition-all hover:bg-white hover:border-primary-100">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="w-5 h-5 rounded-md border-slate-300 text-primary-600 focus:ring-primary-500 transition-all"
            checked={!!item.hasStub}
            onChange={(e) => onChange("hasStub", e.target.checked)}
          />
          <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">🏗 Include Stub Column / Pedestal</span>
        </label>

        {item.hasStub && (
          <div className="mt-4 pt-4 border-t border-slate-200/60 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-amber-50 text-[10px] font-bold text-amber-700 px-3 py-2 rounded-lg border border-amber-100 mb-4 flex items-center gap-2">
              <span className="text-base text-amber-500">📏</span>
              <span>Starter bars: <b>40d footing</b> + stub height + <b>40d lap</b>.</span>
            </div>
            <FormSection>
              <MF
                label="Stub Height"
                value={item.stubH}
                onChange={u("stubH")}
              />
              <NF
                label="Bar Count"
                value={item.colNos}
                onChange={u("colNos")}
              />
              <DiaSelect
                label="Bar Dia"
                value={item.colDia}
                onChange={u("colDia")}
              />
            </FormSection>
          </div>
        )}
      </div>
    </div>
  );
}

function ColumnForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div>
      <FormSection title="Geometry" icon="📏">
        <MF label="Storey Height H" value={item.H} onChange={u("H")} />
        <MF label="Width B" value={item.B} onChange={u("B")} />
        <MF label="Depth D" value={item.D} onChange={u("D")} />
      </FormSection>

      <FormSection title="Reinforcement" icon="🔩">
        <NF
          label="Main Bars Count"
          value={item.mainNos}
          onChange={u("mainNos")}
        />
        <DiaSelect
          label="Main Bar Dia"
          value={item.mainDia}
          onChange={u("mainDia")}
        />
        <DiaSelect
          label="Lateral Tie Dia"
          value={item.tieDia}
          onChange={u("tieDia")}
        />
        <MMF
          label="Tie Spacing"
          value={item.tieSpacing}
          onChange={u("tieSpacing")}
        />
      </FormSection>
    </div>
  );
}

function BeamForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div className="flex flex-col gap-6">
      <FormSection title="Geometry" icon="📏">
        <MF label="Span L" value={item.L} onChange={u("L")} />
        <MF label="Width B" value={item.B} onChange={u("B")} />
        <MF label="Depth D" value={item.D} onChange={u("D")} />
      </FormSection>

      <FormSection title="Reinforcement" icon="🔩">
        <NF
          label="Bottom Main"
          value={item.botNos}
          onChange={u("botNos")}
        />
        <DiaSelect
          label="Bottom Dia"
          value={item.botDia}
          onChange={u("botDia")}
        />
        <NF label="Top Main" value={item.topNos} onChange={u("topNos")} />
        <DiaSelect
          label="Top Dia"
          value={item.topDia}
          onChange={u("topDia")}
        />
        <NF
          label="Extra Top"
          value={item.exTopNos}
          onChange={u("exTopNos")}
        />
        <DiaSelect
          label="Ex. Top Dia"
          value={item.exTopDia}
          onChange={u("exTopDia")}
        />
      </FormSection>

      <FormSection title="Stirrups" icon="⛓️">
        <DiaSelect
          label="Stirrup Dia"
          value={item.stirDia}
          onChange={u("stirDia")}
        />
        <MMF
          label="Spacing"
          value={item.stirSpacing}
          onChange={u("stirSpacing")}
        />
      </FormSection>

      <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg text-[10px] font-bold text-blue-700 flex items-center gap-2">
        <span className="text-base">📐</span>
        <span>Stirrup Zones: Dense @{Math.round(+item.stirSpacing / 2)}mm (L/4) · Normal @{item.stirSpacing}mm (L/2)</span>
      </div>

      <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-lg transition-all hover:bg-white hover:border-primary-100">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="w-5 h-5 rounded-md border-slate-300 text-primary-600 focus:ring-primary-500 transition-all"
            checked={!!item.hasTorsion}
            onChange={(e) => onChange("hasTorsion", e.target.checked)}
          />
          <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">🌀 Include Torsion Bars</span>
        </label>
        {item.hasTorsion && (
          <div className="mt-4 pt-4 border-t border-slate-200/60 animate-in fade-in slide-in-from-top-2 duration-300">
            <FormSection>
              <DiaSelect
                label="Torsion Dia"
                value={item.torsDia}
                onChange={u("torsDia")}
              />
              <NF
                label="Bar Count"
                value={item.torsNos}
                onChange={u("torsNos")}
              />
            </FormSection>
          </div>
        )}
      </div>
    </div>
  );
}

function SlabForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  const lbRatio = +item.L / +item.B;
  const autoIs1Way = lbRatio > 2;

  return (
    <div>
      <FormSection title="Geometry" icon="📏">
        <div className="field">
          <label className="field__label">Slab Type</label>
          <div className="input-wrap">
            <select
              className="input"
              value={item.slabType || "2-way"}
              onChange={(e) => u("slabType")(e.target.value)}
            >
              <option value="1-way">1-Way Slab (Ly/Lx &gt; 2)</option>
              <option value="2-way">2-Way Slab (Ly/Lx &lt; 2)</option>
            </select>
            <span className="input-chevron">▾</span>
          </div>
          {autoIs1Way && item.slabType === "2-way" && (
            <div className="input-warning-hint">
              ⚠️ Ly/Lx = {lbRatio.toFixed(2)} &gt; 2 — behaves as 1-way slab
            </div>
          )}
        </div>
        <MF label="Lx (shorter)" value={item.L} onChange={u("L")} />
        <MF label="Ly (longer)" value={item.B} onChange={u("B")} />
        <MF label="Thickness D" value={item.D} onChange={u("D")} />
      </FormSection>

      <FormSection title="Main Reinforcement" icon="🔩">
        <DiaSelect
          label="Main Bar Dia"
          value={item.mainDia}
          onChange={u("mainDia")}
        />
        <MMF
          label="Main Spacing"
          value={item.mainSp}
          onChange={u("mainSp")}
        />
        <DiaSelect
          label="Top Bar Dia"
          value={item.topDia}
          onChange={u("topDia")}
        />
        <MMF label="Top Spacing" value={item.topSp} onChange={u("topSp")} />
      </FormSection>

      <FormSection title="Distribution" icon="⛓️">
        <DiaSelect
          label="Dist Bar Dia"
          value={item.distDia}
          onChange={u("distDia")}
        />
        <MMF
          label="Dist Spacing"
          value={item.distSp}
          onChange={u("distSp")}
        />
      </FormSection>
    </div>
  );
}

function StaircaseForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div>
      <FormSection title="Geometry" icon="📏">
        <MF
          label="Flight Length"
          value={item.flightLen}
          onChange={u("flightLen")}
        />
        <MF label="Width" value={item.width} onChange={u("width")} />
        <MF
          label="Waist Thickness"
          value={item.waistThick}
          onChange={u("waistThick")}
        />
      </FormSection>

      <FormSection title="Reinforcement" icon="🔩">
        <DiaSelect
          label="Main Bar Dia"
          value={item.mainDia}
          onChange={u("mainDia")}
        />
        <MMF
          label="Main Spacing"
          value={item.mainSp}
          onChange={u("mainSp")}
        />
        <DiaSelect
          label="Dist Bar Dia"
          value={item.distDia}
          onChange={u("distDia")}
        />
        <MMF
          label="Dist Spacing"
          value={item.distSp}
          onChange={u("distSp")}
        />
      </FormSection>
    </div>
  );
}

function LintelForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div>
      <FormSection title="Geometry" icon="📏">
        <MF label="Span L" value={item.L} onChange={u("L")} />
        <MF label="Width B" value={item.B} onChange={u("B")} />
        <MF label="Depth D" value={item.D} onChange={u("D")} />
      </FormSection>

      <FormSection title="Reinforcement" icon="🔩">
        <NF
          label="Bottom Count"
          value={item.botNos}
          onChange={u("botNos")}
        />
        <DiaSelect
          label="Bottom Dia"
          value={item.botDia}
          onChange={u("botDia")}
        />
        <NF label="Top Count" value={item.topNos} onChange={u("topNos")} />
        <DiaSelect
          label="Top Dia"
          value={item.topDia}
          onChange={u("topDia")}
        />
      </FormSection>

      <FormSection title="Stirrups" icon="⛓️">
        <DiaSelect
          label="Stirrup Dia"
          value={item.stirDia}
          onChange={u("stirDia")}
        />
        <MMF
          label="Spacing"
          value={item.stirSpacing}
          onChange={u("stirSpacing")}
        />
      </FormSection>

      <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-lg transition-all hover:bg-white hover:border-primary-100 mt-6">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="w-5 h-5 rounded-md border-slate-300 text-primary-600 focus:ring-primary-500 transition-all"
            checked={!!item.hasChajja}
            onChange={(e) => onChange("hasChajja", e.target.checked)}
          />
          <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">☀️ Include Chajja (Sun Shade)</span>
        </label>
        {item.hasChajja && (
          <div className="mt-4 pt-4 border-t border-slate-200/60 animate-in fade-in slide-in-from-top-2 duration-300">
            <FormSection>
              <MF
                label="Projection"
                value={item.chajjaL}
                onChange={u("chajjaL")}
              />
              <MF
                label="Thickness"
                value={item.chajjaD}
                onChange={u("chajjaD")}
              />
              <DiaSelect
                label="Bar Dia"
                value={item.chajjaDia}
                onChange={u("chajjaDia")}
              />
              <MMF
                label="Spacing"
                value={item.chajjaSp}
                onChange={u("chajjaSp")}
              />
            </FormSection>
          </div>
        )}
      </div>
    </div>
  );
}

function RaftForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div>
      <FormSection title="Geometry" icon="📏">
        <MF label="Length L" value={item.L} onChange={u("L")} />
        <MF label="Width B" value={item.B} onChange={u("B")} />
        <MF label="Depth D" value={item.D} onChange={u("D")} />
      </FormSection>

      <FormSection title="Main Reinforcement" icon="🔩">
        <DiaSelect
          label="Main Bar Dia"
          value={item.mainDia}
          onChange={u("mainDia")}
        />
        <MMF
          label="Main Spacing"
          value={item.mainSp}
          onChange={u("mainSp")}
        />
        <DiaSelect
          label="Dist Bar Dia"
          value={item.distDia}
          onChange={u("distDia")}
        />
        <MMF
          label="Dist Spacing"
          value={item.distSp}
          onChange={u("distSp")}
        />
      </FormSection>

      <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg text-[10px] font-bold text-blue-700 flex items-center gap-2 mb-6">
        <span className="text-base">ℹ️</span>
        <span>Top + Bottom mat calculated automatically (2× bars)</span>
      </div>

      <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-lg transition-all hover:bg-white hover:border-primary-100">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="w-5 h-5 rounded-md border-slate-300 text-primary-600 focus:ring-primary-500 transition-all"
            checked={!!item.hasCrank}
            onChange={(e) => onChange("hasCrank", e.target.checked)}
          />
          <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">↗ Include Crank / Bent-up Bars</span>
        </label>
        {item.hasCrank && (
          <div className="mt-4 pt-4 border-t border-slate-200/60 animate-in fade-in slide-in-from-top-2 duration-300">
            <FormSection>
              <DiaSelect
                label="Crank Dia"
                value={item.crankDia}
                onChange={u("crankDia")}
              />
              <MMF
                label="Crank Spacing"
                value={item.crankSp}
                onChange={u("crankSp")}
              />
            </FormSection>
          </div>
        )}
      </div>
    </div>
  );
}

function PileCapForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div>
      <FormSection title="Geometry" icon="📏">
        <MF label="Length L" value={item.L} onChange={u("L")} />
        <MF label="Width B" value={item.B} onChange={u("B")} />
        <MF label="Depth D" value={item.D} onChange={u("D")} />
      </FormSection>

      <FormSection title="Pile Details" icon="🔵">
        <NF label="Pile Count" value={item.nPiles} onChange={u("nPiles")} />
        <Field
          label="Pile Dia"
          value={item.pileDia}
          onChange={u("pileDia")}
          unit="mm"
          step="50"
          min="150"
        />
      </FormSection>

      <FormSection title="Reinforcement" icon="🔩">
        <DiaSelect
          label="Main Bar Dia"
          value={item.mainDia}
          onChange={u("mainDia")}
        />
        <MMF label="Spacing" value={item.spacing} onChange={u("spacing")} />
        <DiaSelect
          label="Dist Bar Dia"
          value={item.distDia}
          onChange={u("distDia")}
        />
      </FormSection>

      <div className="pilecap-info-note">
        ℹ️ Anchor dowels: 4 bars per pile (IS 456 Cl.34.4)
      </div>
    </div>
  );
}

function getForm(type) {
  return {
    footing: FootingForm,
    column: ColumnForm,
    plinthBeam: BeamForm,
    wallBeam: BeamForm,
    slab: SlabForm,
    staircase: StaircaseForm,
    lintel: LintelForm,
    raft: RaftForm,
    pileCap: PileCapForm,
  }[type];
}

function getDrawing(type, item) {
  if (type === "footing") return <DrawingFooting {...item} />;
  if (type === "column") return <DrawingColumn {...item} />;
  if (type === "plinthBeam")
    return <DrawingBeam {...item} coverType="plinthBeam" />;
  if (type === "wallBeam")
    return <DrawingBeam {...item} coverType="wallBeam" />;
  if (type === "slab") return <DrawingSlab {...item} />;
  if (type === "staircase") return <DrawingStaircase {...item} />;
  if (type === "lintel") return <DrawingLintel {...item} />;
  if (type === "raft") return <DrawingRaft {...item} />;
  if (type === "pileCap") return <DrawingPileCap {...item} />;
}

const TYPE_COLORS = {
  footing: "orange",
  column: "blue",
  plinthBeam: "green",
  wallBeam: "purple",
  slab: "red",
  staircase: "teal",
  lintel: "brown",
  raft: "indigo",
  pileCap: "grey",
};
const TYPE_ICONS = {
  footing: "🏗",
  column: "🏛",
  plinthBeam: "🔩",
  wallBeam: "⚙️",
  slab: "▦",
  staircase: "🪜",
  lintel: "🪟",
  raft: "🟫",
  pileCap: "🔵",
};

// ─── ITEM CARD ────────────────────────────────────────────────────────────────
function ItemCard({ item, type, onChange, onRemove, index }) {
  const [showDrawing, setShowDrawing] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const fileInputRef = React.useRef(null);
  const Form = getForm(type);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onChange("blueprintImage", event.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const removeImage = () => {
    onChange("blueprintImage", null);
  };

  return (
    <Card className="mb-8 border border-slate-200 shadow-luxury group transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
      <div className="px-6 py-4 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Badge label={`#${index + 1}`} color={TYPE_COLORS[type] || "blue"} />
          <div className="relative group/input flex-1 max-w-sm">
            <input
              value={item.label}
              onChange={(e) => onChange("label", e.target.value)}
              className="w-full bg-transparent border-none text-base font-extrabold text-slate-800 focus:outline-none focus:ring-0 truncate"
              placeholder="Item Label..."
            />
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-focus-within/input:w-full" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm group/qty focus-within:ring-2 focus-within:ring-primary-100 transition-all">
            <span className="text-[10px] font-black text-slate-400 uppercase mr-2 pointer-events-none">Qty</span>
            <input
              type="number"
              min="1"
              step="1"
              value={item.count}
              onChange={(e) => onChange("count", Math.max(1, +e.target.value))}
              className="w-12 bg-transparent border-none text-sm font-black text-primary-600 focus:outline-none focus:ring-0 text-center"
            />
            <span className="text-[10px] font-bold text-slate-400 ml-1 pointer-events-none">NOS</span>
          </div>

          <div className="flex items-center gap-2">
             <button
              onClick={() => setShowDrawing((v) => !v)}
              className={`h-9 px-4 rounded-lg flex items-center gap-2 text-xs font-bold transition-all
                         ${showDrawing 
                            ? "bg-primary-600 text-white shadow-lg shadow-primary-200" 
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-sm"}`}
            >
              <span className="text-sm">{showDrawing ? "🧊" : "📐"}</span>
              <span className="hidden sm:inline">{showDrawing ? "Hide Drawing" : "Show Drawing"}</span>
            </button>

            <button
              onClick={() => setCollapsed((v) => !v)}
              className="h-9 px-3 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm"
            >
              {collapsed ? "▼" : "▲"}
            </button>

            <button
              onClick={onRemove}
              className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {!collapsed && (
        <div className={`p-6 transition-all duration-500 ${showDrawing ? "grid xl:grid-cols-[400px,1fr] lg:grid-cols-[300px,1fr] gap-8" : ""}`}>
          <div className="flex flex-col gap-8">
            <div className="bg-slate-50/50 p-3 rounded-lg border border-dashed border-slate-200 flex items-center justify-center gap-2.5">
              <span className="text-xl">📐</span>
              <div className="text-[10px] font-bold text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary-500" />Dimensions <b>metres (m)</b></span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />Spacings <b>millimetres (mm)</b></span>
              </div>
            </div>
            <Form item={item} onChange={onChange} />
          </div>
          {showDrawing && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500">
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col items-center justify-center min-h-[450px] group/draw relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover/draw:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="w-full mb-6 flex items-center justify-between relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">📐 Live Blueprint</span>
                    <span className="text-[10px] font-bold text-slate-400 mt-0.5">Auto-calculated diagram</span>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="relative z-10 w-full max-w-full flex-1 flex items-center justify-center transform group-hover/draw:scale-[1.02] transition-transform duration-500 overflow-hidden">
                  <div className="w-full max-w-[650px] overflow-hidden flex justify-center">
                    {getDrawing(type, item)}
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-lg">
                 <h5 className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2">Pro Tip</h5>
                 <p className="text-[11px] font-medium text-amber-800/80 leading-relaxed">
                   Proper clear cover is essential. Standard: Footing 50mm, Column 40mm, Beam 25mm, Slab 20mm.
                 </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ─── ITEM MANAGER ─────────────────────────────────────────────────────────────
export function ItemManager({ type, items, setItems, elementConfig }) {
  const addItem = () => {
    const n = items.length + 1;
    const prefixes = {
      footing: "F",
      column: "C",
      plinthBeam: "PB",
      wallBeam: "WB",
      slab: "S",
      staircase: "ST",
      lintel: "L",
      raft: "RF",
      pileCap: "PC",
    };
    const typeNames = {
      footing: "Footing",
      column: "Column",
      plinthBeam: "Plinth Beam",
      wallBeam: "Wall Beam",
      slab: "Slab",
      staircase: "Staircase",
      lintel: "Lintel",
      raft: "Raft",
      pileCap: "Pile Cap",
    };
    const item = newItem(type);
    item.label = `${typeNames[type]} ${prefixes[type]}${n}`;
    setItems((prev) => [...prev, item]);
  };

  const updateItem = (id, key, value) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [key]: value } : it)),
    );
  const removeItem = (id) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  const totalCount = items.reduce((s, it) => s + (+it.count || 1), 0);
  const typeLabels = {
    footing: "Footings",
    column: "Columns",
    plinthBeam: "Plinth Beams",
    wallBeam: "Wall Beams",
    slab: "Slabs",
    staircase: "Staircases",
    lintel: "Lintel / Chajja",
    raft: "Raft Foundation",
    pileCap: "Pile Caps",
  };

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
            {TYPE_ICONS[type]}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {typeLabels[type]}
            </h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                {items.length} Variants
              </span>
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {totalCount} Total Units
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={addItem}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold transition-all hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-100 active:scale-95 group shadow-sm"
        >
          <span className="text-lg group-hover:rotate-90 transition-transform duration-300">+</span>
          Add New
        </button>
      </div>

      {items.length === 0 && (
        <div className="py-24 text-center bg-white/40 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">📋</div>
           <h3 className="text-xl font-extrabold text-slate-800">No {typeLabels[type]} Added</h3>
           <p className="text-slate-500 mt-2 max-w-xs mx-auto font-medium text-sm leading-relaxed">
             Start by adding your first {type} to begin the Bar Bending Schedule calculation.
           </p>
           <button
             onClick={addItem}
             className="mt-8 px-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-lg font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
           >
             Quick Add +
           </button>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {items.map((item, i) => (
          <ItemCard
            key={item.id}
            item={item}
            type={type}
            index={i}
            onChange={(k, v) => updateItem(item.id, k, v)}
            onRemove={() => removeItem(item.id)}
          />
        ))}

        {items.length > 0 && (
           <button
            onClick={addItem}
            className="w-full py-8 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50/30 transition-all group"
          >
            <span className="text-3xl group-hover:scale-125 transition-transform duration-300">+</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Add Another {type}</span>
          </button>
        )}
      </div>
    </div>
  );
}
