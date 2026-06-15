"use client";

import { useState, useEffect, useRef } from "react";
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
  Eraser, 
  Check,
  Maximize2,
  Minimize2
} from "lucide-react";
import Chatbot from "./Chatbot";
import Notes from "./Notes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version || "4.8.69"}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  bookId: string;
  title: string;
  onClose: () => void;
}

export default function PDFViewer({ bookId, title, onClose }: PDFViewerProps) {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.0);
  const [goToPageInput, setGoToPageInput] = useState("");
  const [windowWidth, setWindowWidth] = useState(1200);
  const [activeTab, setActiveTab] = useState<"ask" | "notes" | "ink" | null>("ask");
  const [fullscreen, setFullscreen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const [inkColor, setInkColor] = useState("yellow");
  const [brushSize, setBrushSize] = useState("medium");
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<{ page: number; color: string; size: string; points: [number, number][] }[]>([]);
  const [currentStroke, setCurrentStroke] = useState<[number, number][]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPageNumber((prev) => Math.max(prev - 1, 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        mainRef.current?.scrollBy({ top: 120, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        mainRef.current?.scrollBy({ top: -120, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [numPages]);

  // Disable right-click and save shortcuts
  useEffect(() => {
    const noContext = (e: MouseEvent) => e.preventDefault();
    const noSave = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.key === "s") ||
        (e.ctrlKey && e.shiftKey && e.key === "s") ||
        (e.ctrlKey && e.key === "p") ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", noContext);
    document.addEventListener("keydown", noSave);
    return () => {
      document.removeEventListener("contextmenu", noContext);
      document.removeEventListener("keydown", noSave);
    };
  }, []);

  // Load highlights
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`https://kitab-ghar-new-backend-production.up.railway.app/api/v1/highlights/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { if (data?.highlights) setStrokes(data.highlights); })
      .catch(() => {});
  }, [bookId]);

  // Redraw canvas on page change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    redrawCanvas(canvas, strokes);
  }, [pageNumber, strokes]);

  // Sync canvas size to PDF page
  useEffect(() => {
    const pdfCanvas = canvasRef.current?.parentElement?.querySelector("canvas:not([data-highlight])") as HTMLCanvasElement;
    if (pdfCanvas && canvasRef.current) {
      const w = pdfCanvas.offsetWidth;
      const h = pdfCanvas.offsetHeight;
      canvasRef.current.width = w;
      canvasRef.current.height = h;
      canvasRef.current.style.width = w + "px";
      canvasRef.current.style.height = h + "px";
      redrawCanvas(canvasRef.current, strokes);
    }
  }, [pageNumber, numPages, scale]);

  const getPdfUrl = () =>
    `https://kitab-ghar-new-backend-production.up.railway.app/api/v1/books/getBookFile/${encodeURIComponent(bookId)}`;

  const nextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
  const prevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => setNumPages(numPages);

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(goToPageInput);
    if (page && page > 0 && page <= (numPages || 1)) {
      setPageNumber(page);
      setGoToPageInput("");
    }
  };

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextPage();
      else prevPage();
    }
    setTouchStartX(null);
  };

  const getTabButtonClass = (tab: "ask" | "notes" | "ink") => {
    const isActive = activeTab === tab;
    return `w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 ${
      isActive
        ? "bg-primary text-white shadow-sm font-bold scale-105"
        : "text-muted-foreground hover:bg-surface-container-low hover:text-primary"
    }`;
  };

  const colorMap: Record<string, string> = {
    yellow: "rgba(253, 224, 71, 0.4)",
    green: "rgba(134, 239, 172, 0.4)",
    blue: "rgba(147, 197, 253, 0.4)",
    pink: "rgba(249, 168, 212, 0.4)",
  };

  const brushSizeMap: Record<string, number> = { small: 8, medium: 16, large: 28 };

  const redrawCanvas = (canvas: HTMLCanvasElement, allStrokes: typeof strokes) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    allStrokes.filter((s) => s.page === pageNumber).forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = colorMap[stroke.color];
      ctx.lineWidth = brushSizeMap[stroke.size];
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(stroke.points[0][0], stroke.points[0][1]);
      stroke.points.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.stroke();
    });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTab !== "ink") return;
    const rect = canvasRef.current!.getBoundingClientRect();
    setIsDrawing(true);
    setCurrentStroke([[e.clientX - rect.left, e.clientY - rect.top]]);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTab !== "ink") return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const updated = [...currentStroke, [x, y] as [number, number]];
    setCurrentStroke(updated);
    ctx.beginPath();
    ctx.strokeStyle = colorMap[inkColor];
    ctx.lineWidth = brushSizeMap[brushSize];
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (updated.length >= 2) {
      ctx.moveTo(updated[updated.length - 2][0], updated[updated.length - 2][1]);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const handleCanvasMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.length < 2) return;
    setStrokes([...strokes, { page: pageNumber, color: inkColor, size: brushSize, points: currentStroke }]);
    setCurrentStroke([]);
  };

  const clearHighlights = () => {
    const filtered = strokes.filter((s) => s.page !== pageNumber);
    setStrokes(filtered);
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveHighlights = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`https://kitab-ghar-new-backend-production.up.railway.app/api/v1/highlights`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: localStorage.getItem("id"), bookId, highlights: strokes }),
      });
    } catch (err) {
      console.error("Failed to save highlights", err);
    }
  };

  const pdfWidth = fullscreen
    ? Math.min(windowWidth * 0.9, 1200)
    : windowWidth < 768
    ? windowWidth - 90
    : Math.min(windowWidth * 0.55, 900);

  return (
    <div
      className="fixed inset-0 bg-white flex flex-col z-[9999] overflow-hidden select-none font-sans"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      {/* Header */}
      {!fullscreen && (
        <header className="w-full h-14 bg-white border-b border-outline-variant/30 px-3 md:px-6 flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onClose}
              className="font-display text-sm font-bold text-primary tracking-tight shrink-0 flex items-center gap-1.5 cursor-pointer hover:opacity-85 transition"
            >
              <img src="/web_logo.JPG" alt="logo" className="h-7 w-7 object-contain" />
              <span className="hidden sm:block">Darulishaat</span>
            </button>
            <div className="h-5 w-px bg-outline-variant/40 mx-1 hidden sm:block"></div>
            <span className="text-xs font-semibold text-foreground truncate max-w-[100px] sm:max-w-xs hidden sm:block">
              {title}
            </span>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2 bg-surface-container-low py-1 px-2 rounded-full border border-outline-variant/20 shadow-sm">
            <button onClick={zoomOut} disabled={scale <= 0.5} className="p-1 rounded-full text-primary hover:bg-surface-container-high/60 disabled:opacity-30 transition cursor-pointer">
              <Minus className="size-3.5" />
            </button>
            <span className="text-xs font-bold text-foreground w-8 text-center">{(scale * 100).toFixed(0)}%</span>
            <button onClick={zoomIn} disabled={scale >= 3.0} className="p-1 rounded-full text-primary hover:bg-surface-container-high/60 disabled:opacity-30 transition cursor-pointer">
              <Plus className="size-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setFullscreen(true)}
              className="p-2 rounded-xl text-muted-foreground hover:bg-surface-container hover:text-foreground transition cursor-pointer"
              title="Fullscreen"
            >
              <Maximize2 className="size-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:bg-surface-container hover:text-foreground transition cursor-pointer"
              title="Close"
            >
              <X className="size-5" />
            </button>
          </div>
        </header>
      )}

      {/* Workspace */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Sidebar - hidden on mobile unless fullscreen */}
        {!fullscreen && (
          <aside className="hidden md:flex w-[70px] bg-white border-r border-outline-variant/30 flex-col items-center py-6 gap-5 shrink-0">
            <button onClick={() => setActiveTab(activeTab === "ask" ? null : "ask")} className={getTabButtonClass("ask")}>
              <Bot className="size-5" />
              <span className="text-[8px] font-bold tracking-wider uppercase">Ask Book</span>
            </button>
            <button onClick={() => setActiveTab(activeTab === "notes" ? null : "notes")} className={getTabButtonClass("notes")}>
              <FileText className="size-5" />
              <span className="text-[8px] font-bold tracking-wider uppercase">Notes</span>
            </button>
            <button onClick={() => setActiveTab(activeTab === "ink" ? null : "ink")} className={getTabButtonClass("ink")}>
              <PenTool className="size-5" />
              <span className="text-[8px] font-bold tracking-wider uppercase">Ink</span>
            </button>
          </aside>
        )}

        {/* PDF Canvas */}
        <main
          ref={mainRef}
          className="flex-1 bg-background overflow-auto flex flex-col items-center relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* PDF Page */}
          <div className="py-6 px-2 flex justify-center">
            <div className="relative shadow-[0_12px_40px_rgba(21,25,106,0.08)] border border-outline-variant/20 rounded-xl overflow-hidden bg-white p-1">
              <div className="relative">
                <Document
                  file={getPdfUrl()}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex flex-col items-center justify-center min-h-[400px] w-[300px] md:w-[600px] gap-2">
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
                    width={pdfWidth}
                  />
                </Document>
                <canvas
                  ref={canvasRef}
                  data-highlight="true"
                  width={pdfWidth}
                  height={700}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                  className="absolute inset-0 w-full h-full"
                  style={{ cursor: activeTab === "ink" ? "crosshair" : "default", pointerEvents: activeTab === "ink" ? "auto" : "none" }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Page Navigation - centered like a real reader */}
          <div className="sticky bottom-0 w-full flex justify-center pb-4 pt-2 bg-gradient-to-t from-background to-transparent">
            <div className="flex items-center gap-3 bg-white py-2 px-4 rounded-full border border-outline-variant/20 shadow-lg">
              <button
                onClick={prevPage}
                disabled={pageNumber <= 1}
                className="p-1.5 rounded-full text-primary hover:bg-surface-container-high/60 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronLeft className="size-5" />
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
                <span className="text-[11px] font-bold text-foreground/80">{numPages || "..."}</span>
              </form>
              <button
                onClick={nextPage}
                disabled={pageNumber >= (numPages || Infinity)}
                className="p-1.5 rounded-full text-primary hover:bg-surface-container-high/60 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronRight className="size-5" />
              </button>

              {/* Fullscreen toggle inside nav bar */}
              {fullscreen ? (
                <button onClick={() => setFullscreen(false)} className="p-1.5 rounded-full text-primary hover:bg-surface-container-high/60 transition cursor-pointer ml-2">
                  <Minimize2 className="size-4" />
                </button>
              ) : (
                <button onClick={() => setFullscreen(true)} className="p-1.5 rounded-full text-primary hover:bg-surface-container-high/60 transition cursor-pointer ml-2 hidden md:flex">
                  <Maximize2 className="size-4" />
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Right Panel */}
        {!fullscreen && activeTab !== null && (
          <aside className="w-[300px] md:w-[360px] h-full bg-white border-l border-outline-variant/30 flex flex-col shrink-0 relative animate-in slide-in-from-right duration-250">
            <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-white shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {activeTab === "ask" ? "AI Book Assistant" : activeTab === "notes" ? "Study Notes" : "Ink Canvas Controls"}
              </span>
              <button onClick={() => setActiveTab(null)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-surface-container hover:text-foreground transition cursor-pointer">
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {activeTab === "ask" && <Chatbot isInline bookId={bookId} currentPage={pageNumber} />}
              {activeTab === "notes" && <Notes isInline bookId={bookId} currentPage={pageNumber} />}
              {activeTab === "ink" && (
                <div className="p-5 space-y-6 text-foreground">
                  <div>
                    <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3">Highlighter Color</h3>
                    <div className="flex items-center gap-3">
                      {[
                        { name: "yellow", class: "bg-yellow-200 border-yellow-400" },
                        { name: "green", class: "bg-green-200 border-green-400" },
                        { name: "blue", class: "bg-blue-200 border-blue-400" },
                        { name: "pink", class: "bg-pink-200 border-pink-400" }
                      ].map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setInkColor(color.name)}
                          className={`size-8 rounded-full border-2 cursor-pointer transition flex items-center justify-center hover:scale-105 ${color.class} ${inkColor === color.name ? "ring-2 ring-primary ring-offset-2 scale-105" : ""}`}
                        >
                          {inkColor === color.name && <Check className="size-3.5 text-primary-container font-bold" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3">Brush Size</h3>
                    <div className="flex gap-2">
                      {["small", "medium", "large"].map((size) => (
                        <button
                          key={size}
                          onClick={() => setBrushSize(size)}
                          className={`flex-1 py-2 rounded-xl border font-semibold text-xs cursor-pointer capitalize transition ${brushSize === size ? "bg-primary text-white border-primary" : "border-outline-variant/30 hover:bg-surface-container-low text-foreground/80"}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-outline-variant/30 flex flex-col gap-2">
                    <button onClick={clearHighlights} className="w-full py-2.5 rounded-xl bg-surface-container text-foreground hover:bg-surface-container-high transition flex items-center justify-center gap-2 text-xs font-bold cursor-pointer">
                      <Eraser className="size-4" /> Clear Highlights
                    </button>
                    <button onClick={saveHighlights} className="w-full py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container transition flex items-center justify-center gap-2 text-xs font-bold cursor-pointer">
                      <Check className="size-4" /> Save Highlights
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Mobile bottom toolbar */}
      {!fullscreen && (
        <div className="md:hidden flex items-center justify-around border-t border-outline-variant/30 bg-white px-4 py-2 shrink-0">
          <button onClick={() => setActiveTab(activeTab === "ask" ? null : "ask")} className={`flex flex-col items-center gap-0.5 p-2 rounded-xl ${activeTab === "ask" ? "text-primary" : "text-muted-foreground"}`}>
            <Bot className="size-5" />
            <span className="text-[9px] font-bold">Ask</span>
          </button>
          <button onClick={() => setActiveTab(activeTab === "notes" ? null : "notes")} className={`flex flex-col items-center gap-0.5 p-2 rounded-xl ${activeTab === "notes" ? "text-primary" : "text-muted-foreground"}`}>
            <FileText className="size-5" />
            <span className="text-[9px] font-bold">Notes</span>
          </button>
          <button onClick={() => setActiveTab(activeTab === "ink" ? null : "ink")} className={`flex flex-col items-center gap-0.5 p-2 rounded-xl ${activeTab === "ink" ? "text-primary" : "text-muted-foreground"}`}>
            <PenTool className="size-5" />
            <span className="text-[9px] font-bold">Ink</span>
          </button>
          <button onClick={() => setFullscreen(true)} className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-muted-foreground">
            <Maximize2 className="size-5" />
            <span className="text-[9px] font-bold">Full</span>
          </button>
          <button onClick={onClose} className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-muted-foreground">
            <X className="size-5" />
            <span className="text-[9px] font-bold">Close</span>
          </button>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}
