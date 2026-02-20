// app/dashboard/seller/messages/components/ConversationItem.tsx
'use client';

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

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export default function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  const { buyer, listing, lastMessage, unreadCount } = conversation;

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition border-b border-gray-100 ${
        isSelected ? 'bg-blue-50 hover:bg-blue-50' : ''
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
          {buyer.name.charAt(0)}
        </div>
        {buyer.isVerified && (
          <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
            ✓
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-gray-900 truncate">
            {buyer.name}
          </h3>
          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
            {formatTime(lastMessage.timestamp)}
          </span>
        </div>
        
        <p className="text-xs text-gray-500 mb-1 truncate">
          Re: {listing.title}
        </p>
        
        <div className="flex items-center justify-between">
          <p className={`text-sm truncate ${
            !lastMessage.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'
          }`}>
            {lastMessage.text}
          </p>
          {unreadCount > 0 && (
            <span className="flex-shrink-0 ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}