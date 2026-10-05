import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// upsert partout : idempotent même si appelé plusieurs fois en parallèle
// (Next.js peut exécuter une page deux fois pendant la génération statique).
export async function ensureSeed() {
  const adminExists = await prisma.user.findUnique({ where: { email: "admin@plateforme.fr" } });
  if (adminExists) return;

  await prisma.user.upsert({
    where: { email: "admin@plateforme.fr" },
    update: {},
    create: {
      email: "admin@plateforme.fr",
      passwordHash: await bcrypt.hash("admin1234", 10),
      name: "Administrateur",
      role: "ADMIN",
    },
  });

  const merchantUser = await prisma.user.upsert({
    where: { email: "commercant@plateforme.fr" },
    update: {},
    create: {
      email: "commercant@plateforme.fr",
      passwordHash: await bcrypt.hash("commerce1234", 10),
      name: "Gérant CocciMarket",
      role: "MERCHANT",
    },
  });

  const store = await prisma.store.upsert({
    where: { slug: "coccimarket-caen" },
    update: {},
    create: {
      slug: "coccimarket-caen",
      name: "CocciMarket",
      description: "Votre supérette de quartier — fruits & légumes, boucherie à la coupe, épicerie",
      address: "14 avenue du Professeur Horatio Smith, 14000 Caen",
      phone: "02 31 79 01 89",
      colorPrimary: "#C1272D",
    },
  });

  await prisma.storeUser.upsert({
    where: { userId_storeId: { userId: merchantUser.id, storeId: store.id } },
    update: {},
    create: { userId: merchantUser.id, storeId: store.id },
  });

  const existingCategories = await prisma.category.count({ where: { storeId: store.id } });
  if (existingCategories > 0) return; // produits déjà créés

  const categoriesData = [
    { name: "🥩 Boucherie", products: [
      { name: "Escalopes de poulet", price: 990, img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80&auto=format&fit=crop", unit: "kg" },
      { name: "Steak haché 15% MG", price: 450, img: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80&auto=format&fit=crop" },
    ]},
    { name: "🥦 Fruits & légumes", products: [
      { name: "Bananes", price: 180, img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80&auto=format&fit=crop", unit: "kg" },
      { name: "Tomates rondes", price: 290, img: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80&auto=format&fit=crop", unit: "kg" },
    ]},
    { name: "🧀 Crèmerie", products: [
      { name: "Camembert AOP", price: 320, img: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80&auto=format&fit=crop" },
      { name: "Œufs plein air x6", price: 290, img: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=400&q=80&auto=format&fit=crop" },
    ]},
    { name: "🥖 Boulangerie", products: [
      { name: "Baguette tradition", price: 120, img: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&q=80&auto=format&fit=crop" },
    ]},
  ];

  for (let i = 0; i < categoriesData.length; i++) {
    const c = categoriesData[i];
    const category = await prisma.category.create({
      data: { storeId: store.id, name: c.name, position: i },
    });
    for (const p of c.products) {
      await prisma.product.create({
        data: {
          storeId: store.id,
          categoryId: category.id,
          name: p.name,
          priceCents: p.price,
          imageUrl: p.img,
          unit: (p as any).unit ?? null,
        },
      });
    }
  }
}
