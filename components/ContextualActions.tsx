import React from 'react';
import { ChatMessage } from '../types';
import { Zap, Lightbulb, BookOpen, Video } from 'lucide-react';

interface Props {
  lastMessage: ChatMessage;
  onAction: (actionText: string) => void;
  onGenerateVideo: (prompt: string) => void;
}

const ContextualActions: React.FC<Props> = ({ lastMessage, onAction, onGenerateVideo }) => {
  if (!lastMessage || lastMessage.role !== 'assistant') return null;

  const actions = [];

  if (lastMessage.phantomStepDetected) {
    actions.push({
      text: 'Deep Dive into Misconception',
      icon: Zap,
      action: `Explain the phantom step "${lastMessage.misconceptionDescription}" in more detail with a step-by-step correction.`
    });
  }

    if (lastMessage.conceptNote && lastMessage.conceptNote.length > 0) {
    actions.push({
      text: 'Explain with Video',
      icon: Video,
      action: () => onGenerateVideo(lastMessage.conceptNote?.join(', ') || ''),
      isVideoButton: true
    });
    actions.push({
      text: 'Expand on these concepts',
      icon: BookOpen,
      action: 'Provide more detailed explanations and examples for each point in the concept note.'
    });
  }
  
  if (lastMessage.analogyUsed) {
    actions.push({
      text: 'Give me another analogy',
      icon: Lightbulb,
      action: 'Can you explain this concept using a different analogy?'
    });
  }

  if (actions.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {actions.map((action, index) => (
          <button 
            key={index}
                        onClick={() => action.isVideoButton ? action.action() : onAction(action.action)}
            className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-slate-200 rounded-full text-sm font-black text-slate-600 hover:bg-slate-50 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-lg shadow-slate-100/50"
          >
            <action.icon className="w-5 h-5" />
            {action.text}
          </button>
        ))}
      </div>
      <div className="h-px bg-slate-200 w-1/2 mx-auto mt-8"></div>
    </div>
  );
};

export default ContextualActions;
