import { adminGetCategories, adminGetProducts } from "@/lib/admin-data";
import { ProductsManager } from "@/components/admin/products-manager";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([adminGetProducts(), adminGetCategories()]);
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Товары</h1>
      <p className="mt-1 text-ink-muted">Добавляйте, редактируйте и скрывайте товары. Отмечайте новинки и хиты.</p>
      <div className="mt-6">
        <ProductsManager initialProducts={products} categories={categories} />
      </div>
    </div>
  );
}
