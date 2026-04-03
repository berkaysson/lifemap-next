"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from "react";
import { cn } from "@/lib/utils";
import { Iconify } from "@/components/ui/iconify";
import { MentionItem } from "./RichTextEditor";

export interface MentionSuggestionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface MentionSuggestionListProps {
  items: MentionItem[];
  command: (item: { id: string; label: string; type: string }) => void;
}

const typeIcons: Record<string, string> = {
  habit: "ph:plant-bold",
  task: "solar:check-read-bold",
  todo: "solar:checklist-minimalistic-bold",
  project: "solar:folder-with-files-bold",
  category: "solar:hashtag-square-bold",
};

const typeLabels: Record<string, string> = {
  habit: "Habits",
  task: "Tasks",
  todo: "Todos",
  project: "Projects",
  category: "Activity Types",
};

const MentionSuggestionList = forwardRef<
  MentionSuggestionListRef,
  MentionSuggestionListProps
>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectItem = useCallback(
    (index: number) => {
      const item = props.items[index];
      if (item) {
        props.command({ id: item.id, label: item.label, type: item.type });
      }
    },
    [props],
  );

  const upHandler = useCallback(() => {
    setSelectedIndex(
      (prev) => (prev + props.items.length - 1) % props.items.length,
    );
  }, [props.items.length]);

  const downHandler = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % props.items.length);
  }, [props.items.length]);

  const enterHandler = useCallback(() => {
    selectItem(selectedIndex);
  }, [selectItem, selectedIndex]);

  useEffect(() => setSelectedIndex(0), [props.items]);

  // Scroll the selected item into view when navigating with keyboard
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const selected = container.querySelector(
      `[data-index="${selectedIndex}"]`,
    ) as HTMLElement | null;
    if (selected) {
      selected.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  useImperativeHandle(
    ref,
    () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }),
    [upHandler, downHandler, enterHandler],
  );

  if (props.items.length === 0) {
    return (
      <div className="z-50 rounded-md border bg-popover p-2 text-sm text-muted-foreground shadow-md">
        No results
      </div>
    );
  }

  // Group items by type
  const grouped: Record<string, MentionItem[]> = {};
  for (const item of props.items) {
    if (!grouped[item.type]) {
      grouped[item.type] = [];
    }
    grouped[item.type].push(item);
  }

  // Build a flat list for correct index mapping
  const flatItems: { item: MentionItem; globalIndex: number }[] = [];
  let idx = 0;
  for (const type of Object.keys(grouped)) {
    for (const item of grouped[type]) {
      flatItems.push({ item, globalIndex: idx });
      idx++;
    }
  }

  let globalIndex = 0;

  return (
    <div
      ref={containerRef}
      onWheel={(e) => e.stopPropagation()}
      className="z-50 max-h-[300px] w-[240px] overflow-y-auto rounded-md border shadow-md bg-background"
    >
      {Object.entries(grouped).map(([type, items]) => (
        <div key={type}>
          <div className="px-2 py-1.5 text-xs font-semibold text-background uppercase tracking-wide flex items-center gap-1.5 bg-secondary">
            <Iconify icon={typeIcons[type] || "solar:star-bold"} width={14} />
            {typeLabels[type] || type}
          </div>
          {items.map((item) => {
            const currentIndex = globalIndex++;
            return (
              <button
                data-index={currentIndex}
                key={item.id}
                type="button"
                className={cn(
                  "flex w-full text-foreground items-center gap-2 px-2 py-1.5 text-sm text-left transition-colors hover:bg-accent",
                  currentIndex === selectedIndex && "bg-accent",
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  selectItem(currentIndex);
                }}
                onMouseEnter={() => setSelectedIndex(currentIndex)}
              >
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
});

MentionSuggestionList.displayName = "MentionSuggestionList";

export default MentionSuggestionList;
