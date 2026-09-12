"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase using your exact keys
const supabaseUrl = "https://bdsybutowmyvtrgzxzzh.supabase.co";
const supabaseKey = "sb_publishable_gC3nPrBXeWa8YmiAv4iFpA_X4BdVUUe";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminLoginPage() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, push straight to admin
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/admin/products");
      }
    });
  }, [router]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErr(error.message);
    } else {
      router.push("/admin/products");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#e8e0f5" }}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-sans">Admin Login</h1>
          <p className="mt-1 text-xs text-gray-500 font-sans">Secure management portal for store owners.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="owner@store.com"
              className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-full bg-purple-700 py-3 text-white font-medium hover:bg-purple-800 transition shadow-md"
          >
            {loading ? "Signing in..." : "Enter Admin"}
          </button>
        </form>

        {err ? (
          <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 font-sans">
            {err}
          </div>
        ) : null}

        <div className="text-center pt-2 border-t border-gray-100">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-800 font-sans">
            ← Back to shop
          </Link>
        </div>
      </div>
    </div>
  );
}
