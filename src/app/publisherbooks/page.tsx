"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookMarked, Search } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/site/Container";
import { BookCard } from "@/components/site/BookCard";
import axios from "@/api/axios";

export default function PublisherBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBooks = async () => {
    const headers = {
      id: localStorage.getItem("id") || "",
      authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    };
    try {
      setLoading(true);
      const res = await axios.get("/books/getPublisherBooks", { headers });
      setBooks(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch publisher books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book => 
    book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <Container className="py-10 flex-1">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Published Books
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              You have published <span className="text-primary font-semibold">{books.length}</span> {books.length === 1 ? 'book' : 'books'}
            </p>
          </div>

          {books.length > 0 && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search your published books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-card pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-black"
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-surface-container rounded-2xl h-80" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20 bg-card border border-outline-variant/30 rounded-2xl max-w-xl mx-auto p-8 shadow-[0_4px_30px_-10px_rgba(21,25,106,0.05)]">
            <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-6">
              <BookMarked className="size-10" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">No Published Books</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              You haven't published any books yet. Get started and share your knowledge with our readers.
            </p>
            <Link href="/publish" className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-container transition">
              Publish Your First Book
            </Link>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16 bg-card border border-outline-variant/30 rounded-2xl">
            <p className="text-lg font-semibold text-foreground">No matches found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredBooks.map((book) => (
              <BookCard
                key={book._id}
                bookid={book._id}
                image={book.coverUrl}
                title={book.title}
                author={book.author}
                price={book.price}
                pur={true}
              />
            ))}
          </div>
        )}
      </Container>

      <SiteFooter />
    </div>
  );
}
