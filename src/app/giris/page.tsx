"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      router.push("/");
    }
  };

  return (
    <AppShell title="Giriş Yap" showHeader>
      <div className="flex justify-center py-12">
        <Card variant="elevated" padding="lg" className="w-full max-w-md">
          <h2 className="font-display text-2xl font-bold text-content mb-6">Giriş Yap</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-content-secondary block mb-1">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-button border border-border bg-surface-elevated px-4 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div>
              <label className="text-sm text-content-secondary block mb-1">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-button border border-border bg-surface-elevated px-4 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
          <p className="text-sm text-content-secondary text-center mt-4">
            Hesabın yok mu?{" "}
            <Link href="/kayit" className="text-accent hover:underline">Kayıt ol</Link>
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
