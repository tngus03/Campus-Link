'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  FireIcon as SolidFire,
  NewspaperIcon as SolidNews,
  InformationCircleIcon as SolidInfo,
  TagIcon as SolidTrade,
  ChatBubbleOvalLeftEllipsisIcon as SolidChat,
  UserIcon as SolidUser,
} from '@heroicons/react/24/solid';

import {
  FireIcon as OutlineFire,
  NewspaperIcon as OutlineNews,
  InformationCircleIcon as OutlineInfo,
  TagIcon as OutlineTrade,
  ChatBubbleOvalLeftEllipsisIcon as OutlineChat,
  UserIcon as OutlineUser,
} from '@heroicons/react/24/outline';

const NAV = [
  
  { href: '/hot', label: 'HOT', solid: SolidFire, outline: OutlineFire },
  { href: '/life', label: '일반게시판', solid: SolidNews, outline: OutlineNews },
  { href: '/products', label: '중고게시판', solid: SolidTrade, outline: OutlineTrade },
  { href: '/chat', label: '채팅', solid: SolidChat, outline: OutlineChat },
  { href: '/profile', label: '내정보', solid: SolidUser, outline: OutlineUser },
];

const COLOR_MAP: Record<string, string> = {
  '/hot': 'text-red-500',
  '/life': 'text-blue-500',
  '/products': 'text-orange-500',
  '/chat': 'text-yellow-500',
  '/profile': 'text-purple-500',
};

export default function TabBar() {
  const pathname = usePathname();

  return (
    <>
      {/* 데스크탑 사이드바 */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 flex-col border-r border-neutral-200 bg-white py-6 text-neutral-800">
        <nav className="flex flex-col gap-4 px-4">
          {NAV.map(({ href, label, solid: Solid, outline: Outline }) => {
            const active = pathname === href;
            const Icon = active ? Solid : Outline;
            const className = active
              ? `${COLOR_MAP[href]} font-bold`
              : 'text-neutral-800 font-medium';
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-4 rounded-full px-4 py-2 text-xl hover:bg-neutral-100 ${className}`}
              >
                <Icon className="h-6 w-6" />
                <span>{label}</span>
              </Link>
            );
          })}

          {/* 글쓰기 버튼 */}
          <div className="mt-3 flex flex-col gap-5">
            <Link href="/posts/add">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full font-semibold text-base">
                일반 글쓰기
              </button>
            </Link>
            <Link href="/products/add">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-full font-semibold text-base">
                중고 글쓰기
              </button>
            </Link>
          </div>
        </nav>
      </aside>

      {/* 모바일 하단 탭바 */}
      <nav className="lg:hidden fixed bottom-0 grid w-full max-w-screen-md grid-cols-5 border-t border-neutral-300 bg-white px-5 py-3 text-base">
        {NAV.map(({ href, label, solid: Solid, outline: Outline }) => {
          const active = pathname === href;
          const Icon = active ? Solid : Outline;
          const className = active
            ? `${COLOR_MAP[href]} font-bold`
            : 'text-neutral-800 font-medium';
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 ${className}`}
            >
              <Icon className="h-6 w-6" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
