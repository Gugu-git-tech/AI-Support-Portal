// src/pages/BotPage.tsx
import React from 'react';
import ChatBot from '../components/ChatBot/ChatBot';

const BotPage: React.FC = () => {
  return (
    <div style={{ 
      height: '100%',
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <ChatBot />
    </div>
  );
};

export default BotPage;