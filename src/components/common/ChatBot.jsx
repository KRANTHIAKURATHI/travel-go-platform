import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { generateChatResponse } from '../../services/aiService';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi there! I am your TravelGo AI assistant. How can I help you find the best buses or tour packages today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isMinimized]);

  // Extract window text content for AI context
  const getPageContext = () => {
    // Try to get main content, otherwise fallback to body
    const mainContent = document.querySelector('main');
    const content = mainContent ? mainContent.innerText : document.body.innerText;
    
    // Truncate to avoid exceeding token limits for a quick context
    return content.substring(0, 3000); 
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const context = getPageContext();
      const response = await generateChatResponse(userMessage, context);
      setMessages((prev) => [...prev, { role: 'bot', text: response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Sorry, an error occurred. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`bg-white dark:bg-gray-900 dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 dark:border-gray-700 overflow-hidden flex flex-col transition-all duration-300 ease-in-out mb-4 ${
            isMinimized ? 'w-72 h-14' : 'w-80 sm:w-96 h-[500px] max-h-[80vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-blue-600 dark:bg-blue-700 p-4 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-2 font-semibold">
              <Bot className="w-5 h-5" />
              <span>TravelGo Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-blue-500 rounded transition-colors"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-blue-500 rounded transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area (Hidden if minimized) */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800 dark:bg-gray-900">
                {messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-sm' 
                          : 'bg-white dark:bg-gray-900 dark:bg-gray-800 text-gray-800 dark:text-gray-200 dark:text-gray-200 border border-gray-200 dark:border-gray-700 dark:border-gray-700 rounded-tl-sm shadow-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-900 dark:bg-gray-800 p-4 rounded-2xl rounded-tl-sm border border-gray-200 dark:border-gray-700 dark:border-gray-700 shadow-sm flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">Typing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form 
                onSubmit={handleSend}
                className="p-4 bg-white dark:bg-gray-900 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 dark:border-gray-700 shrink-0"
              >
                <div className="relative flex items-center">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about buses or tours..."
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 dark:text-gray-200 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    disabled={isLoading}
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center group relative animate-bounce hover:animate-none"
          title="Chat with AI Assistant"
        >
          <Bot className="w-8 h-8" />
          {/* Notification bubble */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
      )}
    </div>
  );
}
