'use client'
import { Editor } from "@tiptap/react";
import {
  LuHeading,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
} from "react-icons/lu";

import { FaListOl, FaQuestion } from "react-icons/fa";
import { MdFormatBold, MdFormatListBulleted, MdOutlineImage } from "react-icons/md";

import { GoItalic } from "react-icons/go";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import ImageChoosing from "./imageUpload";
import { useState } from "react";
interface prop {
  editor: Editor | null;
}
interface MenubarItems1 {
  id: number;
  type: "multiple";
  comp: React.ReactNode;
}
interface MenubarItems2 {
  id: number;
  type: "single";
  icon: React.ReactNode;
  command?: () => void;
}
type MenuItem = MenubarItems1 | MenubarItems2;
export default function MenuBar({ editor }: prop) {
  const [Open, setOpen] = useState<boolean>(false);
  if (!editor) {
    return null;
  }
  const menu: MenuItem[] = [
    {
      id: 1,
      type: "multiple",
      comp: <HeadingComponent editor={editor} key={1} />,
    },
    {
      id: 2,
      type: "single",
      icon: <MdFormatListBulleted key={2} />,
      command: () => {
        editor.chain().focus().toggleBulletList().run();
        console.log("");
      },
    },
    {
      id: 3,
      type: "single",
      icon: <MdFormatBold />,
      command: () => {
        editor.chain().focus().toggleBold().run();
      },
    },
    {
      id: 4,
      type: "single",
      icon: <GoItalic />,
      command: () => {
        editor.chain().focus().toggleItalic().run();
      },
    },
    {
      id: 5,
      type: "single",
      icon: <FaListOl />,
      command: () => {
        editor.chain().focus().toggleOrderedList().run();
      },
    },
    {
      id: 6,
      type: "single",
      icon: <FaQuestion />,
      command: () => {
        editor.chain().focus().insertFaqSingleItem().run(); 
      },
    },
    {
      id: 7,
      type: "single",
      icon: <MdOutlineImage />,
      command: () => {
        setOpen(!Open)
      },
    },
  ];
  
  return (
    <div className="menubar w-full h-[34px] bg-gray-100 rounded-xl mb-4">
      <div className=" flex items-center px-4 h-full w-max gap-4">
        {menu.map((item) => {
          if (item.type == "multiple") {
            return item.comp;
          }
          return (
            <Button
              onClick={item.command}
              className="size-6 p-0 bg-white [&>svg]:fill-black [&>svg]:hover:fill-white "
              key={item.id}
            >
              {item.icon}
            </Button>
          );
        })}
        <ImageChoosing editor={editor} Value={Open}setValue={setOpen}/>
      </div>
    </div>
  );
}

const HeadingComponent = ({ editor }: { editor: Editor }) => {
  const headings = [
    {
      id: 1,
      icon: <LuHeading1 />,
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      id: 2,
      icon: <LuHeading2 />,
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      id: 3,
      icon: <LuHeading3 />,
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      id: 4,
      icon: <LuHeading4 />,
      command: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
    },
    {
      id: 5,
      icon: <LuHeading5 />,
      command: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
    },
    {
      id: 6,
      icon: <LuHeading6 />,
      command: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
    },
  ];
  return (
    <DropdownMenu key={"heading-dropDown"}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="size-6 p-0">
          <LuHeading />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-gray-600 font-thin">
          Heading
        </DropdownMenuLabel>
        <DropdownMenuGroup className="gap-2 flex flex-col ">
          {headings.map((item) => {
            return (
              <Button
                onClick={item.command}
                key={item.id}
                className="w-full p-0"
              >
                {item.icon}
              </Button>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

