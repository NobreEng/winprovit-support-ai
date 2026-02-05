import React from 'react';
import { WinprovitLogo } from './Logo';

export const ChatHeader: React.FC = () => {
    return (
        <header className="bg-white/90 backdrop-blur-xl border-b border-white/20 px-6 py-4 sticky top-0 z-30 shadow-sm transition-all duration-300">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <WinprovitLogo className="hover:opacity-80 transition-opacity duration-300 scale-95" />
                <div className="hidden sm:block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] opacity-80">
                    Suporte Técnico Profissional
                </div>
            </div>
        </header>
    );
};
