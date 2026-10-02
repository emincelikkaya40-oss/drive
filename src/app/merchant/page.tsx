import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Page protégée par le middleware : impossible d'arriver ici sans un token
// valide dont le rôle est MERCHANT ou ADMIN (vérifié côté serveur).
export default async function MerchantHome() {
  const session = await getServerSession(authOptions);
  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>✅ Espace commerçant</h1>
      <p>Connecté en tant que : {session?.user?.email}</p>
      <p>Rôle : {(session?.user as any)?.role}</p>
      <p>Si tu vois cette page, le middleware t'a correctement laissé passer.</p>
    </main>
  );
}
