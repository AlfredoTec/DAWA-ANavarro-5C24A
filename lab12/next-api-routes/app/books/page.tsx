"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, X, Save, Trash2 } from "lucide-react";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

type Author = { id: string; name: string };
type Book = {
  id: string;
  title: string;
  genre?: string;
  publishedYear?: number;
  pages?: number;
  author: { id: string; name: string };
};
type Pagination = { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean };

const btn = {
  blue:  "cursor-pointer inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm",
  green: "cursor-pointer inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm",
  red:   "cursor-pointer inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 active:scale-95 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm",
  gray:  "cursor-pointer inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
  ghost: "cursor-pointer inline-flex items-center gap-1.5 border border-gray-200 bg-white hover:bg-gray-50 active:scale-95 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", isbn: "", publishedYear: "", genre: "", pages: "", authorId: "" });
  const [formError, setFormError] = useState("");

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page), limit: "10", sortBy, order,
      ...(search && { search }),
      ...(genre && { genre }),
      ...(authorFilter && { authorName: authorFilter }),
    });
    const res = await fetch(`/api/books/search?${params}`);
    const data = await res.json();
    setBooks(data.data ?? []);
    setPagination(data.pagination ?? null);
    setLoading(false);
  }, [page, search, genre, authorFilter, sortBy, order]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);
  useEffect(() => { fetch("/api/authors").then((r) => r.json()).then(setAuthors); }, []);
  useEffect(() => { setPage(1); }, [search, genre, authorFilter, sortBy, order]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        publishedYear: form.publishedYear ? parseInt(form.publishedYear) : undefined,
        pages: form.pages ? parseInt(form.pages) : undefined,
      }),
    });
    if (res.ok) {
      setForm({ title: "", description: "", isbn: "", publishedYear: "", genre: "", pages: "", authorId: "" });
      setShowForm(false);
      fetchBooks();
    } else {
      const d = await res.json();
      setFormError(d.error ?? "Error al crear libro");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar libro?")) return;
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    fetchBooks();
  };

  const inputCls = "bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all w-full";

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              <AnimatedGradientText>Catálogo de Libros</AnimatedGradientText>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Búsqueda avanzada con filtros y paginación</p>
          </div>
          <Link href="/" className={btn.ghost}>
            <ArrowLeft size={15} /> Dashboard
          </Link>
        </div>

        {/* Create book */}
        <div className="mb-6">
          <button onClick={() => setShowForm(!showForm)} className={showForm ? btn.gray : btn.green}>
            {showForm ? <><X size={15} /> Cancelar</> : <><Plus size={15} /> Nuevo Libro</>}
          </button>

          {showForm && (
            <form onSubmit={handleCreate} className="mt-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nuevo Libro</h3>
              {formError && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-red-600 text-sm">{formError}</div>}
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Título *" className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <select required className={inputCls} value={form.authorId} onChange={(e) => setForm({ ...form, authorId: e.target.value })}>
                  <option value="">Seleccionar autor *</option>
                  {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                <input placeholder="ISBN" className={inputCls} value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
                <input placeholder="Género" className={inputCls} value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} />
                <input type="number" placeholder="Año publicación" className={inputCls} value={form.publishedYear} onChange={(e) => setForm({ ...form, publishedYear: e.target.value })} />
                <input type="number" placeholder="Páginas" className={inputCls} value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} />
              </div>
              <textarea placeholder="Descripción" className={`${inputCls} resize-none`} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="flex gap-2">
                <button type="submit" className={btn.green}><Save size={15} /> Crear Libro</button>
                <button type="button" onClick={() => setShowForm(false)} className={btn.gray}><X size={15} /> Cancelar</button>
              </div>
            </form>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Filtros</p>
          <input
            placeholder="🔍 Buscar por título..."
            className={`${inputCls} mb-3`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <input placeholder="Género" className={inputCls} value={genre} onChange={(e) => setGenre(e.target.value)} />
            <input placeholder="Nombre del autor" className={inputCls} value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} />
            <select className={inputCls} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="createdAt">Fecha creación</option>
              <option value="title">Título</option>
              <option value="publishedYear">Año</option>
            </select>
            <select className={inputCls} value={order} onChange={(e) => setOrder(e.target.value)}>
              <option value="desc">↓ Descendente</option>
              <option value="asc">↑ Ascendente</option>
            </select>
          </div>
          {pagination && (
            <p className="text-xs text-gray-400 mt-3">
              <span className="text-blue-600 font-semibold">{pagination.total}</span> resultado(s)
            </p>
          )}
        </div>

        {/* Books list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <h2 className="font-semibold text-gray-700">Libros</h2>
          </div>

          {loading ? (
            <div className="p-10 flex justify-center">
              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : books.length === 0 ? (
            <div className="p-14 text-center">
              <p className="text-gray-300 text-3xl mb-2">📭</p>
              <p className="text-gray-400 text-sm">No se encontraron libros.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {books.map((b) => (
                <li key={b.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{b.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="text-blue-500 font-medium">{b.author.name}</span>
                      {b.genre && <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-100">{b.genre}</span>}
                      {b.publishedYear && <span>{b.publishedYear}</span>}
                      {b.pages && <span>{b.pages} págs</span>}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(b.id)} className={btn.red}>
                    <Trash2 size={13} /> Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button disabled={!pagination.hasPrev} onClick={() => setPage((p) => p - 1)} className={btn.ghost + " disabled:opacity-30"}>
              ← Anterior
            </button>
            <span className="text-sm text-gray-500 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button disabled={!pagination.hasNext} onClick={() => setPage((p) => p + 1)} className={btn.ghost + " disabled:opacity-30"}>
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
