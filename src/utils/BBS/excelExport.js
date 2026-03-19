import * as XLSX from "xlsx";

/**
 * Reconstructed Excel Export utility for BBS
 * Creates a multi-sheet workbook with Summary, BBS Tables, and Schedules
 */

export const downloadExcel = (details, byType, allRows, costs, cutLengthData, barTagData) => {
  const wb = XLSX.utils.book_new();

  // --- 1. SUMMARY SHEET ---
  const summaryData = [
    ["BAR BENDING SCHEDULE REPORT"],
    ["Generated on", new Date().toLocaleString("en-IN")],
    [],
    ["PROJECT DETAILS"],
    ["Project Name", details.projectName || "—"],
    ["Client Name", details.clientName || "—"],
    ["Location", details.location || "—"],
    ["Engineer", details.engineerName || "—"],
    [],
    ["ESTIMATE SUMMARY"],
    ["Total Steel Weight (kg)", allRows.reduce((s, r) => s + r.weight, 0).toFixed(2)],
    ["Total Material Cost (INR)", costs.reduce((s, r) => s + r.cost, 0).toFixed(2)],
    ["Total Bar Items", allRows.length]
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

  // --- 2. FULL BBS SHEET ---
  const bbsHead = [["Type", "Mark", "Dia", "Nos", "Cut Len (m)", "Total Len (m)", "Weight (kg)", "Description"]];
  const bbsBody = allRows.map(r => [
    r.source || "—",
    r.mark,
    r.dia,
    r.nos,
    r.cutLen,
    r.totalLen,
    r.weight,
    r.desc || "—"
  ]);
  const wsBBS = XLSX.utils.aoa_to_sheet([...bbsHead, ...bbsBody]);
  XLSX.utils.book_append_sheet(wb, wsBBS, "Full_BBS");

  // --- 3. BAR TAG SCHEDULE ---
  if (barTagData && barTagData.length > 0) {
    const tagHead = [["Tag", "Source", "Mark", "Dia", "Nos", "Length (m)", "Weight (kg)"]];
    const tagBody = barTagData.map(t => [
      t.tag,
      t.source,
      t.mark,
      t.dia,
      t.nos,
      t.totalLen,
      t.weight
    ]);
    const wsTags = XLSX.utils.aoa_to_sheet([...tagHead, ...tagBody]);
    XLSX.utils.book_append_sheet(wb, wsTags, "Bar_Tags");
  }

  // --- 4. MATERIAL COST SHEET ---
  const costHead = [["Diameter", "Weight (kg)", "Rate (Rs/kg)", "Total Cost (Rs)"]];
  const costBody = costs.map(c => [
    `${c.dia}mm`,
    c.weight.toFixed(2),
    c.rate.toFixed(2),
    c.cost.toFixed(2)
  ]);
  const wsCost = XLSX.utils.aoa_to_sheet([...costHead, ...costBody]);
  XLSX.utils.book_append_sheet(wb, wsCost, "Costing");

  // Generate Filename
  const filename = `BBS_Export_${details.projectName?.replace(/\s+/g, "_") || "Data"}.xlsx`;
  
  // Download
  XLSX.writeFile(wb, filename);
  return filename;
};
