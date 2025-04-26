"use client";
import { links } from "@/app/lib/links";
import { RichTextEditor } from "@/app/test/rich-text-editor";
import { useDebounceFn, useSafeState } from "ahooks";
import { Button } from "antd";
import { useSession } from "next-auth/react";

export default function Page() {
  const [content, setContent] = useSafeState<string>();
  const auth = useSession();
  const { run: updateDescription } = useDebounceFn(
    (updatedDescription: string) => {
      console.log({ updatedDescription });
      setContent(updatedDescription); // Fixed: pass the value, not the function
    },
    { wait: 500 } // Added debounce delay (optional but recommended)
  );
  console.log(auth);

  const CreatePost = async () => {
    try {
      const CreatingPost = await fetch(
        `${links.baseUrl}/api/blog/post/create`,
        {
          method: "POST",
          body: JSON.stringify({
            authorId:auth.data?.userId,
            title: "hey",
            content: content,
          }),
        }
      );
      if(CreatingPost.ok){
        console.log(CreatingPost);
        
      }
    } catch (error) {}
  };
  return (
    <div className="w-full h-screen flex justify-center">
      <div className="max-w-[1280px] w-full min-h-[450px] mt-12">
        <RichTextEditor
          options={{
            onUpdate: ({ editor }) => {
              updateDescription(editor.getHTML());
            },
          }}
        />

        <Button
          onClick={() => {
            console.log(content);
            CreatePost();
          }}
        >
          log
        </Button>
      </div>
    </div>
  );
}
