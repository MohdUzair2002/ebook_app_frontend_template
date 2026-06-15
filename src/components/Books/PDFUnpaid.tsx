"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { 
  Bot, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Minus, 
  Plus, 
  FileText, 
  PenTool, 
  Loader2, 
  Lock, 
  ShoppingBag,
  Check 
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version || "4.8.69"}/build/pdf.worker.min.mjs`;

interface PDFUnpaidProps {
  bookId: string;
  title: string;
  onClose: () => void;
  isPreviewMode?: boolean;
}

export default function PDFUnpaid({ bookId, title, onClose, isPreviewMode = true }: PDFUnpaidProps) {
  const router = useRouter();

  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.0);
  const [goToPageInput, setGoToPageInput] = useState("");
  const [maxPreviewPage, setMaxPreviewPage] = useState(Infinity);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [activeTab, setActiveTab] = useState<"ask" | "notes" | "ink" | null>("ask");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const getPdfUrl = () => 
    `https://kitab-ghar-new-backend-production.up.railway.app/api/v1/books/getBookFile/${encodeURIComponent(bookId)}`;

  useEffect(() => {
    if (numPages && isPreviewMode) {
      // Show 5% of pages or minimum 5 pages
      const previewPageCount = Math.max(5, Math.ceil(numPages * 0.05));
      setMaxPreviewPage(Math.min(previewPageCount, numPages));
    }
  }, [numPages, isPreviewMode]);

  const nextPage = () => {
    const nextPageNum = Math.min(pageNumber + 1, numPages || 1);
    if (isPreviewMode && nextPageNum > maxPreviewPage) {
      showPurchasePrompt();
      return;
    }
    setPageNumber(nextPageNum);
  };

  const prevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(goToPageInput);
    if (page && page > 0 && page <= (numPages || 1)) {
      if (isPreviewMode && page > maxPreviewPage) {
        showPurchasePrompt();
        return;
      }
      setPageNumber(page);
      setGoToPageInput("");
    }
  };

  const showPurchasePrompt = () => {
    toast.error(
      <div className="flex flex-col items-center p-4">
        <h3 className="font-bold text-lg mb-2">Preview Limit Reached</h3>
        <p className="mb-4 text-center">You've read the free preview pages.</p>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition cursor-pointer"
          onClick={() => {
            toast.dismiss();
            onClose(); // Close the PDF viewer first
            router.push(`/books/${bookId}`);
          }}
        >
          Buy Full Version
        </button>
        <button 
          className="mt-2 text-gray-400 hover:text-gray-300 text-sm cursor-pointer"
          onClick={() => toast.dismiss()}
        >
          Continue Preview
        </button>
      </div>,
      {
        position: "bottom-center",
        autoClose: false,
        closeButton: false,
        className: "!bg-gray-900 !text-white !rounded-xl !border !border-gray-700",
      }
    );
  };

  const getTabButtonClass = (tab: "ask" | "notes" | "ink") => {
    const isActive = activeTab === tab;
    return `w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 ${
      isActive 
        ? "bg-primary text-white shadow-sm font-bold scale-105" 
        : "text-muted-foreground hover:bg-surface-container-low hover:text-primary"
    }`;
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-[9999] overflow-hidden select-none font-sans">
      
      {/* 1. Header Toolbar */}
      <header className="w-full h-16 bg-white border-b border-outline-variant/30 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <LinkToHome onClose={onClose} />
          <div className="h-5 w-px bg-outline-variant/40 mx-1"></div>
          <span className="text-sm font-semibold text-foreground truncate max-w-[180px] sm:max-w-md">
            {title} <span className="ml-2 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Free Preview</span>
          </span>
        </div>

        {/* Navigation & Zoom controls */}
        <div className="flex items-center gap-4">
          {/* Page Navigation rounded pill */}
          <div className="flex items-center gap-2 bg-surface-container-low py-1 px-3 rounded-full border border-outline-variant/20 shadow-sm">
            <button
              onClick={prevPage}
              disabled={pageNumber <= 1}
              className="p-1 rounded-full text-primary hover:bg-surface-container-high/60 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
            <form onSubmit={handleGoToPage} className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max={numPages || 1}
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
                placeholder={String(pageNumber)}
                className="w-10 py-0.5 text-center font-bold text-xs bg-white text-foreground rounded border border-outline-variant/40 outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-[11px] text-muted-foreground/60">/</span>
              <span className="text-[11px] font-bold text-foreground/80 pr-1">{numPages || "..."}</span>
            </form>
            <button
              onClick={nextPage}
              disabled={pageNumber >= (numPages || Infinity)}
              className="p-1 rounded-full text-primary hover:bg-surface-container-high/60 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Zoom controls rounded pill */}
          <div className="flex items-center gap-3 bg-surface-container-low py-1 px-3 rounded-full border border-outline-variant/20 shadow-sm">
            <button 
              onClick={zoomOut} 
              disabled={scale <= 0.5}
              className="p-1 rounded-full text-primary hover:bg-surface-container-high/60 disabled:opacity-30 transition cursor-pointer"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="text-xs font-bold text-foreground w-10 text-center">
              {(scale * 100).toFixed(0)}%
            </span>
            <button 
              onClick={zoomIn} 
              disabled={scale >= 3.0}
              className="p-1 rounded-full text-primary hover:bg-surface-container-high/60 disabled:opacity-30 transition cursor-pointer"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Close Overlay */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-muted-foreground hover:bg-surface-container hover:text-foreground transition-all cursor-pointer"
          title="Close PDF"
        >
          <X className="size-5" />
        </button>
      </header>

      {/* 2. Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Leftmost Vertical Sidebar (70px wide) */}
        <aside className="w-[70px] bg-white border-r border-outline-variant/30 flex flex-col items-center py-6 gap-5 shrink-0">
          <button 
            onClick={() => setActiveTab(activeTab === "ask" ? null : "ask")}
            className={getTabButtonClass("ask")}
          >
            <div className="relative">
              <Bot className="size-5" />
              <Lock className="size-2 text-[#735c00] absolute -top-1 -right-1 bg-[#fed65b] rounded-full p-[1px]" />
            </div>
            <span className="text-[8px] font-bold tracking-wider uppercase">Ask Book</span>
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === "notes" ? null : "notes")}
            className={getTabButtonClass("notes")}
          >
            <div className="relative">
              <FileText className="size-5" />
              <Lock className="size-2 text-[#735c00] absolute -top-1 -right-1 bg-[#fed65b] rounded-full p-[1px]" />
            </div>
            <span className="text-[8px] font-bold tracking-wider uppercase">Notes</span>
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === "ink" ? null : "ink")}
            className={getTabButtonClass("ink")}
          >
            <div className="relative">
              <PenTool className="size-5" />
              <Lock className="size-2 text-[#735c00] absolute -top-1 -right-1 bg-[#fed65b] rounded-full p-[1px]" />
            </div>
            <span className="text-[8px] font-bold tracking-wider uppercase">Ink</span>
          </button>
        </aside>

        {/* Centered Document Canvas Area */}
        <main className="flex-1 bg-background overflow-auto p-8 flex justify-center items-start relative">
          <div className="relative shadow-[0_12px_40px_rgba(21,25,106,0.08)] border border-outline-variant/20 rounded-xl overflow-hidden bg-white p-1">
            <Document
              file={getPdfUrl()}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex flex-col items-center justify-center min-h-[400px] w-[600px] gap-2">
                  <Loader2 className="size-8 text-primary animate-spin" />
                  <p className="text-xs font-semibold text-muted-foreground">Loading Document...</p>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="max-w-full"
                width={Math.min(windowWidth * 0.55, 900)}
              />
            </Document>
          </div>
        </main>

        {/* Right Side panel for active sidebar tab (Purchase Promo for Unpaid viewers) */}
        {activeTab !== null && (
          <aside className="w-[360px] md:w-[380px] h-full bg-white border-l border-outline-variant/30 flex flex-col shrink-0 relative animate-in slide-in-from-right duration-250">
            {/* Panel Header */}
            <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-white shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                <Lock className="size-3.5" />
                Premium Feature
              </span>
              <button
                onClick={() => setActiveTab(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-surface-container hover:text-foreground transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Panel Body (Purchase Prompt Layout) */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f8f9ff]">
              <div className="size-16 rounded-full bg-[#fed65b]/20 flex items-center justify-center text-[#745c00] mb-5 shadow-sm border border-[#fed65b]/35 animate-pulse">
                <ShoppingBag className="size-8" />
              </div>
              <h3 className="text-lg font-display font-bold text-foreground leading-snug">
                Unlock Full Features
              </h3>
              <p className="text-xs text-muted-foreground mt-2 max-w-xs leading-relaxed">
                Purchase the full book to activate the **AI Book Assistant**, create **Study Notes** linked to pages, and access the **Ink Canvas Drawing tools**.
              </p>

              <div className="w-full h-px bg-outline-variant/30 my-6"></div>

              <button
                onClick={() => {
                  onClose();
                  router.push(`/books/${bookId}`);
                }}
                className="w-full py-3 bg-primary text-white hover:bg-primary-container font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="size-4" />
                <span>Buy Full Book</span>
              </button>
              <button
                onClick={() => setActiveTab(null)}
                className="mt-3 text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Continue Free Preview
              </button>
            </div>
          </aside>
        )}
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

// Logo home helper link
function LinkToHome({ onClose }: { onClose: () => void }) {
  return (
    <button 
      onClick={onClose}
      className="font-display text-base font-bold text-primary tracking-tight shrink-0 flex items-center gap-1.5 cursor-pointer hover:opacity-85 transition"
    >
      <img
        src="/web_logo.png"
        alt="logo"
        className="h-5.5 w-5.5"
      />
      KitabGhar
    </button>
  );
}
