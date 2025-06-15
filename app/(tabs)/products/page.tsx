import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { formatSmartDate } from "@/lib/utils";
import { SCHOOL_KOREAN_NAME } from "@/lib/school-name";
import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/solid";

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      photo: true,
      created_at: true,
      user: {
        select: {
          username: true,
          school: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function Products() {
  const products = await getInitialProducts();

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border border-gray-200 rounded-xl p-5 flex justify-between items-center gap-6 shadow-sm hover:shadow-md transition hover:bg-gray-50"
          >
            {/* 왼쪽 텍스트 */}
            <div className="flex flex-col justify-between gap-3 flex-1">
              {/* 작성자 + 학교 + 시간 */}
              <div className="flex items-center gap-2 text-base text-gray-700">
                <UserIcon className="w-5 h-5 text-gray-500" />
                <span className="font-medium">{product.user.username}</span>
                <span className="font-bold text-lg text-gray-900">
                  {SCHOOL_KOREAN_NAME[product.user.school] ?? product.user.school}
                </span>
                <span className="text-sm text-gray-500">
                  {formatSmartDate(product.created_at.toString())}
                </span>
              </div>

              {/* 제목 */}
              <div className="text-lg font-semibold text-gray-900">
                {product.title}
              </div>

              {/* 가격 */}
              <div className="text-xl font-bold text-orange-500">
                {product.price.toLocaleString()}원
              </div>
            </div>

            {/* 오른쪽 이미지 */}
            <div className="w-28 h-28 rounded-lg bg-gray-100 overflow-hidden shrink-0">
              <Image
                src={`${product.photo}/width=500,height=500`}
                alt="product photo"
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
