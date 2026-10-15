"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (r.ok) { router.push("/admin"); router.refresh(); }
    else setError((await r.json()).error || "Erreur");
  }
  return (
    <section className="container-p max-w-sm py-20">
      <h1 className="mb-6 text-2xl font-extrabold text-brand-900">Espace administrateur</h1>
      <form onSubmit={submit} className="space-y-4 rounded-3xl bg-white p-6 ring-1 ring-stone-200">
        <div><label className="label" htmlFor="e">E-mail</label><input id="e" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></div>
        <div><label className="label" htmlFor="p">Mot de passe</label><input id="p" type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></div>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button className="btn-dark w-full">Se connecter</button>
      </form>
    </section>
  );
}
