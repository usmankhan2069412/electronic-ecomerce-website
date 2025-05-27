import * as React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/toast-context";
import axios from "axios";

// Initialize Stripe promise
const stripePromise = loadStripe("pk_test_51OXaMpLkjaNGkjsNGkjsNGkjsN");

interface CheckoutProps {
  amount: number;
  items: any[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function StripeCheckout({ amount, items, onSuccess, onCancel }: CheckoutProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/payment/create-payment-intent", {
          amount,
          items
        });
        
        setClientSecret(response.data.clientSecret);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to initialize payment");
        toast({
          title: "Error",
          description: err.response?.data?.error || "Failed to initialize payment",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, items]);

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#3b82f6',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={onCancel}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
        </Elements>
      )}
    </div>
  );
}

function CheckoutForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
      redirect: 'if_required'
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
      toast({
        title: "Payment failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage("Payment successful!");
      toast({
        title: "Success",
        description: "Your payment was processed successfully!"
      });
      onSuccess();
    } else {
      setMessage("An unexpected error occurred.");
      toast({
        title: "Error",
        description: "An unexpected error occurred during payment processing.",
        variant: "destructive"
      });
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {message && <div className="text-sm text-red-500 mt-2">{message}</div>}
      
      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || isProcessing}>
          {isProcessing ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </form>
  );
}
