/**
 * BOQ Engine — Bill of Quantities Calculator
 * Computes material quantities and costs for concrete structural elements.
 *
 * EXPORTS:
 *   computeBOQ({ grade, length, width, height, steelKg, formwork, state })
 */

// ── State-wise concrete rates (₹ / m³)  ────────────────────────────────────
const CONCRETE_RATES = {
  Maharashtra:     6800,
  Delhi:           7200,
  Karnataka:       6600,
  'Tamil Nadu':    6500,
  Gujarat:         6400,
  Rajasthan:       6000,
  'West Bengal':   6200,
  'Uttar Pradesh': 5900,
  Telangana:       6600,
};

// ── Grade-wise cement content (bags / m³)  ──────────────────────────────────
const CEMENT_BAGS = {
  M20: 8.0,
  M25: 9.5,
  M30: 11.0,
  M35: 12.5,
  M40: 14.0,
};

// ── Base rates  ─────────────────────────────────────────────────────────────
const STEEL_RATE_PER_KG    = 72;    // ₹/kg
const FORMWORK_RATE_PER_M2 = 220;   // ₹/m²
const LABOUR_RATE_FRACTION  = 0.18; // 18% of material cost

/**
 * @param {object} params
 * @param {string} params.grade      - Concrete grade: 'M20' | 'M25' | 'M30' | 'M35' | 'M40'
 * @param {number} params.length     - Length of element (m)
 * @param {number} params.width      - Width of element (m)
 * @param {number} params.height     - Height / depth of element (m)
 * @param {number} params.steelKg    - Steel reinforcement (kg / m³)
 * @param {boolean} params.formwork  - Include formwork cost?
 * @param {string} params.state      - Indian state for regional rates
 *
 * @returns {{ items: object[], breakdown: object[], total: number }}
 */
export function computeBOQ({ grade, length, width, height, steelKg, formwork, state }) {
  const volume   = length * width * height;                    // m³
  const surfaceArea = 2 * (length * height + width * height);  // m² (vertical faces)

  const concreteRate = CONCRETE_RATES[state] ?? 6500;
  const cementBags   = CEMENT_BAGS[grade]   ?? 9.5;

  // ── Material quantities ─────────────────────────────────────────────────
  const cementQty = cementBags * volume;            // bags
  const sandQty   = volume * 0.44;                  // m³  (IS ratio approx)
  const aggQty    = volume * 0.88;                  // m³
  const steelQty  = steelKg * volume;               // kg

  // ── Material costs ──────────────────────────────────────────────────────
  const concreteCost = concreteRate * volume;
  const steelCost    = STEEL_RATE_PER_KG * steelQty;
  const fwCost       = formwork ? FORMWORK_RATE_PER_M2 * surfaceArea : 0;
  const materialCost = concreteCost + steelCost + fwCost;
  const labourCost   = Math.round(materialCost * LABOUR_RATE_FRACTION);
  const total        = Math.round(materialCost + labourCost);

  // ── BOQ line items ──────────────────────────────────────────────────────
  const items = [
    {
      description: `${grade} Ready Mix Concrete`,
      unit:        'm³',
      qty:         volume.toFixed(2),
      rate:        concreteRate,
      amount:      Math.round(concreteCost),
    },
    {
      description: `Cement (${grade})`,
      unit:        'bags (50kg)',
      qty:         cementQty.toFixed(1),
      rate:        400,
      amount:      Math.round(cementQty * 400),
    },
    {
      description: 'Fine Aggregate (Sand)',
      unit:        'm³',
      qty:         sandQty.toFixed(2),
      rate:        1200,
      amount:      Math.round(sandQty * 1200),
    },
    {
      description: 'Coarse Aggregate (20mm)',
      unit:        'm³',
      qty:         aggQty.toFixed(2),
      rate:        1400,
      amount:      Math.round(aggQty * 1400),
    },
    {
      description: `Steel Reinforcement (${steelKg} kg/m³)`,
      unit:        'kg',
      qty:         steelQty.toFixed(0),
      rate:        STEEL_RATE_PER_KG,
      amount:      Math.round(steelCost),
    },
    ...(formwork ? [{
      description: 'Shuttering & Formwork',
      unit:        'm²',
      qty:         surfaceArea.toFixed(2),
      rate:        FORMWORK_RATE_PER_M2,
      amount:      Math.round(fwCost),
    }] : []),
    {
      description: 'Labour (Placing, Compaction, Curing)',
      unit:        'LS',
      qty:         '1.00',
      rate:        labourCost,
      amount:      labourCost,
    },
  ];

  // ── Cost breakdown for pie/bar chart ───────────────────────────────────
  const breakdown = [
    { label: 'Concrete',  amount: Math.round(concreteCost), pct: Math.round((concreteCost / total) * 100) },
    { label: 'Steel',     amount: Math.round(steelCost),    pct: Math.round((steelCost    / total) * 100) },
    ...(formwork ? [{ label: 'Formwork', amount: Math.round(fwCost), pct: Math.round((fwCost / total) * 100) }] : []),
    { label: 'Labour',    amount: labourCost,               pct: Math.round((labourCost   / total) * 100) },
  ];

  return { items, breakdown, total };
}
