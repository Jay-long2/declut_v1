// app/dashboard/seller/messages/components/ConversationList.tsx
'use client';

import { useState } from 'react';
import ConversationItem from './conversationItem';

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
  lastMessage: {
    text: string;
    timestamp: string;
    isRead: boolean;
    sender: string;
  };
  unreadCount: number;
}

interface ConversationListProps {
  selectedId?: number;
  onSelectConversation: (conversation: Conversation) => void;
}

export default function ConversationList({ selectedId, onSelectConversation }: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Mock data
  const conversations: Conversation[] = [
    {
      id: 1,
      buyer: {
        name: 'Sarah Kimani',
        avatar: null,
        isVerified: true,
      },
      listing: {
        id: 101,
        title: 'Vintage Oversized Denim Jacket',
        price: 45,
        image: null,
      },
      lastMessage: {
        text: 'Hi! Is this still available? I can pick up today.',
        timestamp: '2024-02-12T10:30:00',
        isRead: false,
        sender: 'buyer',
      },
      unreadCount: 2,
    },
    {
      id: 2,
      buyer: {
        name: 'James Omondi',
        avatar: null,
        isVerified: true,
      },
      listing: {
        id: 102,
        title: 'Organic Cotton Trousers',
        price: 32,
        image: null,
      },
      lastMessage: {
        text: 'Would you accept $28? I can come tomorrow.',
        timestamp: '2024-02-11T15:45:00',
        isRead: true,
        sender: 'buyer',
      },
      unreadCount: 0,
    },
  ];

  const filteredConversations = conversations
    .filter(conv => {
      if (filter === 'unread') return conv.unreadCount > 0;
      return true;
    })
    .filter(conv => 
      conv.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.listing.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex p-4 space-x-2 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-sm rounded-full transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 text-sm rounded-full transition ${
            filter === 'unread'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Unread
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedId === conversation.id}
              onClick={() => onSelectConversation(conversation)}
            />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No conversations found
          </div>
        )}
      </div>
    </div>
  );
}