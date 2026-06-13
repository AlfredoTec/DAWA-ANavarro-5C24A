import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "@/lib/users";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Todos los campos son requeridos." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres." }, { status: 400 });
  }

  const existing = findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "El correo ya está registrado." }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  createUser({ id: randomUUID(), name, email, password: hashedPassword });

  return NextResponse.json({ message: "Usuario registrado exitosamente." }, { status: 201 });
}
