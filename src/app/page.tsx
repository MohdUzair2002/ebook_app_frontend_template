"use client";

import { useEffect, useState,useRef} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, BookmarkCheck, Sparkles, EyeOff, Laptop, Moon, NotebookPen, Stars, Building2, Brain, Cpu, Palette, LineChart, Landmark, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/site/Container";
import { BookCard } from "@/components/site/BookCard";
import axios from "@/api/axios";
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
  const [recentBooks, setRecentBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    axios.get("/books/getAllBooks").then((res) => {
      setAllBooks(res.data.books || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await axios.get("/books/recent");
        setRecentBooks(response.data.recentBooks || []);
      } catch (error) {
        console.error("Error fetching recent books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const heroImgSrc = typeof heroImg === "object" ? heroImg.src : heroImg;
;
  const handleSearch = () => {
    const q = searchQuery.trim();
    setShowDropdown(false);
    if (q) router.push(`/books?search=${encodeURIComponent(q)}`);
    else router.push("/books");
  };

  const filteredSuggestions = searchQuery.trim().length > 0
    ? allBooks.filter((b) =>
        b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];
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
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />
              <input
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                placeholder="Search books, authors, or topics..."
                className="w-full rounded-2xl bg-surface-container-low py-4 pl-12 pr-16 text-sm outline-none focus:ring-2 focus:ring-primary/30 text-black"
              />
              <button onClick={handleSearch} className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-container transition cursor-pointer">
                <ArrowRight className="size-4" />
              </button>
              {showDropdown && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-outline-variant/20 overflow-hidden z-50">
                  {filteredSuggestions.map((book) => (
                    <button
                      key={book._id}
                      onMouseDown={() => router.push(`/books/${book._id}`)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition text-left cursor-pointer"
                    >
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="h-10 w-7 object-cover rounded shadow-sm shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{book.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs">
              <span className="font-bold tracking-widest text-muted-foreground">TRENDING:</span>
              {["Philosophy", "Design Systems"].map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">{t}</span>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
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

      {/* Recently Added Books */}
      <Container className="pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Recently Added Books</h2>
            <p className="mt-1 text-sm text-muted-foreground">Fresh publications added directly from authors and publishers.</p>
          </div>
          <Link href="/books" className="text-sm font-semibold text-primary inline-flex items-center gap-1">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-surface-container rounded-2xl h-80" />
            ))}
          </div>
        ) : recentBooks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No recently added books available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentBooks.slice(0, 4).map((book) => {
              // Map API book details to the premium BookCard format
              const mappedBook = {
                id: book._id,
                title: book.title,
                author: book.author,
                price: book.price,
                cover: book.coverUrl,
                rating: 4.5,
                reviews: 120,
              };
              return <BookCard key={book._id} book={mappedBook} />;
            })}
          </div>
        )}
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

      <SiteFooter />
    </div>
  );
}
