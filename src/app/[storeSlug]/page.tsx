import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StoreCatalog from "./StoreCatalog";

// Page publique d'un commerce : /boulangerie-dupont, /epicerie-martin...
// Toutes les données affichées sont filtrées par storeId dès la requête —
// un visiteur ne peut jamais voir les produits d'un autre commerce, même
// en devinant un id, puisqu'on ne lit que ce qui est rattaché à CE store.
export default async function StorePage({ params }: { params: { storeSlug: string } }) {
  const store = await prisma.store.findUnique({
    where: { slug: params.storeSlug, isActive: true },
    include: {
      categories: {
        orderBy: { position: "asc" },
        include: { products: { where: { available: true } } },
      },
    },
  });

  if (!store) notFound();

  return <StoreCatalog store={store} />;
}
