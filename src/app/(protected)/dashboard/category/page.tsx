import CategoryForm from "@/components/Category/CategoryForm";
import CategoryList from "@/components/Category/CategoryList";
import DashboardHeader from "@/components/Dashboard/dashboard-header";

const CategoryPage = () => {
  return (
    <div>
      <DashboardHeader title="Category" />

      <CategoryList />

      <CategoryForm />
    </div>
  );
};

export default CategoryPage;
