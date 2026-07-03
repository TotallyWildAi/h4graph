import Button from "./Button";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const tiers = [
  {
    name: "Free",
    who: "Trial the graph",
    price: "$0",
    period: "",
    features: [
      "10 papers",
      "25 questions / month",
      "Open-source connectors",
      "Cited answers",
    ],
    cta: "Start free",
    hot: false,
  },
  {
    name: "Researcher",
    who: "Individual academics",
    price: "$29",
    period: "/mo",
    features: [
      "200 papers",
      "500 questions / month",
      "OpenAlex · arXiv · PubMed",
      "Priority email support",
    ],
    cta: "Choose Researcher",
    hot: false,
  },
  {
    name: "Lab",
    who: "Research groups",
    price: "$99",
    period: "/mo",
    features: [
      "2,000 papers · 5 seats",
      "3,000 questions / month",
      "Shared team graph",
      "BYOL connectors (Scopus, IEEE…)",
      "Prepaid credit packs",
    ],
    cta: "Choose Lab",
    hot: true,
  },
  {
    name: "Enterprise",
    who: "Pharma & R&D orgs",
    price: "$499",
    period: "/mo+",
    features: [
      "Unlimited papers · custom quotas",
      "Full BYOL catalog + internal docs",
      "Public API · SSO · scoped keys",
      "Regional data residency",
      "Annual commit discounts",
    ],
    cta: "Talk to us",
    hot: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16 py-22">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHead
          center
          kicker="Pricing"
          title={
            <>
              Start free.{" "}
              <span className="accent-serif grad-text font-normal">
                Scale with your corpus.
              </span>
            </>
          }
        />
        <div className="mt-12 grid gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className="h-full">
              <div
                className={`relative flex h-full flex-col rounded-2xl p-6 ${
                  t.hot
                    ? "border border-indigo/55 bg-gradient-to-b from-indigo/10 to-white/[0.02]"
                    : "panel"
                }`}
              >
                {t.hot && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo to-cyan px-3 py-0.5 text-[11px] font-bold tracking-[0.04em] text-[#04060d]">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-base font-semibold">{t.name}</h3>
                <div className="mb-4 text-[12.5px] text-muted">{t.who}</div>
                <div className="text-[32px] font-extrabold tracking-tight">
                  {t.price}
                  {t.period && (
                    <small className="text-[13px] font-normal text-muted">
                      {t.period}
                    </small>
                  )}
                </div>
                <ul className="mb-6 mt-5 flex-1">
                  {t.features.map((f) => (
                    <li
                      key={f}
                      className="flex gap-2.5 py-1.5 text-[13.5px] text-muted"
                    >
                      <span className="font-bold text-emerald">✓</span> {f}
                    </li>
                  ))}
                </ul>
                {/* placeholder until signup/contact pages exist; #pricing avoids
                    the jarring scroll-to-top a bare "#" causes */}
                <Button href="#pricing" variant={t.hot ? "primary" : "ghost"}>
                  {t.cta}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-9 text-center text-sm text-muted">
            Heavy month? <b className="text-ink">Prepaid credit packs</b> from
            $25 — volume bonuses up to +25%, no surprise bills, ever.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
