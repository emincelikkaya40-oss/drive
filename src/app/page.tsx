import { prisma } from "@/lib/prisma";
import { ensureSeed } from "@/lib/ensure-seed";
import Link from "next/link";

export default async function Home() {
  await ensureSeed();
  const storeCount = await prisma.store.count();
  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>✅ Étape 2 : authentification</h1>
      <p>Connexion base de données OK. {storeCount} commerce(s) en base.</p>
      <ul>
        <li><Link href="/coccimarket-caen">🛒 Boutique CocciMarket (page publique, étape 3)</Link></li>
        <li><Link href="/login">Se connecter</Link></li>
        <li><Link href="/merchant">Espace commerçant (protégé)</Link></li>
        <li><Link href="/admin">Espace admin (protégé)</Link></li>
      </ul>
      <p style={{ color: "#666", fontSize: 14 }}>
        Comptes de test (créés automatiquement) :<br />
        admin@plateforme.fr / admin1234<br />
        commercant@plateforme.fr / commerce1234
      </p>
    </main>
  );
}
