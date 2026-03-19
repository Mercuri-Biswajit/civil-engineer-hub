import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Reconstructed PDF Report utility for BBS
 * Provides functions to download PDF and share via WhatsApp
 */

export const downloadPDF = (details, byType, allRows, costs) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // --- HEADER SECTION ---
  doc.setFontSize(22);
  doc.setTextColor(21, 101, 192); // Primary Blue
  doc.text("BAR BENDING SCHEDULE", margin, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Civil-Engineer-Hub Unified Platform", margin, 26);
  doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, margin, 31);

  // --- PROJECT DETAILS ---
  doc.setDrawColor(208, 220, 232);
  doc.line(margin, 36, pageWidth - margin, 36);

  doc.setFontSize(12);
  doc.setTextColor(26, 37, 53);
  doc.text(`Project: ${details.projectName || "General Project"}`, margin, 44);
  doc.text(`Client: ${details.clientName || "—"}`, margin, 50);
  doc.text(`Location: ${details.location || "—"}`, margin, 56);

  doc.setFontSize(10);
  doc.text(`Engineer: ${details.engineerName || "—"}`, pageWidth - margin, 44, { align: "right" });
  doc.text(`Phone: ${details.engineerPhone || "—"}`, pageWidth - margin, 50, { align: "right" });

  doc.line(margin, 62, pageWidth - margin, 62);

  let currentY = 70;

  // --- SUMMARY TABLE ---
  const totalWeight = allRows.reduce((a, b) => a + b.weight, 0);
  const totalCost = costs.reduce((a, b) => a + b.cost, 0);

  doc.autoTable({
    startY: currentY,
    head: [["Metric", "Value"]],
    body: [
      ["Total Steel Weight", `${totalWeight.toFixed(2)} kg`],
      ["Total Material Cost (Est)", `INR ${totalCost.toLocaleString("en-IN")}`],
      ["Total Bar Entries", `${allRows.length}`],
      ["Element Types", `${byType.filter(t => t.rows.length > 0).length}`]
    ],
    margin: { left: margin },
    theme: "striped",
    headStyles: { fillColor: [21, 101, 192] },
    styles: { fontSize: 10 }
  });

  currentY = doc.lastAutoTable.finalY + 10;

  // --- BBS TABLES BY TYPE ---
  byType.forEach((typeData) => {
    if (typeData.rows.length === 0) return;

    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(21, 101, 192);
    doc.text(`${typeData.type.toUpperCase()} BBS`, margin, currentY);
    currentY += 5;

    doc.autoTable({
      startY: currentY,
      head: [["Mark", "Dia", "Nos", "Length (m)", "Total (m)", "Weight (kg)"]],
      body: typeData.rows.map(r => [
        r.mark,
        `${r.dia}mm`,
        r.nos,
        r.cutLen.toFixed(3),
        r.totalLen.toFixed(3),
        r.weight.toFixed(2)
      ]),
      margin: { left: margin },
      headStyles: { fillColor: [74, 85, 104] },
      styles: { fontSize: 9 }
    });

    currentY = doc.lastAutoTable.finalY + 12;
  });

  // --- FOOTER ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount} | BBS Report v1.0`, pageWidth / 2, 285, { align: "center" });
  }

  const filename = `BBS_Report_${details.projectName?.replace(/\s+/g, "_") || "Export"}.pdf`;
  doc.save(filename);
  return filename;
};

export const sendViaWhatsApp = (details, byType, allRows, costs) => {
  // For WhatsApp, we generate the PDF name and open the URL
  // The user actually has to manually attach the file, but we'll provide the context
  const filename = downloadPDF(details, byType, allRows, costs);
  
  const totalWeight = allRows.reduce((a, b) => a + b.weight, 0).toFixed(2);
  const totalCost = costs.reduce((a, b) => a + b.cost, 0).toLocaleString("en-IN");
  
  const text = encodeURIComponent(
    `*📌 BBS REPORT: ${details.projectName || "General"}*\n` +
    `👤 Client: ${details.clientName || "—"}\n` +
    `⚖️ Total Steel: ${totalWeight} kg\n` +
    `💰 Total Cost: ₹${totalCost}\n\n` +
    `📄 PDF saved as: ${filename}\n` +
    `Please find the attached BBS report for your project.`
  );
  
  const phone = details.engineerPhone || "";
  window.open(`https://wa.me/91${phone}?text=${text}`, "_blank");
  
  return filename;
};
