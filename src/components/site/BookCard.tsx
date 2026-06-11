import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { RatingStars } from "./RatingStars";
import type { Book } from "@/lib/site-data";

export function BookCard({ book }: { book: Book }) {
  const coverSrc = typeof book.cover === "object" ? book.cover.src : book.cover;

  return (
    <article className="group bg-card rounded-2xl p-3 shadow-[0_2px_24px_-12px_rgba(21,25,106,0.18)] hover:shadow-[0_10px_30px_-12px_rgba(21,25,106,0.28)] transition-all flex flex-col">
      <Link
        href={`/books/${book.id}`}
        className="relative block aspect-[3/4] overflow-hidden rounded-xl bg-surface-container"
      >
        <img
          src={coverSrc}
          alt={book.title}
          loading="lazy"
          className="size-full object-cover group-hover:scale-[1.02] transition-transform"
        />
        {book.badge && (
          <span
            className={
              "absolute top-3 left-3 rounded-md px-2.5 py-1 text-[11px] font-bold " +
              (book.badge === "new"
                ? "bg-primary text-primary-foreground"
                : "bg-[#fed65b] text-[#574500]")
            }
          >
            {book.badge === "new" ? "New" : "Best Seller"}
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 px-1 pt-4 pb-2">
        <RatingStars rating={book.rating} reviews={book.reviews} />
        <h3 className="mt-2 font-display text-lg font-bold text-foreground leading-tight line-clamp-2">
          <Link href={`/books/${book.id}`}>{book.title}</Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{book.author}</p>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="font-display text-xl font-bold text-primary">
            ${book.price.toFixed(2)}
          </span>
          <button
            aria-label="Add to cart"
            className="size-9 rounded-full bg-surface-container text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"
          >
            <ShoppingCart className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
