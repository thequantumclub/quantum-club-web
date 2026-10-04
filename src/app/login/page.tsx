"use client";

import { useState, Suspense } from "react";
import { login, signup } from "./actions";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", isError: false });

    const formData = new FormData(e.currentTarget);
    formData.append("next", next);

    const action = isLogin ? login : signup;
    
    try {
      const res = await action(formData);
      if (res?.error) {
        setMessage({ text: res.error, isError: !res.error.includes("check your email") });
      }
    } catch (err) {
      if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
        setMessage({ text: "An unexpected error occurred.", isError: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
      },
    });
    if (error) {
      setMessage({ text: error.message, isError: true });
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-gray-400">
          {isLogin 
            ? "Login to continue to your ticket purchase."
            : "Sign up to quickly purchase and manage tickets."}
        </p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 border rounded-xl text-sm text-center ${
          message.isError 
            ? "bg-red-500/10 border-red-500/30 text-red-400" 
            : "bg-green-500/10 border-green-500/30 text-green-400"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-silver transition-colors"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-silver transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-4 disabled:opacity-50"
        >
          {loading ? "Please wait..." : (isLogin ? "Login" : "Sign Up")}
        </button>
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-white/10"></div>
        <span className="px-4 text-gray-500 text-sm">or</span>
        <div className="flex-grow border-t border-white/10"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full bg-white text-black hover:bg-gray-200 rounded-xl px-4 py-3 font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      <div className="mt-6 text-center text-sm text-gray-400">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-white hover:underline focus:outline-none"
        >
          {isLogin ? "Sign up" : "Login"}
        </button>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="pt-32 pb-24 bg-brand-black min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 glass-panel rounded-3xl border border-white/5">
        <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
