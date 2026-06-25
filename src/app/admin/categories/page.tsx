import { adminGetCategories } from "@/lib/admin-data";
import { CategoriesManager } from "@/components/admin/categories-manager";

export default async function AdminCategoriesPage() {
  const categories = await adminGetCategories();
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Категории</h1>
      <p className="mt-1 text-ink-muted">Добавляйте, скрывайте и меняйте порядок отображения категорий.</p>
      <div className="mt-6">
        <CategoriesManager initial={categories} />
      </div>
    </div>
  );
}
