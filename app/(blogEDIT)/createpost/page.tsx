'use client'
import { RichTextEditor } from "@/app/test/rich-text-editor";
import { useDebounceFn, useSafeState } from "ahooks";
import { Button } from "antd";

export default function Page() {
  const [content, setContent] = useSafeState<string>();
  const { run: updateDescription } = useDebounceFn(
    (updatedDescription: string) => {
      console.log({ updatedDescription });
      setContent(updatedDescription); // Fixed: pass the value, not the function
    },
    { wait: 500 } // Added debounce delay (optional but recommended)
  );
  
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
        <Button onClick={() => console.log(content)}>log</Button>
      </div>
    </div>
  );
}