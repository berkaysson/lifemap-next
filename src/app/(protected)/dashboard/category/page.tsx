import CategoryForm from "@/components/Category/CategoryForm";
import CategoryList from "@/components/Category/CategoryList";
import DashboardHeader from "@/layouts/sidebar/dashboard-header";

const CategoryPage = () => {
  return (
    <div>
      <DashboardHeader title="Category" DialogComponent={<CategoryForm />} />

      <CategoryList />
    </div>
  );
};

export default CategoryPage;
