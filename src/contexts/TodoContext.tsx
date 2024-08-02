import { TodoSchema } from "@/schema";
import {
  createToDo,
  deleteToDo,
  getToDos,
  updateToDo,
} from "@/services/todoService";
import { ServiceResponse } from "@/types/ServiceResponse";
import { ToDo } from "@prisma/client";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { z } from "zod";

interface TodoContextValue {
  todos: ToDo[];
  fetchTodos: () => Promise<ServiceResponse>;
  onCreateTodo: (data: z.infer<typeof TodoSchema>) => Promise<ServiceResponse>;
  onUpdateTodo: (data: ToDo) => Promise<ServiceResponse>;
  onDeleteTodo: (id: string) => Promise<ServiceResponse>;
}

const initialTodoContextValue: TodoContextValue = {
  todos: [],
  fetchTodos: async () => {
    return { message: "", success: false };
  },
  onCreateTodo: async (data: z.infer<typeof TodoSchema>) => {
    return { message: "", success: false };
  },
  onUpdateTodo: async (data: ToDo) => {
    return { message: "", success: false };
  },
  onDeleteTodo: async (id: string) => {
    return { message: "", success: false };
  },
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
    if (!session || !session.user)
      return { message: "Session not exist", success: false };
    const response = await getToDos(session.user.id);
    if (response.success && response.todos) {
      setTodos(response.todos);
    }

    return {
      message: response.message,
      success: response.success,
    };
  };

  const onCreateTodo = async (data: z.infer<typeof TodoSchema>) => {
    if (!session || !session.user || !data)
      return { message: "Session or data not exist", success: false };
    if (!session.user.id) return { message: "User not exist", success: false };
    const response = await createToDo(data, session.user.id);
    if (response) {
      await fetchTodos();
      return response;
    }

    return { message: "Failed to create todo, onCreateTodo", success: false };
  };

  const onUpdateTodo = async (data: ToDo) => {
    if (!session || !session.user)
      return { message: "Session not exist", success: false };
    const response = await updateToDo(data);
    if (response.success) {
      await fetchTodos();
    }

    return response;
  };

  const onDeleteTodo = async (id: string) => {
    if (!session || !session.user || !id)
      return { message: "Session or Todo not exist", success: false };
    try {
      const response = await deleteToDo(id);
      if (response.success) await fetchTodos();

      return response;
    } catch (error) {
      return { message: `${error}`, success: false };
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
