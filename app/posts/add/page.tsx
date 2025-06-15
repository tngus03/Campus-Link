"use client";

import TabBar from "@/components/tab-bar";
import { useFormState } from "react-dom";
import { createPost } from "./actions";

export default function AddPost() {
  const [state, formAction] = useFormState(createPost, null);

  return (
    <div className="relative min-h-screen">
          {/* 고정된 사이드바 - 콘텐츠를 밀어내지 않음 */}
          <div className="fixed top-0 left-0 w-60 h-full z-10 border-r bg-white">
            <TabBar />
          </div>
          
    <form action={formAction} className="p-5 flex flex-col gap-6 bg-white text-gray-900 max-w-xl mx-auto">
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          제목
        </label>
        <input
          name="title"
          id="title"
          type="text"
          placeholder="제목을 입력하세요"
          className="rounded-md w-full h-10 border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
        />
        {state?.error?.title && (
          <span className="text-red-500 text-sm font-medium">
            {state.error.title}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          내용
        </label>
        <textarea
          name="description"
          id="description"
          placeholder="내용을 입력하세요"
          className="rounded-md w-full h-28 border border-gray-300 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
        />
        {state?.error?.description && (
          <span className="text-red-500 text-sm font-medium">
            {state.error.description}
          </span>
        )}
      </div>

      {/* ✅ 익명 체크박스 유지 */}
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" name="isAnonymous" className="accent-blue-500" />
        익명으로 작성하기
      </label>

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-400 transition"
      >
        작성 완료
      </button>
    </form>
    </div>
  );
}
