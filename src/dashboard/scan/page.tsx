"use client";

import { useNavigate } from "react-router-dom";

export default function QrScanPage() {
  const navigate = useNavigate();

  return (
    <div className="kv-root min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold">QR Scanner</h1>
        <p className="mt-2 text-sm text-slate-600">
          Scan page placeholder. Navigation from the home page is enabled.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border px-4 py-2 text-sm font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
