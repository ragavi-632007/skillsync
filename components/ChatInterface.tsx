import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { empathyTranslate } from '../services/geminiService';

interface ChatInterfaceProps {
  currentUser: User;
  chatPartner: User;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentUser, chatPartner, messages, onSendMessage, onClose }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleImproveMessage = async () => {
    if (!newMessage.trim() || isTranslating) return;

    setIsTranslating(true);
    try {
      const improvedText = await empathyTranslate(newMessage);
      setNewMessage(improvedText);
    } catch (error) {
      console.error("Failed to improve message with AI:", error);
    } finally {
      setIsTranslating(false);
    }
  };


  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 w-96 h-[500px] flex flex-col bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <img src={chatPartner.profilePicture} alt={chatPartner.name} className="w-8 h-8 rounded-full" />
          <span className="font-bold text-white">{chatPartner.name}</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-xl ${msg.senderId === currentUser.id ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-900 border border-gray-600 rounded-full px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            disabled={isTranslating}
          />
           <button
            type="button"
            onClick={handleImproveMessage}
            disabled={isTranslating || !newMessage.trim()}
            className="bg-yellow-600 text-white rounded-full p-2 flex-shrink-0 hover:bg-yellow-500 transition-colors disabled:bg-yellow-800 disabled:cursor-not-allowed"
            title="Improve message with AI"
          >
            {isTranslating ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 9a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM9 2a1 1 0 011 1v1h1a1 1 0 110 2H10v1a1 1 0 11-2 0V6H7a1 1 0 010-2h1V3a1 1 0 011-1zm3.973 8.243a1 1 0 011.414 0l2.121 2.121a1 1 0 01-1.414 1.414L14 13.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.121-2.121zM14 2a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6h-1a1 1 0 110-2h1V3a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            )}
          </button>
          <button 
            type="submit" 
            className="bg-indigo-600 text-white rounded-full p-2 flex-shrink-0 hover:bg-indigo-500 transition-colors disabled:bg-indigo-800 disabled:cursor-not-allowed"
            disabled={isTranslating || !newMessage.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;