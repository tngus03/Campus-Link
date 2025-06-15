"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function writeProductComment(productId: number, formData: FormData) {
  const session = await getSession();
  const payload = formData.get("comment")?.toString();
  const isAnonymous = formData.get("isAnonymous") === "on"; // ✅ 익명 여부 처리

  if (!payload || !session?.id) return;

  await db.productComment.create({
    data: {
      payload,
      productId,
      userId: session.id,
      isAnonymous, // ✅ 이제 주석 제거!
    },
  });

  revalidatePath(`/products/${productId}`);
}
