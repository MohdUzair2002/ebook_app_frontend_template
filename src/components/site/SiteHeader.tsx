"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, CircleUserRound } from "lucide-react";
import { Container } from "./Container";

type Props = { withSearch?: boolean };

export function SiteHeader({ withSearch = false }: Props) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-xl border-b border-outline-variant/40">
      <Container className="flex items-center gap-6 py-4">
        <Link href="/" className="font-display text-xl font-bold text-primary tracking-tight shrink-0">
          KitabGhar
        </Link>

        {withSearch ? (
          <div className="relative flex-1 max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search books..."
              className="w-full rounded-full bg-surface-container-low py-2.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
          {[
            { href: "/", label: "Home" },
            { href: "/books", label: "Books" },
            { href: "/notes", label: "Notes" },
          ].map((l) => {
            const isActive = l.href === "/" ? pathname === "/" : pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative py-1 hover:text-primary transition-colors ${
                  isActive
                    ? "text-primary font-semibold after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-primary after:rounded-full"
                    : ""
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 text-primary">
          <button aria-label="Cart" className="p-1.5 hover:bg-surface-container-low rounded-full transition">
            <ShoppingCart className="size-5" />
          </button>
          <button aria-label="Profile" className="p-1.5 hover:bg-surface-container-low rounded-full transition">
            <CircleUserRound className="size-6" />
          </button>
        </div>
      </Container>
    </header>
  );
}
