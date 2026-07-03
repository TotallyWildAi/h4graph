import Reveal from "./Reveal";

export default function Sovereignty() {
  return (
    <section className="pb-22">
      <div className="mx-auto max-w-[1120px] px-6">
        <Reveal>
          <div className="panel flex flex-wrap items-center gap-8 rounded-2xl px-9 py-8">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-emerald/30 bg-emerald/10 font-mono text-lg font-bold tracking-[0.08em] text-emerald">
              AU
            </div>
            <div className="min-w-[260px] flex-1">
              <h3 className="mb-1.5 text-[19px] font-semibold">
                Sovereign by configuration, not promise
              </h3>
              <p className="max-w-[52em] text-[14.5px] leading-relaxed text-muted">
                Inference pinned to the AWS Australia geography — your data
                never leaves Sydney/Melbourne, is never used to train models,
                and every answer&rsquo;s provenance is auditable. Built for
                teams whose security review reads the architecture, not the
                brochure.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
