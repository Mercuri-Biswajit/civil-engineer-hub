// src/components/BBS/BBSResults.jsx
import { BAR_WEIGHT } from "@/utils/BBS/calculations.js";
import { Badge } from "@/components/BBS/ui.jsx";

export function BBSTable({ rows, showSource = true }) {
  const totalWt = rows.reduce((s, r) => s + r.weight, 0);
  if (!rows.length) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-xs text-left">
        <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200">
          <tr>
            {showSource && <th className="px-4 py-3">Element</th>}
            <th className="px-4 py-3 text-center">Mark</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3 text-center">Qty</th>
            <th className="px-4 py-3 text-right">Cut Length (m)</th>
            <th className="px-4 py-3 text-right text-emerald-600">Total Length (m)</th>
            <th className="px-4 py-3 text-right">Unit Wt (kg/m)</th>
            <th className="px-4 py-3 text-right text-rose-600">Weight (kg)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              {showSource && (
                <td className="px-4 py-3 max-w-[140px] truncate">
                  <span className="font-bold text-slate-700">{r.sourceLabel}</span>
                  {r.count > 1 && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-primary-50 text-primary-600 rounded text-[9px] font-black uppercase">×{r.count}</span>
                  )}
                </td>
              )}
              <td className="px-4 py-3 text-center">
                <Badge label={r.mark} color="blue" />
              </td>
              <td className="px-4 py-3 text-slate-500 max-w-xs">{r.desc}</td>
              <td className="px-4 py-3 text-center font-bold text-slate-700">{r.nos}</td>
              <td className="px-4 py-3 text-right font-mono">{r.cutLen.toFixed(3)}</td>
              <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">
                {r.totalLen.toFixed(3)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-slate-400">
                {BAR_WEIGHT[r.dia] || "—"}
              </td>
              <td className="px-4 py-3 text-right font-mono font-bold text-rose-600">
                {r.weight.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-slate-50/50 border-t border-slate-200">
          <tr>
            <td 
              colSpan={showSource ? 7 : 6} 
              className="px-4 py-4 text-right uppercase tracking-widest text-[10px] font-black text-slate-400"
            >
              Total Steel Weight
            </td>
            <td className="px-4 py-4 text-right">
              <span className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-100/50 text-sm font-black shadow-sm">
                {totalWt.toFixed(2)} kg
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export function GroupedBBSTable({ rows }) {
  const groups = {};
  rows.forEach((r) => {
    const key = r.sourceLabel || "Unnamed";
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
      {Object.entries(groups).map(([label, groupRows]) => (
        <div key={label}>
          <div className="flex items-center gap-3 mb-4">
            <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">{label}</h4>
            <div className="h-px flex-1 bg-slate-100" />
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase tracking-widest">
              {groupRows[0]?.count} nos
            </span>
          </div>
          <BBSTable rows={groupRows} showSource={false} />
        </div>
      ))}
    </div>
  );
}

export function CostTable({ costs, onRateChange, details, onSendBarOrder }) {
  const total = costs.reduce((s, r) => s + r.cost, 0);
  const totalKg = costs.reduce((s, r) => s + r.kg, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
      {/* Purchase summary */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">📦</span>
          <div>
            <h4 className="text-sm font-black text-slate-900 tracking-tight">Bars to Purchase</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">12m Standard Rods</p>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Dia</th>
                <th className="px-4 py-3 text-right">Total Length</th>
                <th className="px-4 py-3 text-right">Weight (kg)</th>
                <th className="px-4 py-3 text-center">12m Rods Reqd</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {costs.map((r) => (
                <tr key={r.dia} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-black text-rose-600">φ{r.dia}mm</td>
                  <td className="px-4 py-3 text-right font-mono">{r.totalLen} m</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-700">{r.kg} kg</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-[11px] font-black uppercase">
                      {r.rods12m} rods
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50/50 font-black text-slate-900 border-t border-slate-200">
              <tr>
                <td colSpan={2} className="px-4 py-3 text-right uppercase tracking-widest text-[9px] text-slate-400">Total</td>
                <td className="px-4 py-3 text-right font-mono text-emerald-600">{totalKg.toFixed(2)} kg</td>
                <td className="px-4 py-3 text-center font-mono text-primary-600">
                  {costs.reduce((s, r) => s + r.rods12m, 0)} rods
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {onSendBarOrder && (
          <button 
            onClick={onSendBarOrder} 
            className="w-full flex items-center justify-center gap-3 h-12 bg-[#25D366] text-white rounded-lg text-xs font-black uppercase tracking-wider hover:bg-[#128C7E] transition-all shadow-lg shadow-green-100 active:scale-[0.98]"
          >
            <span>💬</span>
            Send Bar Order via WhatsApp
          </button>
        )}
      </div>

      {/* Cost estimate */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-lg">💰</span>
          <div>
            <h4 className="text-sm font-black text-slate-900 tracking-tight">Cost Estimate</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Per-Piece Rate (12m rod)</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Dia</th>
                <th className="px-4 py-3 text-center">12m Rods</th>
                <th className="px-4 py-3 text-center">Rate (₹/pc)</th>
                <th className="px-4 py-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {costs.map((r) => (
                <tr key={r.dia} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-black text-rose-600">φ{r.dia}mm</td>
                  <td className="px-4 py-3 text-center font-bold text-slate-600">{r.rods12m} pcs</td>
                  <td className="px-4 py-3 text-center">
                    {onRateChange ? (
                      <input
                        type="number"
                        value={r.ratePerPiece}
                        onChange={(e) => onRateChange(r.dia, +e.target.value)}
                        className="w-20 h-8 bg-slate-100 border-none rounded-lg text-center text-xs font-black text-slate-900 focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <span className="font-bold">₹{r.ratePerPiece}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">
                    ₹{r.cost.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50/50 border-t border-slate-200">
              <tr>
                <td colSpan={3} className="px-4 py-4 text-right uppercase tracking-widest text-[9px] font-black text-slate-400">Total Project Cost</td>
                <td className="px-4 py-4 text-right">
                  <span className="text-lg font-black text-emerald-600">₹{total.toLocaleString("en-IN")}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <p className="text-[10px] font-bold text-slate-400 italic text-center uppercase tracking-tight">
          * Rates shown per 12m rod. Add 5% wastage for actual procurement.
        </p>
      </div>
    </div>
  );
}
