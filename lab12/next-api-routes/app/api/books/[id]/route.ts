import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = await prisma.book.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true, nationality: true } } },
    });
    if (!book) {
      return Response.json({ error: "Libro no encontrado" }, { status: 404 });
    }
    return Response.json(book);
  } catch {
    return Response.json({ error: "Error al obtener libro" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, isbn, publishedYear, genre, pages, authorId } = body;

    const book = await prisma.book.update({
      where: { id },
      data: { title, description, isbn, publishedYear, genre, pages, authorId },
      include: { author: { select: { id: true, name: true } } },
    });
    return Response.json(book);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return Response.json({ error: "Libro no encontrado" }, { status: 404 });
    }
    return Response.json({ error: "Error al actualizar libro" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.book.delete({ where: { id } });
    return Response.json({ message: "Libro eliminado" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return Response.json({ error: "Libro no encontrado" }, { status: 404 });
    }
    return Response.json({ error: "Error al eliminar libro" }, { status: 500 });
  }
}
