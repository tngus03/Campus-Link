'use client';

import React, { useState } from 'react';

export default function Chat() {
  const [activeTab, setActiveTab] = useState('chatRooms');
  const [chatRooms, setChatRooms] = useState([
    { title: '기존 채팅방 1', description: '설명 1' },
    { title: '기존 채팅방 2', description: '설명 2' },
    { title: '기존 채팅방 3', description: '설명 3' },
  ]);

  const [myChats, setMyChats] = useState([
    { title: '나의 채팅방 1', description: '내가 만든 방 1' },
    { title: '나의 채팅방 2', description: '내가 만든 방 2' },
  ]);

  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const chatWindows: Record<string, Window | null> = {};

  const handleTabClick = (tab: string) => setActiveTab(tab);

  const handleCheckboxChange = (chatTitle: string, event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setSelectedChats((prev) =>
      prev.includes(chatTitle) ? prev.filter((chat) => chat !== chatTitle) : [...prev, chatTitle]
    );
  };

  const handleDeleteChats = () => {
    setMyChats(myChats.filter((chat) => !selectedChats.includes(chat.title)));
    setSelectedChats([]);
  };

  const handleCreateRoom = () => setShowCreateForm((prev) => !prev);

  const handleCreateRoomSubmit = () => {
    if (newRoomTitle.trim()) {
      const newRoom = { title: newRoomTitle, description: newRoomDescription };
      setChatRooms([newRoom, ...chatRooms]);
      setNewRoomTitle('');
      setNewRoomDescription('');
      setShowCreateForm(false);
    } else {
      alert('방 제목을 입력하세요.');
    }
  };

  const openChatWindow = (chatTitle: string, event: React.MouseEvent) => {
    if ((event.target as HTMLInputElement).type === 'checkbox') return;
    const url = `/chat-room?roomName=${encodeURIComponent(chatTitle)}`;
    if (!chatWindows[chatTitle] || chatWindows[chatTitle]?.closed) {
      chatWindows[chatTitle] = window.open(url, '_blank', 'width=550,height=783,resizable=yes');
    } else {
      chatWindows[chatTitle].focus();
    }
  };

  return (
    <div className="px-4 pt-6 pb-24 flex flex-col">
      <div className="flex mb-4 border-b border-neutral-700">
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === 'chatRooms'
              ? 'text-neutral-500 border-b-2 border-orange-500'
              : 'text-black'
          }`}
          onClick={() => handleTabClick('chatRooms')}
        >
          채팅방 목록
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === 'myChats'
              ? 'text-neutral-500 border-b-2 border-orange-500'
              : 'text-black'
          }`}
          onClick={() => handleTabClick('myChats')}
        >
          나의 채팅
        </button>
      </div>

      {activeTab === 'chatRooms' && (
        <div className="flex flex-col gap-4">
          {showCreateForm && (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="방 제목"
                value={newRoomTitle}
                onChange={(e) => setNewRoomTitle(e.target.value)}
                className="bg-white text-black p-2 rounded-md"
              />
              <textarea
                placeholder="주 내용"
                value={newRoomDescription}
                onChange={(e) => setNewRoomDescription(e.target.value)}
                className="bg-white text-black p-2 rounded-md"
              />
              <button
                onClick={handleCreateRoomSubmit}
                className="bg-orange-500 text-white py-2 rounded-md hover:bg-orange-400"
              >
                만들기
              </button>
            </div>
          )}

          <ul className="flex flex-col gap-4">
            {chatRooms.map((chat, index) => (
              <li
                key={index}
                onClick={(e) => openChatWindow(chat.title, e)}
                className="border border-neutral-700 p-4 rounded-md hover:bg-gray-200 cursor-pointer"
              >
                <h2 className="text-black font-semibold">{chat.title}</h2>
                <p className="text-neutral-400">{chat.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'myChats' && (
        <div className="flex flex-col gap-4">
          <button
            onClick={handleDeleteChats}
            disabled={selectedChats.length === 0}
            className="bg-red-500 text-white py-2 rounded-md disabled:opacity-50"
          >
            삭제
          </button>
          {myChats.length === 0 ? (
            <p className="text-neutral-500">채팅방이 없습니다.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {myChats.map((chat, index) => (
                <li
                  key={index}
                  onClick={(e) => openChatWindow(chat.title, e)}
                  className="border border-neutral-700 p-4 rounded-md hover:bg-gray-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedChats.includes(chat.title)}
                      onChange={(e) => handleCheckboxChange(chat.title, e)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <h2 className="text-black font-semibold">{chat.title}</h2>
                  </div>
                  <p className="text-neutral-400">{chat.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button
        onClick={handleCreateRoom}
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        +
      </button>
    </div>
  );
}
