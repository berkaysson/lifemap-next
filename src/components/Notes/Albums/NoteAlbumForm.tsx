"use client";

import { useState } from "react";
import { useCreateNoteAlbum, useUpdateNoteAlbum } from "@/queries/noteAlbumQueries";
import { NoteAlbumSchema } from "@/schema";
import { z } from "zod";
import { Input } from "@/components/ui/Forms/input";
import { Label } from "@/components/ui/Forms/label";
import { ColorPicker } from "@/components/ui/Forms/color-picker-field";
import { LoadingButton } from "@/components/ui/Buttons/loading-button";
import { Button } from "@/components/ui/Buttons/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Iconify } from "@/components/ui/iconify";

const EMOJI_OPTIONS = [
  "📁", "📂", "📚", "📖", "📝", "🗂️", "💡", "🎨", "⭐", "🔖",
  "🏷️", "📌", "💼", "🧠", "🎯", "🔥", "✨", "🌟", "💎", "🚀",
];

interface NoteAlbumFormProps {
  /** Provide to pre-set a parent album */
  defaultParentId?: string;
  /** Provide to edit an existing album */
  initialValues?: {
    id: string;
    name: string;
    description?: string | null;
    colorCode?: string | null;
    icon?: string | null;
    parentId?: string | null;
  };
  triggerButton?: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (v: boolean) => void;
}

const NoteAlbumForm = ({
  defaultParentId,
  initialValues,
  triggerButton,
  isOpen: propIsOpen,
  setIsOpen: propSetIsOpen,
}: NoteAlbumFormProps) => {
  const isEditMode = !!initialValues;

  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : isOpenInternal;
  const setIsOpen = propSetIsOpen ?? setIsOpenInternal;

  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [colorCode, setColorCode] = useState(initialValues?.colorCode ?? "#714DD9");
  const [icon, setIcon] = useState(initialValues?.icon ?? "📁");
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: createAlbum, isPending: isCreating } = useCreateNoteAlbum();
  const { mutateAsync: updateAlbum, isPending: isUpdating } = useUpdateNoteAlbum();
  const isPending = isCreating || isUpdating;

  const resetForm = () => {
    if (!isEditMode) {
      setName("");
      setDescription("");
      setColorCode("#714DD9");
      setIcon("📁");
    }
    setError(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      resetForm();
      if (isEditMode && initialValues) {
        setName(initialValues.name);
        setDescription(initialValues.description ?? "");
        setColorCode(initialValues.colorCode ?? "#714DD9");
        setIcon(initialValues.icon ?? "📁");
      }
    }
    setIsOpen(open);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Album name is required");
      return;
    }

    const data: z.infer<typeof NoteAlbumSchema> = {
      name: name.trim(),
      description: description.trim() || undefined,
      colorCode,
      icon,
      parentId: defaultParentId ?? initialValues?.parentId ?? undefined,
    };

    try {
      if (isEditMode) {
        await updateAlbum({ albumId: initialValues!.id, data });
      } else {
        await createAlbum(data);
      }
      setIsOpen(false);
      resetForm();
    } catch {
      setError("An error occurred. Please try again.");
    }
  };

  const content = (
    <DrawerContent className="!left-auto !bottom-auto !h-full !mt-0 fixed inset-y-0 right-0 w-full sm:max-w-[480px] !rounded-none border-l [&>div:first-child]:hidden">
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
            {isEditMode ? "Edit Album" : "New Album"}
          </DrawerTitle>
          <DrawerDescription className="text-muted-foreground">
            {isEditMode
              ? "Update your album settings"
              : "Create a new album to organise your notes"}
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 pt-0 flex-1 overflow-y-auto flex flex-col gap-6">
          {/* Icon picker */}
          <div className="flex flex-col gap-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all border ${
                    icon === emoji
                      ? "border-primary bg-primary/10 scale-110"
                      : "border-border bg-muted/40 hover:bg-muted"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Album"
              maxLength={60}
              disabled={isPending}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Label>Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this album about?"
              maxLength={200}
              disabled={isPending}
            />
          </div>

          {/* Color */}
          <div className="flex flex-col gap-2">
            <Label>Color</Label>
            <ColorPicker value={colorCode} onChange={setColorCode} disabled={isPending} />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 mt-auto pt-4 border-t">
            <LoadingButton
              isLoading={isPending}
              loadingText={isEditMode ? "Saving..." : "Creating..."}
              variant="default"
              onClick={handleSubmit}
              className="w-full"
              disabled={isPending}
            >
              {isEditMode ? "Save Changes" : "Create Album"}
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
  );

  if (triggerButton) {
    return (
      <Drawer handleOnly direction="right" open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer handleOnly direction="right" open={isOpen} onOpenChange={handleOpenChange}>
      {content}
    </Drawer>
  );
};

export default NoteAlbumForm;
