import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CheckoutForm } from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10">
        <h1 className="font-display text-3xl mb-2 animate-fade-up">Checkout</h1>
        <p className="text-sm text-[var(--muted)] mb-8 animate-fade-up">
          Place your order — Vera will confirm by phone / WhatsApp.
        </p>
        <CheckoutForm />
      </main>
      <SiteFooter />
    </div>
  );
}
