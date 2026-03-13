import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { propertySchema } from "@/lib/validations";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/properties/:id
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } } },
    });
    if (!property) return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
    return NextResponse.json(property);
  } catch (err) {
    console.error("[GET /api/properties/:id]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/properties/:id (admin only)
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { images: imageUrls, ...rest } = body;

    const parsed = propertySchema.partial().safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    // Update property + sync images atomically
    const property = await prisma.$transaction(async (tx) => {
      await tx.property.update({
        where: { id },
        data: parsed.data,
      });

      if (Array.isArray(imageUrls)) {
        await tx.propertyImage.deleteMany({ where: { propertyId: id } });
        if (imageUrls.length > 0) {
          await tx.propertyImage.createMany({
            data: imageUrls.map((url: string, i: number) => ({
              url,
              propertyId: id,
              order: i,
            })),
          });
        }
      }

      return tx.property.findUnique({
        where: { id },
        include: { images: { orderBy: { order: "asc" } } },
      });
    });

    return NextResponse.json(property);
  } catch (err) {
    console.error("[PATCH /api/properties/:id]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/properties/:id (admin only)
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id } = await params;
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/properties/:id]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
