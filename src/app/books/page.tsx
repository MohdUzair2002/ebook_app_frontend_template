"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState,Suspense } from "react";
import { useSelector } from "react-redux";
import { ChevronDown, Search } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/site/Container";
import { BookCard } from "@/components/site/BookCard";
import axios from "@/api/axios";
import { RootState } from "@/store";

function BooksPage() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const role = useSelector((state: RootState) => state.auth.role);
  const searchParams = useSearchParams();
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [userBooks, setUserBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/books/getAllBooks");
        setAllBooks(response.data.books || []);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const headers = {
        id: localStorage.getItem("id") || "",
        authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      };
      const fetchUserBooks = async () => {
        try {
          const res = await axios.get("/books/purchased", { headers });
          setUserBooks(res.data.purchasedBooks || []);
        } catch (error) {
          console.error("Error fetching user books:", error);
        }
      };
      fetchUserBooks();
    } else {
      setUserBooks([]);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // 1. Filter out purchased books if user is not admin
    let result = isLoggedIn && role !== "admin"
      ? allBooks.filter(book => !userBooks.some(userBook => userBook._id === book._id))
      : [...allBooks];

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        book => 
          book.title?.toLowerCase().includes(query) || 
          book.author?.toLowerCase().includes(query) ||
          book.desc?.toLowerCase().includes(query)
      );
    }

    // 3. Filter by language
    if (selectedLanguage !== "All") {
      result = result.filter(book => book.language === selectedLanguage);
    }

    // 4. Filter by price
    if (priceFilter !== "All") {
      if (priceFilter === "Under $20") {
        result = result.filter(book => book.price < 20);
      } else if (priceFilter === "$20 - $50") {
        result = result.filter(book => book.price >= 20 && book.price <= 50);
      } else if (priceFilter === "Over $50") {
        result = result.filter(book => book.price > 50);
      }
    }

    // 5. Sort
    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredBooks(result);
  }, [allBooks, userBooks, isLoggedIn, role, searchQuery, selectedLanguage, priceFilter, sortBy]);

  // Extract list of unique languages dynamically
  const languages = ["All", ...Array.from(new Set(allBooks.map(b => b.language).filter(Boolean)))];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <Container className="py-10 flex-1">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Discover Your Next Read
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Showing <span className="text-primary font-semibold">{filteredBooks.length}</span> books
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search title, author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-card pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-black"
              />
            </div>

            {/* Sort Dropdown */}
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground whitespace-nowrap">Sort by:</span>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none rounded-lg border border-outline-variant bg-card pl-3 pr-8 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 text-black"
                >
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              </div>
            </label>
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Filters Sidebar */}
          <aside className="bg-card rounded-2xl p-6 border border-outline-variant/35 shadow-[0_2px_20px_-10px_rgba(21,25,106,0.15)] h-fit space-y-7">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground mb-4">Filters</h2>
              <h3 className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-3">Language</h3>
              <div className="space-y-2.5">
                {languages.map((lang: any) => (
                  <label key={lang} className="flex items-center gap-3 text-sm cursor-pointer text-foreground/80 font-medium">
                    <input
                      type="radio"
                      name="language"
                      checked={selectedLanguage === lang}
                      onChange={() => setSelectedLanguage(lang)}
                      className="size-4 accent-primary"
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-outline-variant/30 pt-6">
              <h3 className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-3">Price Range</h3>
              <div className="space-y-2.5">
                {["All", "Under $20", "$20 - $50", "Over $50"].map((p) => (
                  <label key={p} className="flex items-center gap-3 text-sm cursor-pointer text-foreground/80 font-medium">
                    <input
                      type="radio"
                      name="price"
                      checked={priceFilter === p}
                      onChange={() => setPriceFilter(p)}
                      className="size-4 accent-primary"
                    />
                    {p}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Books Grid */}
          <div>
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse bg-surface-container rounded-2xl h-80" />
                ))}
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-16 bg-card border border-outline-variant/30 rounded-2xl p-8">
                <p className="text-lg font-semibold text-foreground">No Books Available</p>
                <p className="text-sm text-muted-foreground mt-1">
                  We couldn't find any books matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book._id}
                    bookid={book._id}
                    image={book.coverUrl}
                    title={book.title}
                    author={book.author}
                    price={book.price}
                    pur={role === "admin"}
                    nonUser={role !== "admin"} // Non-admin users see preview overlay if they don't own it
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>

      <SiteFooter />
    </div>
  );
}
export default function BooksPageWrapper() {
  return (
    <Suspense>
      <BooksPage />
    </Suspense>
  );
}
