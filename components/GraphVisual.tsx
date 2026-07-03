export default function GraphVisual() {
  return (
    <div className="panel rounded-[20px] p-[18px] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
      <div className="mb-2.5 flex items-center gap-2 border-b border-line px-1.5 pb-3.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald" />
        <span className="ml-1.5 font-mono text-[12.5px] text-muted">
          &ldquo;which methods outperform transformers on long documents?&rdquo;
        </span>
      </div>
      <svg
        viewBox="0 0 520 340"
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
        <g stroke="rgba(255,255,255,.13)" strokeWidth="1.4">
          <line x1="110" y1="170" x2="240" y2="90" />
          <line x1="110" y1="170" x2="250" y2="240" />
          <line x1="240" y1="90" x2="390" y2="140" />
          <line x1="250" y1="240" x2="390" y2="140" />
          <line x1="240" y1="90" x2="250" y2="240" />
          <line x1="390" y1="140" x2="455" y2="260" />
        </g>
        <path
          className="hop-path"
          d="M110,170 L240,90 L390,140 L455,260"
          fill="none"
          stroke="url(#eg)"
          strokeWidth="2.5"
          strokeDasharray="8 7"
        />
        <g className="font-mono">
          <circle
            cx="110"
            cy="170"
            r="30"
            fill="rgba(34,211,238,.12)"
            stroke="#22d3ee"
            strokeWidth="1.6"
          />
          <text x="110" y="166" textAnchor="middle" fontSize="10" fill="#a5f3fc">
            semantic
          </text>
          <text x="110" y="180" textAnchor="middle" fontSize="10" fill="#a5f3fc">
            match
          </text>

          <circle
            cx="240"
            cy="90"
            r="27"
            fill="rgba(167,139,250,.12)"
            stroke="#a78bfa"
            strokeWidth="1.6"
          />
          <text x="240" y="87" textAnchor="middle" fontSize="10" fill="#ddd6fe">
            Paper A
          </text>
          <text x="240" y="100" textAnchor="middle" fontSize="9" fill="#8f96ad">
            2023
          </text>

          <circle
            cx="250"
            cy="240"
            r="27"
            fill="rgba(167,139,250,.12)"
            stroke="#a78bfa"
            strokeWidth="1.6"
          />
          <text x="250" y="237" textAnchor="middle" fontSize="10" fill="#ddd6fe">
            Method X
          </text>
          <text x="250" y="250" textAnchor="middle" fontSize="9" fill="#8f96ad">
            outperforms
          </text>

          <circle
            cx="390"
            cy="140"
            r="27"
            fill="rgba(167,139,250,.12)"
            stroke="#a78bfa"
            strokeWidth="1.6"
          />
          <text x="390" y="137" textAnchor="middle" fontSize="10" fill="#ddd6fe">
            Paper B
          </text>
          <text x="390" y="150" textAnchor="middle" fontSize="9" fill="#8f96ad">
            cites A
          </text>

          <g className="node-pulse">
            <circle
              cx="455"
              cy="260"
              r="30"
              fill="rgba(251,191,36,.12)"
              stroke="#fbbf24"
              strokeWidth="1.8"
            />
          </g>
          <text x="455" y="257" textAnchor="middle" fontSize="10" fill="#fde68a">
            contradicts
          </text>
          <text x="455" y="270" textAnchor="middle" fontSize="9" fill="#8f96ad">
            2025 · 3 hops
          </text>
        </g>
        <text className="font-mono" fontSize="10.5" fill="#8f96ad">
          <tspan x="16" y="314">
            vector finds the entry point → graph traverses the evidence
          </tspan>
          <tspan x="16" y="330">
            → the contradiction lives 3 hops deep
          </tspan>
        </text>
      </svg>
    </div>
  );
}
