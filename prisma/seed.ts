import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Couscous", slug: "couscous", icon: "🫕" },
  { name: "Chorba", slug: "chorba", icon: "🍲" },
  { name: "Tajine", slug: "tajine", icon: "🥘" },
  { name: "Rechta", slug: "rechta", icon: "🍜" },
  { name: "Brick & Bourek", slug: "brick-bourek", icon: "🥟" },
  { name: "Grillades", slug: "grillades", icon: "🍖" },
  { name: "Pâtisserie", slug: "patisserie", icon: "🍮" },
  { name: "Salades", slug: "salades", icon: "🥗" },
  { name: "Plats de fête", slug: "plats-fete", icon: "🎉" },
  { name: "Boissons", slug: "boissons", icon: "🧃" },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Seed categories
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log(`✅ Seeded ${categories.length} categories`);

  // Create a test admin user
  const { default: bcrypt } = await import("bcryptjs");
  const passwordHash = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@darnafood.dz" },
    update: {},
    create: {
      name: "Admin DarnaFood",
      email: "admin@darnafood.dz",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("✅ Created admin user (admin@darnafood.dz / admin123)");

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
