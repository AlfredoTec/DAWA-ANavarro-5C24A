import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const authors = await prisma.author.findMany({
      include: { _count: { select: { books: true } } },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(authors);
  } catch (error) {
    return Response.json({ error: "Error al obtener autores" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, bio, nationality, birthYear } = body;

    if (!name || !email) {
      return Response.json({ error: "name y email son requeridos" }, { status: 400 });
    }

    const author = await prisma.author.create({
      data: { name, email, bio, nationality, birthYear },
    });
    return Response.json(author, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return Response.json({ error: "El email ya está registrado" }, { status: 409 });
    }
    return Response.json({ error: "Error al crear autor" }, { status: 500 });
  }
}
