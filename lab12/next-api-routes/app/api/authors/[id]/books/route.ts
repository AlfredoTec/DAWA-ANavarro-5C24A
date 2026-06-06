import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const author = await prisma.author.findUnique({ where: { id } });
    if (!author) {
      return Response.json({ error: "Autor no encontrado" }, { status: 404 });
    }
    const books = await prisma.book.findMany({
      where: { authorId: id },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(books);
  } catch {
    return Response.json({ error: "Error al obtener libros del autor" }, { status: 500 });
  }
}
