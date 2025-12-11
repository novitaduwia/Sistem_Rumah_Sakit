
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, FunctionCall } from './types.ts';
import { delegateTask } from './services/geminiService.ts';
import { ChatInput } from './components/ChatInput.tsx';
import { Header } from './components/Header.tsx';
import { MessageList } from './components/MessageList.tsx';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initialMessage: ChatMessage = {
    id: 'initial-0',
    role: 'model',
    content: "Selamat datang di Sistem Rumah Sakit Terpadu. Silakan sampaikan permintaan Anda, dan saya akan meneruskannya ke departemen yang tepat.",
  };
  
  useEffect(() => {
    setMessages([initialMessage]);
  }, []);

  const handleSendMessage = async (inputText: string) => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputText,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const functionCalls = await delegateTask(inputText);

      let modelResponse: ChatMessage;

      if (functionCalls && functionCalls.length > 0) {
        modelResponse = {
          id: `model-${Date.now()}`,
          role: 'model',
          content: "Delegasi tugas berhasil. Berikut adalah detailnya:",
          functionCall: functionCalls[0],
        };
      } else {
        modelResponse = {
          id: `model-${Date.now()}`,
          role: 'model',
          content: "Maaf, saya tidak dapat memproses permintaan Anda saat ini atau tidak ada fungsi yang sesuai untuk delegasi. Silakan coba lagi dengan permintaan yang lebih spesifik.",
        };
      }
      setMessages(prev => [...prev, modelResponse]);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan yang tidak diketahui.';
      setError(`Error: ${errorMessage}`);
      const errorResponse: ChatMessage = {
        id: `model-error-${Date.now()}`,
        role: 'model',
        content: `Maaf, terjadi kesalahan saat memproses permintaan Anda. ${errorMessage}`,
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <MessageList messages={messages} isLoading={isLoading} />
      </main>
      {error && (
        <div className="px-4 pb-2 text-red-500 text-sm text-center">
          {error}
        </div>
      )}
      <div className="p-4 md:p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;
