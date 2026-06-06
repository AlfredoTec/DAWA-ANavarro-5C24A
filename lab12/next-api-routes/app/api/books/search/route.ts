import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const search = searchParams.get("search") ?? undefined;
    const genre = searchParams.get("genre") ?? undefined;
    const authorName = searchParams.get("authorName") ?? undefined;

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
    const sortBy = (["title", "publishedYear", "createdAt"] as const).includes(
      searchParams.get("sortBy") as any
    )
      ? (searchParams.get("sortBy") as "title" | "publishedYear" | "createdAt")
      : "createdAt";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";

    const where = {
      ...(search && { title: { contains: search, mode: "insensitive" as const } }),
      ...(genre && { genre }),
      ...(authorName && {
        author: { name: { contains: authorName, mode: "insensitive" as const } },
      }),
    };

    const [total, data] = await Promise.all([
      prisma.book.count({ where }),
      prisma.book.findMany({
        where,
        include: { author: { select: { id: true, name: true } } },
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return Response.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch {
    return Response.json({ error: "Error en la búsqueda" }, { status: 500 });
  }
}
