import Button from "./Button";
import GraphVisual from "./GraphVisual";

const meta = [
  "Every answer cited",
  "Your corpus, never trained on",
  "API-first",
];

export default function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-[1120px] items-center gap-14 px-6 pb-16 pt-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rise">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo/35 bg-indigo/10 px-3.5 py-1.5 text-[13px] text-[#c7d2fe]">
            <span className="pulse-dot h-[7px] w-[7px] rounded-full bg-cyan" />
            Hybrid 4-layer answering engine
          </span>
          <h1 className="mb-6 text-[clamp(40px,5.2vw,62px)] font-extrabold leading-[1.05] tracking-[-0.03em]">
            Stop searching your literature.
            <br />
            <span className="grad-text">
              Ask it{" "}
              <span className="accent-serif font-normal">questions.</span>
            </span>
          </h1>
          <p className="mb-9 max-w-[34em] text-[19px] leading-relaxed text-muted">
            H4Graph turns thousands of papers into a knowledge graph your team
            can interrogate — and answers with citations, including the
            connections you didn&rsquo;t know were there.
          </p>
          <div className="mb-8 flex flex-wrap gap-3.5">
            <Button href="#pricing" size="lg">
              Start free — 10 papers
            </Button>
            <Button href="#layers" variant="ghost" size="lg">
              See how it answers
            </Button>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-muted">
            {meta.map((m) => (
              <span key={m} className="flex items-center gap-2">
                <span className="font-bold text-emerald">✓</span> {m}
              </span>
            ))}
          </div>
        </div>
        <div className="rise rise-delay">
          <GraphVisual />
        </div>
      </div>
    </section>
  );
}
