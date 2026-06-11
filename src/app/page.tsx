import Link from "next/link";
import { Search, ArrowRight, BookmarkCheck, Sparkles, EyeOff, Laptop, Moon, NotebookPen, Stars, Building2, Brain, Cpu, Palette, LineChart, Landmark, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/site/Container";
import { RatingStars } from "@/components/site/RatingStars";
import { editorsPicks, trendingNotes } from "@/lib/site-data";
import heroImg from "@/assets/home-hero-library.jpg";

const features = [
  { Icon: Sparkles, title: "Talk to your book", body: "AI-powered semantic search that lets you ask questions directly to your library.", chip: "AI" },
  { Icon: EyeOff, title: "Read anywhere", body: "Download your entire collection for seamless offline reading, no internet needed." },
  { Icon: Laptop, title: "Multi-device sync", body: "Start on your phone during your commute, finish on your laptop at home." },
  { Icon: Moon, title: "Easy on your eyes", body: "Beautifully optimized night mode and adjustable typography for any environment." },
  { Icon: NotebookPen, title: "Your thoughts, inside", body: "Capture highlights and notes that sync across all your devices instantly." },
  { Icon: Stars, title: "Chosen just for you", body: "Smart recommendations based on your reading habits and interests." },
];

const subjects = [
  { Icon: Building2, label: "Architecture" },
  { Icon: Brain, label: "Philosophy" },
  { Icon: Cpu, label: "Computer Science" },
  { Icon: Palette, label: "Design & Art" },
  { Icon: LineChart, label: "Economics" },
  { Icon: Landmark, label: "History" },
];

export default function HomePage() {
  const { featured, side } = editorsPicks;
  const heroImgSrc = typeof heroImg === "object" ? heroImg.src : heroImg;
  const featuredCover = typeof featured.cover === "object" ? featured.cover.src : featured.cover;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="pt-10 pb-16">
        <Container className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-primary leading-[1.05]">
              Your Digital Library,
              <br />
              <span className="text-[#a07f10]">Reimagined</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              Immerse yourself in a curated collection of premium reads and intelligent study notes. A serene workspace built for deep learning and discovery.
            </p>
            <div className="mt-8 relative max-w-md">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                placeholder="Search books, authors, or topics..."
                className="w-full rounded-2xl bg-surface-container-low py-4 pl-12 pr-16 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-container transition">
                <ArrowRight className="size-4" />
              </button>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs">
              <span className="font-bold tracking-widest text-muted-foreground">TRENDING:</span>
              {["Philosophy", "Design Systems"].map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">{t}</span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden bg-[#3c5269] p-3 shadow-[0_30px_80px_-20px_rgba(21,25,106,0.35)]">
              <div className="rounded-2xl overflow-hidden bg-black aspect-[16/11]">
                <img src={heroImgSrc} alt="A serene library interior" width={1280} height={896} className="size-full object-cover" />
              </div>
            </div>
            <div className="absolute right-6 bottom-12 bg-card rounded-xl shadow-[0_18px_40px_-14px_rgba(21,25,106,0.4)] px-4 py-3 flex items-center gap-3">
              <span className="size-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
                <BookmarkCheck className="size-4" />
              </span>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground">▸ NOW READING</p>
                <p className="text-sm font-semibold text-foreground">The Art of Stillness</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Editor's Picks */}
      <Container className="pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Editor's Picks</h2>
            <p className="mt-1 text-sm text-muted-foreground">Curated selections for the curious mind.</p>
          </div>
          <a href="#" className="text-sm font-semibold text-primary inline-flex items-center gap-1">View all <ArrowRight className="size-4" /></a>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <article className="lg:col-span-2 rounded-2xl bg-surface-container-low p-7 flex gap-6 items-center">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#fed65b]/60 text-[#574500] text-[11px] font-bold px-2 py-1">★ Bestseller</span>
              <h3 className="mt-3 font-display text-4xl font-bold text-foreground">{featured.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{featured.author}</p>
              <p className="mt-4 text-sm text-foreground/80 leading-relaxed">{featured.blurb}</p>
              <div className="mt-6 flex items-center gap-4">
                <button className="rounded-xl bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 inline-flex items-center gap-2 hover:bg-primary-container transition">
                  <BookmarkCheck className="size-4" /> Read Sample
                </button>
                <span className="font-display text-xl font-bold text-foreground">${featured.price.toFixed(2)}</span>
              </div>
            </div>
            <img src={featuredCover} alt={featured.title} width={768} height={1024} loading="lazy" className="w-40 aspect-[3/4] object-cover rounded-md shadow-[0_18px_40px_-12px_rgba(21,25,106,0.4)] rotate-[3deg]" />
          </article>

          <div className="flex flex-col gap-5">
            {side.map((b) => {
              const coverSrc = typeof b.cover === "object" ? b.cover.src : b.cover;
              return (
                <article key={b.id} className="rounded-2xl bg-surface-container-low p-4 flex items-center gap-4">
                  <img src={coverSrc} alt={b.title} width={512} height={768} loading="lazy" className="w-16 aspect-[3/4] object-cover rounded-md shadow-md" />
                  <div className="flex-1">
                    <h4 className="font-display font-semibold text-foreground">{b.title}</h4>
                    <p className="text-xs text-muted-foreground">{b.author}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Container>

      {/* Features */}
      <Container className="pb-16">
        <h2 className="font-display text-3xl font-bold text-foreground">Features for Readers</h2>
        <p className="mt-1 text-sm text-muted-foreground">Experience a smarter way to read and learn.</p>

        <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ Icon, title, body, chip }) => (
            <article key={title} className="relative rounded-2xl bg-surface-container-low p-5">
              <span className="inline-flex size-9 rounded-lg bg-card text-primary items-center justify-center">
                <Icon className="size-4" />
              </span>
              {chip && (
                <span className="absolute top-4 right-4 size-7 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{chip}</span>
              )}
              <h3 className="mt-4 font-display font-semibold text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{body}</p>
            </article>
          ))}
        </div>
      </Container>

      {/* Explore by Subject */}
      <section className="py-14 bg-surface-container-low/70">
        <Container>
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">Explore by Subject</h2>
            <p className="mt-1 text-sm text-muted-foreground">Find your next deep dive.</p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {subjects.map(({ Icon, label }) => (
              <button key={label} className="inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-[0_2px_10px_-4px_rgba(21,25,106,0.15)] hover:bg-primary hover:text-primary-foreground transition">
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Trending Notes */}
      <Container className="pt-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-3xl font-bold text-foreground">Trending Notes &amp; Summaries</h2>
          <div className="flex gap-2">
            <button className="size-9 rounded-full bg-surface-container-low text-foreground hover:bg-primary hover:text-primary-foreground transition flex items-center justify-center"><ChevronLeft className="size-4" /></button>
            <button className="size-9 rounded-full bg-surface-container-low text-foreground hover:bg-primary hover:text-primary-foreground transition flex items-center justify-center"><ChevronRight className="size-4" /></button>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {trendingNotes.map((n) => {
            const coverSrc = typeof n.cover === "object" ? n.cover.src : n.cover;
            return (
              <article key={n.id}>
                <div className="aspect-square overflow-hidden rounded-2xl bg-surface-container">
                  <img src={coverSrc} alt={n.title} loading="lazy" className="size-full object-cover hover:scale-[1.02] transition-transform" />
                </div>
                <h3 className="mt-3 font-display font-semibold text-foreground">{n.title}</h3>
                <p className="text-xs text-muted-foreground">{n.subtitle}</p>
              </article>
            );
          })}
        </div>
      </Container>

      <SiteFooter />
    </div>
  );
}

// Silence unused-import warning while keeping API stable
void RatingStars;
void Link;
