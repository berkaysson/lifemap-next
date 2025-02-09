import TodoForm from "@/components/ToDos/TodoForm";
import TodoList from "@/components/ToDos/TodoList";
import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import { Suspense } from "react";
import Loading from "./loading";

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
