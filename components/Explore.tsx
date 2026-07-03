import GraphExplorer from "./GraphExplorer";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

export default function Explore() {
  return (
    <section className="py-22 pt-5">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHead
          kicker="The corpus, visible"
          title={
            <>
              Browse your literature as{" "}
              <span className="accent-serif grad-text font-normal">
                a living graph
              </span>
            </>
          }
          lead="Every paper, method, concept, and author your corpus contains — connected, searchable, and inspectable. Click any node to read exactly where it came from and which query retrieved it."
        />
        <Reveal delay={0.1}>
          <div className="mt-11">
            <GraphExplorer />
            <p className="mt-3 text-center font-mono text-[12px] text-faint">
              live demo · search a method, drag a node, click for provenance —
              the amber edge is the contradiction
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
