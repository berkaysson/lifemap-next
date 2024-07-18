import { TodoSchema } from "@/schema";
import {
  createToDo,
  deleteToDo,
  getToDos,
  updateToDo,
} from "@/services/todoService";
import { ToDo } from "@prisma/client";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { z } from "zod";

interface TodoContextValue {
  todos: ToDo[];
  fetchTodos: () => Promise<void>;
  onCreateTodo: (
    data: z.infer<typeof TodoSchema>
  ) => Promise<{ message: string }>;
  onUpdateTodo: (data: ToDo) => Promise<void>;
  onDeleteTodo: (id: string) => Promise<void>;
}

const initialTodoContextValue: TodoContextValue = {
  todos: [],
  fetchTodos: async () => {},
  onCreateTodo: async (data: z.infer<typeof TodoSchema>) => {
    return { message: "" };
  },
  onUpdateTodo: async (data: ToDo) => {},
  onDeleteTodo: async (id: string) => {},
};

export const TodoContext = createContext<TodoContextValue>(
  initialTodoContextValue
);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  // Context should be inside of SessionProvider
  const { data: session, status } = useSession();
  const [todos, setTodos] = useState<ToDo[]>([]);

  useEffect(() => {
    if (!session || !session.user || status !== "authenticated") return;
    fetchTodos();
  }, [session, status]);

  const fetchTodos = async () => {
    if (!session || !session.user) return;
    const todos = await getToDos(session.user.id);
    setTodos(todos);
  };

  const onCreateTodo = async (data: z.infer<typeof TodoSchema>) => {
    if (!session || !session.user || !data)
      return { message: "Session or data not exist " };
    if (!session.user.id) return { message: "User not exist" };
    const message = await createToDo(data, session.user.id);
    if (message) {
      await fetchTodos();
      return message;
    }

    return { message: "Failed to create todo, onCreateTodo" };
  };

  const onUpdateTodo = async (data: ToDo) => {
    if (!session || !session.user) return;
    const newTodo = await updateToDo(data);
    if (newTodo) {
      await fetchTodos();
    }
  };

  const onDeleteTodo = async (id: string) => {
    if (!session || !session.user || !id) return;
    try {
      await deleteToDo(id);
      await fetchTodos();
    } catch (error) {
      console.error(`Failed to delete todo with id ${id}: ${error}`);
    }
  };

  const contextValue = useMemo(
    () => ({ todos, fetchTodos, onCreateTodo, onUpdateTodo, onDeleteTodo }),
    [todos, session]
  );

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
};
