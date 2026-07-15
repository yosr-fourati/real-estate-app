/**
 * Quick property importer — run with:
 *   npx tsx scripts/add-property.ts
 *
 * Loads .env automatically (for DATABASE_URL / DIRECT_URL).
 */

import { config } from "dotenv";
import { resolve } from "path";
// Load .env from project root (two levels up from scripts/)
config({ path: resolve(__dirname, "../.env") });
config({ path: resolve(__dirname, "../.env.local"), override: false });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROPERTY = {
  title: "",                            // ← fill in
  description: ``,                      // ← fill in
  price: 0,                             // ← fill in (TND)
  listingType: "SALE" as "SALE" | "RENT",
  type: "VILLA" as "APARTMENT" | "VILLA" | "HOUSE" | "LAND" | "COMMERCIAL",
  governorate: "",                      // ← fill in
  city: "",                             // ← fill in
  address: "",
  areaSqm: undefined as number | undefined,
  bedrooms: undefined as number | undefined,
  bathrooms: undefined as number | undefined,
  latitude: undefined as number | undefined,
  longitude: undefined as number | undefined,
  images: [] as string[],
};

async function main() {
  if (!PROPERTY.title) {
    console.error("❌ Please fill in the PROPERTY object before running.");
    process.exit(1);
  }

  const property = await prisma.property.create({
    data: {
      title: PROPERTY.title,
      description: PROPERTY.description,
      price: PROPERTY.price,
      listingType: PROPERTY.listingType,
      type: PROPERTY.type,
      governorate: PROPERTY.governorate,
      city: PROPERTY.city,
      address: PROPERTY.address || null,
      areaSqm: PROPERTY.areaSqm ?? null,
      bedrooms: PROPERTY.bedrooms ?? null,
      bathrooms: PROPERTY.bathrooms ?? null,
      latitude: PROPERTY.latitude ?? null,
      longitude: PROPERTY.longitude ?? null,
      isActive: true,
      images: PROPERTY.images.length > 0 ? {
        create: PROPERTY.images.map((url, i) => ({
          url,
          alt: PROPERTY.title,
          order: i,
        })),
      } : undefined,
    },
    include: { images: true },
  });

  console.log(`✅ Property created: "${property.title}" (ID: ${property.id})`);
  console.log(`   Type: ${property.type} | Listing: ${property.listingType} | Price: ${property.price} TND`);
  console.log(`   Location: ${property.city}, ${property.governorate}`);
  console.log(`   Images: ${property.images.length} (add via admin panel)`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
