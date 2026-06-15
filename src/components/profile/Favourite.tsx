"use client";

import { useEffect, useState } from "react";
import axios from "@/api/axios";
import BookCard from "@/components/site/BookCard";
import { Loader2, Heart } from "lucide-react";

export default function Favourite() {
  const [FavBooks, setFavBooks] = useState<any[] | null>(null);

  const getHeaders = () => ({
    id: localStorage.getItem("id") || "",
    authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  const fetchFavBooks = async () => {
    try {
      const res = await axios.get("/favourite/getFavouriteBooks", {
        headers: getHeaders(),
      });
      setFavBooks(res.data.data);
    } catch (error) {
      console.error("Error fetching favourite books:", error);
    }
  };

  useEffect(() => {
    fetchFavBooks();
  }, []);

  if (!FavBooks) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 gap-2">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Loading Favourites...</p>
      </div>
    );
  }

  if (FavBooks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <div className="size-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 animate-bounce">
          <Heart className="size-8 fill-red-500" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">No Favourite Books</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          Bookmark books you like while browsing our collection to read them later!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
        Favourite Books
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {FavBooks.map((items, i) => (
          <BookCard
            bookid={items._id}
            image={items.coverUrl}
            title={items.title}
            author={items.author}
            price={items.price}
            key={items._id || i}
            fav={true}
            onActionComplete={fetchFavBooks}
          />
        ))}
      </div>
    </div>
  );
}
