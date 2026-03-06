"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import React, { useState } from "react";

const shippedGroups = [
  {
    title: "Core modes",
    items: ["onboard", "explain", "refactor", "trace-entry / trace-symbol"],
  },
  {
    title: "Trace outputs",
    items: ["md", "json", "mermaid", "ENTRY_TRACE + SYMBOL_TRACE files"],
  },
  {
    title: "Operations",
    items: [
      "--preview-prompt",
      "--generate-map",
      "--clean",
      "--relmap",
      "--list-logs / --restore-log / --cleanup-logs",
    ],
  },
  {
    title: "Artifacts",
    items: [
      "repomap.json + repomap_cache.json",
      "relmap.json",
      "README_AI.md",
      "README_SUMMARY.md",
    ],
  },
];

const plannedItems = [
  {
    flag: "--refresh-map",
    text: "Incrementally update maps after file edits without full re-scan.",
    readmeSource: "README: planned to release",
    uxPlacement: "Map settings panel and project sync controls",
  },
  {
    flag: "--trace-origin",
    text: "Trace where a class/function originated.",
    readmeSource: "README: foundation for future features",
    uxPlacement: "Trace workspace graph node actions",
  },
  {
    flag: "--explain-connections",
    text: "Visualize file-to-file logic relationships.",
    readmeSource: "README: foundation for future features",
    uxPlacement: "Explain mode relationship sidebar",
  },
  {
    flag: "--impact",
    text: "Estimate downstream blast radius from changed symbols/files.",
    readmeSource: "README: foundation for future features",
    uxPlacement: "Release readiness and risk panel",
  },
];

const AdoptionScenarios = () => {
  const [activePlannedFlag, setActivePlannedFlag] = useState<string | null>(
    null,
  );

  return (
    <section className="relative mb-32">
      <SectionHeading
        title="Backend Truth: Shipped vs Planned"
        description="Everything below is mapped directly from the backend README: current capabilities on the left, explicit roadmap items on the right."
        stepLabel="Step 4 · Capability Reality"
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.45 }}
        className="space-y-4"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-[rgba(134,239,172,0.26)] bg-[linear-gradient(160deg,rgba(8,30,39,0.94),rgba(7,18,30,0.92))] p-5 shadow-[0_22px_64px_rgba(2,6,23,0.5)] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(74,222,128,0.16),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(167,243,208,0.75),transparent)]" />
            <div className="relative mb-5 flex items-center justify-between">
              <h4 className="text-xl font-semibold tracking-tight text-primary">
                Shipped Now
              </h4>
              <span className="rounded-full border border-[rgba(134,239,172,0.42)] bg-[linear-gradient(180deg,rgba(20,83,45,0.55),rgba(6,78,59,0.35))] px-3 py-1 text-xs font-semibold tracking-[0.08em] text-[#bbf7d0]">
                Live
              </span>
            </div>

            <div className="relative grid gap-3 sm:grid-cols-2">
              {shippedGroups.map((group) => (
                <div
                  key={group.title}
                  className="rounded-2xl border border-[rgba(167,243,208,0.15)] bg-[linear-gradient(180deg,rgba(3,13,24,0.88),rgba(2,10,20,0.8))] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                >
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#99f6e4]">
                    {group.title}
                  </p>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <p
                        key={item}
                        className="rounded-lg border border-[rgba(148,163,184,0.18)] bg-[rgba(8,22,38,0.72)] px-2.5 py-1.5 font-mono text-xs text-[#dbe7f8]"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-[rgba(165,180,252,0.36)] bg-[linear-gradient(155deg,rgba(21,28,54,0.94),rgba(11,18,38,0.92))] p-5 shadow-[0_22px_64px_rgba(2,6,23,0.52)] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.18),transparent_56%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(199,210,254,0.75),transparent)]" />
            <div className="relative mb-5 flex items-center justify-between">
              <h4 className="text-xl font-semibold tracking-tight text-primary">
                Planned Next
              </h4>
              <span className="rounded-full border border-[rgba(165,180,252,0.45)] bg-[linear-gradient(180deg,rgba(79,70,229,0.32),rgba(67,56,202,0.2))] px-3 py-1 text-xs font-semibold tracking-[0.08em] text-[#dbe2ff]">
                Roadmap
              </span>
            </div>

            <div className="space-y-3.5">
              <p className="mb-2 text-xs tracking-[0.03em] text-[#c7d2fe]">
                Click a roadmap item to expand product placement details.
              </p>
              {plannedItems.map((item, index) => (
                <button
                  key={item.flag}
                  type="button"
                  onClick={() => setActivePlannedFlag(item.flag)}
                  className={`group relative w-full rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                    activePlannedFlag === item.flag
                      ? "border-[rgba(199,210,254,0.5)] bg-[linear-gradient(180deg,rgba(45,58,107,0.78),rgba(22,33,67,0.7))] shadow-[0_14px_35px_rgba(67,56,202,0.22)]"
                      : "border-[rgba(148,163,184,0.2)] bg-[rgba(7,14,31,0.75)] hover:-translate-y-0.5 hover:border-[rgba(199,210,254,0.38)] hover:bg-[rgba(20,31,59,0.76)]"
                  }`}
                >
                  <span
                    className={`absolute inset-y-0 left-0 w-1 rounded-l-2xl ${
                      activePlannedFlag === item.flag
                        ? "bg-[linear-gradient(180deg,#c7d2fe,#818cf8)]"
                        : "bg-[rgba(129,140,248,0.35)]"
                    }`}
                  />
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-[rgba(199,210,254,0.42)] bg-[rgba(165,180,252,0.18)] px-1.5 text-[10px] font-semibold text-[#e0e7ff]">
                      {index + 1}
                    </span>
                    <p className="inline-block rounded-md border border-[rgba(199,210,254,0.42)] bg-[rgba(165,180,252,0.15)] px-2.5 py-1 font-mono text-xs text-[#e0e7ff]">
                      {item.flag}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#dbe1ee]">
                    {item.text}
                  </p>
                  {activePlannedFlag === item.flag ? (
                    <div className="mt-3 rounded-xl border border-[rgba(199,210,254,0.34)] bg-[rgba(10,21,47,0.84)] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                      <p className="text-sm text-[#dbe1ee]">
                        Suggested product placement: {item.uxPlacement}
                      </p>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[#9aa7c1]">
                        {item.readmeSource}
                      </p>
                    </div>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AdoptionScenarios;
