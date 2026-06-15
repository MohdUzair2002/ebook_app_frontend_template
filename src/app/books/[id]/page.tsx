"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ShoppingCart, Zap, Heart, Trash, Edit, Globe } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/site/Container";
import { RatingStars } from "@/components/site/RatingStars";
import axios from "@/api/axios";
import { RootState } from "@/store";

export default function BookDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const role = useSelector((state: RootState) => state.auth.role);

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBook = async () => {
      const headers = {
        bookid: id,
        id: localStorage.getItem("id") || "",
        authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      };
      try {
        const res = await axios.get(`/books/getBookByID/${id}`, { headers });
        setBook(res.data.book);
        if (isLoggedIn) {
          const purRes = await axios.get("/books/purchased", { headers });
          const purchased = purRes.data.purchasedBooks || [];
          setIsPurchased(purchased.some((b: any) => b._id === id));
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchBook();
    }
  }, [id, role]);

  const addToFavourite = async () => {
    const headers = {
      bookid: id,
      id: localStorage.getItem("id") || "",
      authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    };
    if (isPurchased) {
      alert("You already own this book!");
      return;
    }
    try {
      const response = await axios.put("/favourite/addToFavourite", {}, { headers });
      alert(response.data.message);
    } catch (error: any) {
      console.error("Error adding to favourites:", error);
      alert(error.response?.data?.error || "Failed to add to favourites");
    }
  };

  const addToCart = async () => {
    const headers = {
      bookid: id,
      id: localStorage.getItem("id") || "",
      authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    };
    if (isPurchased) {
      alert("You already own this book!");
      return;
    }
    try {
      const response = await axios.put("/cart/addToCart", {}, { headers });
      alert(response.data.message);
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.error || "Failed to add to cart");
    }
  };

  const deleteBook = async () => {
    const headers = {
      bookid: id,
      id: localStorage.getItem("id") || "",
      authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    };
    if (!window.confirm("Are you sure you want to delete this book permanently?")) return;
    try {
      const response = await axios.delete(`/books/delete/${id}`, { headers });
      alert(response.data.message);
      router.push("/books");
    } catch (error: any) {
      console.error("Error deleting book:", error);
      alert(error.response?.data?.error || "Failed to delete book");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader withSearch />

      <Container className="py-8 flex-1">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/books" className="hover:text-primary">Books</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-primary font-medium">Book Details</span>
        </nav>

        {loading ? (
          <div className="flex flex-col lg:flex-row gap-12 mt-8 animate-pulse">
            <div className="w-full lg:w-[400px] h-[550px] bg-surface-container rounded-2xl" />
            <div className="flex-1 space-y-6">
              <div className="h-10 bg-surface-container rounded w-3/4" />
              <div className="h-6 bg-surface-container rounded w-1/4" />
              <div className="h-32 bg-surface-container rounded" />
            </div>
          </div>
        ) : !book ? (
          <div className="text-center py-20 bg-card border border-outline-variant/30 rounded-2xl mt-8">
            <h2 className="text-2xl font-bold text-foreground">Book Not Found</h2>
            <p className="text-sm text-muted-foreground mt-2">
              The book you are looking for does not exist or has been removed.
            </p>
            <Link href="/books" className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-container transition">
              Back to Catalog
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12">
              <div className="flex items-start justify-center">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  width={768}
                  height={1024}
                  className="w-full max-w-xs rounded-xl shadow-[0_30px_60px_-20px_rgba(21,25,106,0.35)] border border-outline-variant/30"
                />
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#fed65b]/70 text-[#574500] text-[11px] font-bold px-2.5 py-1 uppercase tracking-wide">
                    {book.language}
                  </span>
                  <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
                    {book.title}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    by <span className="text-primary font-semibold">{book.author}</span>
                  </p>

                  <div className="mt-3">
                    <RatingStars rating={4.8} reviews={1450} size="md" />
                  </div>

                  <div className="mt-6 flex items-baseline gap-3">
                    <span className="font-display text-3xl font-bold text-primary">
                      USD ${book.price}
                    </span>
                  </div>

                  <p className="mt-6 text-sm text-foreground/80 leading-relaxed max-w-2xl bg-card border border-outline-variant/35 p-5 rounded-2xl shadow-[0_2px_24px_-14px_rgba(21,25,106,0.1)]">
                    {book.desc || "No description provided for this book. Dive in to discover its story and knowledge."}
                  </p>

                  <div className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
                    <Globe className="size-4 text-primary" />
                    <span>Language: <span className="font-semibold text-foreground">{book.language}</span></span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {isLoggedIn && (
                    <>
                      {role !== "admin" ? (
                        <>
                          {isPurchased ? (
                            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold px-6 py-3">
                              ✓ You already own this book
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={addToCart}
                                className="inline-flex items-center gap-2 rounded-xl bg-primary text-white text-sm font-semibold px-6 py-3 hover:bg-primary-container transition"
                              >
                                <ShoppingCart className="size-4" /> Add to Cart (Wishlist)
                              </button>
                              <button
                                onClick={addToFavourite}
                                className="size-12 rounded-xl border border-outline-variant text-foreground hover:bg-surface-container-low transition flex items-center justify-center"
                                aria-label="Add to favourites"
                              >
                                <Heart className="size-5 text-red-500 fill-red-500" />
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <Link
                            href={`/update-book/${id}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold px-6 py-3 hover:bg-emerald-700 transition"
                          >
                            <Edit className="size-4" /> Edit Book
                          </Link>
                          <button
                            onClick={deleteBook}
                            className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white text-sm font-semibold px-6 py-3 hover:bg-red-700 transition"
                          >
                            <Trash className="size-4" /> Delete Book
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>

      <SiteFooter />
    </div>
  );
}
