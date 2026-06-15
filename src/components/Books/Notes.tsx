"use client";

import { useState, useEffect } from "react";
import { Pencil, X, Trash, Edit, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "@/api/axios";
import { toast } from "react-toastify";

interface NotesProps {
  bookId: string;
  currentPage: number;
  isInline?: boolean;
}

interface Note {
  _id: string;
  noteTitle: string;
  noteContent: string;
  currentPage: number;
  createdAt: string;
  updatedAt?: string;
}

const Notes = ({ bookId, currentPage, isInline = false }: NotesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (bookId) {
      fetchNotes();
    }
  }, [bookId]);

  const fetchNotes = async () => {
    setIsLoading(true);
    const headers = {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      const response = await axios.get(`/notes/getNotes/${bookId}`, { headers });
      setNotes(response.data.notes || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to fetch notes");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Just now";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Recently";
      
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      
      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
      if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
      
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Recently";
    }
  };

  const handleSaveNote = async () => {
    if (!title.trim()) {
      toast.warning("Please add a title");
      return;
    }
    if (!content.trim()) {
      toast.warning("Please add note content");
      return;
    }

    setIsSaving(true);
    const headers = {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      const noteData = { 
        bookId, 
        currentPage, 
        noteTitle: title, 
        noteContent: content 
      };

      let response;
      if (editingNoteId) {
        response = await axios.put('/notes/updateNote', { 
          noteID: editingNoteId, 
          noteTitle: title, 
          noteContent: content 
        }, { headers });
        toast.success("Note updated successfully");
      } else {
        response = await axios.post("/notes/addNote", noteData, { headers });
        toast.success("Note added successfully");
      }

      if (response.data?.note) {
        const updatedNote = response.data.note;
        setNotes(prev => editingNoteId
          ? prev.map(n => n._id === editingNoteId ? updatedNote : n)
          : [updatedNote, ...prev]
        );
      } else {
        await fetchNotes();
      }

      resetForm();
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error saving note:", error);
      toast.error(error.response?.data?.error || "Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    const headers = {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      await axios.delete('/notes/deleteNote', { 
        data: { noteID: noteId },
        headers 
      });
      setNotes(prev => prev.filter(note => note._id !== noteId));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingNoteId(null);
  };

  const handleEditNote = (note: Note) => {
    setTitle(note.noteTitle);
    setContent(note.noteContent);
    setEditingNoteId(note._id);
    setIsOpen(true);
  };

  if (isInline) {
    return (
      <div className="flex flex-col h-full bg-[#f8f9ff]">
        {/* Header/Controls */}
        <div className="p-4 border-b border-outline-variant/35 flex justify-between items-center bg-white">
          <h3 className="text-xs font-bold text-[#15196a]">Your Study Notes</h3>
          {!isOpen && (
            <button
              onClick={() => {
                resetForm();
                setIsOpen(true);
              }}
              className="px-3 py-1.5 bg-[#15196a] text-white text-[10px] font-bold rounded-lg hover:bg-[#15196a]/90 transition cursor-pointer"
            >
              Add Note
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isOpen ? (
            /* Note Editor Form */
            <div className="bg-white border border-outline-variant/30 p-4 rounded-xl space-y-3 shadow-sm">
              <h4 className="text-[11px] font-bold text-foreground">
                {editingNoteId ? "Edit Note" : "Create New Note"} (Page {currentPage})
              </h4>
              <div>
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Title *</label>
                <input
                  type="text"
                  placeholder="Note Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-outline-variant/40 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary text-black bg-surface-container-low"
                  required
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Content *</label>
                <textarea
                  placeholder="Write your note here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full mt-1 px-3 py-2 border border-outline-variant/40 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary text-black bg-surface-container-low"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 border rounded-lg text-[10px] text-foreground/80 hover:bg-surface-container transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={isSaving}
                  className="px-3 py-1.5 bg-[#15196a] text-white text-[10px] font-bold rounded-lg hover:bg-[#15196a]/90 transition disabled:opacity-75 flex items-center gap-1 cursor-pointer"
                >
                  {isSaving && <Loader2 className="w-3 h-3 animate-spin" />}
                  <span>Save</span>
                </button>
              </div>
            </div>
          ) : (
            /* Notes List */
            <>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-[11px] p-4 border border-dashed border-outline-variant/50 rounded-xl bg-white">
                  No notes yet. Click "Add Note" to write down key ideas.
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note._id}
                      className="p-3 bg-white rounded-xl border border-outline-variant/30 hover:shadow-sm transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground text-xs truncate">
                            {note.noteTitle}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap line-clamp-3 leading-relaxed">
                            {note.noteContent}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                            <span className="font-semibold text-primary">Page {note.currentPage}</span>
                            <span>•</span>
                            <span>{formatDate(note.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex gap-1.5 ml-2">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="p-1 text-primary hover:bg-surface-container rounded transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note._id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Floating Add Note Button */}
      <div 
        className="fixed bottom-6 right-6 z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <button
            onClick={() => {
              resetForm();
              setIsOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg transition-all flex items-center justify-center"
            aria-label="Add new note"
          >
            <Pencil className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap"
              >
                Add Note
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Notes Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center p-5 border-b">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingNoteId ? "Edit Note" : "Add Note"}
                </h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Editor Section */}
                <div className="w-full md:w-2/3 p-6 border-r overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        placeholder="Note title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 text-black border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content *
                      </label>
                      <textarea
                        placeholder="Write your note here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={8}
                        className="w-full px-4 py-2 text-black border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                        required
                      />
                    </div>

                    <div className="text-sm text-gray-500">
                      Page: {currentPage || 'Not specified'}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNote}
                      disabled={isSaving}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-70 flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : editingNoteId ? (
                        "Update Note"
                      ) : (
                        "Save Note"
                      )}
                    </button>
                  </div>
                </div>

                {/* Notes List Section */}
                <div className="w-full md:w-1/3 p-6 bg-gray-50 overflow-y-auto">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                    Your Notes
                  </h3>

                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                    </div>
                  ) : notes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No notes yet. Add your first note!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notes.map((note) => (
                        <motion.div
                          key={note._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 line-clamp-1">
                                {note.noteTitle}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {note.noteContent}
                              </p>
                              <div className="flex items-center mt-2 text-xs text-gray-500 space-x-2">
                                <span>Page {note.currentPage}</span>
                                <span>•</span>
                                <span>{formatDate(note.createdAt)}</span>
                                {note.updatedAt && note.updatedAt !== note.createdAt && (
                                  <span title={`Updated ${formatDate(note.updatedAt)}`}>
                                    • (edited)
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-2">
                              <button
                                onClick={() => handleEditNote(note)}
                                className="text-emerald-600 hover:text-emerald-800"
                                aria-label="Edit note"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteNote(note._id)}
                                className="text-red-600 hover:text-red-800"
                                aria-label="Delete note"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Notes;
