"use client";

import { Card } from "@/components/ui/Card";

export default function MessagesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      <div className="p-6 text-center">
        <Card>
          <p>No messages yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Messaging feature will be connected once backend is available.
          </p>
        </Card>
      </div>
    </div>
  );
}
