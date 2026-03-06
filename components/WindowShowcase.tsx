"use client";

import BlurDivIn from "@/components/Animation/BlurDivIn";
import React, { useEffect, useRef, useState } from "react";

type ToolId = "onboard" | "explain" | "refactor" | "trace";
type ActiveTab = "overview" | "artifacts" | "activity";
type DragPane = "left" | "right" | null;

type ToolView = {
  id: ToolId;
  label: string;
  title: string;
  status: string;
  summary: string;
  model: string;
  timeline: string[];
  highlights: string[];
  artifacts: string[];
  responseBlocks: Array<{
    title: string;
    body: string;
  }>;
};

const toolViews: ToolView[] = [
  {
    id: "onboard",
    label: "Onboard",
    title: "Repository Onboarding",
    status: "Ready",
    summary: "Build a complete context baseline before touching legacy code.",
    model: "llama3",
    timeline: [
      "Map source tree and ignore noise",
      "Build relationship map and ownership hints",
      "Publish architecture summary and hotspots",
    ],
    highlights: [
      "Fast repo understanding for new engineers",
      "Architecture docs generated in-session",
      "Safer starting point for all follow-up runs",
    ],
    artifacts: [
      "repomap.json",
      "repomap_cache.json",
      "relmap.json",
      "README_AI.md",
      "README_SUMMARY.md",
    ],
    responseBlocks: [
      {
        title: "Coverage",
        body: "47 logic files mapped with service boundaries and critical dependency paths.",
      },
      {
        title: "Risk Focus",
        body: "Payment reconciliation and checkout session guards flagged for careful change handling.",
      },
    ],
  },
  {
    id: "explain",
    label: "Explain",
    title: "File Intelligence",
    status: "Active",
    summary:
      "Deeply explain runtime behavior, intent, and operational risk for selected files.",
    model: "llama3",
    timeline: [
      "Resolve exact file context",
      "Apply language-aware analysis strategy",
      "Produce actionable explanation and follow-up guidance",
    ],
    highlights: [
      "Runtime-first explanations",
      "Maintainability and blast-radius context",
      "Follow-up workflow without losing context",
    ],
    artifacts: [
      "explanation.md",
      "prompt_audit.txt",
      "file_context_snapshot.txt",
      "session_followups.log",
    ],
    responseBlocks: [
      {
        title: "Runtime Role",
        body: "Coordinates invoice totals, discount policy checks, and ledger persistence boundaries.",
      },
      {
        title: "Change Impact",
        body: "Directly affects totals, payment capture behavior, and reconciliation correctness.",
      },
    ],
  },
  {
    id: "refactor",
    label: "Refactor",
    title: "Refactor Planning",
    status: "Staged",
    summary:
      "Generate safe, behavior-preserving refactor plans for high-risk legacy modules.",
    model: "codellama",
    timeline: [
      "Detect mixed concerns and coupling hotspots",
      "Recommend extraction boundaries and sequence",
      "Produce risk-labeled implementation checklist",
    ],
    highlights: [
      "Refactor guidance with stability-first guardrails",
      "Issue severity and impact grouping",
      "Practical split plan for engineering teams",
    ],
    artifacts: [
      "refactor_plan.md",
      "risk_matrix.json",
      "candidate_module_split.md",
      "review_checklist.md",
    ],
    responseBlocks: [
      {
        title: "Primary Concern",
        body: "State, transformation logic, and UI concerns are tightly coupled in one heavy component.",
      },
      {
        title: "Recommended Direction",
        body: "Extract data hook and mapping utilities, then isolate action controls for stable iteration.",
      },
    ],
  },
  {
    id: "trace",
    label: "Trace",
    title: "Impact Trace",
    status: "Needs map",
    summary:
      "Trace entrypoints and symbols to estimate downstream impact before release.",
    model: "analysis",
    timeline: [
      "Validate mapping prerequisites",
      "Traverse reachable graph paths",
      "Report affected modules and high-risk edges",
    ],
    highlights: [
      "Entry and symbol path exploration",
      "Impact-first release confidence",
      "Visual trace outputs for team review",
    ],
    artifacts: [
      "ENTRY_TRACE.md",
      "ENTRY_TRACE.mmd",
      "SYMBOL_TRACE_AuthService.json",
      "trace_summary.md",
    ],
    responseBlocks: [
      {
        title: "Reachability",
        body: "AuthService touches middleware, token refresh handling, and checkout session protections.",
      },
      {
        title: "Critical Edge",
        body: "Checkout/session_guard remains the highest-risk consumer and should receive targeted tests.",
      },
    ],
  },
];

const theme = {
  onboard: "border-[#a5b4fc]/35 bg-[rgba(165,180,252,0.1)] text-[#dbe2ff]",
  explain: "border-[#7dd3fc]/35 bg-[rgba(125,211,252,0.1)] text-[#d7f1ff]",
  refactor: "border-[#93c5fd]/35 bg-[rgba(147,197,253,0.1)] text-[#dbeafe]",
  trace: "border-[#c4b5fd]/35 bg-[rgba(196,181,253,0.12)] text-[#ede9fe]",
} as const;

const modelOptions = ["llama3", "codellama", "mistral", "analysis"];
const githubRepoOptions = [
  { name: "legacy-billing", branches: ["main", "develop", "release/v1.2"] },
  { name: "checkout-service", branches: ["main", "staging", "hotfix/session"] },
  { name: "admin-portal", branches: ["main", "qa", "feature/invoice-audit"] },
] as const;

const UiIcon = ({
  path,
  className = "h-3.5 w-3.5",
}: {
  path: string;
  className?: string;
}) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
    <path
      d={path}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WindowShowcase = () => {
  const [activeToolId, setActiveToolId] = useState<ToolId>("onboard");
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [leftWidth, setLeftWidth] = useState(220);
  const [rightWidth, setRightWidth] = useState(280);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [dragPane, setDragPane] = useState<DragPane>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  const [modelInput, setModelInput] = useState(toolViews[0].model);
  const [traceFormat, setTraceFormat] = useState<"md" | "json" | "mermaid">("mermaid");
  const [selectedRepo, setSelectedRepo] = useState<(typeof githubRepoOptions)[number]["name"]>(
    githubRepoOptions[0].name
  );
  const [branchName, setBranchName] = useState(githubRepoOptions[0].branches[0]);
  const [uploadedSource, setUploadedSource] = useState("No file uploaded");
  const [lastRunSummary, setLastRunSummary] = useState("No runs yet");

  const layoutRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTool = toolViews.find((tool) => tool.id === activeToolId) ?? toolViews[0];

  const selectTool = (id: ToolId) => {
    const tool = toolViews.find((item) => item.id === id);
    setActiveToolId(id);
    if (tool) setModelInput(tool.model);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
      if (event.key === "Escape") setPaletteOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const syncViewport = () => setIsDesktop(window.innerWidth >= 1280);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  useEffect(() => {
    if (!dragPane) return;

    const onMove = (event: MouseEvent) => {
      const layout = layoutRef.current;
      if (!layout) return;
      const rect = layout.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;

      if (dragPane === "left") {
        setLeftWidth(Math.max(160, Math.min(340, pointerX)));
      } else {
        const widthFromRight = rect.width - pointerX;
        setRightWidth(Math.max(220, Math.min(420, widthFromRight)));
      }
    };

    const onUp = () => setDragPane(null);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragPane]);

  const computedLeftWidth = leftCollapsed ? 68 : leftWidth;
  const computedRightWidth = rightCollapsed ? 72 : rightWidth;
  const selectedRepoMeta = githubRepoOptions.find((repo) => repo.name === selectedRepo);
  const sourceLabel = uploadedSource !== "No file uploaded" ? uploadedSource : selectedRepo;

  const workspaceName = sourceLabel;

  return (
    <section className="relative mt-24 mb-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-14 left-1/2 h-56 w-[66%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.12),rgba(165,180,252,0.04)_45%,transparent_72%)] blur-3xl"
      />

      <BlurDivIn className="origin-top">
        <div className="window-shell window-showcase-shell overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.12)] bg-[linear-gradient(180deg,rgba(12,14,20,0.98),rgba(8,10,15,1))] shadow-[0_32px_100px_rgba(0,0,0,0.62)]">
          <div className="flex h-11 items-center justify-between border-b border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005))] px-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#fb7185]" />
              <span className="h-3 w-3 rounded-full bg-[#facc15]" />
              <span className="h-3 w-3 rounded-full bg-[#4ade80]" />
            </div>
            <div className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(2,6,23,0.55)] px-3 py-1 font-mono text-[11px] text-secondary">
              DevPilot HQ - {workspaceName}.workspace
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted">
              <button
                type="button"
                onClick={() => setLeftCollapsed((prev) => !prev)}
                className="rounded border border-[rgba(255,255,255,0.12)] px-1.5 py-0.5 hover:text-primary"
              >
                {leftCollapsed ? "Show Nav" : "Hide Nav"}
              </button>
              <button
                type="button"
                onClick={() => setRightCollapsed((prev) => !prev)}
                className="rounded border border-[rgba(255,255,255,0.12)] px-1.5 py-0.5 hover:text-primary"
              >
                {rightCollapsed ? "Show Inspector" : "Hide Inspector"}
              </button>
            </div>
          </div>

          <div
            ref={layoutRef}
            className="grid min-h-[680px] grid-cols-1 xl:min-h-[700px]"
            style={
              isDesktop
                ? {
                    gridTemplateColumns: `${computedLeftWidth}px 10px minmax(0,1fr) 10px ${computedRightWidth}px`,
                  }
                : undefined
            }
          >
            <aside className="border-b border-[rgba(255,255,255,0.08)] bg-[rgba(2,6,23,0.34)] p-3 xl:border-r xl:border-b-0">
              {!leftCollapsed ? (
                <>
                  <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted">Workflows</p>
                  <div className="space-y-2">
                    {toolViews.map((tool) => {
                      const selected = tool.id === activeTool.id;
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => selectTool(tool.id)}
                          className={`window-hover-option w-full rounded-xl border px-3 py-2 text-left transition ${
                            selected
                              ? `${theme[tool.id]} shadow-[0_12px_24px_rgba(2,6,23,0.35)]`
                              : "border-transparent text-secondary hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(2,6,23,0.45)] hover:text-primary"
                          }`}
                        >
                          <p className="flex items-center gap-2 text-sm font-medium">
                            <UiIcon path="M4 12h16M12 4v16" className="h-3 w-3 opacity-85" />
                            {tool.label}
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted">{tool.title}</p>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  {toolViews.map((tool) => {
                    const selected = tool.id === activeTool.id;
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => selectTool(tool.id)}
                        className={`flex h-10 w-full items-center justify-center rounded-lg border text-xs font-semibold transition ${
                          selected
                            ? `${theme[tool.id]}`
                            : "border-transparent text-secondary hover:border-[rgba(255,255,255,0.12)]"
                        }`}
                      >
                        {tool.label[0]}
                      </button>
                    );
                  })}
                </div>
              )}
            </aside>

            <div
              className="group hidden cursor-col-resize xl:flex xl:items-stretch"
              onMouseDown={() => setDragPane("left")}
            >
              <div className="mx-auto w-px bg-[rgba(255,255,255,0.08)] transition group-hover:bg-[rgba(165,180,252,0.55)]" />
            </div>

            <main className="min-w-0 border-b border-[rgba(255,255,255,0.09)] xl:border-r xl:border-b-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(255,255,255,0.09)] px-4 py-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Run Setup</p>
                  <h4 className="text-lg font-semibold text-primary">{activeTool.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] ${theme[activeTool.id]}`}>
                    {activeTool.status}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setLastRunSummary(
                        `${new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} - Started ${activeTool.label} on ${branchName} (${sourceLabel})`
                      )
                    }
                    className="window-hover-button inline-flex items-center gap-1.5 rounded-lg border border-[rgba(165,180,252,0.45)] bg-[rgba(165,180,252,0.14)] px-3 py-1.5 text-xs font-semibold text-primary"
                  >
                    <UiIcon path="M5 12h14M13 6l6 6-6 6" className="h-3.5 w-3.5" />
                    Start Run
                  </button>
                </div>
              </div>

              <div className="border-b border-[rgba(255,255,255,0.09)] px-4 py-3">
                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                  <div className="text-xs text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      <UiIcon path="M12 4v11m0-11l-3 3m3-3l3 3M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
                      Upload Source
                    </span>
                    <div className="mt-1 flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(2,6,23,0.55)] px-2 py-1.5 text-xs text-primary transition hover:border-[rgba(165,180,252,0.45)]"
                      >
                        <UiIcon path="M12 4v11m0-11l-3 3m3-3l3 3M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
                        Upload File
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setUploadedSource(file.name);
                        }}
                      />
                    </div>
                    <p className="mt-1 truncate text-[11px] text-muted">{uploadedSource}</p>
                  </div>

                  <label className="text-xs text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      <UiIcon path="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.94-2.64c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20.07 5 5.07 5.07 0 0 0 20 1.95S18.73 1.6 16 3.48a13.38 13.38 0 0 0-7 0C6.27 1.6 5 1.95 5 1.95A5.07 5.07 0 0 0 4.93 5 5.44 5.44 0 0 0 3.5 8.46c0 5.42 3.3 6.61 6.44 7A3.4 3.4 0 0 0 9 18.1V22" />
                      GitHub Repository
                    </span>
                    <select
                      value={selectedRepo}
                      onChange={(e) => {
                        const repoName = e.target.value as (typeof githubRepoOptions)[number]["name"];
                        const repo = githubRepoOptions.find((item) => item.name === repoName);
                        setSelectedRepo(repoName);
                        if (repo) setBranchName(repo.branches[0]);
                      }}
                      className="mt-1 w-full rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(2,6,23,0.55)] px-2 py-1.5 text-xs text-primary outline-none focus:border-[rgba(165,180,252,0.45)]"
                    >
                      {githubRepoOptions.map((repo) => (
                        <option key={repo.name} value={repo.name} className="bg-[#0b0f17]">
                          {repo.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-[11px] text-muted">GitHub connected</p>
                  </label>

                  <label className="text-xs text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      <UiIcon path="M6 3v12a3 3 0 1 0 3 3V8a3 3 0 1 1 3 3h6" />
                      Branch
                    </span>
                    <select
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      className="mt-1 w-full rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(2,6,23,0.55)] px-2 py-1.5 text-xs text-primary outline-none focus:border-[rgba(165,180,252,0.45)]"
                    >
                      {(selectedRepoMeta?.branches ?? ["main"]).map((branch) => (
                        <option key={branch} value={branch} className="bg-[#0b0f17]">
                          {branch}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-xs text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      <UiIcon path="M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5" />
                      Model
                    </span>
                    <select
                      value={modelInput}
                      onChange={(e) => setModelInput(e.target.value)}
                      className="mt-1 w-full rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(2,6,23,0.55)] px-2 py-1.5 text-xs text-primary outline-none focus:border-[rgba(165,180,252,0.45)]"
                    >
                      {modelOptions.map((m) => (
                        <option key={m} value={m} className="bg-[#0b0f17]">
                          {m}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {activeToolId === "trace" ? (
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    <label className="text-xs text-secondary">
                      Trace Format
                      <select
                        value={traceFormat}
                        onChange={(e) => setTraceFormat(e.target.value as "md" | "json" | "mermaid")}
                        className="mt-1 w-full rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(2,6,23,0.55)] px-2 py-1.5 text-xs text-primary outline-none focus:border-[rgba(165,180,252,0.45)]"
                      >
                        <option value="md" className="bg-[#0b0f17]">md</option>
                        <option value="json" className="bg-[#0b0f17]">json</option>
                        <option value="mermaid" className="bg-[#0b0f17]">mermaid</option>
                      </select>
                    </label>
                  </div>
                ) : null}
              </div>

              <div className="border-b border-[rgba(255,255,255,0.09)] px-4">
                <div className="flex gap-1 py-2">
                  {(["overview", "artifacts", "activity"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition ${
                        activeTab === tab
                          ? "border border-[rgba(255,255,255,0.14)] bg-[rgba(148,163,184,0.12)] text-primary"
                          : "text-secondary hover:text-primary"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 p-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="window-premium-card rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(15,17,23,0.88)] p-4">
                  <p className="text-xs text-secondary">{activeTool.summary}</p>

                  <div className="mt-3 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#0b0f17] p-3 font-mono text-xs text-[#dbe1ee]">
                    <p>Source: {sourceLabel}</p>
                    <p>Branch: {branchName}</p>
                    <p>Model: {modelInput}</p>
                    <p>Mode: {activeTool.label}</p>
                  </div>

                  <div className="mt-4 space-y-2">
                    {activeTool.timeline.map((step, index) => (
                      <div
                        key={step}
                        className="flex items-start gap-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(2,6,23,0.45)] px-3 py-2"
                      >
                        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[rgba(148,163,184,0.35)] text-[10px] text-secondary">
                          {index + 1}
                        </span>
                        <p className="text-sm text-secondary">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="window-premium-card rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(15,17,23,0.88)] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">Outcome Panels</p>
                  <div className="mt-3 space-y-2">
                    {activeTool.responseBlocks.map((block) => (
                      <div
                        key={block.title}
                        className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(2,6,23,0.45)] p-3"
                      >
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                          {block.title}
                        </p>
                        <p className="mt-1 text-sm text-secondary">{block.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>

            <div
              className="group hidden cursor-col-resize xl:flex xl:items-stretch"
              onMouseDown={() => setDragPane("right")}
            >
              <div className="mx-auto w-px bg-[rgba(255,255,255,0.08)] transition group-hover:bg-[rgba(165,180,252,0.55)]" />
            </div>

            <aside className="p-3">
              {!rightCollapsed ? (
                <>
                  <div className="window-premium-card rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(2,6,23,0.45)] p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Inspector</p>
                    <div className="mt-2 space-y-1.5 text-xs text-secondary">
                      <p className="inline-flex items-center gap-1.5"><UiIcon path="M4 7h16M4 12h16M4 17h10" className="h-3 w-3" /><span className="text-muted">Source:</span> {uploadedSource !== "No file uploaded" ? "Upload" : "GitHub"}</p>
                      <p className="inline-flex items-center gap-1.5"><UiIcon path="M4 12h16M12 4v16" className="h-3 w-3" /><span className="text-muted">Mode:</span> {activeTool.label}</p>
                      <p className="inline-flex items-center gap-1.5"><UiIcon path="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.94-2.64c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20.07 5 5.07 5.07 0 0 0 20 1.95S18.73 1.6 16 3.48a13.38 13.38 0 0 0-7 0C6.27 1.6 5 1.95 5 1.95A5.07 5.07 0 0 0 4.93 5 5.44 5.44 0 0 0 3.5 8.46c0 5.42 3.3 6.61 6.44 7A3.4 3.4 0 0 0 9 18.1V22" className="h-3 w-3" /><span className="text-muted">Repo:</span> {selectedRepo}</p>
                      <p className="inline-flex items-center gap-1.5"><UiIcon path="M6 3v12a3 3 0 1 0 3 3V8a3 3 0 1 1 3 3h6" className="h-3 w-3" /><span className="text-muted">Branch:</span> {branchName}</p>
                      <p className="inline-flex items-center gap-1.5"><UiIcon path="M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5" className="h-3 w-3" /><span className="text-muted">Model:</span> {modelInput}</p>
                    </div>
                  </div>

                  <div className="mt-3 window-premium-card rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(2,6,23,0.45)] p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Artifacts</p>
                    <div className="mt-2 space-y-1.5 font-mono text-[11px] text-secondary">
                      {activeTool.artifacts.map((artifact) => (
                        <p key={artifact} className="rounded-md border border-[rgba(255,255,255,0.1)] px-2 py-1">
                          {artifact}
                        </p>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-start justify-center pt-2">
                  <span className="rounded border border-[rgba(255,255,255,0.12)] px-2 py-1 text-[11px] text-secondary">
                    Inspector
                  </span>
                </div>
              )}
            </aside>
          </div>

          <div className="flex h-9 items-center justify-between border-t border-[rgba(255,255,255,0.09)] bg-[rgba(2,6,23,0.42)] px-4 text-[11px] text-muted">
            <span>Workspace Runtime: Ready</span>
            <span>Branch: {branchName}</span>
            <span>{lastRunSummary}</span>
          </div>
        </div>

        {paletteOpen ? (
          <div className="fixed inset-0 z-[70] grid place-items-center bg-[rgba(2,6,23,0.62)] backdrop-blur-sm">
            <div className="w-[min(640px,92vw)] rounded-2xl border border-[rgba(255,255,255,0.16)] bg-[linear-gradient(180deg,rgba(16,18,24,0.97),rgba(10,12,18,0.98))] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.6)]">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">Command Palette</p>
                <button
                  type="button"
                  onClick={() => setPaletteOpen(false)}
                  className="rounded border border-[rgba(255,255,255,0.14)] px-2 py-1 text-xs text-secondary hover:text-primary"
                >
                  Esc
                </button>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                {toolViews.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      selectTool(tool.id);
                      setPaletteOpen(false);
                    }}
                    className="rounded-xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-left transition hover:border-[rgba(165,180,252,0.45)] hover:bg-[rgba(165,180,252,0.12)]"
                  >
                    <p className="text-sm font-medium text-primary">Switch to {tool.label}</p>
                    <p className="mt-0.5 text-xs text-secondary">{tool.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </BlurDivIn>
    </section>
  );
};

export default WindowShowcase;
