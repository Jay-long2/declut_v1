"use client";

import React from "react";

interface Message {
	id: number;
	sender: "buyer" | "seller";
	text: string;
	timestamp: string;
	isRead: boolean;
}

interface MessageBubbleProps {
	message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
	const isSeller = message.sender === "seller";

	return (
		<div className={`flex ${isSeller ? "justify-end" : "justify-start"} mb-2`}>
			<div
				className={`max-w-[70%] px-4 py-2 rounded-lg shadow-sm ${
					isSeller
						? "bg-blue-600 text-white"
						: "bg-white text-gray-900 border border-gray-200"
				}`}
			>
				<p className="text-sm break-words">{message.text}</p>
				<div className="text-xs text-gray-400 mt-1 text-right">
					{new Date(message.timestamp).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</div>
			</div>
		</div>
	);
}
