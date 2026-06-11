import { Star } from "lucide-react";

export function RatingStars({ rating, reviews, size = "sm" }: { rating: number; reviews?: number; size?: "sm" | "md" }) {
  const dim = size === "md" ? "size-4" : "size-3.5";
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${dim} ${i <= Math.round(rating) ? "fill-[#e9c349] text-[#e9c349]" : "fill-transparent text-outline-variant"}`}
            strokeWidth={1.5}
          />
        ))}
      </div>
      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
      {reviews !== undefined && <span>({reviews.toLocaleString()})</span>}
    </div>
  );
}
