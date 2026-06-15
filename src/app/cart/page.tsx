"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Trash, ShoppingBag, CreditCard } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/site/Container";
import axios from "@/api/axios";
import { RootState } from "@/store";
import Checkout from "@/components/Checkout";

export default function CartPage() {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const headers = {
      id: localStorage.getItem("id") || "",
      authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    };
    try {
      setLoading(true);
      const res = await axios.get("/cart/getUserCart", { headers });
      setCart(res.data.data || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    } else {
      fetchCart();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (cart && cart.length > 0) {
      let sum = 0;
      cart.forEach((item) => {
        sum += parseFloat(item.price || 0);
      });
      setTotal(sum);
    } else {
      setTotal(0);
    }
  }, [cart]);

  const deleteItem = async (id: string) => {
    const headers = {
      id: localStorage.getItem("id") || "",
      authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    };
    try {
      const response = await axios.put(
        `/cart/removeFromCart/${id}`,
        {},
        { headers }
      );
      alert(response.data.message);
      // Refresh cart
      fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    router.push("/profile/OrderHistory");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <Container className="py-10 flex-1">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          Your Wishlist
        </h1>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-24 bg-surface-container rounded-2xl" />
            <div className="h-24 bg-surface-container rounded-2xl" />
            <div className="h-24 bg-surface-container rounded-2xl" />
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center py-20 bg-card border border-outline-variant/30 rounded-2xl max-w-xl mx-auto p-8 shadow-[0_4px_30px_-10px_rgba(21,25,106,0.05)]">
            <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-6">
              <ShoppingBag className="size-10" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Wishlist is Empty</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              You haven't added any books to your wishlist yet.
            </p>
            <button 
              onClick={() => router.push("/books")}
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-container transition"
            >
              Explore Books
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* Wishlist Items List */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div 
                  key={item._id}
                  className="bg-card border border-outline-variant/35 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-center justify-between shadow-[0_2px_12px_-6px_rgba(21,25,106,0.1)] hover:shadow-[0_4px_20px_-8px_rgba(21,25,106,0.15)] transition"
                >
                  <img 
                    src={item.coverUrl} 
                    alt={item.title} 
                    className="h-24 w-18 object-cover rounded-md shadow-sm border"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="font-display font-semibold text-lg text-foreground">{item.title}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">by {item.author}</p>
                    <p className="text-sm text-foreground/80 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-outline-variant/30">
                    <span className="font-display text-xl font-bold text-primary">
                      ${parseFloat(item.price).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => deleteItem(item._id)}
                      className="p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition"
                      aria-label="Remove item"
                    >
                      <Trash className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-card border border-outline-variant/35 rounded-2xl p-6 shadow-[0_4px_24px_-10px_rgba(21,25,106,0.15)]">
              <h2 className="font-display font-bold text-xl text-foreground mb-4">Total Amount</h2>
              <div className="divide-y divide-outline-variant/30 text-sm">
                <div className="py-3 flex justify-between text-muted-foreground">
                  <span>Items</span>
                  <span>{cart.length} books</span>
                </div>
                <div className="py-4 flex justify-between font-display text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => setShowCheckout(true)}
                className="w-full mt-6 rounded-xl bg-primary text-white font-semibold py-3 hover:bg-primary-container transition duration-300 flex items-center justify-center gap-2"
              >
                <CreditCard className="size-4" />
                Place Order
              </button>
            </div>
          </div>
        )}
      </Container>

      {/* Checkout Modal */}
      {showCheckout && (
        <Checkout
          amount={total}
          orders={cart}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowCheckout(false)}
        />
      )}

      <SiteFooter />
    </div>
  );
}
