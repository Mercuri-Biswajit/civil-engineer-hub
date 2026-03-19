import { useState, useCallback } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import GlobalHeader from "@/components/shared/GlobalHeader";
import { DEFAULT_PATH, ROUTES } from "@/utils/StructureDesign/routes/index.js";
import Navbar from "@/components/StructureDesign/layout/header/Navbar.jsx";
import HeroHeader from "@/components/StructureDesign/HeroHeader.jsx";
import VisualDefinitions from "@/components/StructureDesign/layout/VisualDefinitions.jsx";

import BeamPage from "@/pages/StructureDesign/BeamPage.jsx";
import ColumnPage from "@/pages/StructureDesign/ColumnPage.jsx";
import SlabPage from "@/pages/StructureDesign/SlabPage.jsx";
import FoundationPage from "@/pages/StructureDesign/FoundationPage.jsx";
import RoadPage from "@/pages/StructureDesign/RoadPage.jsx";
import BridgePage from "@/pages/StructureDesign/BridgePage.jsx";
import BOQPage from "@/pages/BOQ/BOQPage.jsx";
import { ReportPage } from "@/pages/StructureDesign/OtherPages.jsx";
import ProjectDetailsPage from "@/pages/StructureDesign/ProjectDetailsPage.jsx";


export default function StructureDesignPage({ allData = {}, onDataChange }) {
  const { pathname } = useLocation();
  const segment = pathname.split('/').pop();
  const route = ROUTES.find(r => r.path === segment);
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveToCloud = async () => {
    const currentTool = route ? route.id : 'unknown';
    const pName = window.prompt("Enter Project Name:", `${route ? route.fullLabel : "Structure Design"} - ${new Date().toLocaleDateString()}`);
    if (!pName) return;

    setIsSaving(true);
    try {
      const { saveProjectToFirestore } = await import('@/services/projectService');
      await saveProjectToFirestore("local-user", {
        tool: `structure-${currentTool}`,
        projectName: pName,
        projectData: allData[currentTool] || {}
      });
      alert("Project saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen font-sans">
      <GlobalHeader 
        toolTitle={route ? route.fullLabel : "Structure Design Suite"}
        toolSubtitle={route ? route.description : "IS & IRC Standards"}
        rightActions={
          <button 
            className="btn-save-cloud" 
            onClick={handleSaveToCloud} 
            disabled={isSaving}
            title="Save this project to your Dashboard"
            style={{ 
              padding: '10px 20px', 
              borderRadius: '14px', 
              border: '1px solid #e2e8f0', 
              background: '#fff', 
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isSaving ? "⏳ Saving..." : "☁️ Save Project"}
          </button>
        }
      />
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start relative w-full mx-auto px-4 lg:px-6 py-6 flex-1">
        <VisualDefinitions />
        {/* Sidebar */}
        <Navbar />

        {/* Main content area */}
        <main className="flex-1 min-w-0 w-full relative">
          <div className="w-full max-w-[1400px] mx-auto pb-32">
            <HeroHeader />

              <Routes>
                <Route
                  path="/"
                  element={<Navigate to={DEFAULT_PATH} replace />}
                />
                <Route
                  path="details"
                  element={<ProjectDetailsPage onDetailsChange={(d) => onDataChange?.("details", d)} />}
                />
                <Route
                  path="beam"
                  element={
                    <BeamPage onDataChange={(d) => onDataChange("beam", d)} />
                  }
                />
                <Route
                  path="column"
                  element={
                    <ColumnPage onDataChange={(d) => onDataChange("column", d)} />
                  }
                />
                <Route
                  path="slab"
                  element={
                    <SlabPage onDataChange={(d) => onDataChange("slab", d)} />
                  }
                />
                <Route
                  path="foundation"
                  element={
                    <FoundationPage
                      onDataChange={(d) => onDataChange("foundation", d)}
                    />
                  }
                />
                <Route
                  path="road"
                  element={
                    <RoadPage onDataChange={(d) => onDataChange("road", d)} />
                  }
                />
                <Route
                  path="bridge"
                  element={
                    <BridgePage onDataChange={(d) => onDataChange("bridge", d)} />
                  }
                />
                <Route
                  path="boq"
                  element={
                    <BOQPage />
                  }
                />
                <Route
                  path="report"
                  element={<ReportPage allData={allData} />}
                />
                <Route
                  path="*"
                  element={<Navigate to={DEFAULT_PATH} replace />}
                />
              </Routes>
            </div>
          </main>
      </div>
    </div>
  );
}


