"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await signUp(email, password, displayName);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/giris"), 2000);
    }
  };

  return (
    <AppShell title="Kayıt Ol" showHeader>
      <div className="flex justify-center py-12">
        <Card variant="elevated" padding="lg" className="w-full max-w-md">
          <h2 className="font-display text-2xl font-bold text-content mb-6">Kayıt Ol</h2>
          {success ? (
            <p className="text-success text-center">
              Kayıt başarılı! E-postanızı doğrulayın ve giriş yapın.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-content-secondary block mb-1">Ad</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full rounded-button border border-border bg-surface-elevated px-4 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
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
                  minLength={6}
                  className="w-full rounded-button border border-border bg-surface-elevated px-4 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              {error && <p className="text-sm text-danger">{error}</p>}
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? "Kaydediliyor..." : "Kayıt Ol"}
              </Button>
            </form>
          )}
          <p className="text-sm text-content-secondary text-center mt-4">
            Zaten hesabın var mı?{" "}
            <Link href="/giris" className="text-accent hover:underline">Giriş yap</Link>
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
