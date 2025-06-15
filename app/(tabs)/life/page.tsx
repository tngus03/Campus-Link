import db from "@/lib/db";
import { formatSmartDate } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
  EyeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { SCHOOL_KOREAN_NAME } from "@/lib/school-name";

type PostWithExtras = {
  id: number;
  title: string;
  description: string | null;
  views: number;
  created_at: Date;
  isAnonymous: boolean; // ✅ 익명 여부 추가
  user: {
    username: string;
    school: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
};

async function getPosts(): Promise<PostWithExtras[]> {
  const posts = await db.post.findMany({
     orderBy: {
      created_at: "desc", // ✅ 최신순 정렬 추가!
    },
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      isAnonymous: true, // ✅ 익명 여부도 가져옴
      user: {
        select: {
          username: true,
          school: true,
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });
  return posts;
}

export const metadata = {
  title: "동네생활",
};

export default async function Life() {
  const posts = await getPosts();
  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-white flex flex-col gap-4"
          >
            {/* 아바타 + 유저 정보 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-base text-gray-700">
                <span className="font-semibold text-gray-900">
                  {post.isAnonymous ? "익명" : post.user.username}
                </span>{" "}
                ・ {SCHOOL_KOREAN_NAME[post.user.school] ?? post.user.school}
                {" ・ "}
                {formatSmartDate(post.created_at.toString())}
              </div>
            </div>

            {/* 제목 */}
            <h2 className="text-xl font-bold text-gray-900">{post.title}</h2>

            {/* 내용 */}
            <p className="text-base text-gray-800">{post.description}</p>

            {/* 아이콘 영역 */}
            <div className="flex justify-center gap-16 pt-3 text-blue-500 text-base">
              <div className="flex items-center gap-1 mr-6">
                <ChatBubbleBottomCenterIcon className="w-6 h-6 text-blue-500" />
                <span>{post._count.comments}</span>
              </div>
              <div className="flex items-center gap-1 text-red-500">
                <HandThumbUpIcon className="w-6 h-6" />
                <span>{post._count.likes}</span>
              </div>
              <div className="flex items-center gap-1 ml-6 text-green-600">
                <EyeIcon className="w-6 h-6" />
                <span>{post.views}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
