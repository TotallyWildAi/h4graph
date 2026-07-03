"use client";

import { useEffect, useRef, useState } from "react";

// staged console log under the graph — one line per engine layer
const logLines = [
  { prefix: "[vector]", color: "#22d3ee", rest: " 12 entry passages by meaning · 0.3s" },
  { prefix: "[graph]", color: "#a78bfa", rest: " CITES → EVALUATED_ON → CONTRADICTS · 3 hops" },
  { prefix: "[relational]", color: "#34d399", rest: " 9 claims pinned to source text + DOI" },
  { prefix: "[agent]", color: "#fbbf24", rest: " contradiction found (2025) — answer cited ✓" },
];

const windowTitle =
  "h4 ask — “which methods outperform transformers on long documents?”";

export default function GraphVisual() {
  // start fully visible: correct SSR/no-JS output, no hydration mismatch
  const [visibleCount, setVisibleCount] = useState(logLines.length);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // marquee the window title only when it actually overflows
  const [marquee, setMarquee] = useState(false);
  const titleBoxRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = titleBoxRef.current;
    const text = titleTextRef.current;
    if (!box || !text) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const check = () =>
      setMarquee(!reduce.matches && text.offsetWidth > box.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (hasAnimated) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
          setVisibleCount(0);
        }
      },
      { threshold: 0.3 },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated || visibleCount >= logLines.length) return;
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), 550);
    return () => clearTimeout(timer);
  }, [visibleCount, hasAnimated]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden rounded-[20px] border border-line bg-[#0a0e1c] shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
    >
      {/* macOS window chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-white/[0.03] px-4 py-3">
        <span className="h-3 w-3 shrink-0 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 shrink-0 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 shrink-0 rounded-full bg-[#28C840]" />
        <div
          ref={titleBoxRef}
          className={`relative ml-2 min-w-0 flex-1 overflow-hidden font-mono text-[12px] tracking-[0.02em] text-muted ${
            marquee
              ? "[mask-image:linear-gradient(90deg,transparent,black_7%,black_93%,transparent)]"
              : ""
          }`}
        >
          {/* invisible copy used only to measure the full text width */}
          <span
            ref={titleTextRef}
            aria-hidden
            className="invisible absolute inline-block whitespace-nowrap"
          >
            {windowTitle}
          </span>
          {marquee ? (
            <div className="marquee-track flex w-max">
              <span className="whitespace-nowrap pr-16">{windowTitle}</span>
              <span aria-hidden className="whitespace-nowrap pr-16">
                {windowTitle}
              </span>
            </div>
          ) : (
            <span className="block truncate">{windowTitle}</span>
          )}
        </div>
      </div>

      <div className="p-4">
        <svg
          viewBox="0 0 520 300"
          width="100%"
          role="img"
          aria-label="Knowledge graph answering a question across multiple hops"
        >
          <defs>
            <linearGradient id="eg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#6366f1" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          {/* all edges trimmed to circle boundaries */}
          <g stroke="rgba(255,255,255,.13)" strokeWidth="1.4">
            <line x1="141.5" y1="140.6" x2="211" y2="97.8" />
            <line x1="143.1" y1="176.5" x2="219.6" y2="214.8" />
            <line x1="272.3" y1="90.8" x2="357.7" y2="119.2" />
            <line x1="277.7" y1="210.2" x2="362.3" y2="149.8" />
            <line x1="242.3" y1="113.9" x2="247.7" y2="196.1" />
            <line x1="406.2" y1="159.9" x2="436.9" y2="216.6" />
          </g>
          {/* hop segments trimmed to circle edges so the stream passes
              between nodes, not through their translucent fills */}
          <path
            className="hop-path"
            d="M141.5,140.6 L211,97.8 M272.3,90.8 L357.7,119.2 M406.2,159.9 L436.9,216.6"
            fill="none"
            stroke="url(#eg)"
            strokeWidth="2.5"
            strokeDasharray="8 7"
          />
          <g className="font-mono">
            <circle
              cx="110"
              cy="160"
              r="37"
              fill="rgba(34,211,238,.12)"
              stroke="#22d3ee"
              strokeWidth="1.6"
            />
            <text x="110" y="157" textAnchor="middle" fontSize="12" fill="#a5f3fc">
              semantic
            </text>
            <text x="110" y="172" textAnchor="middle" fontSize="12" fill="#a5f3fc">
              match
            </text>

            <circle
              cx="240"
              cy="80"
              r="34"
              fill="rgba(167,139,250,.12)"
              stroke="#a78bfa"
              strokeWidth="1.6"
            />
            <text x="240" y="79" textAnchor="middle" fontSize="12" fill="#ddd6fe">
              Paper A
            </text>
            <text x="240" y="94" textAnchor="middle" fontSize="10.5" fill="#8f96ad">
              2023
            </text>

            <circle
              cx="250"
              cy="230"
              r="34"
              fill="rgba(167,139,250,.12)"
              stroke="#a78bfa"
              strokeWidth="1.6"
            />
            <text x="250" y="229" textAnchor="middle" fontSize="12" fill="#ddd6fe">
              Method X
            </text>
            <text x="250" y="244" textAnchor="middle" fontSize="10.5" fill="#8f96ad">
              outperforms
            </text>

            <circle
              cx="390"
              cy="130"
              r="34"
              fill="rgba(167,139,250,.12)"
              stroke="#a78bfa"
              strokeWidth="1.6"
            />
            <text x="390" y="129" textAnchor="middle" fontSize="12" fill="#ddd6fe">
              Paper B
            </text>
            <text x="390" y="144" textAnchor="middle" fontSize="10.5" fill="#8f96ad">
              cites A
            </text>

            <g className="node-pulse">
              <circle
                cx="455"
                cy="250"
                r="38"
                fill="rgba(251,191,36,.12)"
                stroke="#fbbf24"
                strokeWidth="1.8"
              />
            </g>
            <text x="455" y="249" textAnchor="middle" fontSize="12" fill="#fde68a">
              contradicts
            </text>
            <text x="455" y="264" textAnchor="middle" fontSize="10.5" fill="#8f96ad">
              2025 · 3 hops
            </text>
          </g>
        </svg>

        {/* layer-by-layer console log */}
        <div
          className="mt-2 border-t border-line px-1 pt-3 font-mono text-[11.5px] leading-[1.9] text-muted"
          aria-live="polite"
        >
          {logLines.slice(0, visibleCount).map((l) => (
            <div key={l.prefix} className="truncate">
              <span style={{ color: l.color }}>{l.prefix}</span>
              {l.rest}
            </div>
          ))}
          {visibleCount < logLines.length && (
            <span className="inline-block h-[13px] w-[7px] animate-pulse bg-cyan/80 align-middle" />
          )}
        </div>
      </div>
    </div>
  );
}
