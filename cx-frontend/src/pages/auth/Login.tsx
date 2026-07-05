// FULL WORKING LOGIN PAGE (SAFE + BACKEND COMPATIBLE)

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Shield, Zap } from "lucide-react";
import { dashboardPath, saveUser } from "@/lib/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "https://proud-heart-b6a8.sabelo-tshazi-digifycx.workers.dev/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data); // 🔍 DEBUG

      // ❌ Handle server errors
      if (!res.ok) {
        setError(data?.error || "Login failed");
        return;
      }

      // ✅ Support multiple backend response formats
      const user = data.user || data;

      if (!user || !user.id) {
        console.error("Invalid response:", data);
        setError("Invalid server response. Contact support.");
        return;
      }

      // ✅ Save user
      saveUser({
        id: user.id,
        name: user.email?.split("@")[0] || "User",
        email: user.email,
        role: user.role,
        token: data.token,
        department: "Technical Support",
        avatar: "🤖",
      });

      // ✅ Navigate safely
      navigate(dashboardPath(user.role));

    } catch (err: any) {
      console.error("LOGIN ERROR:", err);
      setError(err?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">

        {/* LEFT SIDE */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-gradient-neon p-3">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold">CX Expert</h1>
          </div>

          <h2 className="text-4xl font-bold leading-tight">
            AI-Powered Support Operations Center
          </h2>

          <p className="mt-4 text-gray-400">
            Manage tickets, monitor SLAs, and collaborate across teams.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {["Tickets", "SLA", "Insights"].map((t) => (
              <div key={t} className="bg-gray-800 rounded-lg p-3 text-center">
                <Zap className="h-4 w-4 mx-auto text-cyan-400" />
                <p className="text-xs mt-1 text-gray-400">{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-800">
          <h3 className="text-2xl font-bold text-white">Sign In</h3>
          <p className="text-sm text-gray-400 mt-1">
            Enter your credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">

            <div>
              <label className="text-xs text-gray-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-white focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-900/20 border border-red-700 rounded-md p-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-cyan-500 py-3 font-semibold text-black hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-400">
            No account?{" "}
            <Link to="/register" className="text-cyan-400 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

