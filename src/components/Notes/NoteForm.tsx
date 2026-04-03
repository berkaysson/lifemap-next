"use client";

import { useForm } from "react-hook-form";
import { Input } from "../ui/Forms/input";
import { NoteSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition, useCallback } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Forms/form";
import { useCreateNote } from "@/queries/noteQueries";
import { LoadingButton } from "../ui/Buttons/loading-button";
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
import { ColorPicker } from "../ui/Forms/color-picker-field";
import { RichTextEditor } from "../ui/RichTextEditor";
import { useMentionData } from "@/hooks/use-mention-data";
import type { JSONContent } from "@tiptap/core";
import { extractMentionsFromJSON } from "@/helpers/note";

const NoteForm = ({ useArea = "entity" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync: createNote } = useCreateNote();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const mentionData = useMentionData();
  const [editorContent, setEditorContent] = useState<JSONContent | undefined>(
    undefined,
  );

  const form = useForm<z.infer<typeof NoteSchema>>({
    resolver: zodResolver(NoteSchema),
    defaultValues: {
      title: "",
      content: undefined,
      colorCode: "#714DD9",
      pinned: false,
      mentions: [],
    },
  });

  const { reset } = form;

  const handleEditorChange = useCallback(
    (json: JSONContent) => {
      setEditorContent(json);
      form.setValue("content", json);
      const mentions = extractMentionsFromJSON(json);
      form.setValue("mentions", mentions);
    },
    [form],
  );

  const onSubmit = (data: z.infer<typeof NoteSchema>) => {
    startTransition(async () => {
      try {
        const response = await createNote(data);
        if (response.message) {
          setMessage(response.message);
          if (response.success) {
            setIsError(false);
            reset();
            setEditorContent(undefined);
            setIsOpen(false);
          } else {
            setIsError(true);
          }
        }
      } catch (error: any) {
        setMessage("An error occurred");
        setIsError(true);
        console.log(error);
      }
    });
  };

  const handleOpenChange = (newIsOpen: boolean) => {
    if (newIsOpen) {
      setMessage("");
      setIsError(false);
    }
    setIsOpen(newIsOpen);
  };

  return (
    <Drawer
      handleOnly={true}
      direction="right"
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <DrawerTrigger asChild>
        {useArea === "entity" ? (
          <Button variant="ghost" size="sm">
            <Iconify
              icon="solar:add-square-linear"
              width={32}
              className="mr-0 sm:mr-1"
            />
            <span className="sm:inline hidden">Create Note</span>
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <Iconify
              icon="solar:document-text-linear"
              width={24}
              className="mr-0 sm:mr-1"
            />
            <span>Create Note</span>
          </Button>
        )}
      </DrawerTrigger>
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
              Create a Note
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              Write your thoughts and mention entities with @
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pt-0 flex-1 overflow-y-auto">
            <Form {...form}>
              <form
                className="flex flex-col gap-6 h-full"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          maxLength={100}
                          disabled={isPending}
                          {...field}
                          placeholder="Your note title"
                          type="text"
                        />
                      </FormControl>
                      {form.formState.errors.title && (
                        <FormMessage>
                          {form.formState.errors.title.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <FormItem className="flex-1 flex flex-col">
                  <FormLabel>Content</FormLabel>
                  <RichTextEditor
                    content={editorContent}
                    onChange={handleEditorChange}
                    placeholder="Start writing... Use @ to mention entities"
                    enableMentions
                    mentionData={mentionData}
                    editable={!isPending}
                    className="flex-1 [&_.tiptap]:min-h-full"
                  />
                </FormItem>
                <FormField
                  control={form.control}
                  name="colorCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pick a Color</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value || "#714DD9"}
                          onChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {message && isError && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
                    {message}
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-3">
                  <LoadingButton
                    isLoading={isPending}
                    loadingText="Creating..."
                    disabled={isPending}
                    variant="default"
                    type="submit"
                    className="w-full"
                  >
                    Create
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
              </form>
            </Form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NoteForm;
