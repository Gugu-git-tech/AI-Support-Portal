// src/pages/SupportBot.jsx
import React from 'react';
import ChatBot from '../components/ChatBot/ChatBot';

const SupportBot = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      background: '#f0f2f5'
    }}>
      <ChatBot />
    </div>
  );
};

export default SupportBot;