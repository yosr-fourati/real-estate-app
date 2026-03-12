import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { propertySchema } from "@/lib/validations";

// GET /api/properties/:id
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
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
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await req.json();
    const { images: imageUrls, ...rest } = body;

    const parsed = propertySchema.partial().safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    // Update property + sync images
    const property = await prisma.$transaction(async (tx) => {
      const updated = await tx.property.update({
        where: { id: params.id },
        data: parsed.data,
      });

      if (Array.isArray(imageUrls)) {
        // Remove existing images and re-create
        await tx.propertyImage.deleteMany({ where: { propertyId: params.id } });
        if (imageUrls.length > 0) {
          await tx.propertyImage.createMany({
            data: imageUrls.map((url: string, i: number) => ({
              url,
              propertyId: params.id,
              order: i,
            })),
          });
        }
      }

      return tx.property.findUnique({
        where: { id: params.id },
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
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    await prisma.property.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/properties/:id]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
