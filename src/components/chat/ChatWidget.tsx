"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, Sparkles, Loader2 } from "lucide-react";

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([
        { role: "assistant", content: "Welcome to WinWin Travel. I am your neural concierge. How can I help you discover your next escape?" }
    ]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isStreaming) return;

        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsStreaming(true);

        try {
            const resp = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({ messages: [...messages, userMsg] })
            });

            if (!resp.body) return;
            const reader = resp.body.getReader();
            const decoder = new TextDecoder();

            let assistantMsg = { role: "assistant", content: "" };
            setMessages(prev => [...prev, assistantMsg]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = JSON.parse(line.replace("data: ", ""));

                        if (data.type === 'text') {
                            assistantMsg.content += data.content;
                            setMessages(prev => {
                                const newMessages = [...prev];
                                newMessages[newMessages.length - 1] = { ...assistantMsg };
                                return newMessages;
                            });
                        }

                        if (data.type === 'status') {
                            setMessages(prev => [...prev, { role: "assistant", content: `_${data.content}_`, isStatus: true }]);
                        }

                        if (data.type === 'tool_result') {
                            const result = data.content[0]?.content;
                            if (result) {
                                const parsed = JSON.parse(result);
                                setMessages(prev => [...prev, {
                                    role: "assistant",
                                    content: `Neural Scan Complete: Found **${parsed.count}** properties that match your intent. I've curated the top options for you below.`,
                                    isResultSummary: true
                                }]);
                            }
                        }
                    }
                }
            }
        } finally {
            setIsStreaming(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-6 w-96 h-[600px] glass-dark rounded-[32px] border border-white/10 shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 bg-brand text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-brand-gold/20 rounded-2xl flex items-center justify-center text-brand-gold">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm tracking-tight leading-none mb-1">Neural Concierge</h4>
                                    <p className="text-[10px] text-brand-gold font-bold uppercase tracking-widest flex items-center gap-1">
                                        <Sparkles className="w-2 h-2" /> Live Intel
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                                        ? 'bg-brand text-white border-none rounded-tr-none'
                                        : 'glass text-brand-light font-medium border-white/5 rounded-tl-none'
                                        }`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {isStreaming && messages[messages.length - 1].content === "" && (
                                <div className="flex justify-start">
                                    <div className="glass p-4 rounded-2xl flex gap-2">
                                        <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-6 bg-black/20 border-t border-white/5">
                            <div className="relative">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask for an escape..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-gold transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isStreaming}
                                    className="absolute right-3 top-3 w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center text-brand hover:scale-105 active:scale-95 transition-all shadow-lg"
                                >
                                    {isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-brand rounded-3xl shadow-xl hover:shadow-brand-gold/30 hover:scale-110 active:scale-90 transition-all flex items-center justify-center text-white relative group"
            >
                <div className="absolute inset-0 bg-brand-gold rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity" />
                <MessageSquare className="w-6 h-6" />
            </button>
        </div>
    );
};
