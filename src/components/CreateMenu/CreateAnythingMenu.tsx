"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Buttons/button";
import { Iconify } from "@/components/ui/iconify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import CategoryForm from "@/components/Category/CategoryForm";
import TodoForm from "@/components/ToDos/TodoForm";
import TaskForm from "@/components/Tasks/TaskForm";
import HabitForm from "@/components/Habits/HabitForm";
import NoteForm from "@/components/Notes/NoteForm";

export const CreateAnythingMenu = () => {
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openTodo, setOpenTodo] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [openHabit, setOpenHabit] = useState(false);
  const [openNote, setOpenNote] = useState(false);

  return (
    <>
      <CategoryForm isOpen={openCategory} setIsOpen={setOpenCategory} hideTrigger />
      <TodoForm isOpen={openTodo} setIsOpen={setOpenTodo} hideTrigger />
      <TaskForm isOpen={openTask} setIsOpen={setOpenTask} hideTrigger />
      <HabitForm isOpen={openHabit} setIsOpen={setOpenHabit} hideTrigger />
      <NoteForm isOpen={openNote} setIsOpen={setOpenNote} hideTrigger />

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
        <Button className="fixed bottom-6 right-28 sm:bottom-[104px] sm:right-6 group h-16 w-16 sm:w-auto sm:pr-8 sm:pl-3 p-0 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-105 hover:bg-white/[0.08] hover:border-white/20 active:scale-95 z-50 flex items-center justify-center sm:justify-start sm:gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-lg opacity-40 group-hover:opacity-70 group-hover:scale-125 transition-all duration-500" />
              <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-all duration-500">
                <Iconify
                  icon="solar:magic-stick-3-bold-duotone"
                  width={28}
                  className="text-white"
                />
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-400 mb-1">
                Quick Add
              </span>
              <span className="text-base font-bold text-foreground tracking-tight">
                Create New
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-48 mb-2 shadow-xl rounded-xl p-2"
          sideOffset={6}
        >
          <DropdownMenuItem 
            className="my-1 gap-2 cursor-pointer focus:bg-purple-500/20 bg-purple-500/5 py-2 transition-colors"
            onSelect={(e) => { e.preventDefault(); setOpenCategory(true); setOpen(false); }}
          >
            <Iconify
              icon="solar:hashtag-square-bold-duotone"
              width={20}
              className="text-primary"
            />
            <span className="font-semibold text-sm">Activity Type</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="my-1 gap-2 cursor-pointer focus:bg-blue-500/20 bg-blue-500/5 py-2 transition-colors"
            onSelect={(e) => { e.preventDefault(); setOpenTodo(true); setOpen(false); }}
          >
            <Iconify
              icon="solar:checklist-minimalistic-bold-duotone"
              width={20}
              className="text-blue-500"
            />
            <span className="font-semibold text-sm">Todo</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="my-1 gap-2 cursor-pointer focus:bg-amber-500/20 bg-amber-500/5 py-2 transition-colors"
            onSelect={(e) => { e.preventDefault(); setOpenTask(true); setOpen(false); }}
          >
            <Iconify
              icon="solar:check-read-bold-duotone"
              width={20}
              className="text-amber-500"
            />
            <span className="font-semibold text-sm">Task</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="my-1 gap-2 cursor-pointer focus:bg-emerald-500/20 bg-emerald-500/5 py-2 transition-colors"
            onSelect={(e) => { e.preventDefault(); setOpenHabit(true); setOpen(false); }}
          >
            <Iconify
              icon="ph:plant-duotone"
              width={20}
              className="text-emerald-500"
            />
            <span className="font-semibold text-sm">Habit</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="my-1 gap-2 cursor-pointer focus:bg-rose-500/20 bg-rose-500/5 py-2 transition-colors"
            onSelect={(e) => { e.preventDefault(); setOpenNote(true); setOpen(false); }}
          >
            <Iconify
              icon="solar:book-bookmark-bold-duotone"
              width={20}
              className="text-rose-500"
            />
            <span className="font-semibold text-sm">Note</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
