import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon, formatSmartDate } from "@/lib/utils";
import { UserIcon, EyeIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCommentForm from "./comment/form";
import ProductCommentList from "./comment/list";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getProduct(id: number) {
  const product = await db.product.update({
    where: { id },
    data: { views: { increment: 1 } },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
      comments: true,
    },
  });
  return product;
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  return (
    <div className="bg-white text-gray-900 min-h-screen pb-28">
      {/* 상품 이미지 */}
      <div className="relative aspect-square">
        <Image
          className="object-cover"
          fill
          src={`${product.photo}/width=1000,height=1000`}
          alt={product.title}
        />
      </div>

      {/* 판매자 정보 */}
      <div className="p-5 flex items-center gap-3 border-b border-neutral-300">
        <div className="size-10 overflow-hidden rounded-full bg-gray-200">
          {product.user.avatar ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon className="w-full h-full p-2 text-white" />
          )}
        </div>
        <div>
          <h3 className="font-semibold">{product.user.username}</h3>
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="p-5 space-y-2">
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-gray-700">{product.description}</p>
        <div className="text-sm text-gray-500">
          조회수: {product.views}
        </div>
      </div>

      {/* 댓글 리스트 */}
      <div className="px-5">
        <ProductCommentList productId={product.id} />
      </div>

      {/* 댓글 작성 폼 */}
      <div className="px-5 mt-4">
        <ProductCommentForm productId={product.id} />
      </div>

    </div>
  );
}
