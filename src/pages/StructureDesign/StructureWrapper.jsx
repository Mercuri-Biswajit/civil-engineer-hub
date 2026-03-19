import { useState, useCallback } from "react";
import StructureDesignPage from "./StructureDesignPage.jsx";
import "@/styles/StructureDesign/global.css";

export default function StructureWrapper() {
  const [allData, setAllData] = useState({});

  const handleDataChange = useCallback((moduleName, data) => {
    setAllData((prev) => ({
      ...prev,
      [moduleName]: data,
    }));
  }, []);

  return (
    <StructureDesignPage
      allData={allData}
      onDataChange={handleDataChange}
    />
  );
}

