// src/components/ChatBot/QuickActionButtons.tsx
import React from 'react';

interface QuickAction {
  label: string;
  action: string;
}

interface QuickActionButtonsProps {
  actions: QuickAction[];
  onActionClick: (action: string) => void;
}

const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({ actions, onActionClick }) => {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="quick-action-buttons-container">
      <p className="quick-action-buttons-title"> Quick Actions:</p>
      <div className="quick-action-buttons-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className="quick-action-button"
            onClick={() => onActionClick(action.action)}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionButtons;