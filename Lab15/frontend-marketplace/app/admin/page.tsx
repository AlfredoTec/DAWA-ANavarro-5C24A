"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import type { Product, Category } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function AdminPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    imageUrl: "",
    categoryId: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!token) return;
    let ignore = false;
    fetch(`${API_URL}/categories`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!ignore) setCategories(data);
      });
    return () => {
      ignore = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let ignore = false;
    fetch(`${API_URL}/products`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!ignore) setProducts(data);
      });
    return () => {
      ignore = true;
    };
  }, [token]);

  const resetForm = () => {
    setForm({ nombre: "", precio: "", descripcion: "", imageUrl: "", categoryId: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const body: Record<string, unknown> = {
      nombre: form.nombre,
      precio: parseFloat(form.precio),
      descripcion: form.descripcion,
      imageUrl: form.imageUrl || null,
      categoryId: form.categoryId ? parseInt(form.categoryId) : null,
    };

    const url = editingId
      ? `${API_URL}/products/${editingId}`
      : `${API_URL}/products`;
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      resetForm();
      const data = await fetch(`${API_URL}/products`).then((r) => r.json());
      setProducts(data);
    }
    setLoading(false);
  };

  const handleEdit = (product: Product) => {
    setForm({
      nombre: product.nombre,
      precio: String(product.precio),
      descripcion: product.descripcion,
      imageUrl: product.imageUrl || "",
      categoryId: product.categoryId ? String(product.categoryId) : "",
    });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Eliminar este producto?")) return;
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-xl font-semibold">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black">
          <span className="bg-[#C7F33C] px-3 py-1">Admin</span> Productos
        </h1>
        <p className="text-gray-600 mt-2">Gestiona tu catalogo</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-2 border-black rounded-2xl p-6 mb-8 bg-white max-w-xl mx-auto"
      >
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nombre</label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full border-2 border-black rounded-xl px-3 py-2 focus:outline-none focus:border-[#C7F33C] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Precio</label>
            <input
              type="number"
              step="0.01"
              required
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              className="w-full border-2 border-black rounded-xl px-3 py-2 focus:outline-none focus:border-[#C7F33C] transition-colors"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Descripcion</label>
          <textarea
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            rows={3}
            className="w-full border-2 border-black rounded-xl px-3 py-2 focus:outline-none focus:border-[#C7F33C] transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1">URL Imagen</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full border-2 border-black rounded-xl px-3 py-2 focus:outline-none focus:border-[#C7F33C] transition-colors"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Categoria</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full border-2 border-black rounded-xl px-3 py-2 focus:outline-none focus:border-[#C7F33C] transition-colors bg-white"
            >
              <option value="">Sin categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#C7F33C] text-black font-bold px-6 py-2.5 rounded-xl hover:bg-[#E1F2AE] transition-colors disabled:opacity-50 border-2 border-black"
          >
            {loading ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-black text-white font-bold px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors border-2 border-black"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto border-2 border-black rounded-2xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black text-white">
              <th className="px-4 py-3 text-left font-semibold">ID</th>
              <th className="px-4 py-3 text-left font-semibold">Imagen</th>
              <th className="px-4 py-3 text-left font-semibold">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold">Precio</th>
              <th className="px-4 py-3 text-left font-semibold">Categoria</th>
              <th className="px-4 py-3 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t border-black hover:bg-[#E1F2AE]/30 transition-colors"
              >
                <td className="px-4 py-3 font-mono">{product.id}</td>
                <td className="px-4 py-3">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt=""
                      width={48}
                      height={48}
                      className="object-cover rounded-lg border border-black"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">Sin imagen</span>
                  )}
                </td>
                <td className="px-4 py-3 font-semibold">{product.nombre}</td>
                <td className="px-4 py-3 font-bold">
                  S/ {Number(product.precio).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  {product.Category ? (
                    <span className="bg-[#C7F33C] text-black px-2 py-0.5 rounded-full text-xs font-semibold">
                      {product.Category.nombre}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-[#C7F33C] text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-[#E1F2AE] transition-colors text-sm border border-black"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-black text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center text-gray-500 py-8 font-semibold">
            No hay productos registrados
          </p>
        )}
      </div>
    </div>
  );
}
