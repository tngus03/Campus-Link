"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import TabBar from "@/components/tab-bar";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductType, productSchema } from "./schema";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;

    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);

    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setValue(
        "photo",
        `https://imagedelivery.net/iQAqwjAFACn1u56xs0yODA/${id}`
      );
    }
  };

  const onSubmit = handleSubmit(async (data: ProductType) => {
    if (!file) return;

    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "post",
      body: cloudflareForm,
    });
    if (response.status !== 200) return;

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price + "");
    formData.append("description", data.description);
    formData.append("photo", data.photo);

    const errors = await uploadProduct(formData);
    if (errors) {
      // setError("photo", { message: "업로드 실패" });
    }
  });

  const onValid = async () => {
    await onSubmit();
  };

  return (
    <div className="relative min-h-screen">
      {/* 고정된 사이드바 - 콘텐츠를 밀어내지 않음 */}
      <div className="fixed top-0 left-0 w-60 h-full z-10 border-r bg-white">
        <TabBar />
      </div>

      {/* 콘텐츠 - margin 없이 그대로 위치 */}
      <div>
        <form action={onValid} className="p-5 flex flex-col gap-5">
          <label
            htmlFor="photo"
            className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
            style={{
              backgroundImage: `url(${preview})`,
            }}
          >
            {preview === "" ? (
              <>
                <PhotoIcon className="w-20" />
                <div className="text-neutral-400 text-sm">
                  사진을 추가해주세요.
                  {errors.photo?.message}
                </div>
              </>
            ) : null}
          </label>
          <input
            onChange={onImageChange}
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            className="hidden"
          />
          <Input
            required
            placeholder="제목"
            type="text"
            {...register("title")}
            errors={[errors.title?.message ?? ""]}
          />
          <Input
            type="number"
            required
            placeholder="가격"
            {...register("price")}
            errors={[errors.price?.message ?? ""]}
          />
          <Input
            type="text"
            required
            placeholder="자세한 설명"
            {...register("description")}
            errors={[errors.description?.message ?? ""]}
          />
          <Button text="작성 완료" />
        </form>
      </div>
    </div>
  );
}
