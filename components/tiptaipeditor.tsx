"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menuBar";
import { ListItem } from "@tiptap/extension-list-item";
// import Heading from "@tiptap/extension-heading";
import {
  CustomBulletList,
  CustomHeading,
  CustomListItem,
  CustomOrderedList,
} from "@/app/lib/tiptapExtensions";
interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

const Tiptap = ({
  initialContent = ` <ul>
    <li>First item</li>
    <li>Second item</li>
  </ul>`,
  onChange,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        listItem: false,
        bulletList: false,
        orderedList: false,
      }),
      CustomListItem,
      CustomBulletList,
      CustomOrderedList,
      
      CustomHeading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
    ],
    immediatelyRender: false,

    editorProps: {
      attributes: {
        class: "min-h-[150px] border focus:outline-none rounded-xl p-4",
      },
    },
    content: initialContent,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
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
