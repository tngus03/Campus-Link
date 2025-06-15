"use client";

import TabBar from "@/components/tab-bar";
import { useFormState } from "react-dom";
import { writeComment } from "./actions";
import { useRef } from "react";

interface ActionState {
  error?: string;
  success?: boolean;
}

export default function CommentForm({ postId }: { postId: number }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [state, formAction] = useFormState(
    async (prev: ActionState | null, formData: FormData): Promise<ActionState> => {
      const result = await writeComment(postId, prev, formData);

      // 성공 시 textarea 비우기
      if (result.success && textareaRef.current) {
        textareaRef.current.value = "";
      }

      return result;
    },
    null
  );

  return (
    <div className="relative min-h-screen">
          {/* 고정된 사이드바 - 콘텐츠를 밀어내지 않음 */}
          <div className="fixed top-0 left-0 w-60 h-full z-10 border-r bg-white">
            <TabBar />
          </div>

    <form action={formAction} className="flex flex-col gap-2">
      <textarea
        ref={textareaRef}
        name="comment"
        required
        placeholder="댓글을 입력하세요"
        className="w-full rounded-md border border-gray-300 p-2 text-sm"
      />
      <label className="text-sm flex items-center gap-2">
        <input type="checkbox" name="isAnonymous" className="accent-blue-500" />
        익명으로 작성
      </label>
      <button
        type="submit"
        className="self-end px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        등록
      </button>
      {state?.error && (
        <p className="text-sm text-red-500 font-medium">{state.error}</p>
      )}
    </form>
    </div>
  );
}
