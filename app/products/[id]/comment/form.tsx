"use client";

import TabBar from "@/components/tab-bar";
import { useFormState } from "react-dom";
import { writeProductComment } from "./actions";

export default function ProductCommentForm({ productId }: { productId: number }) {
  const [state, formAction] = useFormState(
    async (_prevState: any, formData: FormData) => {
      await writeProductComment(productId, formData);
      return {};
    },
    null
  );
  

  return (
    <div className="relative min-h-screen">
          {/* 고정된 사이드바 - 콘텐츠를 밀어내지 않음 */}
          <div className="fixed top-0 left-0 w-60 h-full z-10 border-r bg-white">
            <TabBar />
          </div>

    <form action={formAction} className="flex flex-col gap-2 mt-4">
      <textarea
        name="comment"
        required
        placeholder="댓글을 입력하세요"
        className="w-full rounded-md border border-gray-300 p-2 text-sm"
      />
      <label className="text-sm flex items-center gap-2 text-gray-700">
        <input
          type="checkbox"
          name="isAnonymous"
          className="accent-orange-500"
        />
        익명으로 작성
      </label>
      <button
        type="submit"
        className="self-end px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-400"
      >
        댓글 작성
      </button>
    </form>
    </div>
  );
}
