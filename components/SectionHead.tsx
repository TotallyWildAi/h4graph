import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function SectionHead({
  kicker,
  title,
  lead,
  center = false,
}: {
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "text-center" : undefined}>
      <div className="mb-3.5 font-mono text-[13px] uppercase tracking-[0.14em] text-cyan">
        {kicker}
      </div>
      <h2 className="mb-4 text-[clamp(28px,3.6vw,42px)] font-bold leading-[1.12] tracking-[-0.02em]">
        {title}
      </h2>
      {lead && (
        <p
          className={`max-w-[44em] text-[17px] leading-relaxed text-muted ${
            center ? "mx-auto" : ""
          }`}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
