"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Search, ShoppingCart, CircleUserRound, Menu, X } from "lucide-react";
import { Container } from "./Container";
import { RootState } from "@/store";
import { useState } from "react";

type Props = { withSearch?: boolean };

export function SiteHeader({ withSearch = false }: Props) {
  const pathname = usePathname();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const role = useSelector((state: RootState) => state.auth.role);
  const [menuOpen, setMenuOpen] = useState(false);

  let links = [
    { title: "Home", href: "/" },
    { title: "All Books", href: "/books" },
    { title: "My Books", href: "/user-books" },
    { title: "Wishlist+", href: "/cart" },
    { title: "Profile", href: "/profile" },
    { title: "Admin Profile", href: "/profile" },
    { title: "Published Books", href: "/publisherbooks" },
    { title: "Publish Book", href: "/publish" },
    { title: "Publisher Profile", href: "/profile" }
  ];

  if (!isLoggedIn) {
    links = links.slice(0, 2);
  } else if (role === "user") {
    links = links.slice(0, 5);
  } else if (role === "admin") {
    links = [links[0], links[1], links[5]];
  } else if (role === "publisher") {
    links = [links[0], links[6], links[7], links[8]];
  }

  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-xl border-b border-outline-variant/40">
      <Container className="flex items-center gap-4 py-4">
        {/* Logo */}
        <Link href="/" className="font-display text-xl font-bold text-primary tracking-tight shrink-0 flex items-center gap-2">
          <img
            src="/web_logo.JPG"
            alt="logo"
            className="h-8 w-8 object-contain"
          />
          Darulishaat
        </Link>

        {/* Search (desktop) */}
        {withSearch ? (
          <div className="relative flex-1 max-w-xl mx-auto hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search books..."
              className="w-full rounded-full bg-surface-container-low py-2.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30 text-black"
            />
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/80">
          {links.map((l) => {
            const isActive = l.href === "/" ? pathname === "/" : pathname?.startsWith(l.href);
            const isProfileLink = l.title.includes("Profile");
            return (
              <Link
                key={l.title}
                href={l.href}
                className={`relative py-1 transition-colors ${
                  isProfileLink
                    ? "rounded border border-primary px-3 py-1.5 hover:bg-primary hover:text-white"
                    : "hover:text-primary"
                } ${
                  isActive && !isProfileLink
                    ? "text-primary font-semibold after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-primary after:rounded-full"
                    : ""
                }`}
              >
                {l.title}
              </Link>
            );
          })}
        </nav>

        {/* Right side icons */}
        <div className="flex items-center gap-2 text-primary ml-auto md:ml-0">
          {!isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2 text-sm font-semibold">
              <Link href="/login" className="rounded border border-primary px-3.5 py-1.5 hover:bg-primary hover:text-white transition-all duration-300">
                LogIn
              </Link>
              <Link href="/signup" className="rounded bg-primary text-white px-3.5 py-1.5 hover:bg-primary-container transition-all duration-300">
                SignUp
              </Link>
            </div>
          ) : (
            <>
              {role === "user" && (
                <Link aria-label="Cart" href="/cart" className="p-1.5 hover:bg-surface-container-low rounded-full transition flex items-center justify-center">
                  <ShoppingCart className="size-5" />
                </Link>
              )}
              <Link aria-label="Profile" href="/profile" className="p-1.5 hover:bg-surface-container-low rounded-full transition flex items-center justify-center">
                <CircleUserRound className="size-6" />
              </Link>
            </>
          )}

          {/* Hamburger */}
          <button
           className="md:hidden p-1.5 rounded-full hover:bg-surface-container-low transition text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-outline-variant/40 px-4 py-4 flex flex-col gap-1">
          {links.map((l) => {
            const isActive = l.href === "/" ? pathname === "/" : pathname?.startsWith(l.href);
            return (
              <Link
                key={l.title}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground/80 hover:bg-surface-container-low hover:text-primary"
                }`}
              >
                {l.title}
              </Link>
            );
          })}

          {!isLoggedIn && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-outline-variant/30">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center rounded-xl border border-primary px-3.5 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition"
              >
                LogIn
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center rounded-xl bg-primary text-white px-3.5 py-2.5 text-sm font-semibold hover:bg-primary-container transition"
              >
                SignUp
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
