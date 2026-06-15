"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "@/api/axios";
import { RootState } from "@/store";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/site/Container";
import { Loader2, ArrowLeft } from "lucide-react";

export default function UpdateBook() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const role = useSelector((state: RootState) => state.auth.role);

  const [data, setData] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    language: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = setTimeout(() => {
      if (!isLoggedIn || role !== "admin") {
        router.push("/");
      }
    }, 100);

    return () => clearTimeout(checkAdmin);
  }, [isLoggedIn, role]);

  useEffect(() => {
    if (!id) return;
    const fetchBook = async () => {
      try {
        const res = await axios.get(`/books/getBookByID/${id}`);
        const book = res.data.book;
        setData({
          title: book.title || "",
          author: book.author || "",
          price: book.price !== undefined ? String(book.price) : "",
          description: book.description || book.desc || "",
          language: book.language || "",
        });
      } catch (error) {
        console.error("Error fetching book for update:", error);
        alert("Failed to load book data.");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const getHeaders = () => ({
    bookid: id,
    id: localStorage.getItem("id") || "",
    authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      if (
        data.title === "" ||
        data.author === "" ||
        data.price === "" ||
        data.description === "" ||
        data.language === ""
      ) {
        alert("All fields are required");
        return;
      }

      setUpdating(true);
      const response = await axios.put(
        "/books/updateBook",
        {
          title: data.title,
          author: data.author,
          price: Number(data.price),
          description: data.description,
          language: data.language,
        },
        { headers: getHeaders() }
      );
      alert(response.data.message);
      router.push(`/books/${id}`);
    } catch (error: any) {
      console.error("Error updating book:", error);
      alert(error.response?.data?.message || "Failed to update book.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-2">
          <Loader2 className="size-8 text-primary animate-spin" />
          <p className="text-sm font-semibold text-muted-foreground">Loading Book Details...</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <Container className="py-8 flex-1 max-w-3xl">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary mb-6 transition cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back</span>
        </button>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
          Update Book Details
        </h2>

        <div className="bg-card border border-outline-variant/30 rounded-2xl p-6 shadow-sm space-y-5">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Book Title
            </label>
            <input
              type="text"
              name="title"
              value={data.title}
              onChange={handleChange}
              placeholder="Book Title"
              className="mt-1.5 w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 font-semibold text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>

          {/* Author */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Author Name
            </label>
            <input
              type="text"
              name="author"
              value={data.author}
              onChange={handleChange}
              placeholder="Author Name"
              className="mt-1.5 w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 font-semibold text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>

          {/* Language & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                Language
              </label>
              <input
                type="text"
                name="language"
                value={data.language}
                onChange={handleChange}
                placeholder="Language"
                className="mt-1.5 w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 font-semibold text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                Price (USD)
              </label>
              <input
                type="number"
                name="price"
                value={data.price}
                onChange={handleChange}
                placeholder="Price"
                className="mt-1.5 w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 font-semibold text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Description
            </label>
            <textarea
              name="description"
              rows={5}
              value={data.description}
              onChange={handleChange}
              placeholder="Description"
              className="mt-1.5 w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-4 font-semibold text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              onClick={() => router.push(`/books/${id}`)}
              disabled={updating}
              className="bg-surface-container hover:bg-surface-container-high text-foreground font-bold px-6 py-3 rounded-xl transition disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="bg-primary text-white hover:bg-primary-container font-bold px-6 py-3 rounded-xl shadow-sm hover:shadow transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {updating && <Loader2 className="size-4 animate-spin" />}
              <span>Update Book</span>
            </button>
          </div>
        </div>
      </Container>

      <SiteFooter />
    </div>
  );
}
