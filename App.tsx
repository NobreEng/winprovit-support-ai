import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { MessageBubble } from './components/MessageBubble';
import { ChatHeader } from './components/ChatHeader';
import { ChatInput } from './components/ChatInput';
import { useChat } from './hooks/useChat';

export default function App() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    selectedImage,
    handleImageSelect,
    clearImage,
    handleSend,
    handleFeedback
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-50 font-sans">
      <ChatHeader />

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto min-h-full flex flex-col justify-end">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} onFeedback={handleFeedback} />
          ))}

          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-winprovit-red" />
                <span className="text-sm text-gray-500">A Winprovit está a analisar...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <ChatInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        handleImageSelect={handleImageSelect}
        clearImage={clearImage}
        selectedImage={selectedImage}
        isLoading={isLoading}
      />
    </div>
  );
}