import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/site/Container";
import { BookCard } from "@/components/site/BookCard";
import { browseBooks } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Browse Books — KitabGhar",
  description: "Browse 124 books across Technology and more on KitabGhar.",
  openGraph: {
    title: "Browse Books — KitabGhar",
    description: "Premium books across every subject.",
  },
};

export default function BooksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader withSearch />

      <Container className="py-10">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Showing <span className="text-primary">124</span> books in 'Technology'
          </h1>
          <label className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Sort by:</span>
            <div className="relative">
              <select className="appearance-none rounded-lg border border-outline-variant bg-card pl-4 pr-10 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            </div>
          </label>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          <aside className="bg-card rounded-2xl p-6 shadow-[0_2px_20px_-10px_rgba(21,25,106,0.2)] h-fit">
            <h2 className="font-display text-lg font-bold text-foreground">Filters</h2>
            <div className="mt-6">
              <h3 className="text-[11px] font-bold tracking-widest text-muted-foreground">CATEGORY</h3>
              <div className="mt-3 space-y-3">
                {[
                  { name: "Technology", checked: true },
                  { name: "Science", checked: false },
                  { name: "Business", checked: false },
                ].map((c) => (
                  <label key={c.name} className="flex items-center gap-3 text-sm cursor-pointer">
                    <input type="checkbox" defaultChecked={c.checked} className="size-4 rounded accent-[var(--primary)]" />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-7">
              <h3 className="text-[11px] font-bold tracking-widest text-muted-foreground">PRICE</h3>
              <div className="mt-3 space-y-3">
                {["Under $20", "$20 - $50", "Over $50"].map((p) => (
                  <label key={p} className="flex items-center gap-3 text-sm cursor-pointer">
                    <input type="radio" name="price" className="size-4 accent-[var(--primary)]" />
                    {p}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {browseBooks.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <button className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold px-8 py-3 hover:bg-primary-container transition">
                Load More <ChevronDown className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </Container>

      <SiteFooter />
    </div>
  );
}
