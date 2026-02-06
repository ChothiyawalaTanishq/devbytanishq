import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const streamResponse = async (
  allMessages: Msg[],
  onChunk: (chunk: string) => void,
  onError: () => void,
  onDone: () => void
) => {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: allMessages }),
    });
    if (!resp.ok || !resp.body) throw new Error("Stream failed");
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") break;
        try {
          const parsed = JSON.parse(json);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onChunk(content);
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }
  } catch {
    onError();
  } finally {
    onDone();
  }
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const handleStream = useCallback((allMessages: Msg[]) => {
    let assistantSoFar = "";
    setIsLoading(true);
    streamResponse(
      allMessages,
      (chunk) => {
        assistantSoFar += chunk;
        const content = assistantSoFar;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content } : m));
          }
          return [...prev, { role: "assistant", content }];
        });
      },
      () => {
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
      },
      () => setIsLoading(false)
    );
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    const userMsg: Msg = { role: "user", content: text };
    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    handleStream([...messages, userMsg]);
  };

  const quickSend = (q: string) => {
    if (isLoading) return;
    const userMsg: Msg = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);
    handleStream([userMsg]);
  };

  const quickReplies = [
    { label: "Skills & Technologies", q: "What are your skills?" },
    { label: "Featured Projects", q: "Tell me about projects" },
    { label: "Work Together", q: "How to hire?" },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Subtle outer ring */}
            <motion.div
              className="absolute -inset-[3px] rounded-2xl opacity-60"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))",
                backgroundSize: "200% 200%",
              }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative p-3.5 rounded-2xl bg-card border border-foreground/[0.08] backdrop-blur-xl">
              <Bot size={20} className="text-primary" />
              {/* Online indicator */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary border-2 border-card" />
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[540px] max-h-[calc(100vh-6rem)] flex flex-col rounded-2xl overflow-hidden border border-foreground/[0.08] bg-card"
            style={{
              boxShadow: "0 25px 60px -12px hsl(var(--background) / 0.8), 0 0 0 1px hsl(var(--foreground) / 0.04)",
            }}
            initial={{ opacity: 0, y: 20, scale: 0.95, originX: 1, originY: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          >
            {/* Header */}
            <div className="relative px-5 py-4 border-b border-foreground/[0.06] bg-card">
              {/* Subtle top gradient accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))" }}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Bot size={18} className="text-primary" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-card" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Tanishq's AI</h3>
                    <p className="text-[11px] text-muted-foreground">Typically replies instantly</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} className="text-muted-foreground" />
                </motion.button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
              {messages.length === 0 && (
                <motion.div
                  className="flex flex-col items-center justify-center h-full text-center px-6 gap-5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.35 }}
                >
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                    <MessageCircle size={28} className="text-primary" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">How can I help you?</p>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
                      Ask me anything about Tanishq's skills, projects, or how to collaborate.
                    </p>
                  </div>

                  {/* Quick replies */}
                  <div className="flex flex-col w-full gap-1.5 mt-1">
                    {quickReplies.map((item, i) => (
                      <motion.button
                        key={item.q}
                        onClick={() => quickSend(item.q)}
                        className="w-full px-4 py-2.5 text-[13px] font-medium rounded-xl border border-foreground/[0.06] bg-card text-foreground/80 hover:text-foreground hover:border-primary/25 hover:bg-primary/[0.03] transition-all text-left flex items-center justify-between group"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.06 }}
                      >
                        <span>{item.label}</span>
                        <span className="text-muted-foreground/40 group-hover:text-primary/60 transition-colors text-xs">→</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${
                      msg.role === "user"
                        ? "bg-primary/10"
                        : "bg-secondary"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User size={13} className="text-primary" />
                    ) : (
                      <Bot size={13} className="text-primary" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-md"
                        : "bg-card border border-foreground/[0.06] text-foreground rounded-2xl rounded-tl-md"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:m-0 [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_ul]:my-1 [&_li]:my-0 [&_code]:bg-foreground/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <motion.div
                  className="flex gap-2.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center">
                    <Bot size={13} className="text-primary" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-card border border-foreground/[0.06]">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"
                          animate={{ y: [0, -4, 0], opacity: [0.3, 0.8, 0.3] }}
                          transition={{ duration: 0.7, repeat: Infinity, delay: d * 0.12 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-foreground/[0.06] bg-card">
              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 text-sm bg-background border border-foreground/[0.06] rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/10 transition-all disabled:opacity-40"
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-20 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Send size={15} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
