"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Key01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  NoteIcon,
  QrCodeIcon,
  Copy01Icon,
  Share01Icon,
  Cancel01Icon,
  Alert01Icon,
  InformationCircleIcon
} from "@hugeicons/core-free-icons";

// Central theme token mappings matching Karevo visual hierarchy
const c = {
  signal: "#3452D9",
  verify: "#1C8C74",
  danger: "#DF4949",
};

interface TokenConfig {
  categories: string[];
  expiry: string;
  label: string;
}

export default function CreateShareTokenPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Form Parameters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expiryOption, setExpiry] = useState<string>("24h");
  const [tokenLabel, setLabel] = useState<string>("");

  // Generated Outputs Mock
  const [generatedPIN, setGeneratedPIN] = useState("");

  const recordCategories = [
    { id: "id", label: "Basic ID Profile", desc: "Legal names, gender registration, age brackets" },
    { id: "blood", label: "Blood Type Index", desc: "Verified laboratory blood type group parameters" },
    { id: "allergies", label: "Clinical Allergies", desc: "Environmental and pharmaceutical substance records" },
    { id: "vaccines", label: "Vaccination History", desc: "Immunization series tracking and provider log" },
    { id: "scripts", label: "Active Prescriptions", desc: "Current medication details and dosing intervals" },
    { id: "full", label: "Complete Medical Record", desc: "All system profiles combined under strict audit logs" },
  ];

  const expiryOptions = [
    { value: "1h", label: "1 Hour" },
    { value: "24h", label: "24 Hours" },
    { value: "7d", label: "7 Days" },
    { value: "single", label: "Single Use" },
  ];

  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleNavBack = () => {
    if (selectedCategories.length > 0 || tokenLabel.trim()) {
      setShowExitConfirm(true);
    } else {
      navigate("/dashboard");
    }
  };

  const executeTokenGenerationPipeline = () => {
    if (selectedCategories.length === 0) return;

    setLoading(true);
    setError(null);

    // Simulate cryptographic authorization delay
    setTimeout(() => {
      // Create random alphanumeric validation key
      const secureSeed = Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + 
                         Math.random().toString(36).substring(2, 6).toUpperCase();
      
      setGeneratedPIN(secureSeed);
      setLoading(false);
      setStep(2);
    }, 1100);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPIN);
    alert("Token validation string copied to security clipboard.");
  };

  // Convert key selections into human strings for summarizing views
  const getSelectionsSummary = () => {
    const labels = recordCategories
      .filter((cat) => selectedCategories.includes(cat.id))
      .map((cat) => cat.label.replace(" Profile", "").replace(" Index", ""));
    return labels.join(", ");
  };

  const getExpiryLabel = () => {
    return expiryOptions.find((opt) => opt.value === expiryOption)?.label || expiryOption;
  };

  const isFormValid = selectedCategories.length > 0;

  return (
    <div className="kv-root min-h-screen bg-slate-50/40 text-[#10151C] transition-colors duration-300 dark:bg-[#0A0E1A] dark:text-[#F2F4F7]">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        
        {/* ── HEADER BLOCK CONTROLLER ── */}
        <header className="mb-8 flex items-center justify-between border-b pb-5" style={{ borderColor: "var(--kv-card-border)" }}>
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={step === 1 ? handleNavBack : () => navigate("/dashboard")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all hover:scale-105 active:scale-95"
              style={{ borderColor: "var(--kv-card-border)", background: "var(--kv-card-bg)" }}
              aria-label="Navigate back"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </button>
            <div>
              <h1 className="kv-display text-lg font-bold tracking-tight sm:text-xl">
                Create a share token
              </h1>
              <p className="kv-body text-xs sm:text-sm" style={{ color: "var(--kv-ink-soft)" }}>
                {step === 1 ? "Configure temporary dataset permissions link." : "Encryption token pipeline live and operational."}
              </p>
            </div>
          </div>
        </header>

        {/* INTERCEPTOR: UNSAVED EXIT CONFIRM DIALOG */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-2xl border bg-white p-5 shadow-xl dark:bg-[#0E1322]" style={{ borderColor: "var(--kv-card-border)" }}>
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <HugeiconsIcon icon={Alert01Icon} size={20} />
                </div>
                <div>
                  <h4 className="kv-display font-semibold text-sm">Discard Configuration?</h4>
                  <p className="kv-body text-xs mt-1 leading-relaxed" style={{ color: "var(--kv-ink-soft)" }}>
                    You have un-generated dataset selections configured. Leaving this view will drop your current parameters.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium border"
                  style={{ borderColor: "var(--kv-card-border)" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-white"
                  style={{ background: c.danger }}
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 1: PARAMETERS CONFIGURATION ENGINE ── */}
        {step === 1 && (
          <div className="space-y-6">
            
            {/* RECORD CATEGORY CHECKLIST SELECTOR */}
            <section className="rounded-2xl border p-5 shadow-sm" style={{ background: "var(--kv-card-bg)", borderColor: "var(--kv-card-border)" }}>
              <h3 className="kv-display text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--kv-ink-soft)" }}>
                Select datasets to authenticate
              </h3>
              
              <div className="space-y-3">
                {recordCategories.map((cat) => {
                  const checked = selectedCategories.includes(cat.id);
                  return (
                    <label
                      key={cat.id}
                      className="flex gap-3.5 p-3.5 rounded-xl border cursor-pointer select-none transition-all items-start group"
                      style={{ 
                        borderColor: checked ? c.signal : "var(--kv-card-border)",
                        background: checked ? "rgba(52, 82, 217, 0.02)" : "transparent"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCategory(cat.id)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-[#3452D9] focus:ring-[#3452D9]/30 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="kv-display text-[13.5px] font-semibold block transition-colors group-hover:text-[#3452D9]">
                          {cat.label}
                        </span>
                        <span className="kv-body text-xs leading-normal block mt-0.5" style={{ color: "var(--kv-ink-soft)" }}>
                          {cat.desc}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* EXPIRY INTERVAL SELECTOR GRIDS */}
            <section className="rounded-2xl border p-5 shadow-sm" style={{ background: "var(--kv-card-bg)", borderColor: "var(--kv-card-border)" }}>
              <h3 className="kv-display text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--kv-ink-soft)" }}>
                Set permission expiry window
              </h3>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {expiryOptions.map((opt) => {
                  const active = expiryOption === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setExpiry(opt.value)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl border font-medium text-xs gap-1 transition-all"
                      style={{
                        borderColor: active ? c.signal : "var(--kv-card-border)",
                        background: active ? "rgba(52, 82, 217, 0.06)" : "var(--kv-card-bg)",
                        color: active ? c.signal : "var(--kv-ink)"
                      }}
                    >
                      <HugeiconsIcon icon={Clock01Icon} size={14} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* OPTIONAL DESCRIPTIVE TEXT LINK LABEL */}
            <section className="rounded-2xl border p-5 shadow-sm" style={{ background: "var(--kv-card-bg)", borderColor: "var(--kv-card-border)" }}>
              <div className="flex items-center gap-1.5 mb-2">
                <HugeiconsIcon icon={NoteIcon} size={14} style={{ color: "var(--kv-ink-soft)" }} />
                <h3 className="kv-display text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--kv-ink-soft)" }}>
                  Token Label Descriptor <span className="lowercase font-normal tracking-normal text-slate-400">(optional)</span>
                </h3>
              </div>
              <input
                type="text"
                value={tokenLabel}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Dr. Adaeze — Clinical Audit Verification"
                className="w-full bg-transparent border rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3452D9]/30 transition-all placeholder:text-slate-400"
                style={{ borderColor: "var(--kv-card-border)" }}
              />
            </section>

            {/* SUBMIT EXECUTIVE INTERFACE BANNER */}
            <button
              type="button"
              disabled={!isFormValid || loading}
              onClick={executeTokenGenerationPipeline}
              className="w-full py-4 rounded-xl text-sm font-semibold text-white shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 active:scale-[0.99]"
              style={{ background: c.signal }}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Computing Crypto Keys...</span>
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={Key01Icon} size={16} />
                  <span>Generate Temporary Share Token</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* ── STEP 2: SECURE DISPLAY HUB ── */}
        {step === 2 && (
          <div className="space-y-6 animate-slide-up">
            
            {/* PRIMARY SYSTEM EMBED VALUE DISPLAY CONTAINER */}
            <section className="rounded-2xl border p-6 shadow-sm text-center flex flex-col items-center gap-5" style={{ background: "var(--kv-card-bg)", borderColor: "var(--kv-card-border)" }}>
              
              {/* QR Render Target Matrix */}
              <div className="p-4 rounded-2xl bg-white border inline-block shadow-inner relative group" style={{ borderColor: "var(--kv-card-border)" }}>
                <div className="grid grid-cols-6 gap-1 h-36 w-34 bg-white p-2">
                  {Array.from({ length: 36 }).map((_, i) => {
                    const on = (i * 13 + (i % 6)) % 7 < 3;
                    return <div key={i} className="h-4 w-4 rounded-sm" style={{ background: on ? "#10151C" : "#F2F4F7" }} />;
                  })}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                  <HugeiconsIcon icon={QrCodeIcon} size={24} className="text-slate-800" />
                </div>
              </div>

              {/* Underlying Short PIN code wrapper block */}
              <div className="space-y-1.5 w-full max-w-sm">
                <span className="kv-mono text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--kv-ink-soft)" }}> Alphanumeric Access PIN </span>
                <div className="kv-mono text-xl sm:text-2xl font-bold tracking-widest bg-slate-100 dark:bg-slate-950 px-4 py-3 rounded-xl border text-center select-all" style={{ borderColor: "var(--kv-card-border)" }}>
                  {generatedPIN}
                </div>
              </div>

              {/* Config summary tag matrix snippet */}
              <div className="border-t pt-4 w-full text-center space-y-1" style={{ borderColor: "var(--kv-card-border)" }}>
                <p className="kv-body text-xs" style={{ color: "var(--kv-ink-soft)" }}>
                  Expires window limits: <span className="font-semibold text-amber-500 dark:text-amber-400">{getExpiryLabel()}</span>
                </p>
                <p className="kv-display text-xs font-medium px-4 truncate" style={{ color: "var(--kv-ink)" }}>
                  Datasets: <span className="italic font-normal">{getSelectionsSummary()}</span>
                </p>
                {tokenLabel.trim() && (
                  <p className="kv-mono text-[10px] tracking-wide mt-1 inline-block bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border" style={{ borderColor: "var(--kv-card-border)", color: "var(--kv-ink-soft)" }}>
                    Label: {tokenLabel}
                  </p>
                )}
              </div>
            </section>

            {/* LOWER UTILITY TRIGGER ACTIONS MAP */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex flex-col items-center justify-center p-3 rounded-xl border font-medium text-xs gap-1.5 transition-all bg-white hover:bg-slate-50 dark:bg-[#141927] dark:hover:bg-slate-800/50"
                style={{ borderColor: "var(--kv-card-border)", color: "var(--kv-ink)" }}
              >
                <HugeiconsIcon icon={Copy01Icon} size={15} />
                Copy String
              </button>

              <button
                type="button"
                onClick={() => alert("Ecosystem messaging integration triggered.")}
                className="flex flex-col items-center justify-center p-3 rounded-xl border font-medium text-xs gap-1.5 transition-all bg-white hover:bg-slate-50 dark:bg-[#141927] dark:hover:bg-slate-800/50"
                style={{ borderColor: "var(--kv-card-border)", color: "var(--kv-ink)" }}
              >
                <HugeiconsIcon icon={Share01Icon} size={15} />
                Share Link
              </button>

              <button
                type="button"
                onClick={() => { if(confirm("Revoke this token immediately?")) { setStep(1); setSelectedCategories([]); setLabel(""); } }}
                className="flex flex-col items-center justify-center p-3 rounded-xl border font-medium text-xs gap-1.5 transition-all bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400"
                style={{ borderColor: "rgba(223, 73, 73, 0.2)" }}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={15} />
                Revoke Now
              </button>
            </div>

            {/* LEGAL LIABILITY DISCLAIMER STACK STRIP */}
            <div className="flex gap-2.5 p-4 rounded-xl border border-blue-500/10 bg-blue-500/[0.02] text-xs">
              <HugeiconsIcon icon={InformationCircleIcon} size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="kv-body leading-normal text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-200">Security Parameters Notice:</span> Anyone possessing this operational matrix sequence can read designated records until it hits parameter metrics limits or is manually purged.
              </p>
            </div>

            {/* COMPLETE RESOLUTION MASTER LINK */}
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-center text-white transition-all active:scale-[0.99] hover:opacity-90"
              style={{ background: c.verify }}
            >
              Complete Pipeline Workflow
            </button>
          </div>
        )}

      </div>

      {/* Local contextual style sheets preserving system metrics */}
      <style>{`
        .kv-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui; }
        .kv-body { font-family: 'Inter', ui-sans-serif, system-ui; }
        .kv-mono { font-family: ui-monospace, monospace; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fadeIn 200ms ease-out forwards; }
        .animate-slide-up { animation: slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}