"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_SETTINGS,
  getSettings,
  saveSettings,
  setAdminPassword,
  getAdminPassword,
  checkAdminPassword,
  type StoreSettings,
} from "@/lib/store";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passMsg, setPassMsg] = useState("");

  useEffect(() => {
    setForm(getSettings());
  }, []);

  function onLogo(file: File | null) {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 1.5 * 1024 * 1024) {
      alert("Logo under 1.5MB please");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, logoDataUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    saveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 animate-fade-up">
      <div className="flex flex-wrap gap-3 text-sm text-[var(--muted)]">
        <Link href="/admin/products">Products</Link>
        <span>·</span>
        <Link href="/admin/orders">Orders</Link>
        <span>·</span>
        <Link href="/">View store</Link>
      </div>
      <h1 className="mt-4 font-display text-3xl">Store settings</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Name, logo, WhatsApp, and bank account — you control these. No developer needed.
      </p>

      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm">
          Store name
          <input
            className="mt-1 w-full rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 py-2.5"
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          Tagline
          <input
            className="mt-1 w-full rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 py-2.5"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          />
        </label>
        <div>
          <p className="text-sm mb-1">Logo</p>
          <input type="file" accept="image/*" onChange={(e) => onLogo(e.target.files?.[0] || null)} />
          {form.logoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.logoDataUrl} alt="" className="mt-3 h-16 w-16 rounded-full object-cover border border-[var(--line)]" />
          ) : null}
        </div>
        <label className="block text-sm">
          WhatsApp (e.g. 2348012345678)
          <input
            className="mt-1 w-full rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 py-2.5"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          Instagram URL
          <input
            className="mt-1 w-full rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 py-2.5"
            value={form.instagram}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
          />
        </label>
        <hr className="border-[var(--line)]" />
        <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Bank details for checkout</p>
        <label className="block text-sm">
          Bank name
          <input className="mt-1 w-full rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 py-2.5" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
        </label>
        <label className="block text-sm">
          Account name
          <input className="mt-1 w-full rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 py-2.5" value={form.accountName} onChange={(e) => setForm({ ...form, accountName: e.target.value })} />
        </label>
        <label className="block text-sm">
          Account number
          <input className="mt-1 w-full rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 py-2.5" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} />
        </label>
        
        <hr className="border-[var(--line)]" />
        
        <hr className="border-[var(--line)]" />
        <p className="text-xs uppercase tracking-wide text-[var(--muted)]">About page</p>
        <label className="block text-sm">
          About title
          <input
            className="mt-1 w-full rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 py-2.5"
            value={form.aboutTitle || ""}
            onChange={(e) => setForm({ ...form, aboutTitle: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          About text
          <textarea
            className="mt-1 w-full rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 py-2.5"
            rows={6}
            value={form.aboutBody || ""}
            onChange={(e) => setForm({ ...form, aboutBody: e.target.value })}
          />
        </label>

        <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Brand colours</p>
        <p className="text-xs text-[var(--muted)]">Default is purple. Change anytime — store updates live.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="text-sm">
            Primary
            <input type="color" className="mt-1 h-12 w-full cursor-pointer rounded-lg border border-[var(--line)]"
              value={form.primaryColor || "#6D28D9"}
              onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} />
          </label>
          <label className="text-sm">
            Accent
            <input type="color" className="mt-1 h-12 w-full cursor-pointer rounded-lg border border-[var(--line)]"
              value={form.accentColor || "#A78BFA"}
              onChange={(e) => setForm({ ...form, accentColor: e.target.value })} />
          </label>
          <label className="text-sm">
            Background
            <input type="color" className="mt-1 h-12 w-full cursor-pointer rounded-lg border border-[var(--line)]"
              value={form.backgroundColor || "#F5F3FF"}
              onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })} />
          </label>
        </div>

        
        <label className="block text-sm">
          Shipping fee (NGN)
          <input
            type="number"
            min={0}
            className="mt-1 w-full rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 py-2.5"
            value={form.shippingFee ?? 2500}
            onChange={(e) => setForm({ ...form, shippingFee: Number(e.target.value) || 0 })}
          />
        </label>
        <label className="block text-sm">
          Admin recovery Gmail
          <input
            type="email"
            className="mt-1 w-full rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 py-2.5"
            placeholder="you@gmail.com"
            value={form.adminEmail || ""}
            onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
          />
        </label>
        <p className="text-xs text-[var(--muted)]">
          Saved for your records. Full “reset via Gmail link” needs free Supabase Auth (optional next step).
        </p>

        <label className="block text-sm">
          Shipping note
          <textarea className="mt-1 w-full rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 py-2.5" rows={3} value={form.shippingNote} onChange={(e) => setForm({ ...form, shippingNote: e.target.value })} />
        </label>
        
        <hr className="border-[var(--line)]" />
        <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Admin password</p>
        <p className="text-xs text-[var(--muted)]">Client can change this anytime. Min 4 characters.</p>
        <label className="block text-sm">
          Current password
          <input
            type="password"
            className="mt-1 w-full rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 py-2.5"
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        <label className="block text-sm">
          New password
          <input
            type="password"
            className="mt-1 w-full rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 py-2.5"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        <label className="block text-sm">
          Confirm password
          <input
            type="password"
            className="mt-1 w-full rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 py-2.5"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setPassMsg("");
            if (!checkAdminPassword(currentPass)) {
              setPassMsg("Current password is wrong");
              return;
            }
            if (newPass.length < 4) {
              setPassMsg("At least 4 characters");
              return;
            }
            if (newPass !== confirmPass) {
              setPassMsg("Passwords do not match");
              return;
            }
            try {
              setAdminPassword(newPass);
              setCurrentPass("");
              setNewPass("");
              setConfirmPass("");
              setPassMsg("Password updated");
            } catch (e) {
              setPassMsg(e instanceof Error ? e.message : "Failed");
            }
          }}
        >
          Update password
        </button>
        {passMsg ? <p className="text-sm text-[var(--muted)]">{passMsg}</p> : null}

        <button type="submit" className="btn btn-primary w-full sm:w-auto">
          {saved ? "Saved ✓" : "Save settings"}
        </button>
      </form>
    </div>
  );
}
