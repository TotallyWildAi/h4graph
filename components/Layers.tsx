import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const layers = [
  {
    num: "LAYER 01",
    name: "Vector",
    store: "Qdrant · embeddings",
    color: "var(--color-cyan)",
    body: (
      <>
        Finds passages by <em>meaning</em>, not keywords. Your question matches
        evidence phrased in entirely different vocabulary.
      </>
    ),
    blind: "exact-word search misses paraphrased science.",
  },
  {
    num: "LAYER 02",
    name: "Graph",
    store: "Neo4j · knowledge graph",
    color: "var(--color-violet)",
    body: (
      <>
        Traverses citations, methods, datasets, and concepts — multi-hop. Finds
        the contradiction published two years later that shares no words with
        your question.
      </>
    ),
    blind: "similarity search dies one hop deep.",
  },
  {
    num: "LAYER 03",
    name: "Relational",
    store: "PostgreSQL · system of record",
    color: "var(--color-emerald)",
    body: (
      <>
        Grounds every claim: exact source text, DOIs, dates, and licence
        rights. Turns candidate evidence into evidence you may legally show —
        and precisely cite.
      </>
    ),
    blind: "LLMs invent citations. This layer can't.",
  },
  {
    num: "LAYER 04",
    name: "Agent",
    store: "Claude · goal-driven planning",
    color: "var(--color-amber)",
    body: (
      <>
        Plans which registered traversals to run, notices gaps, re-queries, and
        synthesises a structured answer — every statement wired to its source.
      </>
    ),
    blind: "pipelines can't adapt. An agent replans.",
  },
];

export default function Layers() {
  return (
    <section id="layers" className="scroll-mt-16 py-22">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHead
          kicker="The H4 engine"
          title={
            <>
              Hybrid <span className="grad-text">4-layer</span> answering
            </>
          }
          lead="Vector-only RAG answers what sounds similar. Real research questions need structure, ground truth, and judgment. Each layer covers the others' blind spot."
        />
        <div className="mt-12 grid gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
          {layers.map((l, i) => (
            <Reveal key={l.name} delay={i * 0.08}>
              <div
                className="panel group relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[color-mix(in_srgb,var(--lc)_45%,transparent)]"
                style={{ "--lc": l.color } as React.CSSProperties}
              >
                <div className="absolute inset-x-0 top-0 h-[3px] bg-[var(--lc)]" />
                <div className="mb-3.5 font-mono text-xs tracking-[0.08em] text-[var(--lc)]">
                  {l.num}
                </div>
                <h3 className="mb-1 text-[19px] font-semibold tracking-tight">
                  {l.name}
                </h3>
                <div className="mb-3 font-mono text-xs text-[var(--lc)]">
                  {l.store}
                </div>
                <p className="text-sm leading-relaxed text-muted">{l.body}</p>
                <div className="mt-3.5 border-t border-dashed border-white/10 pt-3 text-[12.5px] text-muted">
                  <b className="font-semibold text-ink">
                    Blind spot it covers:
                  </b>{" "}
                  {l.blind}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-9 text-center text-[15px] text-muted">
            Any single layer fails a real research question.{" "}
            <b className="text-ink">
              H4Graph is the claim that four together don&rsquo;t
            </b>{" "}
            — compressed into seven characters.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
