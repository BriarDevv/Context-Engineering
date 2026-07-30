// DESTRUCTIVE: truncates all tables before reloading demo data.
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

await db.$executeRawUnsafe(
  'TRUNCATE "OrderItem", "Order", "Product", "User" RESTART IDENTITY CASCADE',
);
await db.product.createMany({
  data: [
    { slug: "mate-imperial", name: "Mate Imperial", priceCents: 4590000, imageId: "demo/mate" },
    { slug: "bombilla-alpaca", name: "Bombilla Alpaca", priceCents: 1250000, imageId: "demo/bombilla" },
  ],
});
await db.$disconnect();
