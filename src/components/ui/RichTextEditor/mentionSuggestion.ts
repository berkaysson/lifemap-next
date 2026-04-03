import { ReactRenderer } from "@tiptap/react";
import MentionSuggestionList, {
  MentionSuggestionListRef,
} from "./MentionSuggestionList";
import { MentionItem } from "./RichTextEditor";

export function getSuggestionConfig(mentionData: MentionItem[]) {
  return {
    items: ({ query }: { query: string }) => {
      return mentionData
        .filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 10);
    },

    render: () => {
      let component: ReactRenderer<MentionSuggestionListRef> | null = null;
      let wrapper: HTMLDivElement | null = null;

      return {
        onStart: (props: any) => {
          component = new ReactRenderer(MentionSuggestionList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          wrapper = document.createElement("div");
          wrapper.style.position = "fixed";
          wrapper.style.zIndex = "9999";
          wrapper.style.pointerEvents = "auto";
          wrapper.appendChild(component.element);
          document.body.appendChild(wrapper);

          updatePosition(wrapper, props.clientRect);
        },

        onUpdate(props: any) {
          component?.updateProps(props);

          if (!props.clientRect || !wrapper) {
            return;
          }

          updatePosition(wrapper, props.clientRect);
        },

        onKeyDown(props: any) {
          if (props.event.key === "Escape") {
            if (wrapper) {
              wrapper.style.display = "none";
            }
            return true;
          }

          return component?.ref?.onKeyDown(props) ?? false;
        },

        onExit() {
          if (wrapper && wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper);
          }
          component?.destroy();
          wrapper = null;
        },
      };
    },
  };
}

function updatePosition(
  wrapper: HTMLDivElement,
  clientRect: () => DOMRect | null,
) {
  const rect = clientRect();
  if (!rect) return;

  const top = rect.bottom;
  const left = rect.left;

  // Check if dropdown would go below viewport
  const viewportHeight = window.innerHeight;
  const dropdownHeight = 300; // max-height from MentionSuggestionList

  if (top + dropdownHeight > viewportHeight) {
    wrapper.style.top = `${rect.top - dropdownHeight}px`;
  } else {
    wrapper.style.top = `${top}px`;
  }

  wrapper.style.left = `${left}px`;
}
