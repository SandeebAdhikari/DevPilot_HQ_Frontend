"use client";

import BlurDivIn from "@/components/Animation/BlurDivIn";
import React, { useState } from "react";

type BackendCheck = {
  id: "health" | "schema" | "auth" | "jobs";
  label: string;
  command: string;
  summary: string;
  status: "Healthy" | "Warning" | "Needs Attention";
  statusTone: string;
  metrics: Array<{ key: string; value: string }>;
  logs: string[];
};

const checks: BackendCheck[] = [
  {
    id: "health",
    label: "Health Check",
    command: "GET /api/devpilot/health",
    summary: "Validate API uptime and core service dependencies.",
    status: "Healthy",
    statusTone:
      "border-[#d9f99d]/45 bg-[rgba(217,249,157,0.12)] text-[#d9f99d]",
    metrics: [
      { key: "API Latency", value: "82ms" },
      { key: "DB Ping", value: "21ms" },
      { key: "Queue", value: "Connected" },
    ],
    logs: [
      "[ping] service gateway reachable",
      "[db] postgres connection stable",
      "[queue] worker heartbeat active",
      "[result] backend ready for command runs",
    ],
  },
  {
    id: "schema",
    label: "Schema Drift",
    command: "POST /api/devpilot/checks/schema-drift",
    summary: "Compare repository models against live backend contracts.",
    status: "Warning",
    statusTone:
      "border-[#fde68a]/45 bg-[rgba(253,230,138,0.12)] text-[#fde68a]",
    metrics: [
      { key: "Contracts Scanned", value: "34" },
      { key: "Drift Found", value: "2" },
      { key: "Severity", value: "Medium" },
    ],
    logs: [
      "[scan] loaded openapi + orm metadata",
      "[drift] InvoiceDto missing taxCategory",
      "[drift] UserSession ttl type mismatch",
      "[next] generate patch suggestions",
    ],
  },
  {
    id: "auth",
    label: "Auth Guard",
    command: "POST /api/devpilot/checks/auth-guard",
    summary: "Trace auth middleware and validate role gate coverage.",
    status: "Needs Attention",
    statusTone:
      "border-[#fca5a5]/45 bg-[rgba(252,165,165,0.11)] text-[#fecaca]",
    metrics: [
      { key: "Routes Checked", value: "57" },
      { key: "Unprotected", value: "1" },
      { key: "Risk", value: "High" },
    ],
    logs: [
      "[trace] auth middleware chain mapped",
      "[warn] /api/admin/report missing role guard",
      "[impact] reachable from internal dashboard",
      "[next] apply policy patch before release",
    ],
  },
  {
    id: "jobs",
    label: "Background Jobs",
    command: "GET /api/devpilot/checks/jobs",
    summary: "Inspect scheduled workers, retries, and error churn.",
    status: "Healthy",
    statusTone:
      "border-[#c4b5fd]/45 bg-[rgba(196,181,253,0.12)] text-[#ddd6fe]",
    metrics: [
      { key: "Workers", value: "9 online" },
      { key: "Fail Rate", value: "0.8%" },
      { key: "Retry Window", value: "5m" },
    ],
    logs: [
      "[jobs] cron workers synchronized",
      "[retry] stale_invoice_cleanup recovered",
      "[errors] no critical failures in 24h",
      "[result] job lane stable",
    ],
  },
];

const BackendInteractiveChecks = () => {
  const [activeId, setActiveId] = useState<BackendCheck["id"]>("health");
  const active = checks.find((item) => item.id === activeId) ?? checks[0];

  return (
    <section className="mb-32">
      <BlurDivIn className="origin-top">
        <div className="mb-8 mx-auto max-w-4xl text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-secondary">
            Backend Checks
          </p>
          <h2 className="text-4xl font-bold text-primary">
            Interactive backend validation, before you run commands.
          </h2>
        </div>

        <div className="overflow-hidden rounded-[30px] border border-[rgba(255,241,118,0.18)] bg-[linear-gradient(180deg,#07080b,#0b0d12)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.45)] md:p-7">
          <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="rounded-2xl border border-[rgba(255,241,118,0.16)] bg-[rgba(255,255,255,0.02)] p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#8f939e]">
                Check Types
              </p>
              <div className="space-y-2">
                {checks.map((check) => {
                  const selected = check.id === active.id;
                  return (
                    <button
                      key={check.id}
                      type="button"
                      onClick={() => setActiveId(check.id)}
                      className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${
                        selected
                          ? "border-[rgba(255,241,118,0.45)] bg-[rgba(255,241,118,0.12)]"
                          : "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,241,118,0.32)] hover:bg-[rgba(255,241,118,0.07)]"
                      }`}
                    >
                      <p className="text-sm font-medium text-[#f4e7a8]">{check.label}</p>
                      <p className="mt-1 text-xs text-[#9ea2ae]">{check.summary}</p>
                    </button>
                  );
                })}
              </div>
            </aside>

            <div className="rounded-2xl border border-[rgba(255,241,118,0.16)] bg-[rgba(255,255,255,0.02)] p-4 md:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(255,255,255,0.12)] pb-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8f939e]">
                    Interactive Run
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-[#f8f2c8]">
                    {active.label}
                  </h3>
                </div>
                <div className={`rounded-full border px-3 py-1 text-xs ${active.statusTone}`}>
                  {active.status}
                </div>
              </div>

              <div className="rounded-xl border border-[rgba(255,241,118,0.24)] bg-[#050609] p-3 font-mono text-xs text-[#ffe98a]">
                <span className="text-[#8f939e]">$ </span>
                {active.command}
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {active.metrics.map((metric) => (
                  <div
                    key={metric.key}
                    className="rounded-xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] px-3 py-2"
                  >
                    <p className="text-xs uppercase tracking-[0.12em] text-[#8f939e]">
                      {metric.key}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#eceff5]">{metric.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 font-mono text-xs text-[#cfd3dd]">
                {active.logs.map((line) => (
                  <p
                    key={line}
                    className="rounded-lg border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] px-3 py-2"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </BlurDivIn>
    </section>
  );
};

export default BackendInteractiveChecks;
