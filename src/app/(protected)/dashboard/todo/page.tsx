import DashboardHeader from "@/components/Dashboard/dashboard-header";
import TodoForm from "@/components/ToDos/TodoForm";
import TodoList from "@/components/ToDos/TodoList";

const TodoPage = () => {
  return (
    <div>
      <DashboardHeader title="Todo" />

      <TodoList />

      <TodoForm />
    </div>
  );
};

export default TodoPage;
