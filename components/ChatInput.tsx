import React, { useRef } from 'react';
import { Send, X, Loader2, Paperclip } from 'lucide-react';

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    handleSend: () => void;
    handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    clearImage: () => void;
    selectedImage: { url: string; file: File } | null;
    isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    input,
    setInput,
    handleSend,
    handleImageSelect,
    clearImage,
    selectedImage,
    isLoading
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <footer className="bg-transparent p-4 sm:p-6 sticky bottom-0 z-20 pointer-events-none">
            <div className="max-w-4xl mx-auto pointer-events-auto flex flex-col items-center">
                {selectedImage && (
                    <div className="mb-4 flex items-start w-full animate-fade-in-up">
                        <div className="relative group">
                            <img
                                src={selectedImage.url}
                                alt="Preview"
                                className="h-20 w-20 object-cover rounded-xl border-2 border-white shadow-lg"
                            />
                            <button
                                onClick={clearImage}
                                className="absolute -top-2 -right-2 bg-winprovit-red text-white rounded-full p-1.5 shadow-md hover:bg-red-700 transition-transform hover:scale-110"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="w-full">
                    <div className="relative flex items-end gap-2 sm:gap-3 bg-white/90 backdrop-blur-xl p-2 sm:p-2 rounded-2xl shadow-premium border border-white/50 transition-all duration-300 focus-within:ring-2 focus-within:ring-winprovit-red/20 focus-within:shadow-glow">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                            accept="image/*"
                            className="hidden"
                        />

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 sm:p-3 text-gray-400 hover:text-winprovit-red hover:bg-red-50/50 rounded-xl transition-all duration-300 active:scale-95 touch-manipulation"
                            title="Anexar imagem"
                            aria-label="Anexar imagem"
                        >
                            <Paperclip size={20} strokeWidth={2} />
                        </button>

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Descreva o seu problema..."
                            className="flex-1 bg-transparent border-none focus:ring-0 outline-none resize-none py-3 text-base sm:text-[0.9375rem] text-gray-700 placeholder-gray-400 font-medium leading-relaxed max-h-32 min-h-[44px]"
                            rows={1}
                        />

                        <button
                            onClick={handleSend}
                            disabled={(!input.trim() && !selectedImage) || isLoading}
                            className={`p-3 sm:p-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md touch-manipulation min-w-[44px] min-h-[44px]
                                ${(!input.trim() && !selectedImage) || isLoading
                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                                    : 'bg-gradient-to-br from-winprovit-red to-winprovit-red-light text-white hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0'
                                }`}
                            aria-label="Enviar mensagem"
                        >
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-0.5" />}
                        </button>
                    </div>
                </div>

                <div className="text-center mt-4 mb-1">
                    <span className="text-[10px] text-gray-300 font-semibold uppercase tracking-[0.2em]">Powered by Winprovit AI</span>
                </div>
            </div>
        </footer>
    );
};
