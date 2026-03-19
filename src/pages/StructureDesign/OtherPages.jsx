import { useState } from "react";
import { C, F } from "@/styles/StructureDesign/tokens";
import {
  Card,
  SectionTitle,
} from "@/components/StructureDesign/ui/index.js";

// ═══════════════════════════════════════════════
//  REPORT PAGE
// ═══════════════════════════════════════════════
export function ReportPage({ allData }) {
  const [project, setProject] = useState({
    name: "",
    client: "",
    location: "",
    engineer: "",
    date: new Date().toLocaleDateString("en-IN"),
  });
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const upd = (k, v) => setProject((p) => ({ ...p, [k]: v }));

  const handleExport = async () => {
    setExporting(true);
    try {
      const { exportToExcel } = await import("@/utils/StructureDesign/excelExport");
      exportToExcel({ project, ...allData });
      setExported(true);
      setTimeout(() => setExported(false), 5000);
    } catch (e) {
      console.error("Export failed:", e);
      alert("Export failed. Ensure xlsx and file-saver are installed.");
    }
    setExporting(false);
  };

  const fieldInput = (label, key, placeholder = "") => (
    <div key={key} style={{ marginBottom: 12 }}>
      <label
        style={{
          display: "block",
          fontSize: 10,
          color: C.inkLight,
          marginBottom: 4,
          fontFamily: F.sans,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </label>
      <input
        style={{
          background: C.bgAlt,
          border: `1.5px solid ${C.border}`,
          borderRadius: 7,
          color: C.ink,
          padding: "8px 12px",
          fontFamily: F.mono,
          fontSize: 13,
          width: "100%",
          outline: "none",
          boxSizing: "border-box",
        }}
        type="text"
        value={project[key]}
        placeholder={placeholder}
        onChange={(e) => upd(key, e.target.value)}
      />
    </div>
  );

  const modules = [
    { id: "beam", label: "Beam Design", code: "IS 456:2000 / IS 800:2007" },
    { id: "column", label: "Column Design", code: "IS 456:2000 / IS 800:2007" },
    { id: "slab", label: "Slab Design", code: "IS 456:2000 Cl. 24" },
    {
      id: "foundation",
      label: "Foundation Design",
      code: "IS 456:2000 / IS 2950 / IS 2911",
    },
    { id: "road", label: "Road Design", code: "IRC 37 / IRC 52 / IRC 73" },
    { id: "bridge", label: "Bridge Loads", code: "IRC:6" },
    { id: "boq", label: "Estimation & BOQ", code: "—" },
  ];

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", paddingBottom: 40 }}>
      {/* Dynamic Header */}
      <div
        style={{
          background: `linear-gradient(135deg, #4f46e5, #4338ca)`,
          borderRadius: 8,
          padding: "48px 24px",
          textAlign: "center",
          marginBottom: 32,
          boxShadow: '0 20px 25px -5px rgba(67, 56, 202, 0.1), 0 10px 10px -5px rgba(67, 56, 202, 0.04)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, background: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div
          style={{
            fontFamily: F.sans,
            fontSize: 32,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "4px",
            textTransform: 'uppercase',
            position: 'relative',
            textShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          Structural Report
        </div>
        <div
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.8)",
            marginTop: 12,
            fontFamily: F.mono,
            fontWeight: 500,
            letterSpacing: '2px',
            position: 'relative'
          }}
        >
          COMPREHENSIVE DESIGN ANALYSIS
        </div>
        <div
          style={{
            height: '2px',
            width: '40px',
            background: 'rgba(255,255,255,0.3)',
            margin: '20px auto',
            position: 'relative',
            borderRadius: '1px'
          }}
        />
        <div
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.6)",
            fontFamily: F.mono,
            letterSpacing: '1px',
            position: 'relative'
          }}
        >
          STANDARDS: IS 456 · IS 800 · IRC:6 · IRC:37
        </div>
      </div>

      <Card>
        <SectionTitle>Project Information</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 20px",
          }}
        >
          {fieldInput("Project Name", "name", "e.g. Residential Tower Block A")}
          {fieldInput("Client", "client", "Client or organisation name")}
          {fieldInput("Location", "location", "City, State")}
          {fieldInput(
            "Engineer of Record",
            "engineer",
            "Name & Registration No.",
          )}
          {fieldInput("Report Date", "date")}
        </div>
      </Card>

      <Card>
        <SectionTitle>Modules Included</SectionTitle>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${C.border}` }}>
              {["Module", "Code Reference", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "8px 12px",
                    textAlign: "left",
                    fontSize: 11,
                    color: C.inkLight,
                    fontFamily: F.mono,
                    letterSpacing: "1px",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((m, i) => (
              <tr
                key={m.id}
                style={{
                  background: i % 2 === 0 ? C.bgAlt : C.bgCard,
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <td
                  style={{
                    padding: "10px 12px",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {m.label}
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    fontSize: 12,
                    color: C.inkLight,
                    fontFamily: F.mono,
                  }}
                >
                  {m.code}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <span
                    style={{
                      background: C.greenLight,
                      color: C.green,
                      fontFamily: F.mono,
                      fontSize: 11,
                      padding: "2px 10px",
                      borderRadius: 8,
                      fontWeight: 700,
                    }}
                  >
                    ✓ Included
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card>
        <SectionTitle>Export to Excel</SectionTitle>
        <p
          style={{
            fontSize: 13,
            color: C.inkMid,
            marginBottom: 20,
            lineHeight: 1.8,
            fontFamily: F.sans,
          }}
        >
          Generates a formatted <strong>.xlsx workbook</strong> with one sheet
          per module — inputs, results, code checks, and utilization ratios.
        </p>
        <button
          onClick={handleExport}
          disabled={exporting}
          style={{
            width: "100%",
            padding: "16px 0",
            borderRadius: 8,
            border: "none",
            background: exported ? C.green : exporting ? C.inkLight : C.blue,
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            fontFamily: F.sans,
            cursor: exporting ? "wait" : "pointer",
            transition: "background 0.3s",
          }}
        >
          {exporting
            ? "⏳  Generating..."
            : exported
              ? "✓  Downloaded!"
              : "⬇  Export Full Report (.xlsx)"}
        </button>
        {exported && (
          <div
            style={{
              marginTop: 10,
              padding: 10,
              background: C.greenLight,
              borderRadius: 7,
              fontSize: 12,
              color: C.green,
            }}
          >
            ✓ Saved as URBAN-MATRIX_Report_{new Date().toISOString().slice(0, 10)}.xlsx
          </div>
        )}
      </Card>

      <div
        style={{
          background: C.yellowLight,
          border: `1px solid ${C.yellow}40`,
          borderRadius: 8,
          padding: "14px 18px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: C.inkMid,
            fontFamily: F.sans,
            lineHeight: 1.8,
          }}
        >
          <strong>Disclaimer:</strong> STRUX provides preliminary calculations
          for educational and planning purposes only. All results must be
          independently verified by a licensed structural or civil engineer.
          Full design per applicable IS/IRC standards is mandatory for
          construction.
        </p>
      </div>
    </div>
  );
}
