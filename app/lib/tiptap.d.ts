import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    reactComponent: {
      insertReactComponent: () => ReturnType;
    };
    faqExtension: {
      insertFaqItem: () => ReturnType;
    };
    faqGroup: {
      insertFaqGroup: () => ReturnType;
    };
    faqSingleItem: {
      insertFaqSingleItem: () => ReturnType;
      deleteFaqSingleItem: () => ReturnType;
    };
  }
}
