"use client";

import { useState } from "react";
import Button from "./Button";

const links = [
  { href: "#layers", label: "How it works" },
  { href: "#developers", label: "Developers" },
  { href: "#pricing", label: "Pricing" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

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

        {/* desktop */}
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[14.5px] text-muted transition-colors hover:text-ink"
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

        {/* mobile */}
        <div className="flex items-center gap-3 md:hidden">
          <Button href="#pricing" onClick={() => setOpen(false)}>
            Start free
          </Button>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-[10px] border border-line bg-white/[0.04] text-ink"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-line bg-bg/95 px-6 py-4 backdrop-blur-xl md:hidden"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-[15.5px] text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-3 border-t border-line pt-4">
            <Button href="#" variant="ghost" className="w-full">
              Sign in
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
