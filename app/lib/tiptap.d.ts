import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    // faqItem: {
    //   insertFAQ: () => ReturnType;
    // };
    reactComponent: {
      insertReactComponent: () => ReturnType;
    };
    faqExtension: {
      insertFaqItem: () => ReturnType;
    };
    faqGroup:{
        insertFaqGroup:()=>ReturnType
    }
    faqSingleItem:{
        insertFaqSingleItem:()=>ReturnType
    }
  }
}
