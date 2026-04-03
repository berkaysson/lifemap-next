import { Note } from "@prisma/client";
import { JSX, useEffect, useState, useCallback } from "react";
import { Input } from "../ui/Forms/input";
import { Label } from "../ui/Forms/label";
import { useUpdateNote } from "@/queries/noteQueries";
import { LoadingButton } from "../ui/Buttons/loading-button";
import { ColorPicker } from "../ui/Forms/color-picker-field";
import { RichTextEditor } from "../ui/RichTextEditor";
import { useMentionData } from "@/hooks/use-mention-data";
import type { JSONContent } from "@tiptap/core";
import { extractMentionsFromJSON } from "@/helpers/note";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/Buttons/button";
import { Iconify } from "../ui/iconify";

interface NoteEditFormProps {
  initialValues: Note;
  triggerButton: JSX.Element;
}

const NoteEditForm = ({ initialValues, triggerButton }: NoteEditFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newTitle, setNewTitle] = useState(initialValues.title);
  const [editorContent, setEditorContent] = useState<JSONContent | undefined>(
    initialValues.content as JSONContent | undefined,
  );
  const [colorCode, setColorCode] = useState(
    initialValues.colorCode || "#714DD9",
  );
  const [pinned, setPinned] = useState(initialValues.pinned);
  const [mentions, setMentions] = useState<
    { entityType: string; entityId: string }[]
  >([]);

  const { mutateAsync: updateNote } = useUpdateNote();
  const [isOpen, setIsOpen] = useState(false);
  const mentionData = useMentionData();

  const handleEditorChange = useCallback((json: JSONContent) => {
    setEditorContent(json);
    const extracted = extractMentionsFromJSON(json);
    setMentions(extracted);
  }, []);

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);
    const updatedNote = {
      ...initialValues,
      title: newTitle,
      content: editorContent || undefined,
      colorCode: colorCode,
      pinned: pinned,
      mentions,
    };
    try {
      const response = await updateNote(updatedNote);
      if (response.success) {
        setIsOpen(false);
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      setError("An error occurred while updating the note.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setNewTitle(initialValues.title);
    setEditorContent(initialValues.content as JSONContent | undefined);
    setColorCode(initialValues.colorCode || "#714DD9");
    setPinned(initialValues.pinned);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Drawer
      handleOnly={true}
      direction="right"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent className="!left-auto !bottom-auto !h-full !mt-0 fixed inset-y-0 right-0 w-full sm:max-w-[720px] !rounded-none border-l [&>div:first-child]:hidden">
        <div className="h-full flex flex-col overflow-hidden">
          <DrawerHeader className="text-left mb-2 flex-shrink-0 relative">
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 h-7 w-7 rounded-sm opacity-70 hover:opacity-100"
              >
                <Iconify icon="mdi:close" width={18} />
              </Button>
            </DrawerClose>
            <DrawerTitle className="text-2xl font-bold tracking-tight">
              Edit Note
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              Update your note content and settings
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pt-0 flex-1 flex flex-col gap-4 overflow-y-auto">
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input
                type="text"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                }}
                min={1}
                maxLength={100}
                placeholder="Note title"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Label>Content</Label>
              <RichTextEditor
                content={editorContent}
                onChange={handleEditorChange}
                placeholder="Start writing... Use @ to mention entities"
                enableMentions
                mentionData={mentionData}
                editable={!isLoading}
                className="flex-1 [&_.tiptap]:min-h-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Color</Label>
              <ColorPicker value={colorCode} onChange={setColorCode} />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div className="pt-2 flex flex-col gap-3">
              <LoadingButton
                isLoading={isLoading}
                loadingText="Saving..."
                variant="default"
                size="sm"
                onClick={handleSubmit}
                className="w-full"
              >
                Save
              </LoadingButton>

              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground hover:text-foreground/80 hover:bg-muted"
                >
                  Cancel
                </Button>
              </DrawerClose>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NoteEditForm;
