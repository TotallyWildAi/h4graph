import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const pillars = [
  {
    num: "MECHANISM 01",
    title: "Registered traversals only",
    body: "The agent never writes queries. It plans over a catalog of read-only, depth-limited query templates — each one profiled, index-backed, and tested like code. No injection surface, no runaway traversals.",
    foot: "Entity doesn't resolve? It asks — clarifies rather than guesses.",
  },
  {
    num: "MECHANISM 02",
    title: "Per-field lineage",
    body: "Every value in an answer records the template, bound parameters, graph nodes, and source passage that produced it — written to an append-only store the application cannot rewrite.",
    foot: "Insert-only by database privilege, not by policy.",
  },
  {
    num: "MECHANISM 03",
    title: "Reproducible on demand",
    body: "Any answer replays from its trace: template + parameters + graph version. An auditor walks from a sentence in an answer to the exact source passage and the exact query that retrieved it.",
    foot: "Built for reviews that ask “show me.”",
  },
];

export default function Governance() {
  return (
    <section className="py-22 pt-5">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHead
          kicker="Governance"
          title={
            <>
              &ldquo;Cited&rdquo; isn&rsquo;t a prompt.{" "}
              <span className="accent-serif grad-text font-normal">
                It&rsquo;s the architecture.
              </span>
            </>
          }
          lead="Most tools ask their model to cite sources and hope it complies. H4Graph's answering layer is built so it cannot emit an untraceable value."
        />
        <div className="mt-11 grid gap-4.5 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.num} delay={i * 0.08}>
              <div className="panel flex h-full flex-col rounded-2xl p-6">
                <div className="mb-3.5 font-mono text-xs tracking-[0.08em] text-indigo">
                  {p.num}
                </div>
                <h3 className="mb-2 text-[17px] font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-muted">
                  {p.body}
                </p>
                <div className="mt-4 border-t border-dashed border-white/10 pt-3 text-[12.5px] text-[#a5b4fc]">
                  {p.foot}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
