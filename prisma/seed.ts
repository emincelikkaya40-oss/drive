import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin1234", 10);
  const merchantPassword = await bcrypt.hash("commerce1234", 10);

  await prisma.user.upsert({
    where: { email: "admin@plateforme.fr" },
    update: {},
    create: {
      email: "admin@plateforme.fr",
      passwordHash: adminPassword,
      name: "Administrateur",
      role: "ADMIN",
    },
  });

  const merchantUser = await prisma.user.upsert({
    where: { email: "commercant@plateforme.fr" },
    update: {},
    create: {
      email: "commercant@plateforme.fr",
      passwordHash: merchantPassword,
      name: "Gérant CocciMarket",
      role: "MERCHANT",
    },
  });

  // Un commerce de test, lié au compte commerçant, pour l'étape 2.
  const store = await prisma.store.upsert({
    where: { slug: "coccimarket-caen" },
    update: {},
    create: {
      slug: "coccimarket-caen",
      name: "CocciMarket",
      address: "14 avenue du Professeur Horatio Smith, 14000 Caen",
      phone: "02 31 79 01 89",
    },
  });

  await prisma.storeUser.upsert({
    where: { userId_storeId: { userId: merchantUser.id, storeId: store.id } },
    update: {},
    create: { userId: merchantUser.id, storeId: store.id },
  });

  console.log("Comptes créés :");
  console.log("  admin@plateforme.fr / admin1234");
  console.log("  commercant@plateforme.fr / commerce1234 (lié au commerce 'coccimarket-caen')");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => prisma.$disconnect());
