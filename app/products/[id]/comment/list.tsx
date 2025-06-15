import db from "@/lib/db";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/solid";
import { formatSmartDate } from "@/lib/utils";
import { SCHOOL_KOREAN_NAME } from "@/lib/school-name";

async function getComments(productId: number) {
  return await db.productComment.findMany({
    where: { productId },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      payload: true,
      created_at: true,
      isAnonymous: true, // ✅ 익명 여부 가져오기
      user: {
        select: {
          username: true,
          avatar: true,
          school: true,
        },
      },
    },
  });
}

export default async function ProductCommentList({ productId }: { productId: number }) {
  const comments = await getComments(productId);

  return (
    <ul className="space-y-4">
      <h3 className="text-lg font-semibold">댓글 ({comments.length})</h3>
      {comments.map((comment) => (
        <li key={comment.id} className="flex gap-3 items-start">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            {comment.isAnonymous || !comment.user.avatar ? (
              <UserIcon className="w-10 h-10 text-white p-1" />
            ) : (
              <Image
                src={comment.user.avatar}
                width={40}
                height={40}
                alt={comment.user.username}
              />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {comment.isAnonymous ? "익명" : comment.user.username} ·{" "}
              {SCHOOL_KOREAN_NAME[comment.user.school] ?? comment.user.school} ·{" "}
              {formatSmartDate(comment.created_at.toString())}
            </p>
            <p className="text-sm text-gray-800">{comment.payload}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
