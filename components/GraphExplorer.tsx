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

// sphere shading stops for the 3D view: highlight → base → shadowed rim
const TYPE_SPHERE: Record<NodeType, [string, string, string]> = {
  paper: ["#d7c8ff", "#a78bfa", "#3d2d75"],
  method: ["#b7f4fd", "#22d3ee", "#0d5468"],
  concept: ["#b1f5d7", "#34d399", "#0e5136"],
  author: ["#bac5d6", "#64748b", "#28313f"],
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
const FOCAL = 760; // perspective focal length for the 3D projection
const Z_RANGE = 110;

const RADIUS = new Map(NODES.map((n) => [n.id, n.r]));

// deterministic golden-angle spiral start → identical SSR and first client render
function initialPositions() {
  return NODES.map((n, i) => {
    const t = i * 2.39996;
    const rad = 46 + 34 * Math.sqrt(i);
    return {
      id: n.id,
      x: W / 2 + rad * Math.cos(t),
      y: H / 2 + rad * Math.sin(t) * 0.72,
      z: ((i * 53) % (Z_RANGE * 2)) - Z_RANGE,
      vx: 0,
      vy: 0,
      vz: 0,
    };
  });
}

export default function GraphExplorer() {
  const [positions, setPositions] = useState(initialPositions);
  const [selected, setSelected] = useState<string | null>("p:1088");
  const [query, setQuery] = useState("");
  const [acIdx, setAcIdx] = useState(0);
  const [acOpen, setAcOpen] = useState(false);
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [view, setView] = useState<"2d" | "3d">("2d");

  const posRef = useRef(positions);
  const alphaRef = useRef(1);
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const viewRef = useRef(view);
  viewRef.current = view;
  const thetaRef = useRef(0);
  const reduceRef = useRef(false);
  const dragRef = useRef<{ id: string; moved: boolean; lastX: number; lastY: number } | null>(null);
  const rotRef = useRef<{ lastX: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // small force simulation in 3D, POC constants scaled; cools to a standstill
  useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceRef.current) alphaRef.current = 0.5;
    let raf = 0;
    const idx = new Map(NODES.map((n, i) => [n.id, i]));
    const tick = () => {
      const P = posRef.current;
      const a = alphaRef.current;
      const simActive = a > 0.02 && modeRef.current === "auto";
      if (simActive) {
        for (let i = 0; i < P.length; i++) {
          for (let j = i + 1; j < P.length; j++) {
            const dx = P[j].x - P[i].x;
            const dy = P[j].y - P[i].y;
            const dz = P[j].z - P[i].z;
            const d2 = Math.max(dx * dx + dy * dy + dz * dz, 60);
            const f = (4600 / d2) * a;
            const d = Math.sqrt(d2);
            P[i].vx -= (dx / d) * f;
            P[i].vy -= (dy / d) * f;
            P[i].vz -= (dz / d) * f;
            P[j].vx += (dx / d) * f;
            P[j].vy += (dy / d) * f;
            P[j].vz += (dz / d) * f;
          }
        }
        for (const e of EDGES) {
          const s = P[idx.get(e.a)!];
          const t = P[idx.get(e.b)!];
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const dz = t.z - s.z;
          const d = Math.max(Math.sqrt(dx * dx + dy * dy + dz * dz), 1);
          const f = (d - 122) * 0.03 * a;
          s.vx += (dx / d) * f;
          s.vy += (dy / d) * f;
          s.vz += (dz / d) * f;
          t.vx -= (dx / d) * f;
          t.vy -= (dy / d) * f;
          t.vz -= (dz / d) * f;
        }
        for (const p of P) {
          if (dragRef.current?.id === p.id) continue;
          p.vx += (W / 2 - p.x) * 0.009 * a;
          p.vy += (H / 2 - p.y) * 0.012 * a;
          p.vz += (0 - p.z) * 0.01 * a;
          p.vx *= 0.86;
          p.vy *= 0.86;
          p.vz *= 0.86;
          p.x = Math.min(W - 34, Math.max(34, p.x + p.vx));
          p.y = Math.min(H - 40, Math.max(34, p.y + p.vy));
          p.z = Math.min(Z_RANGE, Math.max(-Z_RANGE, p.z + p.vz));
        }
        alphaRef.current *= 0.985;
      }
      let render = simActive;
      if (viewRef.current === "3d" && !reduceRef.current && !rotRef.current && !dragRef.current) {
        thetaRef.current += 0.0032; // slow auto-orbit
        render = true;
      }
      if (render) setPositions([...P]);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // perspective projection around a vertical axis through the graph center
  const project = (p: { x: number; y: number; z: number }) => {
    if (viewRef.current === "2d") return { x: p.x, y: p.y, s: 1, depth: 0 };
    const th = thetaRef.current;
    const dx = p.x - W / 2;
    const xr = dx * Math.cos(th) - p.z * Math.sin(th);
    const zr = dx * Math.sin(th) + p.z * Math.cos(th);
    const s = FOCAL / (FOCAL - zr * 1.6);
    return {
      x: W / 2 + xr * s,
      y: H / 2 + (p.y - H / 2) * s,
      s,
      depth: zr,
    };
  };

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
    const cur = toSvg(e);
    if (rotRef.current) {
      thetaRef.current += (cur.x - rotRef.current.lastX) * 0.008;
      rotRef.current.lastX = cur.x;
      setPositions([...posRef.current]);
      return;
    }
    const drag = dragRef.current;
    if (!drag) return;
    const p = posRef.current[NODES.findIndex((n) => n.id === drag.id)];
    const dxs = cur.x - drag.lastX;
    const dys = cur.y - drag.lastY;
    drag.lastX = cur.x;
    drag.lastY = cur.y;
    if (viewRef.current === "2d") {
      p.x = Math.min(W - 34, Math.max(34, p.x + dxs));
      p.y = Math.min(H - 40, Math.max(34, p.y + dys));
    } else {
      // undo the rotation so the node follows the pointer at its own depth
      const th = thetaRef.current;
      const { s } = project(p);
      const dxr = dxs / s;
      p.x = Math.min(W - 34, Math.max(34, p.x + dxr * Math.cos(th)));
      p.z = Math.min(Z_RANGE, Math.max(-Z_RANGE, p.z - dxr * Math.sin(th)));
      p.y = Math.min(H - 40, Math.max(34, p.y + dys / s));
    }
    drag.moved = true;
    if (modeRef.current === "auto") {
      alphaRef.current = Math.max(alphaRef.current, 0.3);
    }
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
  const hotEdge = (e: GEdge) =>
    selected !== null && (e.a === selected || e.b === selected);

  // depth-sorted render lists (far → near) so nearer nodes draw on top in 3D
  const projected = new Map(
    NODES.map((n) => [n.id, project(pos(n.id))] as const),
  );
  const nodeOrder = [...NODES].sort(
    (a, b) => projected.get(a.id)!.depth - projected.get(b.id)!.depth,
  );
  const edgeOrder = [...EDGES].sort(
    (a, b) =>
      (projected.get(a.a)!.depth + projected.get(a.b)!.depth) / 2 -
      (projected.get(b.a)!.depth + projected.get(b.b)!.depth) / 2,
  );
  const depthFade = (d: number) =>
    view === "3d" ? 0.5 + 0.5 * ((d + Z_RANGE * 1.6) / (Z_RANGE * 3.2)) : 1;

  const segBtn = (active: boolean) =>
    `cursor-pointer rounded-lg px-2.5 py-1.5 uppercase tracking-[0.06em] transition-colors ${
      active ? "bg-white/[0.09] text-ink" : "text-faint hover:text-muted"
    }`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-[#0a0e1c] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
      {/* toolbar: layout mode + view + search */}
      <div className="relative z-20 flex flex-wrap items-center gap-3 border-b border-line bg-white/[0.03] p-3">
        <div
          className="flex shrink-0 items-center rounded-[10px] border border-line bg-bg/60 p-0.5 font-mono text-[11px]"
          role="group"
          aria-label="Layout mode"
        >
          {(["auto", "manual"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => {
                setMode(m);
                if (m === "auto")
                  alphaRef.current = Math.max(alphaRef.current, 0.6);
              }}
              className={segBtn(mode === m)}
            >
              {m}
            </button>
          ))}
        </div>
        <div
          className="flex shrink-0 items-center rounded-[10px] border border-line bg-bg/60 p-0.5 font-mono text-[11px]"
          role="group"
          aria-label="View"
        >
          {(["2d", "3d"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={segBtn(view === v)}
            >
              {v}
            </button>
          ))}
        </div>
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
          className="min-w-[180px] flex-1 rounded-[10px] border border-line bg-bg/60 px-3.5 py-2 font-mono text-[13px] text-ink outline-none transition-colors placeholder:text-faint focus:border-cyan/50"
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
          onPointerDown={(e) => {
            if (viewRef.current === "3d" && !dragRef.current) {
              (e.target as Element).setPointerCapture?.(e.pointerId);
              rotRef.current = { lastX: toSvg(e).x };
            }
          }}
          onPointerMove={onPointerMove}
          onPointerUp={() => { dragRef.current = null; rotRef.current = null; }}
          onPointerLeave={() => { dragRef.current = null; rotRef.current = null; }}
          className={`relative block touch-none select-none ${
            view === "3d" ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        >
          <defs>
            {(Object.keys(TYPE_SPHERE) as NodeType[]).map((t) => {
              const [hi, mid, rim] = TYPE_SPHERE[t];
              return (
                <radialGradient
                  key={t}
                  id={`sph-${t}`}
                  cx="34%"
                  cy="28%"
                  r="80%"
                >
                  <stop offset="0%" stopColor={hi} />
                  <stop offset="42%" stopColor={mid} />
                  <stop offset="100%" stopColor={rim} />
                </radialGradient>
              );
            })}
          </defs>
          {edgeOrder.map((e) => {
            const s = projected.get(e.a)!;
            const t = projected.get(e.b)!;
            const hot = hotEdge(e);
            // trim to circle boundaries so edges never cross the node fills
            const ra = (RADIUS.get(e.a)! + 3) * s.s;
            const rb = (RADIUS.get(e.b)! + 3) * t.s;
            const dx = t.x - s.x;
            const dy = t.y - s.y;
            const d = Math.hypot(dx, dy) || 1;
            if (d < ra + rb + 6) return null;
            const ux = dx / d;
            const uy = dy / d;
            const x1 = s.x + ux * ra;
            const y1 = s.y + uy * ra;
            const x2 = t.x - ux * rb;
            const y2 = t.y - uy * rb;
            const fade = depthFade((s.depth + t.depth) / 2);
            return (
              <g key={`${e.a}-${e.b}`} opacity={fade}>
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  className={hot ? "edge-flow" : undefined}
                  stroke={e.flag ? "#fbbf24" : hot ? "#22d3ee" : "rgba(255,255,255,.14)"}
                  strokeWidth={hot ? 2 : e.flag ? 1.8 : 1.2}
                  strokeDasharray={!hot && e.flag ? "5 4" : undefined}
                />
                {(hot || e.flag) && (
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 - 4}
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
          {nodeOrder.map((n) => {
            const p = projected.get(n.id)!;
            const dim = dimming && !matchIds.has(n.id);
            const isSel = selected === n.id;
            const r = n.r * p.s;
            const fade = depthFade(p.depth);
            return (
              <g
                key={n.id}
                opacity={(dim ? 0.22 : 1) * fade}
                className="cursor-pointer"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  (e.target as Element).setPointerCapture?.(e.pointerId);
                  const c = toSvg(e);
                  dragRef.current = { id: n.id, moved: false, lastX: c.x, lastY: c.y };
                }}
                onPointerUp={() => {
                  if (dragRef.current && !dragRef.current.moved) setSelected(n.id);
                  dragRef.current = null;
                }}
              >
                {view === "3d" ? (
                  <>
                    <circle
                      cx={p.x} cy={p.y} r={r}
                      fill={`url(#sph-${n.type})`}
                      stroke={isSel ? "#eceef6" : "rgba(0,0,0,0.35)"}
                      strokeWidth={isSel ? 2.4 : 1}
                    />
                    {/* specular glint */}
                    <circle
                      cx={p.x - r * 0.34}
                      cy={p.y - r * 0.4}
                      r={r * 0.22}
                      fill="#fff"
                      opacity={0.22}
                    />
                  </>
                ) : (
                  <circle
                    cx={p.x} cy={p.y} r={r}
                    fill={TYPE_COLOR[n.type]}
                    fillOpacity={0.16}
                    stroke={isSel ? "#eceef6" : TYPE_COLOR[n.type]}
                    strokeWidth={isSel ? 2.4 : 1.6}
                  />
                )}
                <text
                  x={p.x}
                  y={p.y + r + 12 * p.s}
                  textAnchor="middle"
                  fontSize={10.5 * p.s}
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
          {NODES.length} nodes · {EDGES.length} edges · {mode} layout · {view}
          {view === "3d" && " · drag background to orbit"}
        </div>
      </div>
    </div>
  );
}
