import { extractMentionsFromJSON, getContentPreview } from "@/helpers/note";
import type { JSONContent } from "@tiptap/core";

describe("note helpers", () => {
  describe("extractMentionsFromJSON", () => {
    it("should return an empty array if the document is empty", () => {
      const doc: JSONContent = {};
      expect(extractMentionsFromJSON(doc)).toEqual([]);
    });

    it("should return an empty array if there are no mentions", () => {
      const doc: JSONContent = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Hello world" }],
          },
        ],
      };
      expect(extractMentionsFromJSON(doc)).toEqual([]);
    });

    it("should extract a single mention", () => {
      const doc: JSONContent = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: "Check this " },
              {
                type: "mention",
                attrs: { id: "123", label: "My Habit", type: "habit" },
              },
            ],
          },
        ],
      };
      expect(extractMentionsFromJSON(doc)).toEqual([
        { entityType: "habit", entityId: "123" },
      ]);
    });

    it("should deduplicate mentions", () => {
      const doc: JSONContent = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "mention",
                attrs: { id: "123", label: "My Habit", type: "habit" },
              },
              { type: "text", text: " and again " },
              {
                type: "mention",
                attrs: { id: "123", label: "My Habit", type: "habit" },
              },
            ],
          },
        ],
      };
      const result = extractMentionsFromJSON(doc);
      expect(result).toHaveLength(1);
      expect(result).toEqual([{ entityType: "habit", entityId: "123" }]);
    });

    it("should extract multiple different mentions", () => {
      const doc: JSONContent = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "mention",
                attrs: { id: "1", label: "H1", type: "habit" },
              },
              {
                type: "mention",
                attrs: { id: "2", label: "T1", type: "task" },
              },
            ],
          },
        ],
      };
      expect(extractMentionsFromJSON(doc)).toEqual([
        { entityType: "habit", entityId: "1" },
        { entityType: "task", entityId: "2" },
      ]);
    });

    it("should extract nested mentions", () => {
      const doc: JSONContent = {
        type: "doc",
        content: [
          {
            type: "blockquote",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "mention",
                    attrs: { id: "nested", label: "Nested", type: "project" },
                  },
                ],
              },
            ],
          },
        ],
      };
      expect(extractMentionsFromJSON(doc)).toEqual([
        { entityType: "project", entityId: "nested" },
      ]);
    });

    it("should handle missing type attribute by defaulting to todo", () => {
      const doc: JSONContent = {
        type: "doc",
        content: [
          {
            type: "mention",
            attrs: { id: "999", label: "Unknown" },
          },
        ],
      };
      expect(extractMentionsFromJSON(doc)).toEqual([
        { entityType: "todo", entityId: "999" },
      ]);
    });

    it("should ignore mentions missing an id attribute", () => {
      const doc: JSONContent = {
        type: "doc",
        content: [
          {
            type: "mention",
            attrs: { label: "No ID", type: "habit" },
          },
        ],
      };
      expect(extractMentionsFromJSON(doc)).toEqual([]);
    });

    it("should handle deduplication for same ID but different entityType", () => {
      const doc: JSONContent = {
        type: "doc",
        content: [
          {
            type: "mention",
            attrs: { id: "1", label: "Habit", type: "habit" },
          },
          {
            type: "mention",
            attrs: { id: "1", label: "Task", type: "task" },
          },
        ],
      };
      expect(extractMentionsFromJSON(doc)).toEqual([
        { entityType: "habit", entityId: "1" },
        { entityType: "task", entityId: "1" },
      ]);
    });

    it("should handle empty content arrays gracefully", () => {
      const doc: JSONContent = {
        type: "doc",
        content: [],
      };
      expect(extractMentionsFromJSON(doc)).toEqual([]);
    });
  });

  describe("getContentPreview", () => {
    it("should return an empty string for null, undefined, or empty input", () => {
      expect(getContentPreview(null)).toBe("");
      expect(getContentPreview(undefined)).toBe("");
      expect(getContentPreview("")).toBe("");
    });

    it("should return the original string if it is within maxLength", () => {
      const text = "Short note";
      expect(getContentPreview(text)).toBe(text);
    });

    it("should truncate string if it exceeds maxLength", () => {
      const text = "This is a very long note that should be truncated because it exceeds the limit.";
      const maxLength = 10;
      expect(getContentPreview(text, maxLength)).toBe("This is a ");
    });

    it("should extract text from JSONContent", () => {
      const doc: JSONContent = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Hello" }, { type: "text", text: "world" }],
          },
        ],
      };
      expect(getContentPreview(doc)).toBe("Hello world");
    });

    it("should include mention labels in the preview", () => {
      const doc: JSONContent = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: "Call" },
              { type: "mention", attrs: { label: "John" } },
            ],
          },
        ],
      };
      expect(getContentPreview(doc)).toBe("Call @John");
    });

    it("should handle mentions without labels by ignoring them", () => {
      const doc: JSONContent = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: "Hello" },
              { type: "mention", attrs: { id: "123" } }, // Missing label
              { type: "mention" }, // Missing attrs entirely
            ],
          },
        ],
      };
      expect(getContentPreview(doc)).toBe("Hello");
    });

    it("should truncate JSONContent text with ellipsis if it exceeds maxLength", () => {
      const doc: JSONContent = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "A very long text that goes on and on" }],
          },
        ],
      };
      const maxLength = 10;
      expect(getContentPreview(doc, maxLength)).toBe("A very lon...");
    });

    it("should handle nested JSONContent structures", () => {
      const doc: JSONContent = {
        type: "doc",
        content: [
          {
            type: "blockquote",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Inside blockquote" }],
              },
            ],
          },
        ],
      };
      expect(getContentPreview(doc)).toBe("Inside blockquote");
    });

    it("should handle text nodes with no text property", () => {
      const doc: JSONContent = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text" }], // Missing text property
          },
        ],
      };
      expect(getContentPreview(doc)).toBe("");
    });

    it("should return original string without ellipsis if exactly maxLength", () => {
      const text = "1234567890";
      expect(getContentPreview(text, 10)).toBe(text);
    });

    it("should return exact text without ellipsis if JSON content length is exactly maxLength", () => {
      const doc: JSONContent = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "1234567890" }],
          },
        ],
      };
      expect(getContentPreview(doc, 10)).toBe("1234567890");
    });
  });
});
