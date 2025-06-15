'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/solid';// 아이콘


export default function ProfilePage() {
  const [user, setUser] = useState<null | any>(null);
  const [postsOpen, setPostsOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/';
  };

  if (!user) return <div className="p-4">로딩 중...</div>;

  return (
  <div className="p-6 space-y-8">
  <div className="flex flex-col items-center space-y-2">

    {/* ✅ 사용자 아이콘 */}
    <UserCircleIcon className="w-28 h-28 text-gray-400" />
    {/* ✅ 사용자 아이콘 */}
    
    <h1 className="text-2xl font-bold text-center">{user.username}님의 프로필</h1>
  </div>
      <div className="border-b border-neutral-300 w-full my-0"></div>
      <div>
        <h2
          className="text-xl font-semibold mb-2 cursor-pointer select-none flex items-center justify-between"
          onClick={() => setPostsOpen(!postsOpen)}
        >
          📌 내가 쓴 게시글
          <span className="ml-2 text-sm">{postsOpen ? '▲' : '▼'}</span>
        </h2>
        {postsOpen && (
          <ul className="space-y-1">
            {user.posts.map((post: any) => (
              <li key={post.id}>
                <Link
                  href={`/posts/${post.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-b border-neutral-300 w-full my-0"></div>

      <div>
        <h2
          className="text-xl font-semibold mb-2 cursor-pointer select-none flex items-center justify-between"
          onClick={() => setCommentsOpen(!commentsOpen)}
        >
          💬 내가 단 댓글
          <span className="ml-2 text-sm">{commentsOpen ? '▲' : '▼'}</span>
        </h2>
        {commentsOpen && (
          <ul className="space-y-1">
            {user.comments.map((comment: any) => (
              <li key={comment.id}>
                <Link
                  href={`/posts/${comment.post.id}`}
                  className="text-blue-600 hover:underline"
                >
                  "{comment.payload}"
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-b border-neutral-300 w-full my-0"></div>

      <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 self-center"
    >
      로그아웃
    </button>

    </div>
  );
}
