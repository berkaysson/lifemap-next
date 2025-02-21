import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import CategoryList from "@/components/Category/CategoryList";
import Loading from "./loading";
import { Suspense, lazy } from "react";

const CategoryForm = lazy(() => import("@/components/Category/CategoryForm"));

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
