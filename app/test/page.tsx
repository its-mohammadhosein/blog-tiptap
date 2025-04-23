import { RichTextEditor } from "./rich-text-editor";

export default function page() {
  return (
    <div className="w-full flex justify-center items-center min-h-[600px]">
      <div className="max-w-[1280px]">
        
        <RichTextEditor
          options={{
            content:'hello'
          }}
        />
      </div>
    </div>
  );
}
