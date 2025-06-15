
'use client';

import React, { useEffect, useState, useRef } from 'react';

type ChatRoom = {
  id: number;
  title: string;
  description: string;
  members: number;
  interest: string;
};

type Message = {
  roomId: number;
  sender: string;
  content: string;
  system?: boolean;
};

export default function Chat() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'전체' | '나의 채팅'>('전체');
  const [selectedInterest, setSelectedInterest] = useState<string>('전체');
  const [allRooms, setAllRooms] = useState<ChatRoom[]>([]);
  const [myRooms, setMyRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const storedRooms = localStorage.getItem('myRooms');
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedRooms) setMyRooms(JSON.parse(storedRooms));
    if (storedMessages) setMessages(JSON.parse(storedMessages));
    setAllRooms([
      { id: 1, title: '축구 좋아하는 사람', description: 'FC서울 팬 모여라!', members: 5, interest: '스포츠' },
      { id: 2, title: '스파이더맨 영화 덕후', description: '노웨이홈 최고', members: 2, interest: '영화' },
      { id: 3, title: '토익 스터디', description: '700점 목표', members: 1, interest: '공부' }
    ]);
  }, []);

  useEffect(() => {
    localStorage.setItem('myRooms', JSON.stringify(myRooms));
  }, [myRooms]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleEnterRoom = (room: ChatRoom) => {
    if (myRooms.find(r => r.id === room.id)) return alert('이미 참여한 방입니다!');
    if (confirm(`${room.title} 채팅방에 가입하시겠습니까?`)) {
      if (confirm('정말로 가입하시겠습니까?')) {
        setMyRooms(prev => [...prev, room]);
        const systemMsg: Message = {
          roomId: room.id,
          sender: 'system',
          content: `${room.title} 방에 입장하였습니다.`,
          system: true
        };
        setMessages(prev => [...prev, systemMsg]);
      }
    }
  };

  const handleLeaveRoom = (room: ChatRoom) => {
    if (confirm(`${room.title}에서 나가시겠습니까?`)) {
      setMyRooms(prev => prev.filter(r => r.id !== room.id));
      const systemMsg: Message = {
        roomId: room.id,
        sender: 'system',
        content: `${room.title} 방에서 퇴장하였습니다.`,
        system: true
      };
      setMessages(prev => [...prev, systemMsg]);
    }
  };

  const handleSendMessage = (roomId: number, content: string) => {
    const newMsg: Message = {
      roomId,
      sender: '나',
      content
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const renderMessages = (roomId: number) =>
    messages.filter(msg => msg.roomId === roomId).map((msg, idx) => (
      <div key={idx} className={`text-sm ${msg.system ? 'text-gray-400 italic' : ''}`}>
        {msg.system ? msg.content : `${msg.sender}: ${msg.content}`}
      </div>
    ));

  const interests = ['전체', '스포츠', '영화', '공부'];

  return (
    <div className={isDarkMode ? 'bg-black text-white min-h-screen p-4' : 'bg-white text-black min-h-screen p-4'}>
      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('전체')} className={activeTab === '전체' ? 'font-bold' : ''}>채팅방 목록</button>
          <button onClick={() => setActiveTab('나의 채팅')} className={activeTab === '나의 채팅' ? 'font-bold' : ''}>나의 채팅</button>
        </div>
        <button onClick={() => setIsDarkMode(prev => !prev)}>{isDarkMode ? '☀️' : '🌙'}</button>
      </div>

      <div className="mb-4 flex gap-2">
        {interests.map((i) => (
          <button key={i} onClick={() => setSelectedInterest(i)} className={selectedInterest === i ? 'underline' : ''}>{i}</button>
        ))}
      </div>

      {activeTab === '전체' && (
        <ul className="space-y-2">
          {allRooms.filter(r => selectedInterest === '전체' || r.interest === selectedInterest).map(room => (
            <li key={room.id} className="border p-4 rounded">
              <div className="flex justify-between">
                <div>
                  <div className="font-bold">{room.title}</div>
                  <div className="text-sm text-gray-500">{room.description}</div>
                  <div className="text-xs mt-1 text-blue-500">
                    {room.members === 1 ? '1:1 채팅' : `단체 채팅 (${room.members}명)`}
                  </div>
                </div>
                <button onClick={() => handleEnterRoom(room)} className="bg-blue-500 text-white px-2 py-1 rounded">입장</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {activeTab === '나의 채팅' && (
        <ul className="space-y-4">
          {myRooms.map(room => (
            <li key={room.id} className="border p-4 rounded">
              <div className="flex justify-between mb-2">
                <div>
                  <div className="font-bold">{room.title}</div>
                  <div className="text-sm text-gray-400">{room.description}</div>
                </div>
                <button onClick={() => handleLeaveRoom(room)} className="text-red-500 text-sm">나가기</button>
              </div>
              <div className="bg-gray-100 p-2 h-32 overflow-y-auto text-black rounded mb-2">
                {renderMessages(room.id)}
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const content = (e.target as any).elements.msg.value;
                handleSendMessage(room.id, content);
                (e.target as any).reset();
              }}>
                <input name="msg" className="border rounded w-full text-black px-2 py-1" placeholder="메시지를 입력하세요" />
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
