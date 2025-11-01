import { EditorState } from '@tiptap/pm/state';
import { EditorView } from '@tiptap/pm/view';
import {
  BubbleMenu,
  Editor,
  isTextSelection,
  useEditorState
} from '@tiptap/react';
import CodeBlock from '@tiptap/extension-code-block';
import Table from '@tiptap/extension-table';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { ToggleButton } from './toggle-button';
import { Icon } from './icon';
import { MemoContentTypePicker } from './content-type-picker';
import { Divider } from './divider';
import { useCallback, useRef, useState } from 'react';
import { MemoAlignPicker } from './align-picker';
import { MemoColorPicker } from './color-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { uploadToOss } from '@/lib/oss';

export const TextMenu = ({ editor }: { editor: Editor }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const imageUrl = await uploadToOss(file);
        console.log(imageUrl);
        editor.chain().focus().setImage({ src: imageUrl.url }).run();
      } catch (err) {
        alert('图片上传失败');
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = '';
      }
    },
    [editor]
  );

  const states: {
    currentColor: string;
    currentHighlight: string;
    isBold: boolean;
    isItalic: boolean;
    isStrike: boolean;
    isUnderline: boolean;
    isCode: boolean;
    isCodeBlock: boolean;
  } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        currentColor: ctx.editor.getAttributes('textStyle')?.color || '#000000',
        currentHighlight:
          ctx.editor.getAttributes('highlight')?.color || undefined,
        isBold: ctx.editor.isActive('bold'),
        isItalic: ctx.editor.isActive('italic'),
        isStrike: ctx.editor.isActive('strike'),
        isUnderline: ctx.editor.isActive('underline'),
        isCode: ctx.editor.isActive('code'),
        isCodeBlock: ctx.editor.isActive('codeBlock'),
        isSuperscript: ctx.editor.isActive('superscript'),
        isSubscript: ctx.editor.isActive('subscript')
      };
    }
  });

  const shouldShow = useCallback(
    (props: {
      editor: Editor;
      view: EditorView;
      state: EditorState;
      oldState?: EditorState;
      from: number;
      to: number;
    }) => {
      const { view } = props;

      // 把不需要展示文字浮窗菜单的节点类型过滤掉
      if (
        [CodeBlock.name, Table.name, HorizontalRule.name].some((name) =>
          editor.isActive(name)
        )
      ) {
        return false;
      }

      if (!view || editor.view.dragging) {
        return false;
      }

      const {
        state: {
          doc,
          selection,
          selection: { empty, from, to }
        }
      } = editor;

      const isEmptyTextBlock =
        !doc.textBetween(from, to).length && isTextSelection(selection);

      if (empty || isEmptyTextBlock || !editor.isEditable) {
        return false;
      }

      return true;
    },
    [editor]
  );

  const onResetColor = useCallback(() => {
    editor.chain().unsetColor().run();
  }, [editor]);

  const onChangeColor = useCallback(
    (color: string) => {
      editor.chain().setColor(color).run();
    },
    [editor]
  );

  const onChangeHighlight = useCallback(
    (color: string) => {
      editor.chain().setHighlight({ color }).run();
    },
    [editor]
  );

  const onResetHighlight = useCallback(() => {
    editor.chain().unsetHighlight().run();
  }, [editor]);

  return (
    <BubbleMenu
      tippyOptions={{
        animation: 'fade',
        placement: 'top',
        popperOptions: {
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
                padding: 8
              }
            },
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['bottom-start', 'top-end', 'bottom-end']
              }
            }
          ]
        },
        maxWidth: 'calc(100vw - 16px)'
      }}
      shouldShow={shouldShow}
      pluginKey='text-menu'
      editor={editor}
      updateDelay={100}
    >
      <div className='flex flex-row items-center gap-1 rounded-md border bg-white p-1 dark:bg-zinc-800'>
        <MemoContentTypePicker editor={editor} />
        <Divider />
        <MemoAlignPicker editor={editor} />
        <Divider />
        <ToggleButton
          onPressedChange={(pressed) => {
            if (pressed) {
              editor.chain().focus().toggleBold().run();
            } else {
              editor.chain().focus().unsetBold().run();
            }
          }}
          pressed={states.isBold}
          tooltip='加粗'
        >
          <Icon name='Bold' />
        </ToggleButton>
        <ToggleButton
          onPressedChange={(pressed) => {
            if (pressed) {
              editor.chain().focus().toggleItalic().run();
            } else {
              editor.chain().focus().unsetItalic().run();
            }
          }}
          pressed={states.isItalic}
          tooltip='斜体'
        >
          <Icon name='Italic' />
        </ToggleButton>
        <ToggleButton
          onPressedChange={(pressed) => {
            if (pressed) {
              editor.chain().focus().toggleStrike().run();
            } else {
              editor.chain().focus().unsetStrike().run();
            }
          }}
          pressed={states.isStrike}
          tooltip='删除线'
        >
          <Icon name='Strikethrough' />
        </ToggleButton>
        <ToggleButton
          onPressedChange={(pressed) => {
            if (pressed) {
              editor.chain().focus().toggleUnderline().run();
            } else {
              editor.chain().focus().unsetUnderline().run();
            }
          }}
          pressed={states.isUnderline}
          tooltip='下划线'
        >
          <Icon name='Underline' />
        </ToggleButton>
        <ToggleButton
          onPressedChange={() => inputRef.current?.click()}
          pressed={false}
          tooltip='上传图片'
          disabled={uploading}
        >
          <Icon name='Upload' />
        </ToggleButton>
        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <Divider />
        <Popover>
          <PopoverTrigger asChild>
            <div>
              <ToggleButton
                pressed={states.currentColor !== '#000000'}
                tooltip='文字颜色'
              >
                <Icon name='Palette' />
              </ToggleButton>
            </div>
          </PopoverTrigger>
          <PopoverContent
            asChild
            align='center'
            sideOffset={8}
            className='w-[200px_+_0.5rem] bg-white p-1 dark:bg-zinc-800'
          >
            <div>
              <MemoColorPicker
                color={states.currentColor}
                onChange={onChangeColor}
                onReset={onResetColor}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <div>
              <ToggleButton
                pressed={states.currentHighlight !== undefined}
                tooltip='文字背景'
              >
                <Icon name='Highlighter' />
              </ToggleButton>
            </div>
          </PopoverTrigger>
          <PopoverContent
            asChild
            align='center'
            sideOffset={8}
            className='w-[200px_+_0.5rem] bg-white p-1 dark:bg-zinc-800'
          >
            <div>
              <MemoColorPicker
                color={states.currentHighlight}
                onChange={onChangeHighlight}
                onReset={onResetHighlight}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </BubbleMenu>
  );
};
