import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Comme Render (API) ne permet pas de changer facilement la commande de
// build après coup, on auto-crée les comptes de test au premier chargement
// de la page d'accueil plutôt que via un script séparé à lancer à la main.
// Idempotent : ne fait rien si les comptes existent déjà.
export async function ensureSeed() {
  const adminExists = await prisma.user.findUnique({ where: { email: "admin@plateforme.fr" } });
  if (adminExists) return;

  await prisma.user.create({
    data: {
      email: "admin@plateforme.fr",
      passwordHash: await bcrypt.hash("admin1234", 10),
      name: "Administrateur",
      role: "ADMIN",
    },
  });

  const merchantUser = await prisma.user.create({
    data: {
      email: "commercant@plateforme.fr",
      passwordHash: await bcrypt.hash("commerce1234", 10),
      name: "Gérant CocciMarket",
      role: "MERCHANT",
    },
  });

  const store = await prisma.store.create({
    data: {
      slug: "coccimarket-caen",
      name: "CocciMarket",
      address: "14 avenue du Professeur Horatio Smith, 14000 Caen",
      phone: "02 31 79 01 89",
    },
  });

  await prisma.storeUser.create({
    data: { userId: merchantUser.id, storeId: store.id },
  });
}
