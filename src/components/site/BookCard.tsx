"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { RatingStars } from "./RatingStars";
import axios from "@/api/axios";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("@/components/Books/PDFViewer"), { ssr: false });
const PDFUnpaid = dynamic(() => import("@/components/Books/PDFUnpaid"), { ssr: false });

interface BookCardProps {
  book?: {
    id: string;
    title: string;
    author: string;
    price: number;
    cover: any;
    rating?: number;
    reviews?: number;
    badge?: string;
  };
  image?: string;
  title?: string;
  author?: string;
  price?: number;
  bookid?: string;
  fav?: boolean;
  pur?: boolean;
  nonUser?: boolean;
  onActionComplete?: () => void; // Callback to trigger a refresh
}

export function BookCard({ 
  book, 
  image, 
  title, 
  author, 
  price, 
  bookid, 
  fav = false, 
  pur = false, 
  nonUser = false,
  onActionComplete
}: BookCardProps) {
  const [showPdf, setShowPdf] = useState(false);

  const id = book ? book.id : bookid || "";
  const bookTitle = book ? book.title : title || "";
  const bookAuthor = book ? book.author : author || "";
  const bookPrice = book ? book.price : price || 0;
  const rawCover = book ? book.cover : image || "";
  const coverSrc = typeof rawCover === "object" ? rawCover.src : rawCover;
  
  const rating = book?.rating || 4.5;
  const reviews = book?.reviews || 100;
  const badge = book?.badge;

  const removeFromFavourite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const headers = {
      bookid: id,
      id: localStorage.getItem("id") || "",
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    };
    try {
      const response = await axios.put(
        "/favourite/removeFromFavourite",
        {},
        { headers }
      );
      alert(response.data.message);
      if (onActionComplete) onActionComplete();
    } catch (error) {
      console.error("Error removing from favourites:", error);
    }
  };

  const closePdfViewer = () => {
    setShowPdf(false);
  };

  return (
    <>
      <article className="group bg-card rounded-2xl p-3 border border-outline-variant/30 shadow-[0_2px_24px_-12px_rgba(21,25,106,0.15)] hover:shadow-[0_10px_30px_-12px_rgba(21,25,106,0.25)] transition-all flex flex-col h-full">
        <Link
          href={`/books/${id}`}
          className="relative block aspect-[3/4] overflow-hidden rounded-xl bg-surface-container"
        >
          <img
            src={coverSrc}
            alt={bookTitle}
            loading="lazy"
            className="size-full object-cover group-hover:scale-[1.02] transition-transform"
          />
          {badge && (
            <span
              className={
                "absolute top-3 left-3 rounded-md px-2.5 py-1 text-[11px] font-bold " +
                (badge === "new"
                  ? "bg-primary text-primary-foreground"
                  : "bg-[#fed65b] text-[#574500]")
              }
            >
              {badge === "new" ? "New" : "Best Seller"}
            </span>
          )}
        </Link>

        <div className="flex flex-col flex-1 px-1 pt-4 pb-2">
          <RatingStars rating={rating} reviews={reviews} />
          <h3 className="mt-2 font-display text-base font-bold text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors">
            <Link href={`/books/${id}`}>{bookTitle}</Link>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">by {bookAuthor}</p>

          <div className="mt-auto pt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold text-primary">
                ${parseFloat(String(bookPrice || 0)).toFixed(2)}
              </span>
              {!fav && !pur && !nonUser && (
                <button
                  aria-label="Add to cart"
                  className="size-9 rounded-full bg-surface-container text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"
                >
                  <ShoppingCart className="size-4" />
                </button>
              )}
            </div>

            {fav && (
              <button
                onClick={removeFromFavourite}
                className="w-full mt-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-xs font-semibold transition-all duration-300"
              >
                Remove from Favourites
              </button>
            )}

            {pur && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowPdf(true);
                }}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-semibold transition-all duration-300"
              >
                Read Book
              </button>
            )}

            {nonUser && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowPdf(true);
                }}
                className="w-full mt-2 bg-primary hover:bg-primary-container text-white py-2 rounded-xl text-xs font-semibold transition-all duration-300"
              >
                Preview Book
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Render PDF Viewer Overlay when active */}
      {showPdf && pur && (
        <PDFViewer 
          title={bookTitle} 
          bookId={id} 
          onClose={closePdfViewer}
        />
      )}

      {showPdf && nonUser && (
        <PDFUnpaid 
          title={bookTitle} 
          bookId={id} 
          onClose={closePdfViewer}
        />
      )}
    </>
  );
}
export default BookCard;
