import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import truck from "@/assets/truck.jpg";
import logo from "@/assets/mr-express-brand.png.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "CV MR Express | Agen Pelni Surabaya — Pembukuan" },
      { name: "description", content: "CV MR Express, Agen Pelni Surabaya. Akses resmi MR Express Ledger untuk pembukuan keuangan dan laporan CV MR Express." },
      { property: "og:title", content: "CV MR Express | Agen Pelni Surabaya — Pembukuan" },
      { property: "og:description", content: "Akses resmi pembukuan keuangan CV MR Express, Agen Pelni Surabaya." },
      { property: "og:url", content: "/login" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "CV MR Express", alternateName: "MR Express", description: "Agen Pelni Surabaya" }) }],
  }),
  component: Login,
});

export function AuthShell({ children, showBackground = true, showLogo = true }: { children: React.ReactNode; showBackground?: boolean; showLogo?: boolean }) {
  return (
    <div className="relative grid min-h-screen place-items-center bg-background p-4">
      {showBackground && <img src={truck} alt="Truk CV MR Express" width={1280} height={960} className="absolute inset-0 h-full w-full object-cover" />}
      <div className="relative w-full max-w-sm rounded-xl bg-card/95 p-7 shadow-2xl backdrop-blur">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" />Kembali ke Beranda</Link>
        <div className="mt-4 text-center">
          {showLogo && <img src={logo.url} alt="Logo CV MR Express" width={992} height={200} className="mx-auto mb-4 h-14 w-full max-w-60 rounded bg-card object-contain p-1" />}
          <p className="text-lg font-bold tracking-wide">PEMBUKUAN</p>
          <h1 className="text-3xl font-extrabold">CV MR EXPRESS</h1>
          <p className="text-sm text-muted-foreground">Sistem Pembukuan Keuangan</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function Login() {
  const nav = useNavigate();
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (session) nav({ to: "/dashboard", replace: true }); }, [session, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setError(error.message === "Invalid login credentials" ? "Email atau password salah" : error.message);
  };

  return (
    <AuthShell showBackground={false} showLogo={false}>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <label className="block text-xs text-muted-foreground">Email
          <div className="relative mt-1"><Mail className="absolute left-3 top-2.5 h-4 w-4" /><Input className="pl-9" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        </label>
        <label className="block text-xs text-muted-foreground">Password
          <div className="relative mt-1"><Lock className="absolute left-3 top-2.5 h-4 w-4" /><Input className="pl-9" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        </label>
        {error && <p role="alert" className="rounded bg-danger-soft px-3 py-2 text-xs text-destructive">{error}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={busy}>{busy ? "Memproses..." : "Masuk"}</Button>
      </form>
    </AuthShell>
  );
}
