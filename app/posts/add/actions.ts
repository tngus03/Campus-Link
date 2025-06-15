"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { postSchema } from "./schema";
import { redirect } from "next/navigation";

export async function createPost(_: any, formData: FormData) {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const result = postSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const session = await getSession();

  // ✅ 익명 여부 처리
  const isAnonymous = formData.get("isAnonymous") === "on";

  const post = await db.post.create({
    data: {
      title: result.data.title,
      description: result.data.description,
      isAnonymous, // ✅ 여기에 추가
      user: {
        connect: {
          id: session.id,
        },
      },
    },
    select: {
      id: true,
    },
  });

  redirect(`/posts/${post.id}`);
}
