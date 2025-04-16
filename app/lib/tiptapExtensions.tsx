import BulletList from "@tiptap/extension-bullet-list";
import Heading from "@tiptap/extension-heading";
import { ListItem } from "@tiptap/extension-list-item";
import { GoDotFill } from "react-icons/go";
// import "@tiptap/core"
import { Button } from "@/components/ui/button";
import OrderedList from "@tiptap/extension-ordered-list";
import {
  CommandProps,
  Extension,
  mergeAttributes,
  Node,
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { twMerge } from "tailwind-merge";
import {
  EditorState,
  Plugin,
  Selection,
  TextSelection,
  Transaction,
} from "@tiptap/pm/state";
import { keymap } from "@tiptap/pm/keymap";
// import { faqtComp } from "@/components/faqItem";
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
  let parentNodeType = null;
  let index = 0;

  try {
    const resolved = editor.state.doc.resolve(getPos());
    parentNodeType = resolved.parent.type.name;
    index = resolved.index(); // Get the correct position (0-based)
  } catch (error) {
    console.error(
      "Error resolving position in CustomListItemComponent:",
      error
    );
  }

  const isBulletList = parentNodeType === "bulletList";
  const isOrderedList = parentNodeType === "orderedList";

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
        data-set={editor.storage.orderedList?.count || 0}
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
    // console.log(this.editor.$node);
  },
  addNodeView() {
    return ReactNodeViewRenderer(CustomOrderedlistComponent);
  },
});

// Faq

export const FaqQuestion = Node.create({
  name: "faqQuestion",
  group: "block",
  content: "text*",

  parseHTML() {
    return [{ tag: "faq-question" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["faq-question", HTMLAttributes, 0];
  },

  addProseMirrorPlugins() {
    return [
      keymap({
        Enter(state, dispatch) {
          const { $from } = state.selection;
          const parent = $from.node(-1);

          if (!parent || parent.type.name !== "faqSingleItem") return false;

          const faqItemPos = $from.before(-1);
          const faqQuestionNode = parent.child(0);

          if (!faqQuestionNode) return false;

          const targetPos = faqItemPos + faqQuestionNode.nodeSize + 1;

          if (dispatch) {
            const selection = Selection.near(state.doc.resolve(targetPos));
            dispatch(state.tr.setSelection(selection).scrollIntoView());
            return true;
          }

          return false;
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(() => (
      <NodeViewWrapper as="div" className="faq-question">
        <label contentEditable={false}>Question:</label>
        <div className="bg-white/60 p-1 text-black rounded-md mx-2">
          <NodeViewContent />
        </div>
      </NodeViewWrapper>
    ));
  },
});
// FaqAnswer Node Definition
export const FaqAnswer = Node.create({
  name: "faqAnswer",
  group: "block",
  content: "text*",

  parseHTML() {
    return [{ tag: "faq-answer" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["faq-answer", mergeAttributes(HTMLAttributes), 0];
  },

  addProseMirrorPlugins() {
    return [
      keymap({
        // Enter(state, dispatch) {
        //   const { $from } = state.selection;
        //   const parent = $from.node(-1);
        //   if (!parent || parent.type.name !== 'faqSingleItem') return false;
        //   const isAtEnd =
        //     $from.parentOffset === $from.parent.content.size &&
        //     $from.index($from.depth - 1) === parent.childCount - 1;
        //   if (!isAtEnd) return false;
        //   const posAfterFaq = $from.after(-1);
        //   if (dispatch) {
        //     const tr = state.tr.insert(
        //       posAfterFaq,
        //       state.schema.nodes.paragraph.create()
        //     );
        //     const resolvedPos = tr.doc.resolve(posAfterFaq);
        //     const newSelection = TextSelection.near(resolvedPos);
        //     dispatch(tr.setSelection(newSelection).scrollIntoView());
        //   }
        //   return true;
        // },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(() => (
      <NodeViewWrapper className="faq-answer">
        <label contentEditable={false}>Answer:</label>
        <div className="bg-white/60 p-1 text-black rounded-md mx-2">
          <NodeViewContent />
        </div>
      </NodeViewWrapper>
    ));
  },
});
// // FaqSingleItem Node Definition (Wraps both faqQuestion and faqAnswer)
// import { Node } from '@tiptap/core'
// import { ReactNodeViewRenderer } from '@tiptap/react'
// import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
// import { keymap } from 'prosemirror-keymap'
// import { Selection } from '@tiptap/pm/state'

export const FaqSingleItem = Node.create({
  name: "faqSingleItem",
  group: "block",
  content: "faqQuestion faqAnswer",

  parseHTML() {
    return [{ tag: "faq-single-item" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["faq-single-item", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(() => (
      <NodeViewWrapper className="faq-single-item p-2 rounded border-purple-400 bg-blue-800 text-white">
        <NodeViewContent />
      </NodeViewWrapper>
    ));
  },

  addCommands() {
    return {
      insertFaqSingleItem:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: "faqSingleItem",
            content: [
              {
                type: "faqQuestion",
                content: [{ type: "text", text: "Type your question here" }],
              },
              {
                type: "faqAnswer",
                content: [{ type: "text", text: "Type your answer here" }],
              },
            ],
          });
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Alt-f": () => this.editor.commands.insertFaqSingleItem(),
    };
  },

  // addProseMirrorPlugins() {
  //   return [
  //     new Plugin({
  //       props: {
  //         handleKeyDown: (view, event) => {
  //           if (event.key === 'Enter') {
  //             const { $from } = view.state.selection;
  //             if ($from.node(-1)?.type?.name === this.name) {
  //               event.preventDefault();
  //               return true;
  //             }
  //           }
  //           return false;
  //         },
  //       },
  //     }),
  //   ];
  // },
});
