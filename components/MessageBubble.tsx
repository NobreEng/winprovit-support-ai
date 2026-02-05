import React from 'react';
import { Message, Role } from '../types';
import { Bot, User, ThumbsUp, ThumbsDown, CheckCircle, XCircle, Loader2, CheckCircle2, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
  onFeedback?: (messageId: string, wasHelpful: boolean) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onFeedback }) => {
  const isUser = message.role === Role.USER;
  const showFeedbackButtons = !isUser && message.hasFeedback && !message.feedbackGiven;
  const feedbackGiven = message.feedbackGiven;

  const getStatusIcon = () => {
    switch (message.statusType) {
      case 'loading': return <Loader2 size={18} className="animate-spin text-winprovit-red" />;
      case 'success': return <CheckCircle2 size={18} className="text-green-600" />;
      case 'error': return <AlertCircle size={18} className="text-red-600" />;
      case 'warning': return <AlertTriangle size={18} className="text-orange-500" />;
      case 'info': return <Info size={18} className="text-blue-500" />;
      default: return null;
    }
  };

  const statusIcon = getStatusIcon();

  return (
    <div className={`flex w-full mb-6 animate-fade-in-up ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[75%] gap-3 sm:gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md ring-2 ring-white ${isUser
          ? 'bg-gradient-to-br from-winprovit-red to-orange-600 text-white'
          : 'bg-gradient-to-br from-gray-800 to-black text-white'
          }`}>
          {isUser ? <User size={14} /> : <Bot size={16} />}
        </div>

        {/* Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-6 py-4 rounded-2xl shadow-sm text-[0.9375rem] leading-relaxed transition-all duration-300 hover:shadow-md ${isUser
            ? 'bg-gradient-to-br from-winprovit-red to-winprovit-red-light text-white rounded-tr-sm shadow-lg shadow-red-900/10'
            : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-white/60 rounded-tl-sm shadow-premium'
            }`}>

            {/* Status Icon Header */}
            {statusIcon && (
              <div className="flex items-center gap-2 mb-2 font-medium">
                {statusIcon}
                <span className={`text-xs uppercase tracking-wider ${message.statusType === 'loading' ? 'text-winprovit-red' :
                    message.statusType === 'success' ? 'text-green-600' :
                      message.statusType === 'error' ? 'text-red-600' :
                        message.statusType === 'warning' ? 'text-orange-500' :
                          'text-blue-500'
                  }`}>
                  {message.statusType === 'loading' ? 'A Processar' :
                    message.statusType === 'success' ? 'Sucesso' :
                      message.statusType === 'error' ? 'Erro' :
                        message.statusType === 'warning' ? 'Atenção' :
                          'Info'}
                </span>
              </div>
            )}

            {message.image && (
              <div className="mb-4 overflow-hidden rounded-xl border-2 border-white/20 shadow-sm">
                <img
                  src={message.image}
                  alt="User uploaded"
                  className="max-w-full max-h-64 object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : 'prose-headings:text-gray-800 prose-p:text-gray-600 prose-strong:text-gray-900'}`}>
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          </div>

          {/* Feedback Buttons */}
          {showFeedbackButtons && onFeedback && (
            <div className="flex items-center gap-2 mt-3 px-1 animate-fade-in">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 mr-2 font-medium">Esta solução ajudou?</span>
              <button
                onClick={() => onFeedback(message.id, true)}
                className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-white hover:bg-green-50 rounded-full border border-gray-100 hover:border-green-200 shadow-sm hover:shadow transition-all duration-200"
              >
                <ThumbsUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                <span>Sim</span>
              </button>
              <button
                onClick={() => onFeedback(message.id, false)}
                className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-white hover:bg-red-50 rounded-full border border-gray-100 hover:border-red-200 shadow-sm hover:shadow transition-all duration-200"
              >
                <ThumbsDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                <span>Não</span>
              </button>
            </div>
          )}

          {/* Feedback Given Indicator */}
          {feedbackGiven && (
            <div className={`flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm border ${feedbackGiven === 'yes'
              ? 'text-green-700 bg-green-50/80 border-green-100'
              : 'text-orange-700 bg-orange-50/80 border-orange-100'
              }`}>
              {feedbackGiven === 'yes' ? (
                <>
                  <CheckCircle size={14} />
                  <span>Obrigado pelo seu feedback!</span>
                </>
              ) : (
                <>
                  <XCircle size={14} />
                  <span>Feedback registado.</span>
                </>
              )}
            </div>
          )}

          <span className="text-[10px] font-medium text-gray-300 mt-1.5 px-2 select-none">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};