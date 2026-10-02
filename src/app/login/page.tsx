"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    // On ne sait pas encore le rôle côté client avant le prochain render ;
    // le plus simple et le plus fiable est de renvoyer vers une page neutre
    // qui redirige elle-même selon le rôle réel (vérifié serveur).
    router.push("/");
    router.refresh();
  }

  return (
    <main style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif", padding: 20 }}>
      <h1>Connexion</h1>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label><br />
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Mot de passe</label><br />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ padding: "8px 16px" }}>Se connecter</button>
      </form>
    </main>
  );
}
