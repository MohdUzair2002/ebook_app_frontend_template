import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShoppingCart, Zap, Heart } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/site/Container";
import { RatingStars } from "@/components/site/RatingStars";
import { BookCard } from "@/components/site/BookCard";
import { systemDesignBook, becauseYouLiked } from "@/lib/site-data";
import authorImg from "@/assets/author-rostova.jpg";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "The Principles of System Design — KitabGhar",
    description: "Dr. Elena Rostova distills decades of software engineering experience into a comprehensive, accessible guide.",
    openGraph: {
      title: "The Principles of System Design — KitabGhar",
      description: "A comprehensive guide to scalable software architecture.",
    },
  };
}

const reviews = [
  { name: "James Chen", role: "Verified Buyer · 2 weeks ago", body: "An absolute masterclass in clarity. The diagrams alone are worth the price of the book. It immediately changed how my team approaches our microservice boundaries." },
  { name: "Sarah Jenkins", role: "Verified Buyer · 1 month ago", body: "Very thorough. Sometimes the pacing in chapter 4 felt a bit slow, but the final case studies tied everything together perfectly. Highly recommend for mid-level devs." },
  { name: "Michael K.", role: "Student · 2 months ago", body: "Used this alongside my university coursework. It made concepts that my professor struggled to explain incredibly obvious. The glassmorphic UI of the digital companion app is also stunning." },
];

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params;
  const b = systemDesignBook;
  const bCover = typeof b.cover === "object" ? b.cover.src : b.cover;
  const authorImgSrc = typeof authorImg === "object" ? authorImg.src : authorImg;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader withSearch />

      <Container className="py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/books" className="hover:text-primary">Books</Link>
          <ChevronRight className="size-3.5" />
          <span>Technology</span>
          <ChevronRight className="size-3.5" />
          <span className="text-primary font-medium">Software Engineering</span>
        </nav>

        {/* Hero */}
        <div className="mt-8 grid lg:grid-cols-[1fr_1.4fr] gap-12">
          <div className="flex items-start justify-center">
            <img src={bCover} alt={b.title} width={768} height={1024} className="w-full max-w-xs rounded-md shadow-[0_30px_60px_-20px_rgba(21,25,106,0.4)]" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1 rounded-md bg-[#fed65b]/70 text-[#574500] text-[11px] font-bold px-2.5 py-1">BESTSELLER</span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">{b.title}</h1>
            <p className="mt-2 text-sm">by <a href="#" className="text-primary font-medium hover:underline">{b.author}</a></p>
            <div className="mt-3"><RatingStars rating={b.rating} reviews={b.reviews} size="md" /></div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-foreground">${b.price.toFixed(2)}</span>
              <span className="text-muted-foreground line-through">${b.oldPrice?.toFixed(2)}</span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold px-5 py-3 hover:bg-primary-container transition">
                <ShoppingCart className="size-4" /> Add to Cart
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-[#fed65b] text-[#574500] text-sm font-bold px-5 py-3 hover:brightness-95 transition">
                <Zap className="size-4 fill-current" /> Buy Now
              </button>
              <button aria-label="Wishlist" className="size-11 rounded-xl border border-outline-variant text-foreground hover:bg-surface-container-low transition flex items-center justify-center">
                <Heart className="size-4" />
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="rounded-xl bg-secondary-container/30 border-2 border-primary px-5 py-3 text-left">
                <div className="text-[11px] font-bold text-muted-foreground">Hardcover</div>
                <div className="font-display font-bold text-foreground">$45.00</div>
              </button>
              <button className="rounded-xl border border-outline-variant px-5 py-3 text-left hover:border-primary/50 transition">
                <div className="text-[11px] font-bold text-muted-foreground">Digital (PDF)</div>
                <div className="font-display font-bold text-foreground">$29.00</div>
              </button>
            </div>

          </div>
        </div>

        {/* Synopsis + Specs */}
        <div className="mt-14 grid lg:grid-cols-[1.6fr_1fr] gap-6">
          <article className="rounded-2xl bg-card p-7 shadow-[0_2px_24px_-14px_rgba(21,25,106,0.2)]">
            <h2 className="font-display text-2xl font-bold text-foreground">Synopsis</h2>
            <div className="mt-4 space-y-3 text-sm text-foreground/80 leading-relaxed">
              <p>In <em>The Principles of System Design</em>, Dr. Elena Rostova distills decades of software engineering experience into a comprehensive, accessible guide. This book bridges the gap between theoretical computer science and practical, scalable application architecture.</p>
              <p>Moving beyond simple patterns, Rostova introduces a framework for thinking about complex systems holistically. You will learn how to evaluate trade-offs between latency, throughput, and consistency, and how to structure microservices to withstand massive scale without sacrificing developer velocity.</p>
              <p>Whether you are preparing for a senior engineering interview or architecting your startup's next major platform shift, this text serves as an indispensable reference manual.</p>
            </div>
          </article>

          <article className="rounded-2xl bg-surface-container-low p-7">
            <h2 className="font-display text-2xl font-bold text-foreground">Specifications</h2>
            <dl className="mt-4 divide-y divide-outline-variant/40 text-sm">
              {[
                ["Publisher", "TechPress Hub"],
                ["Publication Date", "Oct 12, 2023"],
                ["Language", "English"],
                ["Pages", "412"],
                ["ISBN-13", "978-1-56619-909-4"],
              ].map(([k, v]) => (
                <div key={k} className="py-2.5 flex justify-between">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </article>
        </div>

        {/* Author */}
        <article className="mt-6 rounded-2xl bg-card p-7 shadow-[0_2px_24px_-14px_rgba(21,25,106,0.2)] flex gap-5 items-start">
          <img src={authorImgSrc} alt="Dr. Elena Rostova" width={512} height={512} className="size-16 rounded-full object-cover" />
          <div>
            <p className="text-xs font-bold tracking-wide text-muted-foreground">About the Author</p>
            <h3 className="font-display text-xl font-bold text-primary mt-1">Dr. Elena Rostova</h3>
            <p className="mt-2 text-sm text-foreground/80 leading-relaxed max-w-3xl">Dr. Rostova is a Principal Engineer at a leading global cloud provider. With over 15 years of experience in distributed systems, she frequently speaks at international conferences and contributes to major open-source infrastructure projects. Her mission is to make robust software architecture accessible to engineers at all career stages.</p>
          </div>
        </article>

        {/* Reviews */}
        <section className="mt-16">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display text-3xl font-bold text-foreground">Reader Reviews</h2>
            <a href="#" className="text-sm text-primary font-semibold">Write a Review ✎</a>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {reviews.map((r) => (
              <article key={r.name} className="rounded-2xl bg-card p-5 shadow-[0_2px_24px_-14px_rgba(21,25,106,0.2)]">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold text-primary">
                    {r.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.name}</p>
                    <p className="text-[11px] text-muted-foreground">{r.role}</p>
                  </div>
                </div>
                <div className="mt-3"><RatingStars rating={5} /></div>
                <p className="mt-3 text-sm italic text-foreground/80 leading-relaxed">"{r.body}"</p>
              </article>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="mt-16">
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">Because you liked this</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {becauseYouLiked.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        </section>
      </Container>

      <SiteFooter />
    </div>
  );
}
