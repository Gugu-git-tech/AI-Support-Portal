// src/components/ChatBot/ChatBot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // ← NEW: For navigation
import BotService from '../../services/botService';
import SmartSuggestions from './SmartSuggestions';
import FeedbackWidget from './FeedbackWidget';
import './ChatBot.css';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  suggestions?: string[];
  isGoodbye?: boolean;  // ← NEW: Track goodbye messages
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isGoodbye, setIsGoodbye] = useState<boolean>(false);  // ← NEW: Track if chat is closed
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const botService = new BotService();
  const navigate = useNavigate();  // ← NEW: For navigation

  // Add welcome message on mount
  useEffect(() => {
    const welcome = botService.processMessage('hello');
    setMessages([{
      id: Date.now(),
      type: 'bot',
      content: welcome.message,
      suggestions: welcome.suggestions || []
    }]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (): void => {
    if (!input.trim() || isLoading || isGoodbye) return;  // ← NEW: Don't allow typing if goodbye

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setShowFeedback(false);

    const userMsg: Message = {
      id: Date.now(),
      type: 'user',
      content: userMessage
    };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const response = botService.processMessage(userMessage);
      
      // Check if it's a goodbye message
      if (response.type === 'goodbye') {
        setIsGoodbye(true);  // ← NEW: Close the chat
        setShowFeedback(false);
      }
      
      // Check if it's a redirect (Create Request)
      if (response.type === 'redirect' && response.redirectUrl) {
        // Show the redirect message first
        const botMsg: Message = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.message,
          suggestions: response.suggestions || []
        };
        setMessages(prev => [...prev, botMsg]);
        
        // Then redirect after 1.5 seconds
        setTimeout(() => {
          navigate(response.redirectUrl!);
        }, 1500);
        
        setIsLoading(false);
        return;
      }
      
      const botMsg: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.message,
        suggestions: response.suggestions || [],
        isGoodbye: response.type === 'goodbye'
      };
      
      setMessages(prev => [...prev, botMsg]);
      
      // Only show feedback if not goodbye or redirect
      if (response.type !== 'goodbye' && response.type !== 'redirect') {
        setShowFeedback(true);
      }
      
      setIsLoading(false);
    }, 600);
  };

  const handleSuggestion = (suggestion: string): void => {
    // If chat is closed, don't allow suggestions
    if (isGoodbye) return;
    
    const suggestionMap: Record<string, string> = {
      'Create Request': 'I need to create a support request',
      'Create Ticket': 'I need to create a support request',
      'Submit Feature': 'I want to submit a feature request',
      'Reset Password': 'I need help resetting my password',
      'Login Help': 'I need help to login ',
      'Search Help': 'I need help finding articles',
      'Contact Support': 'How can I contact support?',
      'Update Payment': 'I need to update my payment method',
      'Request Refund': 'I want to request a refund',
      'Report Bug': 'I found a bug in the app',
      'Check Subscription': 'I want to check my subscription',
      'View Dashboard': 'Help me find the dashboard',
      'Check Ticket': 'How do I check my ticket status?',
      'Try Again': 'Let me try explaining again',
      'Yes, another question': 'Yes',
      "No, I'm done": "No, I'm done",
      'Email Support': 'What is the support email?',
      'Call Support': 'What is the support phone number?',
      'View Article': 'Show me the help article',
      'Troubleshooting Guide': 'I need troubleshooting help',
      'View Roadmap': 'What is the product roadmap?',
      'Help Articles': 'Show me help articles',
      'Login Issues': 'I need help logging in',
      'Technical Help': 'I need technical help',
      'Feature Request': 'I have a feature request',
      'General Question': 'I have a general question',
      'Update Profile': 'How do I update my profile?',
      'Change Email': 'How do I change my email?',
      'Preferences': 'How do I change my preferences?',
      'Project Guidelines': 'What are the project guidelines?',
      'View Existing': 'Show me my existing requests'
    };
    
    const message = suggestionMap[suggestion] || suggestion;
    setInput(message);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleFeedback = (feedback: 'yes' | 'no'): void => {
    setShowFeedback(false);
    let response: string;
    let suggestions: string[];
    
    if (feedback === 'yes') {
      response = "I'm glad I could help! 😊 Is there anything else I can assist with?";
      suggestions = ["Yes, another question", "No, I'm done"];
    } else {
      response = "I'm sorry I wasn't helpful. 😔 Would you like to create a support request so a human can help you?";
      suggestions = ["Create Request", "Try Again", "Contact Support"];
    }
    
    const botMsg: Message = {
      id: Date.now(),
      type: 'bot',
      content: response,
      suggestions: suggestions
    };
    
    setMessages(prev => [...prev, botMsg]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Restart chat function - can be called when user wants to chat again
  const restartChat = (): void => {
    setIsGoodbye(false);
    setMessages([]);
    const welcome = botService.processMessage('hello');
    setMessages([{
      id: Date.now(),
      type: 'bot',
      content: welcome.message,
      suggestions: welcome.suggestions || []
    }]);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-header-content">
          <span className="chatbot-icon">🤖</span>
          <div className="chatbot-header-text">
            <h2>AI Support Assistant</h2>
            <p>{isGoodbye ? '👋 Chat ended' : 'Online • Ready to help'}</p>
          </div>
          {/* NEW: Restart button when chat is closed */}
          {isGoodbye && (
            <button 
              className="chat-restart-btn"
              onClick={restartChat}
              style={{
                marginLeft: 'auto',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🔄 New Chat
            </button>
          )}
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.type}`}>
            <div className={`message-bubble ${msg.type}`}>
              <div className="message-content">
                {msg.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < msg.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
              {msg.suggestions && msg.suggestions.length > 0 && !msg.isGoodbye && (
                <SmartSuggestions 
                  suggestions={msg.suggestions} 
                  onSuggestionClick={handleSuggestion}
                />
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message-wrapper bot">
            <div className="message-bubble bot">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {showFeedback && !isLoading && !isGoodbye && (
          <div className="feedback-container">
            <FeedbackWidget onFeedback={handleFeedback} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Only show input if chat is not closed */}
      {!isGoodbye && (
        <div className="chatbot-input-container">
          <textarea
            className="chatbot-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            rows={2}
            disabled={isLoading}
          />
          <button 
            className="chatbot-send-btn"
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
          >
            <span className="send-icon">▶</span>
          </button>
        </div>
      )}
      
      {/* NEW: Show "Chat Closed" message when goodbye */}
      {isGoodbye && (
        <div className="chatbot-closed-message" style={{
          padding: '16px',
          textAlign: 'center',
          background: '#f0f0f0',
          color: '#666',
          fontSize: '13px',
          borderTop: '1px solid #ddd'
        }}>
          💬 Chat ended • Click 🔄 New Chat to start again
        </div>
      )}
    </div>
  );
};

export default ChatBot;