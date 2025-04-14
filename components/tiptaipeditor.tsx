"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

const Tiptap = ({ initialContent = "", onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(JSON.stringify(editor.getJSON()));
      }
    },
  });

  return <EditorContent className="h-[400px] border-black border focus:outline-none" editor={editor} />;
};

export default Tiptap;
