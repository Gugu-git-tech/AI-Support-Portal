// src/components/ChatBot/ChatWidget.tsx
import React, { useState } from 'react';
import ChatBot from './ChatBot';
import './ChatWidget.css';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Button */}
      <button 
        className="chat-widget-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-widget-window">
          <ChatBot />
        </div>
      )}
    </>
  );
};

export default ChatWidget;