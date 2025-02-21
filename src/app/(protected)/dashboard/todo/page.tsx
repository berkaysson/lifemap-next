import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import TodoList from "@/components/ToDos/TodoList";
import { Suspense, lazy } from "react";
import Loading from "./loading";

const TodoForm = lazy(() => import("@/components/ToDos/TodoForm"));

const TodoPage = () => {
  return (
    <div>
      <DashboardHeader title="Todo" DialogComponent={<TodoForm />} />
      <Suspense fallback={<Loading />}>
        <TodoList />
      </Suspense>
    </div>
  );
};

export default TodoPage;
