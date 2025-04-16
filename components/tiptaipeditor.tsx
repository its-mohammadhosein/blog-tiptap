"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { HardBreak } from "@tiptap/extension-hard-break";
import MenuBar from "./menuBar";
// import Heading from "@tiptap/extension-heading";
import {
  CustomBulletList,
  // CustomExtension,
  CustomHeading,
  CustomListItem,
  CustomOrderedList,
  // FaqItem,
  // FaqGroup,
  FaqQuestion,
  FaqAnswer,
  FaqSingleItem,
  // FaqExtension,
} from "@/app/lib/tiptapExtensions";
interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

const Tiptap = ({
  initialContent = ``,
  onChange,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // listItem: true, // Enable these temporarily for debugging
        // bulletList: true,
        // orderedList: true,
        paragraph: {}, // Ensure paragraph is included
        hardBreak: {}, // Ensure hard_break is included
      }),
      HardBreak,
      CustomListItem,
      CustomBulletList,
      CustomOrderedList,
      FaqQuestion, // Ensure this extension is implemented correctly
      FaqAnswer,
      FaqSingleItem,
      CustomHeading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
    ],
    editorProps: {
      attributes: {
        class: "min-h-[150px] border focus:outline-none rounded-xl p-4",
      },
    },
    content: initialContent,
    onUpdate: ({ editor }) => {
      try {
        if (onChange) {
          onChange(editor.getHTML());
        }
      } catch (error) {
        console.error("Error in onUpdate:", error);
      }
    },
  });

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent className="h-full focus:outline-none " editor={editor} />
    </>
  );
};

export default Tiptap;
