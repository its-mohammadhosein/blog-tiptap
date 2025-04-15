import BulletList from "@tiptap/extension-bullet-list";
import Heading from "@tiptap/extension-heading";
import { ListItem } from "@tiptap/extension-list-item";
import { GoDotFill } from "react-icons/go";
// import "@tiptap/core"
import {
  CommandProps,
  Extension,
  mergeAttributes,
  Node,
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
  RawCommands,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import React from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import OrderedList from "@tiptap/extension-ordered-list";
import { ChevronDown, ChevronRight } from "lucide-react";
// Custom Heading
export const CustomHeading = Heading.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CustomHeadingComponent);
  },
});

const CustomHeadingComponent = ({ node, editor, getPos }: NodeViewProps) => {
  const level = node.attrs.level as number;
  const HeadingTag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  // Color mapping for different heading levels
  const colorMap = {
    1: "bg-red-50 text-red-800 border-red-200",
    2: "bg-orange-50 text-orange-800 border-orange-200",
    3: "bg-amber-50 text-amber-800 border-amber-200",
    4: "bg-yellow-50 text-yellow-800 border-yellow-200",
    5: "bg-lime-50 text-lime-800 border-lime-200",
    6: "bg-green-50 text-green-800 border-green-200",
  };

  return (
    <NodeViewWrapper
      as={HeadingTag}
      className={twMerge(
        `border rounded px-2 py-1 my-1 ${
          colorMap[level as keyof typeof colorMap]
        }`
      )}
    >
      <span className="text-xs font-mono font-normal opacity-70 mr-2">
        H{level}
      </span>
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

// Custom Bullet List

export const CustomBulletList = BulletList.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CustomBulletListComponent);
  },
});

const CustomBulletListComponent = ({ node, editor, getPos }: NodeViewProps) => {
  return (
    <NodeViewWrapper
      as="ul"
      className="custom-bullet-list border rounded px-2 py-1 my-1 bg-purple-200"
    >
      <span className="text-xs font-mono font-normal opacity-70 mr-2">
        <em>Bullet List</em>
      </span>
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

// Custom List Item

export const CustomListItem = ListItem.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CustomListItemComponent);
  },
});

const CustomListItemComponent = ({ node, editor, getPos }: NodeViewProps) => {
  const parentNodeType = editor.state.doc.resolve(getPos()).parent.type.name;
  const isBulletList = parentNodeType === "bulletList";
  const isOrderedList = parentNodeType === "orderedList";

  const count = editor.storage.orderedList.count;

  const resolved = editor.state.doc.resolve(getPos());

  const index = resolved.index(); // THIS gives you the correct position (0-based)
  return (
    <NodeViewWrapper
      as="li"
      className="custom-list-item flex gap-2 items-baseline"
    >
      {isBulletList ? (
        <GoDotFill className="flex-shrink-0 fill-amber-500" size={14} />
      ) : isOrderedList ? (
        <Button
          disabled
          className="p-0 bg-amber-50 hover:bg-amber-50 size-6 text-black select-none"
        >
          {index + 1}
        </Button>
      ) : null}

      <NodeViewContent
        data-set={editor.storage.orderedList.count}
        className="flex-1"
      />
    </NodeViewWrapper>
  );
};

// Custom ordered List

const CustomOrderedlistComponent = ({
  node,
  editor,
  getPos,
}: NodeViewProps) => {
  editor.extensionStorage.orderedList.count = node.content.content.length;

  return (
    <NodeViewWrapper
      as="ul"
      className="custom-bullet-list border rounded px-2 py-1 my-1 bg-green-200"
      data-set={`${node.content.content.length}`}
    >
      <span className="text-xs font-mono font-normal opacity-70 mr-2">
        <em>Bullet List</em>
      </span>
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

export const CustomOrderedList = OrderedList.extend({
  addStorage() {
    return {
      count: 0 as number,
    };
  },
  onUpdate() {
    console.log(this.editor.$node);
  },
  addNodeView() {
    return ReactNodeViewRenderer(CustomOrderedlistComponent);
  },
});

// Faq

// declare module "@tiptap/core" {
//   interface Commands<ReturnType> {
//     faqItem: {
//       insertFAQ: () => ReturnType;
//     };
//   }
// }
export const CustomExtension = Extension.create({
  // Your configuration will go here
  name: "faqItem", // Unique identifier
  group: "block", // Belongs to the 'block' group
  content: "paragraph+", // Allows one or more paragraphs inside
  defining: true, // Ensures it's treated as a block

  // Add this to enforce structure (optional but recommended)
  parseHTML() {
    return [{ tag: 'div[data-type="faq-item"]' }];
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, string> }) {
    return ["div", { ...HTMLAttributes, "data-type": "faq-item" }, 0];
  },

  // Commands (fixed)
  addCommands() {
    return {
      insertFAQ:
        () =>
        ({ commands }: { commands: CommandProps["commands"] }) => {
          return commands.insertContent({
            type: this.name,
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Question:" }],
              },
              {
                type: "paragraph",
                content: [{ type: "text", text: "Answer:" }],
              },
            ],
          });
        },
    } as unknown as Record<string, any>; // Type assertion for Tiptap compatibility
  },
});
