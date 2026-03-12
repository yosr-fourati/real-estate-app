/**
 * Quick property importer — run with:
 *   npx tsx scripts/add-property.ts
 *
 * Edit the PROPERTY object below, then run the script.
 * Images: paste direct image URLs (right-click image → Copy image address)
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── EDIT THIS BLOCK ───────────────────────────────────────────────────────────
const PROPERTY = {
  title: "",            // e.g. "Appartement S+3 à La Marsa"
  description: ``,     // paste the full Facebook post text here (between backticks)
  price: 0,            // in TND, e.g. 450000
  listingType: "SALE" as "SALE" | "RENT",   // "SALE" or "RENT"
  type: "APARTMENT" as "APARTMENT" | "VILLA" | "HOUSE" | "LAND" | "COMMERCIAL",
  governorate: "",     // e.g. "Ariana", "Tunis", "La Manouba", ...
  city: "",            // e.g. "La Marsa", "Ennasr", "Soukra", ...
  address: "",         // optional full address
  areaSqm: undefined as number | undefined,   // e.g. 150
  bedrooms: undefined as number | undefined,  // e.g. 3
  bathrooms: undefined as number | undefined, // e.g. 2
  latitude: undefined as number | undefined,  // optional, e.g. 36.8625
  longitude: undefined as number | undefined, // optional, e.g. 10.1846
  images: [] as string[], // paste image URLs here, e.g. ["https://...", "https://..."]
};
// ───────────────────────────────────────────────────────────────────────────────

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
  console.log(`   Images: ${property.images.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
