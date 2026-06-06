"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Eye, Pencil, Trash2, Plus, X, Save } from "lucide-react";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { NumberTicker } from "@/components/magicui/number-ticker";

type Author = {
  id: string;
  name: string;
  email: string;
  nationality?: string;
  birthYear?: number;
  bio?: string;
  _count?: { books: number };
};

const btn = {
  blue:  "cursor-pointer inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm",
  amber: "cursor-pointer inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 active:scale-95 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm",
  red:   "cursor-pointer inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 active:scale-95 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm",
  green: "cursor-pointer inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm",
  gray:  "cursor-pointer inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
};

export default function Dashboard() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", nationality: "", birthYear: "", bio: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", bio: "" });
  const [error, setError] = useState("");

  const fetchAuthors = async () => {
    setLoading(true);
    const res = await fetch("/api/authors");
    setAuthors(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchAuthors(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/authors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, birthYear: form.birthYear ? parseInt(form.birthYear) : undefined }),
    });
    if (res.ok) {
      setForm({ name: "", email: "", nationality: "", birthYear: "", bio: "" });
      setShowForm(false);
      fetchAuthors();
    } else {
      const d = await res.json();
      setError(d.error ?? "Error al crear autor");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar autor?")) return;
    await fetch(`/api/authors/${id}`, { method: "DELETE" });
    fetchAuthors();
  };

  const startEdit = (a: Author) => {
    setEditId(a.id);
    setEditForm({ name: a.name, bio: a.bio ?? "" });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/authors/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditId(null);
    fetchAuthors();
  };

  const totalBooks = authors.reduce((s, a) => s + (a._count?.books ?? 0), 0);

  const inputCls = "bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all w-full";

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              <AnimatedGradientText>Sistema de Biblioteca</AnimatedGradientText>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Gestión de autores y colección de libros</p>
          </div>
          <Link href="/books" className={btn.blue + " px-4 py-2 text-sm"}>
            <BookOpen size={15} /> Ver Libros
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Total Autores</p>
            <p className="text-4xl font-bold text-blue-600">
              <NumberTicker value={authors.length} />
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Total Libros</p>
            <p className="text-4xl font-bold text-green-600">
              <NumberTicker value={totalBooks} />
            </p>
          </div>
        </div>

        {/* Create author */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className={showForm ? btn.red : btn.green}
          >
            {showForm ? <><X size={15} /> Cancelar</> : <><Plus size={15} /> Nuevo Autor</>}
          </button>

          {showForm && (
            <form onSubmit={handleCreate} className="mt-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nuevo Autor</h3>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-red-600 text-sm">{error}</div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "name", placeholder: "Nombre *", required: true },
                  { key: "email", placeholder: "Email *", required: true, type: "email" },
                  { key: "nationality", placeholder: "Nacionalidad" },
                  { key: "birthYear", placeholder: "Año de nacimiento", type: "number" },
                ].map(({ key, placeholder, required, type }) => (
                  <input
                    key={key}
                    required={required}
                    type={type ?? "text"}
                    placeholder={placeholder}
                    className={inputCls}
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                ))}
              </div>
              <textarea
                placeholder="Biografía"
                className={`${inputCls} resize-none`}
                rows={2}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
              <div className="flex gap-2">
                <button type="submit" className={btn.green}>
                  <Save size={15} /> Crear Autor
                </button>
                <button type="button" onClick={() => setShowForm(false)} className={btn.gray}>
                  <X size={15} /> Cancelar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Authors list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <h2 className="font-semibold text-gray-700">Autores registrados</h2>
          </div>

          {loading ? (
            <div className="p-10 flex justify-center">
              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : authors.length === 0 ? (
            <div className="p-14 text-center">
              <p className="text-gray-300 text-3xl mb-2">📭</p>
              <p className="text-gray-400 text-sm">No hay autores. Crea el primero.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {authors.map((a) =>
                editId === a.id ? (
                  <li key={a.id} className="px-6 py-4 bg-blue-50/40">
                    <form onSubmit={handleEdit} className="flex gap-3 flex-wrap items-center">
                      <input
                        className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-blue-400 transition-colors flex-1 min-w-[140px] bg-white"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                      <input
                        placeholder="Bio"
                        className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-blue-400 transition-colors flex-1 min-w-[140px] bg-white"
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      />
                      <button type="submit" className={btn.blue}>
                        <Save size={13} /> Guardar
                      </button>
                      <button type="button" onClick={() => setEditId(null)} className={btn.gray}>
                        <X size={13} /> Cancelar
                      </button>
                    </form>
                  </li>
                ) : (
                  <li key={a.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{a.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 flex flex-wrap items-center gap-2">
                        <span>{a.email}</span>
                        <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100 font-medium">
                          {a._count?.books ?? 0} libros
                        </span>
                        {a.nationality && <span>· {a.nationality}</span>}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link href={`/authors/${a.id}`} className={btn.blue}>
                        <Eye size={13} /> Ver
                      </Link>
                      <button onClick={() => startEdit(a)} className={btn.amber}>
                        <Pencil size={13} /> Editar
                      </button>
                      <button onClick={() => handleDelete(a.id)} className={btn.red}>
                        <Trash2 size={13} /> Eliminar
                      </button>
                    </div>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
