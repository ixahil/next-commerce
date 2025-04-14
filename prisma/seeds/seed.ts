import { PrismaClient } from "@prisma/client";
import { seedProductsFromFile } from "./product.seed";

const prisma = new PrismaClient();

async function main() {
  await seedProductsFromFile(prisma);
  console.log("Database Seeded");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
