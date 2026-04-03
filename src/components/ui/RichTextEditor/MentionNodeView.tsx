"use client";

import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";

export const MentionNodeView = (props: NodeViewProps) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    props.deleteNode();
  };

  return (
    <NodeViewWrapper as="span" className="inline">
      <span className="relative mention group/mention bg-primary/20 text-primary rounded px-1 py-0.5 font-medium cursor-pointer inline-flex items-center gap-0.5">
        @{props.node.attrs.label}
        {props.editor.isEditable && (
          <button
            type="button"
            className="absolute -right-1 -top-1 align-middle bg-destructive hidden group-hover/mention:inline-flex items-center justify-center w-4 h-4 rounded-full text-destructive-foreground transition-colors text-[10px] leading-none cursor-pointer"
            onClick={handleRemove}
            contentEditable={false}
          >
            ✕
          </button>
        )}
      </span>
    </NodeViewWrapper>
  );
};
