import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { propertySchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";
import type { PropertyType, ListingType } from "@prisma/client";

// GET /api/properties
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const governorate = searchParams.get("governorate");
    const city = searchParams.get("city");
    const type = searchParams.get("type");
    const listingType = searchParams.get("listingType");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") ?? "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "9"));
    const skip = (page - 1) * limit;

    const where: Prisma.PropertyWhereInput = {
      isActive: true,
    };

    if (governorate) where.governorate = { contains: governorate, mode: "insensitive" };
    if (city) where.city = { contains: city, mode: "insensitive" };
    if (type) where.type = type as PropertyType;
    if (listingType) where.listingType = listingType as ListingType;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice);
      if (maxPrice) where.price.lte = parseInt(maxPrice);
    }

    const orderBy: Prisma.PropertyOrderByWithRelationInput =
      sort === "price_asc"
        ? { price: "asc" }
        : sort === "price_desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: { images: { orderBy: { order: "asc" }, take: 1 } },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({ properties, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("[GET /api/properties]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/properties (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await req.json();
    const parsed = propertySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { images: imageUrls, ...data } = body;

    const property = await prisma.property.create({
      data: {
        ...parsed.data,
        images:
          Array.isArray(imageUrls) && imageUrls.length > 0
            ? {
                create: imageUrls.map((url: string, i: number) => ({
                  url,
                  order: i,
                })),
              }
            : undefined,
      },
      include: { images: true },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (err) {
    console.error("[POST /api/properties]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
