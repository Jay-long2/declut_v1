// app/dashboard/seller/messages/components/ChatWindow.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import MessageBubble from './messageBubble';

interface Message {
  id: number;
  sender: 'buyer' | 'seller';
  text: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: number;
  buyer: {
    name: string;
    avatar: string | null;
    isVerified: boolean;
  };
  listing: {
    id: number;
    title: string;
    price: number;
    image: string | null;
  };
}

interface ChatWindowProps {
  conversation: Conversation;
  onBack: () => void;
}

export default function ChatWindow({ conversation, onBack }: ChatWindowProps) {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock messages
    setMessages([
      {
        id: 1,
        sender: 'buyer',
        text: 'Hi! Is this still available? I can pick up today.',
        timestamp: '2024-02-12T10:30:00',
        isRead: true,
      },
      {
        id: 2,
        sender: 'seller',
        text: 'Yes, it\'s still available! When would you like to pick up?',
        timestamp: '2024-02-12T10:35:00',
        isRead: true,
      },
    ]);
  }, [conversation.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'seller',
      text: message,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        <button
          onClick={onBack}
          className="md:hidden mr-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ←
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
            {conversation.buyer.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{conversation.buyer.name}</h2>
            <p className="text-xs text-gray-500">{conversation.listing.title}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}