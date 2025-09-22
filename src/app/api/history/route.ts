import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: lista tudo (mais recente primeiro)
export async function GET() {
  const rows = await prisma.history.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rows);
}

// POST: cria item (aceita id/createdAt opcionais para import)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, createdAt, nome, data, sent, result } = body || {};
    if (!nome || !data || !result) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const row = await prisma.history.create({
      data: {
        id,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        nome,
        data,
        sent: sent ?? null,
        result,
      },
    });
    return NextResponse.json(row, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

// DELETE: apaga tudo
export async function DELETE() {
  await prisma.history.deleteMany({});
  return NextResponse.json({ ok: true });
}
