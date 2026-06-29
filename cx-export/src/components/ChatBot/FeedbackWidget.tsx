// src/components/ChatBot/FeedbackWidget.tsx
import React, { useState } from 'react';

interface FeedbackWidgetProps {
  onFeedback: (type: 'yes' | 'no') => void;
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ onFeedback }) => {
  const [selected, setSelected] = useState<'yes' | 'no' | null>(null);

  const handleFeedback = (type: 'yes' | 'no') => {
    setSelected(type);
    onFeedback(type);
  };

  return (
    <div className="feedback-widget-container">
      <span className="feedback-widget-label">Was this helpful?</span>
      <div className="feedback-widget-buttons">
        <button 
          className={`feedback-widget-btn yes ${selected === 'yes' ? 'selected' : ''}`}
          onClick={() => handleFeedback('yes')}
        >
          👍 Yes
        </button>
        <button 
          className={`feedback-widget-btn no ${selected === 'no' ? 'selected' : ''}`}
          onClick={() => handleFeedback('no')}
        >
          👎 No
        </button>
      </div>
    </div>
  );
};

export default FeedbackWidget;