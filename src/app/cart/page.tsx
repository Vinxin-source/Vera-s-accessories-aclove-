import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CartView } from "@/components/CartView";

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <h1 className="font-display text-3xl mb-8 animate-fade-up">Your cart</h1>
        <CartView />
      </main>
      <SiteFooter />
    </div>
  );
}
