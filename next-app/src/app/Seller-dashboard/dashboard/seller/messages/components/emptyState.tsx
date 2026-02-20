// app/dashboard/seller/messages/components/EmptyState.tsx
'use client';

import Link from 'next/link';

export default function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">💬</span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Your Messages
      </h3>
      
      <p className="text-gray-500 max-w-sm mb-8">
        Select a conversation from the list to start chatting with buyers about your items.
      </p>

      <div className="space-y-3">
        <Link 
          href="/dashboard/seller"
          className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          View Your Listings
        </Link>
        
        <p className="text-xs text-gray-400">
          When buyers message you, they'll appear here
        </p>
      </div>
    </div>
  );
}