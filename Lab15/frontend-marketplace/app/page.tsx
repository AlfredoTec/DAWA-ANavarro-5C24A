import Link from "next/link";
import Image from "next/image";
import type { Product, Category } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

async function getProducts(categoryId?: string): Promise<Product[]> {
  const url = categoryId
    ? `${API_URL}/products?categoryId=${categoryId}`
    : `${API_URL}/products`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(categoria),
    getCategories(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black mb-2">
          <span className="bg-[#C7F33C] px-3 py-1">Marketplace</span>
        </h1>
        <p className="text-gray-600 text-lg">Descubre productos increibles</p>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Link
            href="/"
            className={`px-4 py-2 rounded-full font-semibold border-2 border-black transition-colors text-sm ${
              !categoria
                ? "bg-[#C7F33C] text-black"
                : "bg-white hover:bg-[#E1F2AE]"
            }`}
          >
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/?categoria=${cat.id}`}
              className={`px-4 py-2 rounded-full font-semibold border-2 border-black transition-colors text-sm ${
                categoria === String(cat.id)
                  ? "bg-[#C7F33C] text-black"
                  : "bg-white hover:bg-[#E1F2AE]"
              }`}
            >
              {cat.nombre}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group block border-2 border-black rounded-2xl overflow-hidden hover:shadow-[4px_4px_0px_#C7F33C] transition-all bg-white"
          >
            {product.imageUrl && (
              <div className="relative h-48 bg-[#E1F2AE]/30 flex items-center justify-center overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.nombre}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                {product.Category && (
                  <span className="text-xs bg-[#E1F2AE] px-2 py-0.5 rounded-full font-semibold">
                    {product.Category.nombre}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold mb-1 group-hover:text-[#C7F33C] transition-colors">
                {product.nombre}
              </h2>
              <p className="text-2xl font-black text-black mb-2">
                S/ {Number(product.precio).toFixed(2)}
              </p>
              <p className="text-gray-600 text-sm line-clamp-2">
                {product.descripcion}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-6xl mb-4">📦</p>
          <p className="text-xl text-gray-500 font-semibold">
            No hay productos en esta categoria
          </p>
        </div>
      )}
    </div>
  );
}
