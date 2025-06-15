import db from "@/lib/db";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/solid";
import { formatSmartDate } from "@/lib/utils";
import { SCHOOL_KOREAN_NAME } from "@/lib/school-name";

async function getComments(postId: number) {
  return await db.comment.findMany({
    where: { postId },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      payload: true,
      created_at: true,
      isAnonymous: true,
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

export default async function CommentList({ postId }: { postId: number }) {
  const comments = await getComments(postId);

  return (
    <div className="pt-6">
      <h3 className="text-lg font-semibold mb-4">댓글 ({comments.length})</h3>
      <ul className="flex flex-col gap-6">
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
              {comment.user.avatar ? (
                <Image
                  src={comment.user.avatar}
                  width={40}
                  height={40}
                  alt={comment.user.username}
                />
              ) : (
                <UserIcon className="w-10 h-10 text-white p-1" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {comment.isAnonymous ? "익명" : comment.user.username} ·{" "}
                {SCHOOL_KOREAN_NAME[comment.user.school] ?? comment.user.school} ·{" "}
                {formatSmartDate(comment.created_at.toString())}
              </p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{comment.payload}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
