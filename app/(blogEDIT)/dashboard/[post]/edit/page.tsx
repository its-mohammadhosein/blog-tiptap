// 'use client'
import { links } from "@/app/lib/links";
import { RichTextEditor } from "@/app/test/rich-text-editor";
import { PostWithAuthor } from "../../page";
import EditorBlogPost from "./editingblogppost";

export default async function page({ params }: { params: { post: string } }) {
  const { post } = await params;
  const res = await fetch(`${links.baseUrl}/api/blog/${post}`, {
    cache: "no-store",
  });
  const data = (await res.json()) as PostWithAuthor;
  console.log(data);

  return (
    <div className="w-full h-screen flex justify-center">
      <div className="max-w-[1280px] w-full min-h-[450px] mt-12 ">
        <EditorBlogPost postContent={data} />
      </div>
    </div>
  );
}
