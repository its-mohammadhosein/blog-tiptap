// 'use client'
import Tiptap from "@/components/tiptaipeditor";

export default function page() {
  return (
    <div className="w-full h-screen flex justify-center">
      <div className="max-w-[1280px] w-full min-h-[450px] mt-12 ">
        <Tiptap />
      </div>
    </div>
  );
}
