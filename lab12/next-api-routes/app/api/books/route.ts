import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const genre = searchParams.get("genre");

    const books = await prisma.book.findMany({
      where: genre ? { genre } : undefined,
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(books);
  } catch {
    return Response.json({ error: "Error al obtener libros" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, isbn, publishedYear, genre, pages, authorId } = body;

    if (!title || !authorId) {
      return Response.json({ error: "title y authorId son requeridos" }, { status: 400 });
    }

    const author = await prisma.author.findUnique({ where: { id: authorId } });
    if (!author) {
      return Response.json({ error: "Autor no encontrado" }, { status: 404 });
    }

    const book = await prisma.book.create({
      data: { title, description, isbn, publishedYear, genre, pages, authorId },
      include: { author: { select: { id: true, name: true } } },
    });
    return Response.json(book, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return Response.json({ error: "El ISBN ya está registrado" }, { status: 409 });
    }
    return Response.json({ error: "Error al crear libro" }, { status: 500 });
  }
}
