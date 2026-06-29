// src/components/ChatBot/SmartSuggestions.tsx
import React from 'react';

interface SmartSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({ suggestions, onSuggestionClick }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="smart-suggestions-container">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="smart-suggestion-chip"
          onClick={() => onSuggestionClick(suggestion)}
        >
          💡 {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SmartSuggestions;