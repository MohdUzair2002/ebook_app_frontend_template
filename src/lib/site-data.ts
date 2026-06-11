import bookDeepWork from "@/assets/book-deep-work.jpg";
import bookThinking from "@/assets/book-thinking.jpg";
import bookAtomic from "@/assets/book-atomic.jpg";
import bookSystemDesign from "@/assets/book-system-design.jpg";
import bookCleanCode from "@/assets/book-clean-code.jpg";
import bookNeural from "@/assets/book-neural.jpg";
import bookFutureWeb from "@/assets/book-future-web.jpg";
import bookHardware from "@/assets/book-hardware.jpg";
import noteSapiens from "@/assets/note-sapiens.jpg";
import noteMeditations from "@/assets/note-meditations.jpg";
import noteMastery from "@/assets/note-mastery.jpg";

export type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  oldPrice?: number;
  cover: any; // Using dynamic imports for Next.js image compatibility
  rating: number;
  reviews: number;
  badge?: "best-seller" | "new" | "bestseller";
};

export const browseBooks: Book[] = [
  { id: "clean-code", title: "The Art of Clean Code", author: "Sarah Jenkins", price: 34.99, cover: bookCleanCode, rating: 4.8, reviews: 120, badge: "best-seller" },
  { id: "neural-networks", title: "Neural Networks Demystified", author: "Dr. Alan Turing", price: 42.5, cover: bookNeural, rating: 4.5, reviews: 85 },
  { id: "future-web", title: "Future Web Architecture", author: "Elena Rostova", price: 28.0, cover: bookFutureWeb, rating: 4.9, reviews: 210 },
  { id: "hardware", title: "Hardware Integration Patterns", author: "Marcus Chen", price: 55.0, cover: bookHardware, rating: 5.0, reviews: 12, badge: "new" },
];

export const editorsPicks = {
  featured: {
    id: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    price: 18.99,
    cover: bookDeepWork,
    blurb:
      "Rules for focused success in a distracted world. Master the art of intense concentration and elevate your cognitive capabilities.",
  },
  side: [
    { id: "thinking", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", cover: bookThinking },
    { id: "atomic", title: "Atomic Habits", author: "James Clear", price: 14.5, cover: bookAtomic },
  ],
};

export const trendingNotes = [
  { id: "sapiens", title: "Sapiens", subtitle: "Summary & Key Takeaways", cover: noteSapiens },
  { id: "meditations", title: "Meditations", subtitle: "Annotated Edition", cover: noteMeditations },
  { id: "mastery", title: "Mastery", subtitle: "Study Guide", cover: noteMastery },
  { id: "principles", title: "Principles", subtitle: "Executive Summary", cover: bookDeepWork },
];

export const systemDesignBook = {
  id: "system-design",
  title: "The Principles of System Design",
  author: "Dr. Elena Rostova",
  price: 45,
  oldPrice: 60,
  rating: 4.8,
  reviews: 2145,
  cover: bookSystemDesign,
};

export const becauseYouLiked: Book[] = [
  { id: "clean-prac", title: "Clean Code in Practice", author: "Robert Martins", price: 38, cover: bookCleanCode, rating: 4.6, reviews: 90 },
  { id: "data-struct", title: "Data Structures Refined", author: "Anna Lee", price: 42.5, cover: bookFutureWeb, rating: 4.7, reviews: 60 },
  { id: "algorithms", title: "Algorithms Unlocked", author: "Thomas Cormen", price: 55, cover: bookNeural, rating: 4.9, reviews: 180 },
  { id: "ddia", title: "Designing Data Intensive Applications", author: "Martin Kleppmann", price: 49.99, cover: bookHardware, rating: 4.9, reviews: 540 },
];
