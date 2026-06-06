"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Pencil, Trash2, Plus, X, Save, BookOpen } from "lucide-react";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { NumberTicker } from "@/components/magicui/number-ticker";

type Book = { id: string; title: string; genre?: string; publishedYear?: number; pages?: number; isbn?: string };
type Author = { id: string; name: string; email: string; nationality?: string; birthYear?: number; bio?: string; books: Book[] };
type Stats = {
  authorName: string;
  totalBooks: number;
  firstBook: { title: string; year: number } | null;
  latestBook: { title: string; year: number } | null;
  averagePages: number;
  genres: string[];
  longestBook: { title: string; pages: number } | null;
  shortestBook: { title: string; pages: number } | null;
};

const btn = {
  blue:  "cursor-pointer inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm",
  green: "cursor-pointer inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm",
  amber: "cursor-pointer inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm",
  red:   "cursor-pointer inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 active:scale-95 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm",
  gray:  "cursor-pointer inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
  ghost: "cursor-pointer inline-flex items-center gap-1.5 border border-gray-200 bg-white hover:bg-gray-50 active:scale-95 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
};

export default function AuthorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [author, setAuthor] = useState<Author | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", bio: "", nationality: "" });
  const [showBookForm, setShowBookForm] = useState(false);
  const [bookForm, setBookForm] = useState({ title: "", genre: "", publishedYear: "", pages: "", isbn: "", description: "" });
  const [bookError, setBookError] = useState("");

  const fetchAuthor = async () => {
    const [aRes, sRes] = await Promise.all([fetch(`/api/authors/${id}`), fetch(`/api/authors/${id}/stats`)]);
    const a = await aRes.json();
    const s = await sRes.json();
    setAuthor(a);
    setStats(s);
    setEditForm({ name: a.name, email: a.email, bio: a.bio ?? "", nationality: a.nationality ?? "" });
    setLoading(false);
  };

  useEffect(() => { fetchAuthor(); }, [id]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/authors/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editForm) });
    setEditMode(false);
    fetchAuthor();
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookError("");
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...bookForm, authorId: id,
        publishedYear: bookForm.publishedYear ? parseInt(bookForm.publishedYear) : undefined,
        pages: bookForm.pages ? parseInt(bookForm.pages) : undefined,
      }),
    });
    if (res.ok) {
      setBookForm({ title: "", genre: "", publishedYear: "", pages: "", isbn: "", description: "" });
      setShowBookForm(false);
      fetchAuthor();
    } else {
      const d = await res.json();
      setBookError(d.error ?? "Error al agregar libro");
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm("¿Eliminar libro?")) return;
    await fetch(`/api/books/${bookId}`, { method: "DELETE" });
    fetchAuthor();
  };

  const inputCls = "bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all w-full";

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!author) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-red-500">Autor no encontrado.</div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="flex items-center justify-between">
          <Link href="/" className={btn.ghost}><ArrowLeft size={15} /> Dashboard</Link>
          <Link href="/books" className={btn.ghost}>Ver todos los libros <ArrowRight size={15} /></Link>
        </div>

        {/* Author info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {editMode ? (
            <form onSubmit={handleEdit} className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Editar Autor</h3>
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Nombre" className={inputCls} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                <input required type="email" placeholder="Email" className={inputCls} value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                <input placeholder="Nacionalidad" className={inputCls} value={editForm.nationality} onChange={(e) => setEditForm({ ...editForm, nationality: e.target.value })} />
              </div>
              <textarea placeholder="Biografía" className={`${inputCls} resize-none`} rows={2} value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} />
              <div className="flex gap-2">
                <button type="submit" className={btn.blue}><Save size={15} /> Guardar cambios</button>
                <button type="button" onClick={() => setEditMode(false)} className={btn.gray}><X size={15} /> Cancelar</button>
              </div>
            </form>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  <AnimatedGradientText>{author.name}</AnimatedGradientText>
                </h1>
                <p className="text-gray-400 text-sm">{author.email}</p>
                {author.nationality && (
                  <p className="text-gray-400 text-sm mt-1">
                    {author.nationality}{author.birthYear && ` · Nacido en ${author.birthYear}`}
                  </p>
                )}
                {author.bio && <p className="text-gray-600 text-sm mt-3 max-w-xl">{author.bio}</p>}
              </div>
              <button onClick={() => setEditMode(true)} className={btn.amber}>
                <Pencil size={15} /> Editar
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        {stats && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Estadísticas del autor</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                <p className="text-3xl font-bold text-blue-600"><NumberTicker value={stats.totalBooks} /></p>
                <p className="text-xs text-gray-400 mt-1">Libros</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                <p className="text-3xl font-bold text-green-600"><NumberTicker value={stats.averagePages} /></p>
                <p className="text-xs text-gray-400 mt-1">Págs. promedio</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                <p className="text-3xl font-bold text-purple-600"><NumberTicker value={stats.genres.length} /></p>
                <p className="text-xs text-gray-400 mt-1">Géneros</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center">
                <p className="text-xs text-gray-400 mb-2">Géneros</p>
                {stats.genres.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {stats.genres.map((g) => (
                      <span key={g} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-100">{g}</span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-300">Sin géneros</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Primer libro", data: stats.firstBook ? `${stats.firstBook.title} (${stats.firstBook.year})` : null, cls: "border-cyan-100 bg-cyan-50 text-cyan-700" },
                { label: "Último libro", data: stats.latestBook ? `${stats.latestBook.title} (${stats.latestBook.year})` : null, cls: "border-orange-100 bg-orange-50 text-orange-700" },
                { label: "Libro más largo", data: stats.longestBook ? `${stats.longestBook.title} — ${stats.longestBook.pages} págs` : null, cls: "border-pink-100 bg-pink-50 text-pink-700" },
                { label: "Libro más corto", data: stats.shortestBook ? `${stats.shortestBook.title} — ${stats.shortestBook.pages} págs` : null, cls: "border-yellow-100 bg-yellow-50 text-yellow-700" },
              ].map(({ label, data, cls }) => (
                <div key={label} className={`rounded-xl p-3 border ${cls}`}>
                  <p className="text-xs opacity-60 mb-1">{label}</p>
                  <p className="text-xs font-semibold">{data ?? "—"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Books list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-gray-400" />
              <h2 className="font-semibold text-gray-700">Libros ({author.books.length})</h2>
            </div>
            <button
              onClick={() => setShowBookForm(!showBookForm)}
              className={showBookForm ? btn.gray : btn.green}
            >
              {showBookForm ? <><X size={15} /> Cancelar</> : <><Plus size={15} /> Agregar libro</>}
            </button>
          </div>

          {showBookForm && (
            <form onSubmit={handleAddBook} className="p-6 border-b border-gray-100 bg-green-50/30 space-y-3">
              {bookError && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-red-600 text-sm">{bookError}</div>}
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Título *" className={inputCls} value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} />
                <input placeholder="Género" className={inputCls} value={bookForm.genre} onChange={(e) => setBookForm({ ...bookForm, genre: e.target.value })} />
                <input type="number" placeholder="Año publicación" className={inputCls} value={bookForm.publishedYear} onChange={(e) => setBookForm({ ...bookForm, publishedYear: e.target.value })} />
                <input type="number" placeholder="Páginas" className={inputCls} value={bookForm.pages} onChange={(e) => setBookForm({ ...bookForm, pages: e.target.value })} />
                <input placeholder="ISBN" className={inputCls} value={bookForm.isbn} onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })} />
              </div>
              <textarea placeholder="Descripción" className={`${inputCls} resize-none`} rows={2} value={bookForm.description} onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })} />
              <div className="flex gap-2">
                <button type="submit" className={btn.green}><Save size={15} /> Agregar libro</button>
                <button type="button" onClick={() => setShowBookForm(false)} className={btn.gray}><X size={15} /> Cancelar</button>
              </div>
            </form>
          )}

          {author.books.length === 0 ? (
            <div className="p-14 text-center">
              <p className="text-gray-300 text-3xl mb-2">📭</p>
              <p className="text-gray-400 text-sm">No hay libros registrados.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {author.books.map((b) => (
                <li key={b.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{b.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex flex-wrap items-center gap-2">
                      {b.genre && <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-100">{b.genre}</span>}
                      {b.publishedYear && <span>{b.publishedYear}</span>}
                      {b.pages && <span>{b.pages} págs</span>}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteBook(b.id)} className={btn.red}>
                    <Trash2 size={13} /> Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
