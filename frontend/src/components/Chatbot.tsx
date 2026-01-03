import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function Chatbot() {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {open ? (
                <div className="w-80 bg-white rounded-2xl shadow-2xl border border-green-200 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white">
                        <span className="font-bold">GlobeTrotter Chatbot</span>
                        <button onClick={() => setOpen(false)} className="hover:text-green-200">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 px-4 py-6 text-gray-600 text-center text-sm">
                        <p>
                            Hi! I'm your travel assistant.<br />
                            Ask me anything about your trips, destinations, or GlobeTrotter features.
                        </p>
                        <div className="mt-4 text-xs text-gray-400">
                            (Chatbot coming soon)
                        </div>
                    </div>
                    <div className="px-4 py-3 border-t bg-gray-50">
                        <input
                            type="text"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none"
                            placeholder="Type a message..."
                            disabled
                        />
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setOpen(true)}
                    className="relative group focus:outline-none"
                    title="Open Chatbot"
                >
                    {/* Animated pulsing ring */}
                    <span className="absolute inset-0 flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-green-400 opacity-30"></span>
                    </span>
                    {/* Animated icon with bounce and shadow */}
                    <span className="relative z-10 flex items-center justify-center bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-full shadow-xl group-hover:scale-110 transition-transform duration-200 animate-bounce">
                        <MessageCircle className="h-7 w-7 drop-shadow-lg" />
                    </span>
                </button>
            )}
        </div>
    );
}
