import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        books: {
          select: {
            id: true,
            title: true,
            publishedYear: true,
            genre: true,
            pages: true,
          },
          orderBy: { publishedYear: "asc" },
        },
      },
    });

    if (!author) {
      return Response.json({ error: "Autor no encontrado" }, { status: 404 });
    }

    const books = author.books;
    const totalBooks = books.length;

    if (totalBooks === 0) {
      return Response.json({
        authorId: id,
        authorName: author.name,
        totalBooks: 0,
        firstBook: null,
        latestBook: null,
        averagePages: 0,
        genres: [],
        longestBook: null,
        shortestBook: null,
      });
    }

    const withPages = books.filter((b) => b.pages != null);
    const withYear = books.filter((b) => b.publishedYear != null);

    const firstBook = withYear[0] ?? null;
    const latestBook = withYear[withYear.length - 1] ?? null;

    const averagePages =
      withPages.length > 0
        ? Math.round(
            withPages.reduce((sum, b) => sum + (b.pages ?? 0), 0) / withPages.length
          )
        : 0;

    const genres = [...new Set(books.map((b) => b.genre).filter(Boolean))] as string[];

    const longestBook =
      withPages.length > 0
        ? withPages.reduce((max, b) => ((b.pages ?? 0) > (max.pages ?? 0) ? b : max))
        : null;

    const shortestBook =
      withPages.length > 0
        ? withPages.reduce((min, b) => ((b.pages ?? Infinity) < (min.pages ?? Infinity) ? b : min))
        : null;

    return Response.json({
      authorId: id,
      authorName: author.name,
      totalBooks,
      firstBook: firstBook
        ? { title: firstBook.title, year: firstBook.publishedYear }
        : null,
      latestBook: latestBook
        ? { title: latestBook.title, year: latestBook.publishedYear }
        : null,
      averagePages,
      genres,
      longestBook: longestBook
        ? { title: longestBook.title, pages: longestBook.pages }
        : null,
      shortestBook: shortestBook
        ? { title: shortestBook.title, pages: shortestBook.pages }
        : null,
    });
  } catch {
    return Response.json({ error: "Error al obtener estadísticas" }, { status: 500 });
  }
}
