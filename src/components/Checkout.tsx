"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "@/api/axios";

// Standard Stripe loading using Next.js public environment variable prefix
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = loadStripe(stripePublishableKey);

interface CheckoutFormProps {
  amount: number;
  orders: any[];
  onSuccess: () => void;
}

const CheckoutForm = ({ amount, orders, onSuccess }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const headers = {
      id: localStorage.getItem("id") || "",
      authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    };

    try {
      // Step 1 - Get client secret from backend
      const { data } = await axios.post(
        "/order/createPaymentIntent",
        { amount: Math.round(amount * 100) }, // convert to cents
        { headers }
      );

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError("Payment element not loaded.");
        setLoading(false);
        return;
      }

      // Step 2 - Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setError(result.error.message || "Stripe confirmation error");
        setLoading(false);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        // Step 3 - Place order after payment
        await axios.post("/order/placeOrder", { order: orders }, { headers });
        alert("Payment successful! Order placed.");
        onSuccess();
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-800 p-6 rounded-lg w-full">
      <h2 className="text-zinc-200 text-xl font-semibold mb-4">Complete Payment</h2>
      
      <div className="bg-zinc-900 p-3 rounded mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#ffffff",
                "::placeholder": { color: "#a1a1aa" },
              },
              invalid: { color: "#ef4444" },
            },
          }}
        />
      </div>

      <p className="text-zinc-400 text-sm mb-4">
        Total: <span className="text-white font-semibold">${amount.toFixed(2)}</span>
      </p>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-all duration-300 disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

interface CheckoutProps {
  amount: number;
  orders: any[];
  onSuccess: () => void;
  onClose: () => void;
}

const Checkout = ({ amount, orders, onSuccess, onClose }: CheckoutProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="w-full md:w-2/6 mx-4">
        <Elements stripe={stripePromise}>
          <CheckoutForm amount={amount} orders={orders} onSuccess={onSuccess} />
        </Elements>
        <button
          className="mt-3 w-full text-zinc-400 hover:text-white text-sm"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Checkout;
