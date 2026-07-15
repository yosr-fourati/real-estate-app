import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Temporary debug endpoint — delete after use
export async function GET() {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const images = await prisma.propertyImage.findMany({
    take: 30,
    orderBy: { id: "asc" },
    select: { id: true, url: true, propertyId: true },
  });

  const grouped = images.reduce((acc: Record<string, string[]>, img) => {
    if (!acc[img.propertyId]) acc[img.propertyId] = [];
    acc[img.propertyId].push(img.url);
    return acc;
  }, {});

  return NextResponse.json(grouped, { status: 200 });
}
