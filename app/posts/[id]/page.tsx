import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatSmartDate } from "@/lib/utils";
import { EyeIcon, HandThumbUpIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import LikeButton from "@/components/like-button";
import { SCHOOL_KOREAN_NAME } from "@/lib/school-name";
import CommentList from "./comment/list";
import CommentForm from "./comment/form";

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
            school: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});

async function getLikeStatus(postId: number) {
  const session = await getSession();
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id!,
      },
    },
  });
  const likeCount = await db.like.count({ where: { postId } });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const post = await getCachedPost(id);
  if (!post) return notFound();

  const { likeCount, isLiked } = await getLikeStatus(id);

  return (
    <div className="bg-white text-gray-900 p-6 min-h-screen">
      {/* 사용자 정보 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
          {post.isAnonymous || !post.user.avatar ? (
            <UserIcon className="w-12 h-12 text-white p-2" />
          ) : (
            <Image
              width={48}
              height={48}
              src={post.user.avatar}
              alt={post.user.username}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div>
          <div className="text-xl font-medium flex items-center gap-2">
            {post.isAnonymous ? "익명" : post.user.username}
            <span className="text-2xl font-bold text-black-600">
              {SCHOOL_KOREAN_NAME[post.user.school] ?? post.user.school}
            </span>
          </div>
          <div className="text-base text-gray-500">
            {formatSmartDate(post.created_at.toString())}
          </div>
        </div>
      </div>

      {/* 게시글 내용 */}
      <h2 className="text-3xl font-bold mb-4 leading-tight">{post.title}</h2>
      <p className="text-lg mb-8 leading-relaxed text-gray-800">{post.description}</p>

      {/* 좋아요, 조회수 */}
      <div className="flex items-center gap-8 text-base text-green-600 mb-10">
        <div className="flex items-center gap-2">
          <LikeButton
            isLiked={isLiked}
            likeCount={likeCount}
            postId={id}
          />
        </div>
        <div className="flex items-center gap-1">
          <EyeIcon className="w-5 h-5" />
          <span>{post.views}</span>
        </div>
      </div>

      {/* 댓글 리스트 */}
      <div className="pt-4">
        <div className="border-t border-gray-300 mb-4"></div>
        <CommentList postId={id} />
      </div>

      {/* 댓글 작성 폼 */}
      <div className="mt-6">
        <CommentForm postId={id} />
      </div>
    </div>
  );
}
