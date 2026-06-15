"use client";

import { useState } from "react";
import axios from "@/api/axios";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/site/Container";
import { BookOpen, Upload, Cpu, Loader2 } from "lucide-react";

export default function PublishPage() {
  const [formData, setFormData] = useState<any>({
    title: "",
    author: "",
    price: "",
    description: "",
    language: "",
    pdfFile: null,
    jpgFile: null,
    vectorDB: "No",
  });

  const [isLoading, setIsLoading] = useState(false);

  const getHeaders = () => ({
    id: localStorage.getItem("id") || "",
    authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    "Content-Type": "multipart/form-data",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setFormData({ ...formData, [name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData({ ...formData, [fieldName]: files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (
        formData.title === "" ||
        formData.author === "" ||
        formData.price === "" ||
        formData.description === "" ||
        formData.language === "" ||
        !formData.pdfFile ||
        !formData.jpgFile
      ) {
        alert("All fields with (*) are required!");
        setIsLoading(false);
        return;
      }

      const headers = getHeaders();

      // If vector store is needed, create it
      if (formData.vectorDB === "Yes") {
        const vectorizeFormData = new FormData();
        vectorizeFormData.append("file", formData.pdfFile);
        
        try {
          await axios.post("/vectorize", vectorizeFormData, { headers });
        } catch (err) {
          console.error("Vectorization failed:", err);
          alert("Warning: Vectorization failed. We will proceed to publish the book.");
        }
      }

      // Prepare payload for publish-book API
      const publishPayload = new FormData();
      publishPayload.append("title", formData.title);
      publishPayload.append("author", formData.author);
      publishPayload.append("price", formData.price);
      publishPayload.append("description", formData.description);
      publishPayload.append("language", formData.language);
      publishPayload.append("file", formData.pdfFile);
      publishPayload.append("cover", formData.jpgFile);
      publishPayload.append("vectorDB", formData.vectorDB);

      // Finally publish the book
      const publishResponse = await axios.post("/books/add", publishPayload, { headers });

      // Reset form data
      setFormData({
        title: "",
        author: "",
        price: "",
        description: "",
        language: "",
        pdfFile: null,
        jpgFile: null,
        vectorDB: "No",
      });

      alert(publishResponse.data.message || "Book published successfully!");
    } catch (error: any) {
      console.error("Publishing failed:", error);
      alert(error.response?.data?.error || "Publishing failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <Container className="py-10 flex-1 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
            <BookOpen className="size-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Publish Your Book</h1>
          <p className="mt-2 text-sm text-muted-foreground">Share your writings with our global readers community</p>
        </div>

        <div className="bg-card border border-outline-variant/35 rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_-10px_rgba(21,25,106,0.1)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-foreground/80 mb-1.5">
                Book Title *
              </label>
              <input
                id="title"
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-black"
                disabled={isLoading}
              />
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-semibold text-foreground/80 mb-1.5">
                Author Name *
              </label>
              <input
                id="author"
                type="text"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                placeholder="Author name"
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-black"
                disabled={isLoading}
              />
            </div>

            {/* Language & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="language" className="block text-sm font-semibold text-foreground/80 mb-1.5">
                  Language *
                </label>
                <input
                  id="language"
                  type="text"
                  name="language"
                  required
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="e.g. English, Urdu"
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-black"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-foreground/80 mb-1.5">
                  Price (USD) *
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-black"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-foreground/80 mb-1.5">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Write a brief overview of the book..."
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-black"
                disabled={isLoading}
              />
            </div>

            {/* File Upload Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-foreground/80 mb-2">Book Cover Image (JPG) *</label>
                <div className="relative border-2 border-dashed border-outline-variant/60 rounded-xl p-4 text-center hover:border-primary transition cursor-pointer bg-surface-container-low">
                  <input
                    type="file"
                    name="jpgFile"
                    accept=".jpg,.jpeg"
                    onChange={(e) => handleFileChange(e, "jpgFile")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isLoading}
                  />
                  <Upload className="mx-auto size-8 text-primary mb-2" />
                  <p className="text-xs font-semibold text-foreground/80">
                    {formData.jpgFile ? formData.jpgFile.name : "Select JPG Cover"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">Max size: 5MB</p>
                </div>
              </div>

              {/* PDF Document Upload */}
              <div>
                <label className="block text-sm font-semibold text-foreground/80 mb-2">Book Document (PDF) *</label>
                <div className="relative border-2 border-dashed border-outline-variant/60 rounded-xl p-4 text-center hover:border-primary transition cursor-pointer bg-surface-container-low">
                  <input
                    type="file"
                    name="pdfFile"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, "pdfFile")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isLoading}
                  />
                  <Upload className="mx-auto size-8 text-primary mb-2" />
                  <p className="text-xs font-semibold text-foreground/80">
                    {formData.pdfFile ? formData.pdfFile.name : "Select PDF Document"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">Max size: 50MB</p>
                </div>
              </div>
            </div>

            {/* Semantic search */}
            <div className="pt-2">
              <label className="block text-sm font-semibold text-foreground/80 mb-1.5 flex items-center gap-1.5">
                <Cpu className="size-4 text-primary" />
                Enable semantic search chatbot?
              </label>
              <div className="flex gap-6 mt-2">
                {["Yes", "No"].map((opt) => (
                  <label key={opt} className="flex items-center text-sm font-medium text-foreground/85 cursor-pointer">
                    <input
                      type="radio"
                      name="vectorDB"
                      value={opt}
                      checked={formData.vectorDB === opt}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 accent-primary"
                      disabled={isLoading}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-primary text-white font-semibold py-3 hover:bg-primary-container transition duration-300 disabled:opacity-75 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Publishing Book...
                  </>
                ) : (
                  "Publish Book"
                )}
              </button>
            </div>
          </form>
        </div>
      </Container>

      <SiteFooter />
    </div>
  );
}
