"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";

// ✅ 한글 욕설 리스트 (원하면 더 추가 가능)
const bannedWords = ["욕설1", "욕설2", "욕설3", "욕설4", "욕설5", "욕설6", "욕설7", "욕설8", "욕설9", "욕설10",];

// ✅ 욕설 필터링 함수
function filterBadWords(input: string) {
  let filtered = input;
  for (const word of bannedWords) {
    const regex = new RegExp(word, "gi"); // 대소문자 구분 없이
    filtered = filtered.replace(regex, "***");
  }
  return filtered;
}

export async function writeComment(
  postId: number,
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const payload = formData.get("comment")?.toString().trim();
  const isAnonymous = formData.get("isAnonymous") === "on";
  if (!payload) return { error: "내용을 입력해 주세요." };

  const filteredPayload = filterBadWords(payload); // ✅ 필터링 적용

  const session = await getSession();
  if (!session.id) return { error: "로그인이 필요합니다." };

  await db.comment.create({
    data: {
      payload: filteredPayload,
      isAnonymous,
      postId,
      userId: session.id,
    },
  });

  revalidateTag(`post-comments-${postId}`);
  return { success: true };
}
