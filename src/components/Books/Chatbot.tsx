"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Loader2, Trash, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "@/api/axios";
import { toast } from "react-toastify";

interface ChatbotProps {
  bookId: string;
  title?: string;
  isInline?: boolean;
  currentPage?: number;
}

interface Message {
  type: "question" | "answer" | "error";
  content: string;
  timestamp: string;
  id: string;
  pageNumbers?: string;
}

const Chatbot = ({ bookId, isInline = false, currentPage = 1 }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bookId && (isOpen || isInline)) {
      fetchConversationHistory();
    }
  }, [bookId, isOpen, isInline]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversationHistory = async () => {
    setIsLoading(true);
    const headers = {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      const response = await axios.get(`/semanticSearch/ask/history/${bookId}`, { headers });
      
      const transformedHistory = response.data.history.flatMap((item: any) => [
        {
          type: "question",
          content: item.question,
          timestamp: item.createdAt,
          id: item._id + "-q"
        },
        {
          type: "answer",
          content: item.answer,
          pageNumbers: item.pageNumbers,
          timestamp: item.updatedAt,
          id: item._id + "-a"
        }
      ]);
      
      setConversation(transformedHistory || []);
    } catch (error) {
      console.error("Error fetching conversation history:", error);
      toast.error("Failed to load chat history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    if (!bookId) {
      toast.warning("Please select a book first");
      return;
    }

    setIsSending(true);
    const headers = {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      const userMessage: Message = {
        type: "question",
        content: question,
        timestamp: new Date().toISOString(),
        id: Date.now() + "-q"
      };
      setConversation(prev => [...prev, userMessage]);

      const response = await axios.post("/semanticSearch/ask", {
        question,
        bookId
      }, { headers });

      const botMessage: Message = {
        type: "answer",
        content: response.data.answer,
        pageNumbers: response.data.pageNumbers,
        timestamp: new Date().toISOString(),
        id: Date.now() + "-a"
      };
      setConversation(prev => [...prev, botMessage]);

      setQuestion("");
    } catch (error: any) {
      console.error("Error asking question:", error);
      toast.error(error.response?.data?.error || "Failed to get answer");
      
      const errorMessage: Message = {
        type: "error",
        content: "Sorry, I couldn't process your question. Please try again.",
        timestamp: new Date().toISOString(),
        id: Date.now() + "-e"
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const clearConversation = () => {
    if (window.confirm("Are you sure you want to clear this conversation?")) {
      setConversation([]);
    }
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isInline) {
    return (
      <div className="flex flex-col h-full bg-[#f8f9ff]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-[#15196a]" />
            </div>
          ) : conversation.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400">
              <MessageSquare className="w-10 h-10 mb-3 text-gray-300" />
              <h3 className="text-sm font-semibold mb-1 text-gray-500">Ask about page {currentPage}</h3>
              <p className="text-xs max-w-xs text-muted-foreground">Ask anything! The assistant has indexed this book's content.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conversation.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'question' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-[0_2px_8px_-2px_rgba(21,25,106,0.08)] relative ${message.type === 'question' 
                      ? 'bg-[#15196a] text-white rounded-br-none' 
                      : message.type === 'error'
                        ? 'bg-red-100 text-red-800 rounded-bl-none'
                        : 'bg-white text-[#121c2a] rounded-bl-none border border-outline-variant/30'}`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap text-xs leading-relaxed">
                          {message.content}
                        </div>
                        {message.type === 'answer' && message.pageNumbers && (
                          <div className="mt-1 text-[10px] text-primary/85 font-semibold">
                            Relevant pages: {message.pageNumbers}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-outline-variant/35 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 px-3 py-2 border text-foreground border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition text-xs bg-surface-container-low"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!question.trim() || isSending}
              className="p-2.5 bg-[#15196a] hover:bg-[#15196a]/90 text-white rounded-xl transition disabled:opacity-50 flex items-center justify-center cursor-pointer"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div 
        className="fixed bottom-24 right-7 z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <button
            onClick={() => setIsOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg transition-all flex items-center justify-center"
            aria-label="Ask a question"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap shadow-lg"
              >
                Ask a Question
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[#5BA191] p-5 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Bot className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">
                    Book Q&A Assistant
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={clearConversation}
                    className="text-white/80 hover:text-white flex items-center text-sm transition"
                    title="Clear conversation"
                  >
                    <Trash className="w-4 h-4 mr-1.5" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white transition"
                    aria-label="Close modal"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-[#5BA191]" />
                  </div>
                ) : conversation.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-400">
                    <MessageSquare className="w-14 h-14 mb-4 text-gray-300" />
                    <h3 className="text-xl font-medium mb-2 text-gray-500">Ask about this book</h3>
                    <p className="max-w-md">Your questions and answers will appear here. Start by asking something about the book's content.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conversation.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${message.type === 'question' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-4 relative ${message.type === 'question' 
                            ? 'bg-[#5BA191] text-white rounded-br-none shadow-md' 
                            : message.type === 'error'
                              ? 'bg-red-100 text-red-800 rounded-bl-none shadow-md'
                              : 'bg-white text-gray-800 rounded-bl-none shadow-md border border-gray-100'}`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.type === 'question' ? (
                              <User className="w-5 h-5 mt-0.5 flex-shrink-0 text-white" />
                            ) : (
                              <Bot className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#5BA191]" />
                            )}
                            <div className="flex-1">
                              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {message.content}
                              </div>
                              {message.type === 'answer' && message.pageNumbers && (
                                <div className="mt-2 text-xs text-[#5BA191] font-medium">
                                  Relevant pages: {message.pageNumbers}
                                </div>
                              )}
                              <div className={`text-xs mt-2 ${message.type === 'question' ? 'text-[#5BA191]/80' : 'text-gray-500'}`}>
                                {formatTime(message.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Ask a question about this book..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="flex-1 px-4 py-3 border text-gray-800 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5BA191] focus:border-transparent outline-none transition text-sm bg-gray-50"
                    disabled={isSending}
                  />
                  <button
                    type="submit"
                    disabled={!question.trim() || isSending}
                    className="p-3 bg-[#5BA191] hover:bg-[#4a8a7a] text-white rounded-xl transition shadow-md disabled:opacity-50"
                  >
                    {isSending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
