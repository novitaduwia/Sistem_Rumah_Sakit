
import React from 'react';

export const Header: React.FC = () => (
  <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center border-b border-gray-200 dark:border-gray-700">
    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Hospital AI System Coordinator</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Gemini Function Calling</p>
    </div>
  </header>
);
