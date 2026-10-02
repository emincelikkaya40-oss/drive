import { prisma } from "@/lib/prisma";

// Page de vérification étape 1 : si cette page affiche "0 commerce(s)"
// sans planter, ça veut dire que la connexion à la base de données
// et le schéma Prisma fonctionnent correctement.
export default async function Home() {
  const storeCount = await prisma.store.count();
  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>✅ Setup étape 1 opérationnel</h1>
      <p>Connexion base de données OK.</p>
      <p>{storeCount} commerce(s) en base pour le moment.</p>
    </main>
  );
}
