"use client";

// Stays "use client": multi-step form, gender/category pickers, auth redirect.
// trackEvent / identifyUser removed — re-add when Netmera is re-enabled.

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { nmIdentify, nmRegister } from "@/lib/netmera-events";
import Button from "@/components/ui/Button";
import type { User, Gender, ProductCategory } from "@/types";

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<Gender>("other");
  const [favoriteCategory, setFavoriteCategory] = useState<ProductCategory | "">("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  // Redirect already-authenticated users
  useEffect(() => {
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const mockUser: User = {
      id: `user_${email.split("@")[0]}_${Date.now()}`,
      email,
      name,
      gender,
      favoriteCategory: favoriteCategory || undefined,
      createdAt: new Date().toISOString(),
    };

    login(mockUser);
    nmIdentify(mockUser.id, {
      email: mockUser.email,
      name: mockUser.name,
      gender: mockUser.gender,
      favoriteCategory: mockUser.favoriteCategory,
    });
    nmRegister(mockUser.id, mockUser.email, mockUser.gender, mockUser.favoriteCategory ?? "");

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
          <h1 className="text-3xl font-bold text-ink mt-6 mb-2">Create account</h1>
          <p className="text-muted">Join the movement. Walk lightly.</p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s <= step ? "bg-sage w-10" : "bg-warm w-6"
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleStep1} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                autoComplete="name"
                className="w-full border border-warm rounded-xl px-4 py-3 text-sm text-ink bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sage transition-all"
              />
            </div>

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
                className="w-full border border-warm rounded-xl px-4 py-3 text-sm text-ink bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sage transition-all"
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
                  autoComplete="new-password"
                  className="w-full border border-warm rounded-xl px-4 py-3 pr-11 text-sm text-ink bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sage transition-all"
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

            <Button type="submit" variant="primary" size="lg" fullWidth>
              Continue
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-sm text-muted bg-cream rounded-xl px-4 py-3">
              Help us personalise your experience — these preferences power product recommendations.
            </p>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-3">
                I shop for
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["female", "male", "other"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                      gender === g
                        ? "border-ink bg-ink text-white"
                        : "border-warm text-muted hover:border-muted hover:text-ink"
                    }`}
                  >
                    {g === "female" ? "Women" : g === "male" ? "Men" : "Both"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-3">
                Favourite style{" "}
                <span className="font-normal normal-case tracking-normal text-gray-400">
                  (optional)
                </span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "women", label: "Running" },
                  { value: "men", label: "Casual" },
                  { value: "new-arrivals", label: "Trail" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setFavoriteCategory((prev) =>
                        prev === opt.value ? "" : (opt.value as ProductCategory)
                      )
                    }
                    className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                      favoriteCategory === opt.value
                        ? "border-sage bg-sage/10 text-sage"
                        : "border-warm text-muted hover:border-muted hover:text-ink"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                Create Account
              </Button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-muted hover:text-ink text-center mt-3 transition-colors"
              >
                ← Back
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-sage font-semibold hover:text-sage-dark transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
