// Register page — connects to Cloudflare Workers backend
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Shield, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE_URL = "https://proud-heart-b6a8.sabelo-tshazi-digifycx.workers.dev";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate inputs
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Call the register API
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Registration successful
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Branding */}
        <div className="hidden lg:block animate-float-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-gradient-neon p-3 glow-blue animate-pulse-glow">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">CX Expert</h1>
          </div>
          <h2 className="text-4xl font-bold leading-tight">
            Create Your <span className="text-gradient">Account</span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Join our AI-powered support platform and streamline your ticket management experience.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {["Secure", "Fast", "Smart"].map((t) => (
              <div key={t} className="glass rounded-lg p-3 text-center">
                <ShieldCheck className="h-4 w-4 mx-auto text-neon-cyan" />
                <p className="text-xs mt-1 text-muted-foreground">{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Register card */}
        <div className="glass rounded-2xl p-6 sm:p-8 neon-border animate-float-in">
          <h3 className="text-2xl font-bold">Create Account</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Sign up to get started with CX Expert.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-1 w-full rounded-lg bg-input border border-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg bg-input border border-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Password must be at least 4 characters.
              </p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg bg-input border border-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
                required
              />
            </div>
            
            {error && (
              <p className="text-xs text-danger bg-danger/10 border border-danger/30 rounded-md p-2">
                {error}
              </p>
            )}
            
            {success && (
              <p className="text-xs text-green-500 bg-green-500/10 border border-green-500/30 rounded-md p-2">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-neon py-3 font-semibold text-primary-foreground glow-blue hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-neon-cyan hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}