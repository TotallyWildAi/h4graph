import Button from "./Button";
import Reveal from "./Reveal";

export default function FinalCta() {
  return (
    <section className="py-24 text-center">
      <div className="mx-auto max-w-[1120px] px-6">
        <Reveal>
          <h2 className="mb-4 text-[clamp(28px,3.6vw,42px)] font-bold leading-[1.12] tracking-[-0.02em]">
            The connections are already in your literature.
            <br />
            <span className="grad-text">
              Start{" "}
              <span className="accent-serif font-normal">finding them.</span>
            </span>
          </h2>
          <p className="mb-9 text-[17px] text-muted">
            Ten papers, cited answers, five minutes to your first &ldquo;I
            didn&rsquo;t know that.&rdquo;
          </p>
          <Button href="#pricing" size="lg">
            Start free
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
