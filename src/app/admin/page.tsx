import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminHome() {
  const session = await getServerSession(authOptions);
  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>✅ Espace administrateur</h1>
      <p>Connecté en tant que : {session?.user?.email}</p>
      <p>Rôle : {(session?.user as any)?.role}</p>
      <p>Seul un compte ADMIN peut voir cette page — un compte MERCHANT est redirigé vers /login.</p>
    </main>
  );
}
