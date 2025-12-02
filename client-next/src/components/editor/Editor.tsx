'use client'
import { TextStyleKit } from "@tiptap/extension-text-style";
import { TableCell, TableKit } from "@tiptap/extension-table";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import "./styles/styles.scss";
import { useEffect, useState } from "react";

const extensions = [
  TextStyleKit,
  StarterKit,
  TableCell,
  TableKit,
  Highlight,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Image,
  Document,
  Typography,
];

interface EditorComponentProps {
  content: string;
  onChange: (content: string) => void;
  onUpdate?: (content: { html: string; json: unknown; text: string }) => void;
}

export default function EditorComponent({
  content,
  onChange,
  onUpdate,
}: EditorComponentProps) {
  // 使用 lazy initialization 避免在 effect 中同步调用 setState
  // 在服务端为 false，在客户端为 true
  const [mounted] = useState(() => typeof window !== 'undefined');
  
  const editor = useEditor({
    extensions,
    content: content || "",
    immediatelyRender: false, // 禁用立即渲染，避免 SSR hydration 不匹配
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const json = editor.getJSON();
      const text = editor.getText();
      // 调用 onChange（HTML 格式）
      if (onChange) {
        onChange(html);
      }

      // 调用 onUpdate（多种格式）
      if (onUpdate) {
        onUpdate({ html, json, text });
      }
    },
  });
  
  // 同步外部 content 变化
  useEffect(() => {
    if (editor && mounted && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor, mounted]);

  if (!mounted || !editor) {
    return (
      <div className="tiptap-editor-wrapper">
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-500 text-sm">加载编辑器中...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="tiptap-editor-wrapper">
      <MenuBar editor={editor} />
      <div className="tiptap-editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
