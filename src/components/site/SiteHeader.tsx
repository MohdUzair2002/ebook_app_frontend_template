"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Search, ShoppingCart, CircleUserRound } from "lucide-react";
import { Container } from "./Container";
import { RootState } from "@/store";

type Props = { withSearch?: boolean };

export function SiteHeader({ withSearch = false }: Props) {
  const pathname = usePathname();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const role = useSelector((state: RootState) => state.auth.role);

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

  // Apply original Navbar splicing logic in a clean, modern way
  if (!isLoggedIn) {
    // Guest gets: Home, All Books
    links = links.slice(0, 2);
  } else if (role === "user") {
    // Reader gets: Home, All Books, My Books, Wishlist+, Profile
    links = links.slice(0, 5);
  } else if (role === "admin") {
    // Admin gets: Home, All Books, Admin Profile
    links = [links[0], links[1], links[5]];
  } else if (role === "publisher") {
    // Publisher gets: Home, Published Books, Publish Book, Publisher Profile
    links = [links[0], links[6], links[7], links[8]];
  }

  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-xl border-b border-outline-variant/40">
      <Container className="flex items-center gap-6 py-4">
        <Link href="/" className="font-display text-xl font-bold text-primary tracking-tight shrink-0 flex items-center gap-2">
          <img
            src="/web_logo.png"
            alt="logo"
            className="h-22 w-21"
          />
          Darulishaat
        </Link>

        {withSearch ? (
          <div className="relative flex-1 max-w-xl mx-auto">
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

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/80">
          {links.map((l) => {
            const isActive = l.href === "/" ? pathname === "/" : pathname?.startsWith(l.href);
            
            // Render Profile links styled as buttons
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

        <div className="flex items-center gap-3 text-primary">
          {!isLoggedIn ? (
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Link
                href="/login"
                className="rounded border border-primary px-2.5 py-1.5 hover:bg-primary hover:text-white transition-all duration-300 whitespace-nowrap"
              >
                LogIn
              </Link>
              <Link
                href="/signup"
                className="rounded bg-primary text-white px-2.5 py-1.5 hover:bg-primary-container transition-all duration-300 whitespace-nowrap hidden sm:block"
              >
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
        </div>
      </Container>
    </header>
  );
}
