
import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { FunctionCallDisplay } from './FunctionCallDisplay';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {messages.map((msg, index) => (
        <div key={msg.id} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {msg.role === 'model' && (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white font-bold">
              AI
            </div>
          )}
          <div className={`max-w-xl p-4 rounded-xl shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700'}`}>
            <p className="whitespace-pre-wrap">{msg.content}</p>
            {msg.functionCall && (
              <div className="mt-3">
                <FunctionCallDisplay functionCall={msg.functionCall} />
              </div>
            )}
          </div>
          {msg.role === 'user' && (
             <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0 flex items-center justify-center font-bold">
                U
            </div>
          )}
        </div>
      ))}
      {isLoading && (
         <div className="flex items-start gap-4 justify-start">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white font-bold">
              AI
            </div>
            <div className="max-w-xl p-4 rounded-xl shadow-sm bg-white dark:bg-gray-700 flex items-center space-x-2">
                <span className="text-gray-500 dark:text-gray-400">Menganalisis...</span>
                <div className="dot-flashing"></div>
            </div>
         </div>
      )}
      <div ref={messagesEndRef} />
      <style>{`
        .dot-flashing {
          position: relative;
          width: 6px;
          height: 6px;
          border-radius: 5px;
          background-color: #4F46E5;
          color: #4F46E5;
          animation: dot-flashing 1s infinite linear alternate;
          animation-delay: 0.5s;
        }
        .dot-flashing::before, .dot-flashing::after {
          content: "";
          display: inline-block;
          position: absolute;
          top: 0;
        }
        .dot-flashing::before {
          left: -10px;
          width: 6px;
          height: 6px;
          border-radius: 5px;
          background-color: #4F46E5;
          color: #4F46E5;
          animation: dot-flashing 1s infinite alternate;
          animation-delay: 0s;
        }
        .dot-flashing::after {
          left: 10px;
          width: 6px;
          height: 6px;
          border-radius: 5px;
          background-color: #4F46E5;
          color: #4F46E5;
          animation: dot-flashing 1s infinite alternate;
          animation-delay: 1s;
        }
        @keyframes dot-flashing {
          0% { background-color: #4F46E5; }
          50%, 100% { background-color: rgba(79, 70, 229, 0.2); }
        }
      `}</style>
    </div>
  );
};
