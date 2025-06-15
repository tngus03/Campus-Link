'use client';

import { useState } from 'react';
import SignupPageModal from '@/components/SignupPageModal';
import LoginPageModal from '@/components/LoginPageModal';

export default function LoginPage() {
  const [open, setOpen] = useState<'signup' | 'login' | null>(null);

  return (
    <div className="fixed inset-0 grid grid-cols-4 overflow-y-auto">
      {/* 왼쪽 3/4 */}
      <div className="relative col-span-3">
        <img
          src="/login-background.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* 오른쪽 1/4 */}
      <div className="col-span-1 flex flex-col justify-center bg-black px-10 text-white">
        <h1 className="mb-8 whitespace-pre-line text-5xl font-bold">
          지금 일어나고 있는 일
        </h1>
        <h2 className="mb-8 text-3xl font-bold">캠퍼스링크에 가입하세요.</h2>

        <button
          onClick={() => setOpen('signup')}
          className="w-full rounded-full bg-blue-500 py-2 font-semibold hover:bg-blue-600"
        >
          이메일 주소로 가입하기
        </button>

        <p className="mt-8 text-lg">
          이미 캠퍼스링크 계정이 있나요?{' '}
          <span
            onClick={() => setOpen('login')}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            로그인
          </span>
        </p>
      </div>

      {open === 'signup' && <SignupPageModal onClose={() => setOpen(null)} />}
      {open === 'login' && <LoginPageModal onClose={() => setOpen(null)} />}
    </div>
  );
}
