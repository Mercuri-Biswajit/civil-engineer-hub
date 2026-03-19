import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiFileText,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiHash,
  FiPhone,
  FiMail,
  FiClipboard,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const DEFAULT_SD_PROJECT = {
  projectName: "",
  projectNo: "",
  clientName: "",
  clientPhone: "",
  clientEmail: "",
  siteLocation: "",
  date: new Date().toISOString().slice(0, 10),
  preparedBy: "",
  checkedBy: "",
  description: "",
};

function FieldGroup({ label, icon: Icon, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        <Icon size={12} className="text-blue-500" />
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all";

export default function ProjectDetailsPage({ onDetailsChange, details, onLaunch }) {
  const navigate = useNavigate();
  const [data, setData] = useState(details || DEFAULT_SD_PROJECT);

  const set = (k, v) => {
    const next = { ...data, [k]: v };
    setData(next);
    onDetailsChange?.(next);
  };

  const projectReady = data.projectName.trim().length > 0;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-[0.15em]">
          <FiClipboard size={12} />
          Structure Design Suite
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Project Details</h1>
        <p className="text-sm text-slate-500">
          Configure your project metadata before running structural calculations.
        </p>
      </div>

      {/* Project Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-lg p-6 shadow-luxury space-y-6"
      >
        <h2 className="text-xs font-black text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-2">
          Project Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup label="Project Name" icon={FiFileText}>
            <input
              value={data.projectName}
              onChange={(e) => set("projectName", e.target.value)}
              placeholder="e.g. Residential Building, Block A"
              className={inputCls}
            />
          </FieldGroup>
          <FieldGroup label="Project Number" icon={FiHash}>
            <input
              value={data.projectNo}
              onChange={(e) => set("projectNo", e.target.value)}
              placeholder="e.g. SD-2024-001"
              className={inputCls}
            />
          </FieldGroup>
          <FieldGroup label="Site Location" icon={FiMapPin}>
            <input
              value={data.siteLocation}
              onChange={(e) => set("siteLocation", e.target.value)}
              placeholder="City / District / State"
              className={inputCls}
            />
          </FieldGroup>
          <FieldGroup label="Date" icon={FiCalendar}>
            <input
              type="date"
              value={data.date}
              onChange={(e) => set("date", e.target.value)}
              className={inputCls}
            />
          </FieldGroup>
        </div>
      </motion.div>

      {/* Client Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4"
      >
        <h2 className="text-xs font-black text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-2">
          Client Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup label="Client Name" icon={FiUser}>
            <input
              value={data.clientName}
              onChange={(e) => set("clientName", e.target.value)}
              placeholder="Name of the owner / client"
              className={inputCls}
            />
          </FieldGroup>
          <FieldGroup label="Phone" icon={FiPhone}>
            <input
              value={data.clientPhone}
              onChange={(e) => set("clientPhone", e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className={inputCls}
            />
          </FieldGroup>
          <FieldGroup label="Email" icon={FiMail}>
            <input
              value={data.clientEmail}
              onChange={(e) => set("clientEmail", e.target.value)}
              placeholder="client@example.com"
              className={inputCls}
            />
          </FieldGroup>
        </div>
      </motion.div>

      {/* Engineering Team Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4"
      >
        <h2 className="text-xs font-black text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-2">
          Engineering Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup label="Prepared By" icon={FiUser}>
            <input
              value={data.preparedBy}
              onChange={(e) => set("preparedBy", e.target.value)}
              placeholder="Design engineer's name"
              className={inputCls}
            />
          </FieldGroup>
          <FieldGroup label="Checked By" icon={FiCheckCircle}>
            <input
              value={data.checkedBy}
              onChange={(e) => set("checkedBy", e.target.value)}
              placeholder="Senior engineer / reviewer"
              className={inputCls}
            />
          </FieldGroup>
          <div className="sm:col-span-2">
            <FieldGroup label="Project Description" icon={FiFileText}>
              <textarea
                value={data.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                placeholder="Brief description of structural scope or design intent…"
                className={`${inputCls} resize-none`}
              />
            </FieldGroup>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="flex justify-end"
      >
        <button
          disabled={!projectReady}
          onClick={() => navigate("/structure/beam")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 shadow-sm ${
            projectReady
              ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          Start Designing
          <FiArrowRight size={15} />
        </button>
      </motion.div>
    </div>
  );
}

export { DEFAULT_SD_PROJECT };
