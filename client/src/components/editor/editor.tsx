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
import "./styles/basic.scss";
import { useEffect } from "react";

const extensions = [
  TextStyleKit,
  StarterKit,
  TableCell,
  TableKit,
  Highlight,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Highlight,
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
  const editor = useEditor({
    extensions,
    content: content || "",
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
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }
  return (
    <div className="tiptap-editor-wrapper">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
