'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ChatRoom() {
  const searchParams = useSearchParams();
  const roomName = searchParams.get('roomName') || '알 수 없는 방';

  const [messages, setMessages] = useState([
    { id: 1, sender: 'user1', content: '안녕하세요!' },
    { id: 2, sender: 'user2', content: '안녕하세요, 반갑습니다!' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const newMessageObj = {
        id: messages.length + 1,
        sender: 'user1',
        content: newMessage.trim(),
      };
      setMessages([...messages, newMessageObj]);
      setNewMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className="p-4 flex flex-col bg-white"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1000,
      }}
    >
      <h2 className="text-lg font-bold mb-2">{roomName}</h2>
      <div className="flex-1 overflow-y-auto border rounded p-2 bg-gray-100">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 ${
              msg.sender === 'user1'
                ? 'text-right text-blue-600'
                : 'text-left text-gray-700'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 border px-2 py-1 rounded"
          placeholder="메시지를 입력하세요..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-400"
        >
          전송
        </button>
      </div>
    </div>
  );
}
