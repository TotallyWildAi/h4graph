import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const steps = [
  {
    n: "01 · DISCOVER",
    title: "Bring the literature in",
    body: "Search OpenAlex, arXiv, PubMed — or connect your Scopus, Embase and IEEE licences (bring-your-own-license). One click to ingest.",
  },
  {
    n: "02 · INGEST",
    title: "Agents build the graph",
    body: "Papers are chunked, embedded, and mined for entities and relationships — authors, methods, datasets, citations — into one knowledge graph.",
  },
  {
    n: "03 · ASK",
    title: "Interrogate the corpus",
    body: "Natural-language questions, answered across all four layers. Multi-hop, cross-paper, quota-metered.",
  },
  {
    n: "04 · TRUST",
    title: "Every claim, cited",
    body: "Answers link back to the exact source passage. Publishable provenance, not plausible prose.",
  },
];

export default function Steps() {
  return (
    <section className="py-22 pt-5">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHead
          kicker="From PDFs to answers"
          title={
            <>
              Four steps.{" "}
              <span className="accent-serif grad-text font-normal">
                Zero reading lists.
              </span>
            </>
          }
        />
        <div className="mt-12 grid gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="relative h-full px-5">
                {i < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute -right-2 top-1 hidden text-xl text-indigo lg:block"
                  >
                    →
                  </span>
                )}
                <div className="mb-2.5 font-mono text-xs text-[#a5b4fc]">
                  {s.n}
                </div>
                <h3 className="mb-2 text-[16.5px] font-semibold">{s.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-muted">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
