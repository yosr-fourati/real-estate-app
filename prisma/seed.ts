import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@indeed-immo.tn";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme-strong";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: { email: adminEmail, password: hashed, role: "ADMIN" },
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
  }

  // Seed a sample property for demo
  const count = await prisma.property.count();
  if (count === 0) {
    await prisma.property.create({
      data: {
        title: "Villa de Luxe à Ennasr 2",
        description:
          "Villa de luxe sur 3 niveaux. Terrain 740m², bâti 560m². 6 suites, piscine, garage 6 voitures.",
        price: 1550000,
        city: "Ennasr",
        governorate: "Ariana",
        type: "VILLA",
        listingType: "SALE",
        latitude: 36.8625,
        longitude: 10.1846,
        areaSqm: 560,
        bedrooms: 6,
        bathrooms: 5,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=60",
              alt: "Villa Ennasr 2",
              order: 0,
            },
          ],
        },
      },
    });
    console.log("✅ Sample property created");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
