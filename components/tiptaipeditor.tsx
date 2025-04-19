"use client";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Content, Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";
import MenuBar from "./menuBar";
import {
  CustomBulletList,
  CustomHeading,
  CustomListItem,
  CustomOrderedList,
  FaqAnswer,
  FaqQuestion,
  FaqSingleItem,
} from "@/app/lib/tiptapExtensions";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { title } from "process";
// import { toast } from "sonner"; // or your preferred toast library

interface RichTextEditorProps {
  initialContent?: string | Content;
  onChange?: (content: string) => void;
  onSave?: (content: string) => Promise<void> | void;
  isSaving?: boolean;
  postSlug:string
}

const Tiptap = ({
  initialContent = ``,
  onChange,
  onSave,
  isSaving: externalIsSaving,
  postSlug,
}: RichTextEditorProps) => {
  const [internalIsSaving, setInternalIsSaving] = useState(false);
  const isSaving = externalIsSaving ?? internalIsSaving;

  const editor = useEditor({
    immediatelyRender:false,
    extensions: [
      StarterKit.configure({
        paragraph: {},
        hardBreak: {},
      }),
      ImageResize,
      HardBreak,
      CustomListItem,
      CustomBulletList,
      CustomOrderedList,
      FaqQuestion,
      FaqAnswer,
      FaqSingleItem,
      CustomHeading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] border focus:outline-none rounded-xl p-4 prose max-w-none",
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
        // toast.error("Failed to update content");
      }
    },
  });

  const handleSave = async () => {
    if (!editor) return;

    const content = editor.getJSON()
    await fetch('/api/blog/post/create',{
        method:'POST',
       body:JSON.stringify({
        content:content,
        title:'a',
        slug:'1-1',
        authorId:"1"
       }) 
      })
  };

  // Set initial content when it changes
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  if (!editor) {
    return (
      <div className="border rounded-xl p-4 min-h-[150px]">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <MenuBar editor={editor} />
      <EditorContent
        className="h-max focus:outline-none mb-4"
        editor={editor}
      />
      <Button className="w-full gap-2" onClick={handleSave} disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save
          </>
        )}
      </Button>
    </div>
  );
};

export default Tiptap;
