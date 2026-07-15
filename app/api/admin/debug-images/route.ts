import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Temporary debug endpoint — delete after use
export async function GET() {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const properties = await prisma.property.findMany({
    where: { isActive: true },
    select: {
      id: true,
      title: true,
      _count: { select: { images: true } },
      images: { take: 1, orderBy: { order: "asc" }, select: { url: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = properties.map((p) => ({
    id: p.id,
    title: p.title,
    imageCount: p._count.images,
    coverUrl: p.images[0]?.url ?? null,
  }));

  return NextResponse.json(result);
}
