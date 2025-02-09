import CategoryForm from "@/components/Category/CategoryForm";
import CategoryList from "@/components/Category/CategoryList";
import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import Loading from "./loading";
import { Suspense } from "react";

const CategoryPage = () => {
  return (
    <div>
      <DashboardHeader title="Category" DialogComponent={<CategoryForm />} />

      <Suspense fallback={<Loading />}>
        <CategoryList />
      </Suspense>
    </div>
  );
};

export default CategoryPage;
