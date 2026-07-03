import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const bad = [
  "Finds chunks that sound like your question — and stops there",
  "The contradicting 2025 paper shares no vocabulary → invisible",
  "Answers the first half, silently misses the second",
  "Citations generated, not guaranteed",
];

const good = [
  "Vector finds the entry points by meaning",
  "Graph follows CITES → EVALUATED_ON → CONTRADICTS, three hops out",
  "Relational layer pins every claim to source text, DOI and date",
  <>
    Agent notices the gap, re-queries, answers <em>both</em> halves — cited
  </>,
  "Ambiguous entity? It clarifies rather than guesses",
];

function Row({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 py-2.5 text-[14.5px] text-muted">
      <span
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-extrabold ${
          ok ? "bg-emerald/15 text-emerald" : "bg-rose/15 text-rose"
        }`}
      >
        {ok ? "✓" : "✕"}
      </span>
      <span className="min-w-0 break-words">{children}</span>
    </li>
  );
}

export default function Comparison() {
  return (
    <section className="py-22 pt-5">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHead
          kicker="Why not just RAG?"
          title={
            <>
              The question every &ldquo;chat with your PDFs&rdquo; tool{" "}
              <span className="accent-serif grad-text font-normal">
                gets wrong
              </span>
            </>
          }
          lead={
            <>
              &ldquo;Which methods outperform transformers on long documents —{" "}
              <em>and has anyone contradicted those results?</em>&rdquo;
            </>
          }
        />
        <div className="mt-11 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-line bg-rose/[0.045] p-7">
              <h3 className="mb-4 flex items-center gap-2.5 text-[17px] font-semibold">
                Vector-only RAG
                <span className="rounded-full bg-rose/10 px-2.5 py-0.5 font-mono text-[11px] tracking-[0.05em] text-rose">
                  1 HOP
                </span>
              </h3>
              <ul>
                {bad.map((b, i) => (
                  <Row key={i} ok={false}>
                    {b}
                  </Row>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-emerald/25 bg-emerald/5 p-7">
              <h3 className="mb-4 flex items-center gap-2.5 text-[17px] font-semibold">
                H4Graph
                <span className="rounded-full bg-emerald/10 px-2.5 py-0.5 font-mono text-[11px] tracking-[0.05em] text-emerald">
                  MULTI-HOP
                </span>
              </h3>
              <ul>
                {good.map((g, i) => (
                  <Row key={i} ok>
                    {g}
                  </Row>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
