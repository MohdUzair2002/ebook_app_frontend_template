"use client";

import { useEffect, useState } from "react";
import axios from "@/api/axios";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function PendingBooks() {
  const [books, setBooks] = useState<any[] | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const getHeaders = () => ({
    id: localStorage.getItem("id") || "",
    authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  const fetchPending = async () => {
    try {
      const res = await axios.get("/books/getPendingBooks", {
        headers: getHeaders(),
      });
      setBooks(res.data.books || []);
    } catch (error) {
      console.error("Error fetching pending books:", error);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const approveBook = async (bookId: string) => {
    setPublishingId(bookId);
    try {
      const res = await axios.put(`/books/publishBook/${bookId}`, {}, {
        headers: getHeaders(),
      });
      alert(res.data.message);
      setBooks((prev) => (prev ? prev.filter((b) => b._id !== bookId) : []));
    } catch (error: any) {
      console.error("Error publishing book:", error);
      alert(error.response?.data?.error || "Failed to publish book.");
    } finally {
      setPublishingId(null);
    }
  };

  if (!books) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 gap-2">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Loading Pending Books...</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle2 className="size-16 text-emerald-500 mb-4" />
        <h3 className="text-2xl font-bold text-foreground">No Pending Books</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          All submitted books have been approved and published to the catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
        Pending Books
      </h2>

      <div className="space-y-4">
        {books.map((book) => (
          <div
            key={book._id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-surface-container-low/40 hover:bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 gap-4 transition duration-150 shadow-sm"
          >
            {/* Book Info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-20 bg-surface-container rounded-lg overflow-hidden border border-outline-variant/30 flex-shrink-0">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="size-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground text-base leading-tight">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">by {book.author}</p>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-xs font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded">
                    {book.language}
                  </span>
                  <span className="text-xs font-bold text-primary">${book.price}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => approveBook(book._id)}
              disabled={publishingId === book._id}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer w-full sm:w-auto text-center flex items-center justify-center gap-2"
            >
              {publishingId === book._id && <Loader2 className="size-3.5 animate-spin" />}
              <span>Approve & Publish</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
