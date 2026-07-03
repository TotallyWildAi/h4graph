"use client";

import { useEffect, useRef, useState } from "react";

type NodeType = "paper" | "method" | "concept" | "author";

type GNode = {
  id: string;
  label: string;
  type: NodeType;
  r: number;
  props: [string, string][];
  template: string;
};

type GEdge = { a: string; b: string; rel: string; flag?: boolean };

const TYPE_COLOR: Record<NodeType, string> = {
  paper: "#a78bfa",
  method: "#22d3ee",
  concept: "#34d399",
  author: "#64748b",
};

const TYPE_LABEL: Record<NodeType, string> = {
  paper: "PAPER",
  method: "METHOD",
  concept: "CONCEPT",
  author: "AUTHOR",
};

const NODES: GNode[] = [
  { id: "p:1021", label: "Longformer (2020)", type: "paper", r: 17, props: [["doi", "10.48550/2004.05150"], ["year", "2020"]], template: "citation_chain@3" },
  { id: "p:1024", label: "BigBird (2020)", type: "paper", r: 16, props: [["doi", "10.48550/2007.14062"], ["year", "2020"]], template: "citation_chain@3" },
  { id: "p:1033", label: "S4 (2021)", type: "paper", r: 17, props: [["doi", "10.48550/2111.00396"], ["year", "2021"]], template: "citation_chain@3" },
  { id: "p:1047", label: "Hyena (2023)", type: "paper", r: 16, props: [["doi", "10.48550/2302.10866"], ["year", "2023"]], template: "method_comparisons@1" },
  { id: "p:1052", label: "Mamba (2023)", type: "paper", r: 18, props: [["doi", "10.48550/2312.00752"], ["year", "2023"]], template: "method_comparisons@1" },
  { id: "p:1088", label: "Zhao et al. (2025)", type: "paper", r: 18, props: [["doi", "10.1234/zhao.2025"], ["year", "2025"], ["status", "CONTRADICTS"]], template: "contradiction_scan@2" },
  { id: "m:2011", label: "Sparse attention", type: "method", r: 14, props: [["class", "attention"], ["papers", "2"]], template: "concept_bridge@2" },
  { id: "m:2014", label: "State-space models", type: "method", r: 15, props: [["class", "recurrence"], ["papers", "3"]], template: "concept_bridge@2" },
  { id: "c:3002", label: "Long-document QA", type: "concept", r: 15, props: [["papers", "4"]], template: "concept_bridge@2" },
  { id: "c:3005", label: "Transformers", type: "concept", r: 14, props: [["papers", "6"]], template: "concept_bridge@2" },
  { id: "a:4008", label: "A. Gu", type: "author", r: 11, props: [["papers", "2"]], template: "citation_chain@3" },
  { id: "a:4011", label: "T. Dao", type: "author", r: 11, props: [["papers", "2"]], template: "citation_chain@3" },
];

const EDGES: GEdge[] = [
  { a: "p:1021", b: "m:2011", rel: "USES_METHOD" },
  { a: "p:1024", b: "m:2011", rel: "USES_METHOD" },
  { a: "p:1024", b: "p:1021", rel: "CITES" },
  { a: "p:1033", b: "m:2014", rel: "USES_METHOD" },
  { a: "p:1047", b: "p:1033", rel: "CITES" },
  { a: "p:1052", b: "m:2014", rel: "USES_METHOD" },
  { a: "p:1052", b: "p:1033", rel: "CITES" },
  { a: "p:1021", b: "c:3002", rel: "EVALUATED_ON" },
  { a: "p:1052", b: "c:3002", rel: "EVALUATED_ON" },
  { a: "p:1088", b: "c:3002", rel: "EVALUATED_ON" },
  { a: "p:1052", b: "c:3005", rel: "OUTPERFORMS" },
  { a: "p:1047", b: "c:3005", rel: "OUTPERFORMS" },
  { a: "p:1088", b: "p:1052", rel: "CONTRADICTS", flag: true },
  { a: "p:1033", b: "a:4008", rel: "AUTHORED_BY" },
  { a: "p:1052", b: "a:4008", rel: "AUTHORED_BY" },
  { a: "p:1052", b: "a:4011", rel: "AUTHORED_BY" },
];

const W = 640;
const H = 430;

// deterministic golden-angle spiral start → identical SSR and first client render
function initialPositions() {
  return NODES.map((n, i) => {
    const t = i * 2.39996;
    const rad = 46 + 34 * Math.sqrt(i);
    return {
      id: n.id,
      x: W / 2 + rad * Math.cos(t),
      y: H / 2 + rad * Math.sin(t) * 0.72,
      vx: 0,
      vy: 0,
    };
  });
}

export default function GraphExplorer() {
  const [positions, setPositions] = useState(initialPositions);
  const [selected, setSelected] = useState<string | null>("p:1088");
  const [query, setQuery] = useState("");
  const [acIdx, setAcIdx] = useState(0);
  const [acOpen, setAcOpen] = useState(false);

  const posRef = useRef(positions);
  const alphaRef = useRef(1);
  const dragRef = useRef<{ id: string; moved: boolean } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // small force simulation, POC constants scaled; cools to a standstill
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      alphaRef.current = 0.5; // settle fast, minimal motion
    }
    let raf = 0;
    const idx = new Map(NODES.map((n, i) => [n.id, i]));
    const tick = () => {
      const P = posRef.current;
      const a = alphaRef.current;
      if (a > 0.02) {
        for (let i = 0; i < P.length; i++) {
          for (let j = i + 1; j < P.length; j++) {
            const dx = P[j].x - P[i].x;
            const dy = P[j].y - P[i].y;
            const d2 = Math.max(dx * dx + dy * dy, 60);
            const f = (3400 / d2) * a;
            const d = Math.sqrt(d2);
            P[i].vx -= (dx / d) * f;
            P[i].vy -= (dy / d) * f;
            P[j].vx += (dx / d) * f;
            P[j].vy += (dy / d) * f;
          }
        }
        for (const e of EDGES) {
          const s = P[idx.get(e.a)!];
          const t = P[idx.get(e.b)!];
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const d = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
          const f = (d - 104) * 0.03 * a;
          s.vx += (dx / d) * f;
          s.vy += (dy / d) * f;
          t.vx -= (dx / d) * f;
          t.vy -= (dy / d) * f;
        }
        for (const p of P) {
          if (dragRef.current?.id === p.id) continue;
          p.vx += (W / 2 - p.x) * 0.012 * a;
          p.vy += (H / 2 - p.y) * 0.014 * a;
          p.vx *= 0.86;
          p.vy *= 0.86;
          p.x = Math.min(W - 34, Math.max(34, p.x + p.vx));
          p.y = Math.min(H - 40, Math.max(34, p.y + p.vy));
        }
        alphaRef.current *= 0.985;
        setPositions([...P]);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pos = (id: string) => positions[NODES.findIndex((n) => n.id === id)];

  const toSvg = (e: React.PointerEvent) => {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const { x, y } = toSvg(e);
    const p = posRef.current[NODES.findIndex((n) => n.id === drag.id)];
    p.x = Math.min(W - 34, Math.max(34, x));
    p.y = Math.min(H - 40, Math.max(34, y));
    drag.moved = true;
    alphaRef.current = Math.max(alphaRef.current, 0.3);
    setPositions([...posRef.current]);
  };

  const matches = query.trim()
    ? NODES.filter(
        (n) =>
          n.label.toLowerCase().includes(query.trim().toLowerCase()) ||
          n.id.includes(query.trim().toLowerCase()),
      ).slice(0, 6)
    : [];
  const matchIds = new Set(matches.map((m) => m.id));
  const dimming = query.trim().length > 0;

  const pick = (id: string) => {
    setSelected(id);
    setQuery("");
    setAcOpen(false);
    setAcIdx(0);
  };

  const selNode = NODES.find((n) => n.id === selected);
  const hotEdge = (e: GEdge) => selected !== null && (e.a === selected || e.b === selected);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-[#0a0e1c] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
      {/* search bar */}
      <div className="relative z-20 border-b border-line bg-white/[0.03] p-3">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setAcOpen(true);
            setAcIdx(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setAcIdx((i) => Math.min(i + 1, matches.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setAcIdx((i) => Math.max(i - 1, 0)); }
            if (e.key === "Enter" && matches[acIdx]) pick(matches[acIdx].id);
            if (e.key === "Escape") { setQuery(""); setAcOpen(false); }
          }}
          placeholder="Search the graph — try “mamba”, “sparse”, or “Zhao”"
          aria-label="Search graph nodes"
          className="w-full rounded-[10px] border border-line bg-bg/60 px-3.5 py-2 font-mono text-[13px] text-ink outline-none transition-colors placeholder:text-faint focus:border-cyan/50"
        />
        {acOpen && matches.length > 0 && (
          <div className="absolute inset-x-3 top-full z-30 mt-1 overflow-hidden rounded-xl border border-line bg-[#0d1222] shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
            {matches.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => pick(m.id)}
                onMouseEnter={() => setAcIdx(i)}
                className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] ${
                  i === acIdx ? "bg-white/[0.06]" : ""
                }`}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: TYPE_COLOR[m.type] }}
                />
                <span className="font-medium text-ink">{m.label}</span>
                <span className="ml-auto font-mono text-[11px] text-faint">
                  {m.id}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        {/* dotted grid backdrop */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,.06) 1px, transparent 0) 0 0/22px 22px",
          }}
        />
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="application"
          aria-label="Interactive knowledge-graph explorer demo"
          onPointerMove={onPointerMove}
          onPointerUp={() => (dragRef.current = null)}
          onPointerLeave={() => (dragRef.current = null)}
          className="relative block touch-none select-none"
        >
          {EDGES.map((e) => {
            const s = pos(e.a);
            const t = pos(e.b);
            const hot = hotEdge(e);
            return (
              <g key={`${e.a}-${e.b}`}>
                <line
                  x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                  stroke={e.flag ? "#fbbf24" : hot ? "#22d3ee" : "rgba(255,255,255,.14)"}
                  strokeWidth={hot ? 2 : e.flag ? 1.8 : 1.2}
                  strokeDasharray={e.flag ? "5 4" : undefined}
                />
                {(hot || e.flag) && (
                  <text
                    x={(s.x + t.x) / 2}
                    y={(s.y + t.y) / 2 - 4}
                    textAnchor="middle"
                    fontSize="8.5"
                    className="font-mono"
                    fill={e.flag ? "#fde68a" : "#67e8f9"}
                    stroke="#0a0e1c"
                    strokeWidth="3"
                    paintOrder="stroke"
                  >
                    {e.rel}
                  </text>
                )}
              </g>
            );
          })}
          {NODES.map((n) => {
            const p = pos(n.id);
            const dim = dimming && !matchIds.has(n.id);
            const isSel = selected === n.id;
            return (
              <g
                key={n.id}
                opacity={dim ? 0.22 : 1}
                className="cursor-pointer"
                onPointerDown={(e) => {
                  (e.target as Element).setPointerCapture?.(e.pointerId);
                  dragRef.current = { id: n.id, moved: false };
                }}
                onPointerUp={() => {
                  if (dragRef.current && !dragRef.current.moved) setSelected(n.id);
                  dragRef.current = null;
                }}
              >
                <circle
                  cx={p.x} cy={p.y} r={n.r}
                  fill={TYPE_COLOR[n.type]}
                  fillOpacity={0.16}
                  stroke={isSel ? "#eceef6" : TYPE_COLOR[n.type]}
                  strokeWidth={isSel ? 2.4 : 1.6}
                />
                <text
                  x={p.x}
                  y={p.y + n.r + 12}
                  textAnchor="middle"
                  fontSize="10.5"
                  fill={isSel ? "#eceef6" : "#aab1c6"}
                  stroke="#0a0e1c"
                  strokeWidth="3.5"
                  paintOrder="stroke"
                  className="font-mono"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* detail / provenance panel */}
        {selNode && (
          <div className="absolute left-3 top-3 z-10 w-[248px] max-w-[calc(100%-24px)] rounded-xl border border-line bg-[#0d1222]/95 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-sm">
            <div className="mb-2.5 flex items-start gap-2.5">
              <span
                className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[13px] font-bold text-[#04060d]"
                style={{ background: TYPE_COLOR[selNode.type] }}
              >
                {selNode.label[0]}
              </span>
              <div className="min-w-0">
                <div className="font-mono text-[9.5px] tracking-[0.12em] text-faint">
                  {TYPE_LABEL[selNode.type]}
                </div>
                <div className="truncate font-mono text-[13.5px] text-ink">
                  {selNode.label}
                </div>
              </div>
              <button
                type="button"
                aria-label="Close details"
                onClick={() => setSelected(null)}
                className="ml-auto cursor-pointer text-faint transition-colors hover:text-ink"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 font-mono text-[11px]">
              {selNode.props.map(([k, v]) => (
                <div key={k} className="contents">
                  <span className="text-faint">{k}</span>
                  <span className="truncate text-ink">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-line bg-bg/60 p-2.5 font-mono text-[10.5px] leading-relaxed text-muted">
              <div><span className="text-faint">source</span>{"     "}neo4j</div>
              <div><span className="text-faint">node_id</span>{"    "}{selNode.id}</div>
              <div><span className="text-faint">template</span>{"   "}{selNode.template}</div>
              <div><span className="text-faint">graph_ver</span>{"  "}2026-07-01T09:00Z</div>
            </div>
          </div>
        )}

        {/* legend + status */}
        <div className="pointer-events-none absolute right-3 top-3 hidden gap-2 sm:flex">
          {(Object.keys(TYPE_COLOR) as NodeType[]).map((t) => (
            <span
              key={t}
              className="flex items-center gap-1.5 rounded-full border border-line bg-[#0d1222]/90 px-2.5 py-1 font-mono text-[10px] text-muted"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: TYPE_COLOR[t] }} />
              {TYPE_LABEL[t]}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-line bg-[#0d1222]/90 px-3 py-1 font-mono text-[10.5px] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
          {NODES.length} nodes · {EDGES.length} edges · live demo
        </div>
      </div>
    </div>
  );
}
