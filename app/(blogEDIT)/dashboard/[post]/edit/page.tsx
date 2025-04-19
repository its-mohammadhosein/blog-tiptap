// 'use client'
import Tiptap from "@/components/tiptaipeditor";
import { PostWithAuthor } from "../../page";
import { JSONContent } from "@tiptap/core";

export default async function page({ params }: { params: { post: string } }) {
  const { post } = await params;
  const res = await fetch(`http://localhost:3000/api/blog/${post}`, {
    
    cache: "no-store",
  });
  const data = (await res.json()) as PostWithAuthor;
  return (
    <div className="w-full h-screen flex justify-center">
      <div className="max-w-[1280px] w-full min-h-[450px] mt-12 ">
        <Tiptap
          postSlug={data.slug}
          initialContent={data.content as JSONContent}
        />
      </div>
    </div>
  );
}
