import { Prisma, PropertyType } from "@prisma/client";
import { prisma } from "../utils/prisma";

export type PropertyFilters = {
  city?: string;
  type?: string;        // string from query, mapped to enum internally
  minPrice?: number;
  maxPrice?: number;
};

// Map a string to the PropertyType enum (case-insensitive).
function toPropertyTypeEnum(input?: string): PropertyType | undefined {
  if (!input) return undefined;
  const wanted = input.trim().toLowerCase();
  return (Object.values(PropertyType) as string[]).find(
    (e) => e.toLowerCase() === wanted
  ) as PropertyType | undefined;
}

/** Accepts either a numeric id (Int PK) or string id (cuid/uuid PK) */
function toPropertyWhereUnique(id: number | string): Prisma.PropertyWhereUniqueInput {
  // If it's a numeric string like "12", coerce to number for Int PKs.
  if (typeof id === "string" && id.trim() !== "" && Number.isFinite(+id)) {
    return { id: +id as any };
  }
  return { id: id as any }; // works for both Int and String schemas
}

export async function findProperties(filters: PropertyFilters = {}) {
  const where: Prisma.PropertyWhereInput = {};

  if (filters.city?.trim()) {
    where.city = { contains: filters.city.trim(), mode: "insensitive" };
  }

  const enumType = toPropertyTypeEnum(filters.type);
  if (enumType) {
    where.type = enumType;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) (where.price as any).gte = filters.minPrice;
    if (filters.maxPrice !== undefined) (where.price as any).lte = filters.maxPrice;
  }

  return prisma.property.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function findPropertyById(id: number | string) {
  return prisma.property.findUnique({
    where: toPropertyWhereUnique(id),
    include: { images: true },
  });
}

type CreatePropertyInput = {
  title: string;
  city: string;
  type: string;           // will be mapped to enum inside
  price: number;
  description?: string;
  images?: string[];      // array of image URLs from client
  lat?: number | null;
  lng?: number | null;
};

export async function createProperty(input: CreatePropertyInput) {
  const typeEnum = toPropertyTypeEnum(input.type);
  if (!typeEnum) {
    throw new Error(`Unknown property type: ${input.type}`);
  }

  // Start with only the fields that are guaranteed to exist
  const data: Prisma.PropertyUncheckedCreateInput = {
    title: input.title.trim(),
    city: input.city.trim(),
    type: typeEnum,
    price: input.price,
    description: input.description?.trim() ?? "",
  };

  // Images relation (if your schema has PropertyImage { url String })
  if (input.images?.length) {
    (data as any).images = {
      create: input.images
        .map((u) => u.trim())
        .filter(Boolean)
        .map((url) => ({ url })), // change to { src: url } if your column name differs
    };
  }

  // Attach lat/lng ONLY if provided. If your schema doesn't have these,
  // Prisma will ignore them at runtime; TS is bypassed via `as any`.
 // Only include coordinates if provided, AND map to your actual columns.
if (typeof input.lat !== "undefined") {
  (data as any).latitude = input.lat ?? null;
}
if (typeof input.lng !== "undefined") {
  (data as any).longitude = input.lng ?? null;
}


  return prisma.property.create({ data });
}

