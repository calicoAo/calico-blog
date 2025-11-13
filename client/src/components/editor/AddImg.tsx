import { Editor } from "@tiptap/react";

// 是否上传图片待定，先实现添加图片的功能

export const addImage = (editor: Editor) => {
  const image = prompt('Enter the URL of the image:');
  if (image) {
    editor.chain().focus().setImage({ src: image }).run();
  }
};