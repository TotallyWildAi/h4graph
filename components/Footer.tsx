const links = ["Docs", "API", "Security", "Privacy", "Status"];

export default function Footer() {
  return (
    <footer className="border-t border-line py-9 text-[13.5px] text-muted">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 px-6">
        <span>© 2026 H4Graph · Hybrid 4-layer answering</span>
        <span className="flex gap-5">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              className="text-muted no-underline transition-colors hover:text-ink"
            >
              {l}
            </a>
          ))}
        </span>
      </div>
    </footer>
  );
}
