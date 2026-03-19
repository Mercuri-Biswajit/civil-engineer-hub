// src/components/BBS/ProjectDetails.jsx
import React from "react";
import {
  Card,
  CardHeader,
  FormSection,
  Field,
  Button,
  Divider,
} from "./ui.jsx";

const today = () => new Date().toISOString().split("T")[0];

export const DEFAULT_PROJECT = {
  projectName: "",
  clientName: "",
  clientAddress: "",
  location: "",
  engineerName: "Biswajit Deb Barman",
  engineerPhone: "",
  engineerEmail: "biswajitdebbarman.civil@gmail.com",
  firmName: "Urban Matrix",
  date: today(),
  refNo: "",
  remarks: "",
};

export default function ProjectDetails({
  details,
  setDetails,
  onStart,
  projectReady,
}) {
  const u = (key) => (val) => setDetails((p) => ({ ...p, [key]: val }));

  return (
    <div className="p-4 lg:p-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
        <FormSection title="Core Information" icon="🏗️">
          <Field
            label="Project Name"
            value={details.projectName}
            onChange={u("projectName")}
            placeholder="e.g. G+2 Residential Building"
            type="text"
            icon="🏢"
            className="sm:col-span-2"
          />
          <Field
            label="Date"
            value={details.date}
            onChange={u("date")}
            type="date"
            icon="📅"
          />
          <Field
            label="Ref No."
            value={details.refNo}
            onChange={u("refNo")}
            placeholder="BBS/2026/001"
            type="text"
            icon="🔖"
          />
          <Field
            label="Site Location"
            value={details.location}
            onChange={u("location")}
            placeholder="e.g. Salt Lake, Sector V"
            type="text"
            icon="📍"
            className="sm:col-span-2"
          />
        </FormSection>

        <FormSection title="Client Relations" icon="👤">
          <Field
            label="Client Name"
            value={details.clientName}
            onChange={u("clientName")}
            placeholder="e.g. Ramesh Kumar Das"
            type="text"
            icon="👨‍💼"
            className="sm:col-span-2"
          />
          <Field
            label="Client Address"
            value={details.clientAddress}
            onChange={u("clientAddress")}
            placeholder="e.g. Bhawanipur, Kolkata"
            type="text"
            icon="🏠"
            className="sm:col-span-2"
          />
        </FormSection>

        <FormSection title="Professional Team" icon="👔">
          <Field
            label="Lead Engineer"
            value={details.engineerName}
            onChange={u("engineerName")}
            placeholder="Er. Amit Banerjee"
            type="text"
            icon="👷"
          />
          <Field
            label="Engineering Firm"
            value={details.firmName}
            onChange={u("firmName")}
            placeholder="Urban Matrix"
            type="text"
            icon="🏢"
          />
          <Field
            label="Contact Number"
            value={details.engineerPhone}
            onChange={u("engineerPhone")}
            placeholder="9876543210"
            type="tel"
            icon="📱"
          />
          <Field
            label="Official Email"
            value={details.engineerEmail}
            onChange={u("engineerEmail")}
            placeholder="engineer@office.com"
            type="email"
            icon="📧"
          />
        </FormSection>

        <FormSection title="Design Metadata" icon="📝">
          <Field
            label="Remarks & Constraints"
            value={details.remarks}
            onChange={u("remarks")}
            placeholder="e.g. Steel as per HYSD Fe-500D..."
            type="text"
            icon="✍️"
            className="sm:col-span-2"
          />
        </FormSection>
      </div>

      {onStart && (
        <div className="flex justify-center mt-8">
          <Button
            variant="primary"
            size="md"
            onClick={onStart}
            disabled={!projectReady}
            className="rounded-full px-8 py-2.5 h-auto text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            Launch BBS Calculator 🚀
          </Button>
        </div>
      )}
    </div>
  );
}
