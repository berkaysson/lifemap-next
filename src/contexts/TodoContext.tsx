import {
  createToDo,
  deleteToDo,
  getToDos,
  updateToDo,
} from "@/services/todoService";
import { ToDo } from "@prisma/client";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";

interface TodoContextValue {
  todos: ToDo[];
  fetchTodos: () => Promise<void>;
  onCreateTodo: (data: ToDo) => Promise<void>;
  onUpdateTodo: (data: ToDo) => Promise<void>;
  onDeleteTodo: (id: string) => Promise<void>;
}

const initialTodoContextValue: TodoContextValue = {
  todos: [],
  fetchTodos: async () => {},
  onCreateTodo: async (data: ToDo) => {},
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
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    if (!session || !session.user) return;
    const todos = await getToDos(session.user.id);
    setTodos(todos);
  };

  const onCreateTodo = async (data: ToDo) => {
    if (!session || !session.user) return;
    const newTodo = await createToDo(data);
    if (newTodo) {
      await fetchTodos();
    }
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
