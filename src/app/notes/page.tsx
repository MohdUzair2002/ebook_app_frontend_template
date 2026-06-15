import type { Metadata } from "next";
import { Plus, Search, Bold, Italic, Underline, List, Quote, MoreVertical } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/site/Container";

export const metadata: Metadata = {
  title: "My Notes — Darulishaat Ebooks",
  description: "Your personal study and reading notes in DArulishaat Ebooks.",
  openGraph: {
    title: "My Notes — Darulishaat Ebooks",
    description: "Capture, organize, and revisit your reading notes.",
  },
};

const notes = [
  {
    id: "quantum",
    title: "Quantum Mechanics: Wave Functions",
    preview: "The wave function represents the probability amplitude of finding a particle in a given state...",
    when: "Today, 10:45 AM",
    tag: "Study",
    active: true,
  },
  {
    id: "stoicism",
    title: "Philosophy 101: Stoicism Notes",
    preview: "Marcus Aurelius emphasizes the importance of controlling one's own mind in the face of...",
    when: "Yesterday",
    tag: "Personal",
  },
  {
    id: "gatsby",
    title: "Literary Analysis: The Great Gatsby",
    preview: "The green light serves as a powerful symbol for Gatsby's unattainable dream and the illusion...",
    when: "Oct 24",
    tag: "Research",
  },
];

const tagStyles: Record<string, string> = {
  Study: "bg-[#fed65b]/60 text-[#574500]",
  Personal: "bg-accent text-accent-foreground",
  Research: "bg-surface-container-high text-primary",
};

export default function NotesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <Container className="py-8 flex-1">
        <div className="grid lg:grid-cols-[340px_1fr] gap-6 min-h-[calc(100vh-220px)]">
          {/* Sidebar */}
          <aside className="rounded-2xl bg-surface-container-low/70 p-5 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-primary">My Notes</h2>
              <button aria-label="New note" className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-container transition">
                <Plus className="size-5" />
              </button>
            </div>

            <div className="relative mt-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input placeholder="Search notes..." className="w-full rounded-xl bg-card py-3 pl-11 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div className="mt-4 flex gap-2 text-xs">
              {["All", "Study", "Research", "Personal"].map((t, i) => (
                <button key={t} className={"px-3 py-1.5 rounded-full font-medium " + (i === 0 ? "bg-primary text-primary-foreground" : "bg-card text-foreground/70 hover:bg-surface-container")}>
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-5 border-t border-outline-variant/40 -mx-5" />

            <ul className="mt-3 space-y-2">
              {notes.map((n) => (
                <li key={n.id}>
                  <button className={
                    "w-full text-left rounded-xl p-3 transition " +
                    (n.active
                      ? "bg-card border-l-4 border-primary shadow-[0_2px_12px_-6px_rgba(21,25,106,0.25)]"
                      : "border-l-4 border-transparent hover:bg-card/60")
                  }>
                    <h3 className="font-display text-sm font-bold text-foreground line-clamp-1">{n.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{n.preview}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">{n.when}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${tagStyles[n.tag]}`}>{n.tag}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Editor */}
          <section className="bg-card rounded-2xl p-8 shadow-[0_2px_24px_-14px_rgba(21,25,106,0.2)]">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
              <div className="flex items-center gap-1 text-foreground/70">
                {[Bold, Italic, Underline].map((Icon, i) => (
                  <button key={i} className="size-9 rounded-md hover:bg-surface-container-low flex items-center justify-center"><Icon className="size-4" /></button>
                ))}
                <span className="mx-2 h-5 w-px bg-outline-variant" />
                <button className="size-9 rounded-md hover:bg-surface-container-low flex items-center justify-center"><List className="size-4" /></button>
                <button className="size-9 rounded-md hover:bg-surface-container-low flex items-center justify-center"><Quote className="size-4" /></button>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                Saved
                <button className="size-8 rounded-md hover:bg-surface-container-low flex items-center justify-center text-foreground"><MoreVertical className="size-4" /></button>
              </div>
            </div>

            <h1 className="mt-7 font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Quantum Mechanics: Wave Functions
            </h1>

            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#fed65b]/60 text-[#574500] text-xs font-semibold">🏷 Study</span>
              <button className="text-primary text-xs font-semibold">+ Add Tag</button>
            </div>

            <div className="mt-7 space-y-5 text-[15px] text-foreground/85 leading-7">
              <p>The wave function <em>Ψ(x,t)</em> represents the probability amplitude of finding a particle in a given state. It is the fundamental object of study in quantum mechanics, evolving deterministically according to the Schrödinger equation until a measurement is made.</p>

              <h2 className="font-display text-xl font-bold text-foreground pt-2">Core Principles</h2>

              <ul className="space-y-2 pl-5 list-disc marker:text-primary">
                <li><strong>Born Rule:</strong> The probability density of finding a particle at position x is given by |Ψ(x,t)|².</li>
                <li><strong>Superposition:</strong> If Ψ₁ and Ψ₂ are valid states, then a linear combination (c₁Ψ₁ + c₂Ψ₂) is also a valid state.</li>
                <li><strong>Normalization:</strong> The total probability of finding the particle somewhere in space must be 1.</li>
              </ul>

              <blockquote className="border-l-4 border-primary bg-surface-container-low/70 rounded-r-md px-4 py-3 italic text-foreground/80">
                "I think I can safely say that nobody understands quantum mechanics."
                <br />— Richard Feynman
              </blockquote>

              <p>The collapse of the wave function upon measurement remains one of the most debated philosophical aspects of the theory, leading to various interpretations like the Copenhagen interpretation and Many-Worlds.</p>
            </div>
          </section>
        </div>
      </Container>

      <SiteFooter />
    </div>
  );
}
