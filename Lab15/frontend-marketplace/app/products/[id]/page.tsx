import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-black font-semibold hover:text-[#C7F33C] transition-colors mb-8"
      >
        <span className="text-xl">&larr;</span> Volver a productos
      </Link>

      <div className="border-2 border-black rounded-2xl overflow-hidden bg-white">
        <div className="grid md:grid-cols-2">
          <div className="bg-[#E1F2AE]/30 flex items-center justify-center p-8 min-h-[300px]">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.nombre}
                width={400}
                height={320}
                className="object-contain rounded-xl"
                style={{ maxHeight: "320px", width: "auto" }}
              />
            ) : (
              <div className="text-8xl">📦</div>
            )}
          </div>

          <div className="p-8 flex flex-col justify-center">
            {product.Category && (
              <span className="inline-block bg-[#C7F33C] text-black px-3 py-1 rounded-full font-semibold text-sm mb-3 w-fit">
                {product.Category.nombre}
              </span>
            )}
            <h1 className="text-3xl font-black mb-2">{product.nombre}</h1>
            <p className="text-4xl font-black mb-6">
              <span className="bg-[#C7F33C] px-3 py-1">S/ {Number(product.precio).toFixed(2)}</span>
            </p>
            <div className="border-t-2 border-black pt-6">
              <h2 className="text-lg font-bold mb-2">Descripcion</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.descripcion}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
