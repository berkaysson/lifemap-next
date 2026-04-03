import type { JSONContent } from "@tiptap/core";

export interface MentionRef {
  entityType: "habit" | "task" | "todo" | "project" | "category";
  entityId: string;
}

/**
 * Walk a TipTap JSON document tree and extract all mention nodes.
 * Returns a deduplicated array of { entityType, entityId }.
 */
export function extractMentionsFromJSON(doc: JSONContent): MentionRef[] {
  const mentions: MentionRef[] = [];
  const seen = new Set<string>();

  function walk(node: JSONContent) {
    if (node.type === "mention" && node.attrs) {
      const key = `${node.attrs.type || "unknown"}:${node.attrs.id}`;
      if (!seen.has(key) && node.attrs.id) {
        seen.add(key);
        mentions.push({
          entityType: node.attrs.type || "todo",
          entityId: node.attrs.id,
        });
      }
    }
    if (node.content) {
      for (const child of node.content) {
        walk(child);
      }
    }
  }

  walk(doc);
  return mentions;
}

/**
 * Extract a plain-text preview from TipTap JSON content.
 */
export function getContentPreview(
  content: JSONContent | string | null | undefined,
  maxLength = 120,
): string {
  if (!content) return "";
  if (typeof content === "string") return content.slice(0, maxLength);

  const parts: string[] = [];

  function walk(node: JSONContent) {
    if (node.type === "text" && node.text) {
      parts.push(node.text);
    }
    if (node.type === "mention" && node.attrs?.label) {
      parts.push(`@${node.attrs.label}`);
    }
    if (node.content) {
      for (const child of node.content) {
        walk(child);
      }
    }
  }

  walk(content);
  const text = parts.join(" ");
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}
