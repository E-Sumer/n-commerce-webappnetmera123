"use client";

// Stays "use client": form state, password toggle, auth redirect.
// trackEvent / identifyUser removed — re-add when Netmera is re-enabled.

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { nmLogin } from "@/lib/netmera-events";
import Button from "@/components/ui/Button";
import type { User } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect already-authenticated users
  useEffect(() => {
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const mockUser: User = {
      id: `user_${email.split("@")[0]}_${Date.now()}`,
      email,
      name: email.split("@")[0],
      gender: "other",
      createdAt: new Date().toISOString(),
    };

    login(mockUser);
    nmLogin(mockUser.id, mockUser.email, mockUser.name, "email");

    setLoading(false);
    router.push("/");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-bold tracking-[0.15em] text-ink">
            N·WALKS
          </Link>
          <h1 className="text-3xl font-bold text-ink mt-6 mb-2">Welcome back</h1>
          <p className="text-muted">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full border border-warm rounded-xl px-4 py-3 text-sm text-ink bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full border border-warm rounded-xl px-4 py-3 pr-11 text-sm text-ink bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs text-sage hover:text-sage-dark underline transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-sage font-semibold hover:text-sage-dark transition-colors"
          >
            Create one
          </Link>
        </p>

        <div className="mt-8 p-4 bg-sage/10 rounded-xl border border-sage/20">
          <p className="text-xs text-sage font-semibold mb-1">Demo Mode</p>
          <p className="text-xs text-muted">
            Enter any email and password to sign in. Auth state persists via Zustand + localStorage.
          </p>
        </div>
      </div>
    </div>
  );
}
