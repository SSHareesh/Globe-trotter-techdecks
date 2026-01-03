import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, User, Bot, Plane, Hotel as HotelIcon, MapPin, Star } from 'lucide-react';
import { sendChatMessage } from '../api/landingApi';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    data?: {
        type?: 'flight' | 'hotel' | 'destination';
        items?: any[];
    };
}

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! 👋 I'm your GlobeTrotter assistant. Ask me about destinations, flights, or hotels!" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (open) {
            scrollToBottom();
        }
    }, [messages, open]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            // Filter system messages if any, and only send last N for context
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const result = await sendChatMessage(userMessage, history);

            // Handle structured response with optional data
            const assistantMessage: Message = {
                role: 'assistant',
                content: result.response || result.message || 'No response',
            };

            // If API returned structured data (flights, hotels, destinations)
            if (result.data) {
                assistantMessage.data = result.data;
            }

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            console.error('Chat failed:', err);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble right now. Please try again! 🙏" }]);
        } finally {
            setLoading(false);
        }
    };

    const renderMessageContent = (m: Message) => {
        // If message has structured data, render cards
        if (m.data?.items && m.data.items.length > 0) {
            return (
                <div className="space-y-2">
                    <p className="text-xs mb-2">{m.content}</p>
                    {m.data.items.map((item: any, idx: number) => (
                        <div key={idx} className="bg-white/50 rounded-xl p-2 border border-gray-100 hover:shadow-md transition-shadow">
                            {m.data?.type === 'destination' && (
                                <div className="flex gap-2 items-center">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-xs text-gray-900 truncate">{item.name}</p>
                                        <p className="text-[10px] text-gray-500">{item.country}</p>
                                    </div>
                                </div>
                            )}
                            {m.data?.type === 'flight' && (
                                <div className="flex gap-2 items-center">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                                        <Plane className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-xs text-gray-900">₹{item.price}</p>
                                        <p className="text-[10px] text-gray-500 truncate">{item.route}</p>
                                    </div>
                                </div>
                            )}
                            {m.data?.type === 'hotel' && (
                                <div className="flex gap-2 items-center">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                                        <HotelIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-xs text-gray-900 truncate">{item.name}</p>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            <p className="text-[10px] text-gray-500">{item.rating || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        }
        return <span className="text-xs leading-relaxed">{m.content}</span>;
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {open ? (
                <div className="w-80 h-[480px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-green-100 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-xs tracking-tight leading-none">GlobeTrotter</h3>
                                <span className="text-[9px] font-bold text-green-100 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-green-300 rounded-full animate-pulse" /> Online
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="w-7 h-7 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gradient-to-b from-gray-50/50 to-white">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-green-500 text-white' : 'bg-white text-gray-400 border border-gray-100 shadow-sm'
                                        }`}>
                                        {m.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-green-500" />}
                                    </div>
                                    <div className={`px-3 py-2 rounded-xl shadow-sm ${m.role === 'user'
                                        ? 'bg-green-500 text-white rounded-tr-md'
                                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-md'
                                        }`}>
                                        {renderMessageContent(m)}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                                        <Bot className="w-3 h-3 text-green-500" />
                                    </div>
                                    <div className="bg-white border border-gray-100 px-3 py-2 rounded-xl rounded-tl-md flex items-center gap-1 shadow-sm">
                                        <span className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1 h-1 bg-gray-300 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 bg-white border-t border-gray-100">
                        <form onSubmit={handleSend} className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-xs text-gray-700 placeholder:text-gray-400"
                                placeholder="Ask me anything..."
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setOpen(true)}
                    className="relative group focus:outline-none"
                    title="Chat with GlobeTrotter"
                >
                    <span className="absolute inset-0 flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-14 w-14 rounded-full bg-green-400 opacity-30"></span>
                    </span>
                    <span className="relative z-10 flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white p-3.5 rounded-full shadow-2xl group-hover:scale-110 transition-all duration-300 hover:rotate-12">
                        <MessageCircle className="h-6 w-6 drop-shadow-lg" />
                    </span>
                </button>
            )}
        </div>
    );
}
