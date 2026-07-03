import Button from "./Button";

const links = [
  { href: "#layers", label: "How it works" },
  { href: "#developers", label: "Developers" },
  { href: "#pricing", label: "Pricing" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
        <a
          href="#"
          className="flex items-center gap-2.5 text-[19px] font-bold tracking-tight text-ink no-underline"
        >
          <span className="grid h-[30px] w-[30px] place-items-center rounded-lg bg-gradient-to-br from-indigo to-cyan font-mono text-[13px] font-extrabold text-[#04060d]">
            H4
          </span>
          H4Graph
        </a>
        <div className="flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hidden text-[14.5px] text-muted transition-colors hover:text-ink md:block"
            >
              {l.label}
            </a>
          ))}
          <div className="flex items-center gap-3">
            <Button href="#" variant="ghost">
              Sign in
            </Button>
            <Button href="#pricing">Start free</Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
