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
      <div className="w-full max-w-[1280px] flex mt-12 gap-6">
        <div className="w-[80%]  min-h-[450px]  ">
          <EditorBlogPost postContent={data} />
        </div>
        <div className="w-[20%] ">
          <div className="side bg-red-300 p-2 h-full">
            {/* creating sidebar for author and title and slug and other things */}
          </div>
        </div>
      </div>
    </div>
  );
}
