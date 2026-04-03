"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import { StarterKit } from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Underline } from "@tiptap/extension-underline";
import { Mention } from "@tiptap/extension-mention";
import { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Iconify } from "@/components/ui/iconify";
import { Button } from "@/components/ui/Buttons/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSuggestionConfig } from "./mentionSuggestion";
import { MentionNodeView } from "./MentionNodeView";

export interface MentionItem {
  id: string;
  label: string;
  type: "habit" | "task" | "todo" | "project" | "category";
}

interface RichTextEditorProps {
  content?: JSONContent | string;
  onChange?: (json: JSONContent) => void;
  placeholder?: string;
  editable?: boolean;
  enableMentions?: boolean;
  mentionData?: MentionItem[];
  className?: string;
}

const RichTextEditor = ({
  content,
  onChange,
  placeholder = "Start writing...",
  editable = true,
  enableMentions = false,
  mentionData = [],
  className,
}: RichTextEditorProps) => {
  const extensions = useMemo(() => {
    const exts: any[] = [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Placeholder.configure({ placeholder }),
      Underline,
    ];

    if (enableMentions) {
      exts.push(
        Mention.configure({
          HTMLAttributes: {
            class: "mention",
          },
          suggestion: getSuggestionConfig(mentionData),
        }).extend({
          addNodeView() {
            return ReactNodeViewRenderer(MentionNodeView, {
              as: "span",
              className: "inline",
            });
          },
        }),
      );
    }

    return exts;
  }, [enableMentions, placeholder, mentionData]);

  const editor = useEditor({
    extensions,
    content: content || "",
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none",
          !editable && "cursor-default opacity-70",
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && content && !editor.isFocused) {
      const currentContent = JSON.stringify(editor.getJSON());
      const newContent = JSON.stringify(
        typeof content === "string"
          ? {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: content }],
                },
              ],
            }
          : content,
      );
      if (currentContent !== newContent) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {editable && (
        <TooltipProvider delayDuration={300}>
          <div className="flex flex-wrap gap-1 rounded-md border border-input bg-background p-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              icon="mdi:format-bold"
              tooltip="Bold"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              icon="solar:text-italic-bold"
              tooltip="Italic"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              icon="solar:text-underline-bold"
              tooltip="Underline"
            />
          </div>
        </TooltipProvider>
      )}
      <EditorContent
        editor={editor}
        className="flex-1 [&>.tiptap]:h-full [&>.tiptap]:min-h-[200px]"
      />
    </div>
  );
};

const ToolbarButton = ({
  onClick,
  isActive,
  icon,
  tooltip,
}: {
  onClick: () => void;
  isActive: boolean;
  icon: string;
  tooltip: string;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        type="button"
        variant={isActive ? "secondary" : "ghost"}
        size="sm"
        onClick={onClick}
        className="h-7 w-7 p-0"
      >
        <Iconify icon={icon} width={16} />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

export default RichTextEditor;
