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
      include: { books: true },
    });
    if (!author) {
      return Response.json({ error: "Autor no encontrado" }, { status: 404 });
    }
    return Response.json(author);
  } catch {
    return Response.json({ error: "Error al obtener autor" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, bio, nationality, birthYear } = body;

    const author = await prisma.author.update({
      where: { id },
      data: { name, email, bio, nationality, birthYear },
    });
    return Response.json(author);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return Response.json({ error: "Autor no encontrado" }, { status: 404 });
    }
    return Response.json({ error: "Error al actualizar autor" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.author.delete({ where: { id } });
    return Response.json({ message: "Autor eliminado" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return Response.json({ error: "Autor no encontrado" }, { status: 404 });
    }
    return Response.json({ error: "Error al eliminar autor" }, { status: 500 });
  }
}
