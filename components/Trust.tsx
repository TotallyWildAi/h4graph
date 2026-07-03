import Reveal from "./Reveal";

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const points = [
  {
    icon: (
      <svg {...iconProps} aria-hidden>
        <path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6l8-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "Never trained on",
    body: "Your corpus stays yours. Nothing you ingest is used to train models — architecturally, not just contractually.",
  },
  {
    icon: (
      <svg {...iconProps} aria-hidden>
        <path d="M7 3h8l4 4v14H7z" />
        <path d="M15 3v4h4M10 13l2 2 4-4" />
      </svg>
    ),
    title: "Auditable provenance",
    body: "Every answer traces to source text, DOI, date, and licence rights — evidence your compliance team can replay.",
  },
  {
    icon: (
      <svg {...iconProps} aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
      </svg>
    ),
    title: "Residency on your terms",
    body: "Pin storage and inference to the region you choose. Your data never leaves the geography your review requires.",
  },
  {
    icon: (
      <svg {...iconProps} aria-hidden>
        <circle cx="12" cy="9" r="6" />
        <path d="M9 14.5L8 21l4-2 4 2-1-6.5M10 9l1.5 1.5L14.5 7" />
      </svg>
    ),
    title: "License-aware by design",
    body: "Ingestion stores only what each source's licence permits — metadata, abstract, or full text, enforced per connector. Never relicensed.",
  },
];

export default function Trust() {
  return (
    <section className="pb-22">
      <div className="mx-auto max-w-[1120px] px-6">
        <Reveal>
          <div className="panel rounded-2xl px-9 py-8">
            <h3 className="mb-6 text-[19px] font-semibold">
              Built to pass compliance review
            </h3>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {points.map((p) => (
                <div key={p.title} className="flex items-start gap-3.5">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-emerald/25 bg-emerald/10 text-emerald">
                    {p.icon}
                  </span>
                  <div>
                    <div className="mb-1 text-[15px] font-semibold">
                      {p.title}
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-muted">
                      {p.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
