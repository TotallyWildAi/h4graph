import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const KeyIcon = (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="7.5" cy="15.5" r="4.5" />
    <path d="M10.7 12.3 21 2m-3 3 3 3m-6 0 2 2" />
  </svg>
);

const points = [
  {
    icon: "⌁",
    title: "/api/v1 — stable by contract.",
    body: "OpenAPI-pinned, additive-only changes, Pact-verified on every merge.",
  },
  {
    icon: "⇄",
    title: "Webhooks, not polling.",
    body: (
      <>
        <code className="font-mono text-[12.5px] text-[#a5b4fc]">
          paper.ingested
        </code>
        ,{" "}
        <code className="font-mono text-[12.5px] text-[#a5b4fc]">
          answer.completed
        </code>{" "}
        — HMAC-signed, retried.
      </>
    ),
  },
  {
    icon: KeyIcon,
    title: "M2M auth that fits.",
    body: "API keys for simple integrations, OAuth2 client-credentials with scopes for enterprise.",
  },
  {
    icon: "↻",
    title: "Idempotent by design.",
    body: "Safe retries on every mutating call.",
  },
];

export default function Developers() {
  return (
    <section
      id="developers"
      className="scroll-mt-16 bg-gradient-to-b from-transparent via-indigo/5 to-transparent py-22"
    >
      <div className="mx-auto grid max-w-[1120px] items-center gap-13 px-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="min-w-0">
          <SectionHead
            kicker="API-first"
            title={
              <>
                Wire it into{" "}
                <span className="accent-serif grad-text font-normal">
                  your pipelines
                </span>
              </>
            }
            lead="A versioned public API, generated SDKs, and signed webhooks. Your LIMS, internal tools, and data pipelines get the same cited answers your team does."
          />
          <Reveal delay={0.08}>
            <ul className="mt-6">
              {points.map((p) => (
                <li
                  key={p.title}
                  className="flex items-start gap-3.5 py-3 text-[15px] text-muted"
                >
                  <span className="mt-0.5 grid h-[26px] w-[26px] shrink-0 place-items-center rounded-lg bg-indigo/15 text-[13px] text-[#a5b4fc]">
                    {p.icon}
                  </span>
                  <span>
                    <b className="font-semibold text-ink">{p.title}</b> {p.body}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.12} className="min-w-0">
          <div className="overflow-hidden rounded-2xl border border-line bg-[#0a0f1e] font-mono text-[13px] shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-line px-4.5 py-3 text-xs text-muted">
              <span>quickstart.py</span>
              <span>pip install h4graph</span>
            </div>
            <pre className="overflow-x-auto p-5 leading-[1.75] text-[#c9d4ee]">
              <span className="text-[#a78bfa]">from</span> h4graph{" "}
              <span className="text-[#a78bfa]">import</span> H4Graph{"\n\n"}
              h4 = H4Graph(api_key=
              <span className="text-[#7dd3fc]">&quot;h4_live_…&quot;</span>)
              {"\n\n"}
              <span className="text-[#7b86a8]">
                # ingest — batched, webhook on completion
              </span>
              {"\n"}
              h4.papers.submit(doi=
              <span className="text-[#7dd3fc]">
                &quot;10.1234/example.2025&quot;
              </span>
              ){"\n\n"}
              <span className="text-[#7b86a8]">
                # ask — hybrid 4-layer answer, cited
              </span>
              {"\n"}
              answer = h4.questions.ask({"\n"}
              {"    "}
              <span className="text-[#7dd3fc]">
                &quot;Which methods outperform transformers
              </span>
              {"\n"}
              <span className="text-[#7dd3fc]">
                {"     "}on long documents? Any contradictions?&quot;
              </span>
              {"\n"}){"\n\n"}
              <span className="text-[#f0abfc]">print</span>(answer.text){"\n"}
              <span className="text-[#a78bfa]">for</span> c{" "}
              <span className="text-[#a78bfa]">in</span> answer.citations:
              {"\n"}
              {"    "}
              <span className="text-[#f0abfc]">print</span>(c.doi, c.passage,
              c.hops){"  "}
              <span className="text-[#7b86a8]"># provenance, always</span>
            </pre>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
