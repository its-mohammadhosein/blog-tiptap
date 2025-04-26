"use client";
import { RichTextEditor } from "@/app/test/rich-text-editor";
import { PostWithAuthor } from "../../page";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { links } from "@/app/lib/links";
import { error } from "console";

export default function EditorBlogPost({
  postContent,
}: {
  postContent: PostWithAuthor;
}) {
  const [Content, setContent] = useState<string>(postContent.content);
  const EditpostSave = async () => {
    const PostEditing = await fetch(
      `${links.baseUrl}/api/blog/${postContent.slug}/editing/`,
      {
        method: "PUT",
      }
    );
    if (!PostEditing.ok) {
        throw new Error('failed to update the post')
    }
    const response =await PostEditing.json()
    console.log(response);

    
    
  };
  return (
    <>
      <RichTextEditor
        options={{
          onUpdate: ({ editor }) => {
            setTimeout(() => {
              setContent(editor.getHTML());
            }, 500);
          },
          content: postContent.content,
        }}
      />
      <Button
        className="mt-2"
        onClick={() => {
          console.log(Content);
        }}
      >
        ذخیره تغییرات
      </Button>
    </>
  );
}
