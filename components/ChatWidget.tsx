"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Send, MessageCircle, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function renderContent(text: string) {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // **bold**
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // clickable URLs
  html = html.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;word-break:break-all;">$1</a>'
  );

  // newlines
  html = html.replace(/\n/g, "<br/>");

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isAdmin = pathname?.startsWith("/portail");
  if (isAdmin) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Bonjour ! Je suis l'assistant Indeed Immobilier. Comment puis-je vous aider ? / Hello! How can I help you? / مرحبا! كيف يمكنني مساعدتك؟",
        },
      ]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message || "Désolé, une erreur s'est produite." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Désolé, je ne peux pas répondre pour le moment." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#002B5B] hover:bg-[#003d80] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          aria-label="Ouvrir le chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed z-50 flex flex-col bg-white shadow-2xl border border-gray-100 overflow-hidden rounded-2xl"
          style={{
            right: "0.75rem",
            bottom: "0.75rem",
            width: "min(340px, calc(100vw - 1.5rem))",
            height: "min(480px, calc(100dvh - 80px))",
          }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#002B5B] text-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">Indeed Immobilier</p>
                <p className="text-[11px] text-blue-200 mt-0.5">Assistant virtuel</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#002B5B] text-white rounded-br-sm"
                      : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
                  }`}
                >
                  {msg.role === "assistant" ? renderContent(msg.content) : msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-400 shadow-sm border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 px-3 py-3 bg-white border-t border-gray-100 flex items-end gap-2">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez votre message..."
              className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#002B5B] transition-colors bg-gray-50 min-h-[40px] max-h-[100px]"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-[#002B5B] hover:bg-[#003d80] disabled:bg-gray-200 text-white flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Envoyer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
