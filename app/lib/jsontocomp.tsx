// utils/renderTiptapToJSX.tsx
import React from 'react';
import { JSX } from 'react/jsx-runtime';

type JSONContent = {
  type: string;
  content?: JSONContent[];
  text?: string;
  marks?: { type: string }[];
  attrs?: Record<string, any>;
};

export const renderTiptapToJSX = (node: JSONContent): React.ReactNode => {
  if (!node) return null;

  const renderChildren = (nodes?: JSONContent[]) =>
    nodes?.map((child, i) => <React.Fragment key={i}>{renderTiptapToJSX(child)}</React.Fragment>);

  switch (node.type) {
    case 'doc':
      return <div>{renderChildren(node.content)}</div>;

    case 'paragraph':
      return <p>{renderChildren(node.content)}</p>;

    case 'text': {
      let el: React.ReactNode = node.text || '';

      node.marks?.forEach((mark) => {
        if (mark.type === 'bold') el = <strong>{el}</strong>;
        else if (mark.type === 'italic') el = <em>{el}</em>;
        else if (mark.type === 'underline') el = <u>{el}</u>;
        // add more marks as needed
      });

      return el;
    }

    case 'hardBreak':
      return <br />;

    case 'heading': {
      const level = node.attrs?.level ?? 1;
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      return <Tag>{renderChildren(node.content)}</Tag>;
    }

    case 'faqSingleItem':
      return (
        <div className="my-4 rounded-xl border p-4 bg-gray-50">
          {renderChildren(node.content)}
        </div>
      );

    case 'faqQuestion':
      return (
        <div className="font-semibold text-blue-700 mb-2">
          {renderChildren(node.content)}
        </div>
      );

    case 'faqAnswer':
      return (
        <div className="text-gray-700">
          {renderChildren(node.content)}
        </div>
      );

    default:
      return <div>{renderChildren(node.content)}</div>;
  }
};
