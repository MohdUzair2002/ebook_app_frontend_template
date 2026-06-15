"use client";

import { useState } from "react";
import axios from "@/api/axios";
import { Loader2 } from "lucide-react";

export default function AddBook() {
  const [data, setData] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    language: "",
    pdfFile: null as File | null,
    jpgFile: null as File | null,
    vectorDB: "No",
  });
  const [loading, setLoading] = useState(false);

  const getHeaders = () => ({
    id: localStorage.getItem("id") || "",
    authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    "Content-Type": "multipart/form-data",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (
        data.title === "" ||
        data.author === "" ||
        data.price === "" ||
        data.description === "" ||
        data.language === "" ||
        !data.pdfFile ||
        !data.jpgFile
      ) {
        alert("All fields with (*) are required!");
        return;
      }

      setLoading(true);
      const publishPayload = new FormData();
      publishPayload.append("title", data.title);
      publishPayload.append("author", data.author);
      publishPayload.append("price", data.price);
      publishPayload.append("description", data.description);
      publishPayload.append("language", data.language);
      publishPayload.append("file", data.pdfFile);
      publishPayload.append("cover", data.jpgFile);
      publishPayload.append("vectorDB", data.vectorDB);

      const response = await axios.post("/books/add", publishPayload, {
        headers: getHeaders(),
      });

      alert(response.data.message);

      // Reset form
      setData({
        title: "",
        author: "",
        price: "",
        description: "",
        language: "",
        pdfFile: null,
        jpgFile: null,
        vectorDB: "No",
      });
      // Clear file inputs physically
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => {
        (input as HTMLInputElement).value = "";
      });
    } catch (error: any) {
      console.error("Error adding book:", error);
      alert(error.response?.data?.error || "Failed to publish book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-full max-w-3xl">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
        Add Book
      </h2>

      <div className="bg-surface-container-low/40 border border-outline-variant/30 rounded-2xl p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Title of Book *
          </label>
          <input
            type="text"
            name="title"
            required
            value={data.title}
            onChange={handleChange}
            placeholder="e.g. The Great Gatsby"
            className="mt-1.5 w-full bg-card border border-outline-variant/40 rounded-xl px-4 py-3 font-semibold text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        {/* Author */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Author of Book *
          </label>
          <input
            type="text"
            name="author"
            required
            value={data.author}
            onChange={handleChange}
            placeholder="e.g. F. Scott Fitzgerald"
            className="mt-1.5 w-full bg-card border border-outline-variant/40 rounded-xl px-4 py-3 font-semibold text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        {/* Language & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Language *
            </label>
            <input
              type="text"
              name="language"
              required
              value={data.language}
              onChange={handleChange}
              placeholder="e.g. English"
              className="mt-1.5 w-full bg-card border border-outline-variant/40 rounded-xl px-4 py-3 font-semibold text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Price *
            </label>
            <input
              type="number"
              name="price"
              required
              value={data.price}
              onChange={handleChange}
              placeholder="e.g. 19.99"
              className="mt-1.5 w-full bg-card border border-outline-variant/40 rounded-xl px-4 py-3 font-semibold text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Description of Book *
          </label>
          <textarea
            name="description"
            required
            rows={4}
            value={data.description}
            onChange={handleChange}
            placeholder="Write a brief overview of the plot, topics, and contents..."
            className="mt-1.5 w-full bg-card border border-outline-variant/40 rounded-xl p-4 font-semibold text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">
              Upload Book Cover (.jpg) *
            </label>
            <input
              type="file"
              name="jpgFile"
              accept=".jpg,.jpeg"
              required
              onChange={handleFileChange}
              className="w-full text-sm text-foreground/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-surface-container file:text-primary hover:file:bg-primary/10 file:cursor-pointer bg-card border border-outline-variant/40 rounded-xl p-1 px-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">
              Upload Book Document (.pdf) *
            </label>
            <input
              type="file"
              name="pdfFile"
              accept=".pdf"
              required
              onChange={handleFileChange}
              className="w-full text-sm text-foreground/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-surface-container file:text-primary hover:file:bg-primary/10 file:cursor-pointer bg-card border border-outline-variant/40 rounded-xl p-1 px-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Vector store */}
        <div>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-2">
            Create Vector Store for Semantic Search?
          </span>
          <div className="flex items-center gap-6 text-sm font-semibold text-foreground">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="vectorDB"
                value="Yes"
                checked={data.vectorDB === "Yes"}
                onChange={handleChange}
                className="size-4 text-primary focus:ring-primary border-outline-variant"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="vectorDB"
                value="No"
                checked={data.vectorDB === "No"}
                onChange={handleChange}
                className="size-4 text-primary focus:ring-primary border-outline-variant"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary text-white hover:bg-primary-container font-bold px-6 py-3 rounded-xl shadow-sm hover:shadow transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            <span>Publish Book</span>
          </button>
        </div>
      </div>
    </div>
  );
}
