"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { setAdminLoggedIn } from "@/lib/store";

export default function AdminCallbackPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("Signing you in…");

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setMsg("Supabase not configured");
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      if (data.session) {
        setAdminLoggedIn(true);
        router.replace("/admin/products");
      } else {
        setMsg("No session. Try the login link again.");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <p className="text-sm text-[var(--muted)]">{msg}</p>
    </div>
  );
}
