import type { ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold no-underline transition-all duration-200 cursor-pointer";

const variants = {
  primary:
    "bg-gradient-to-br from-indigo to-cyan text-[#04060d] hover:-translate-y-px hover:shadow-[0_10px_36px_rgba(56,189,248,0.35)]",
  ghost:
    "text-ink border border-line bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]",
} as const;

const sizes = {
  md: "px-5 py-2.5 text-[14.5px] rounded-[10px]",
  lg: "px-7 py-3.5 text-base rounded-xl",
} as const;

export default function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  children,
}: {
  href: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </a>
  );
}
