import TodoForm from "@/components/ToDos/TodoForm";
import TodoList from "@/components/ToDos/TodoList";
import DashboardHeader from "@/layouts/sidebar/dashboard-header";

const TodoPage = () => {
  return (
    <div>
      <DashboardHeader title="Todo" DialogComponent={<TodoForm />} />

      <TodoList />
    </div>
  );
};

export default TodoPage;
