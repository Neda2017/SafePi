"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [piReady, setPiReady] = useState(false);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://safepi-botj.onrender.com";

  useEffect(() => {
    const loadPiSDK = () => {
      const Pi = (window as any).Pi;

      if (typeof window !== "undefined" && Pi) {
        console.log("Pi SDK detected");

        Pi.init({
          version: "2.0",
          sandbox: false,
        });

        Pi.authenticate(["payments"], (incomplete: any) => {
          console.log("Incomplete payment found:", incomplete);
        })
          .then((auth: any) => {
            console.log("User Authenticated:", auth);
            setPiReady(true);
          })
          .catch((err: any) => console.error("Pi Auth Error:", err));
      } else {
        console.log("Pi SDK NOT detected — open inside Pi Browser");
      }
    };

    loadPiSDK();
  }, []);

  async function handlePayment() {
    const Pi = (window as any).Pi;

    if (!piReady || !Pi) {
      alert("Pi SDK not ready yet. Please open inside Pi Browser.");
      return;
    }

    console.log("Starting Pi payment...");

    const paymentData = {
      amount: 1,
      memo: "SafePi Test Payment",
      metadata: { orderId: "SP-0001" },
    };

    const paymentCallbacks = {
      onReadyForServerApproval: async (paymentId: string) => {
        console.log("Server approval needed:", paymentId);

        const res = await fetch(`${BACKEND_URL}/api/create-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId }),
        });

        const data = await res.json();
        console.log("Approval response:", data);
      },

      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        console.log("Server completion:", paymentId, txid);

        const res = await fetch(`${BACKEND_URL}/api/complete-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, txid }),
        });

        const data = await res.json();
        console.log("Completion response:", data);
      },

      onCancel: (paymentId: string) => {
        console.warn("Payment Cancelled:", paymentId);
      },

      onError: (error: string, payment: any) => {
        console.error("Payment Error:", error, payment);
      },
    };

    try {
      const payment = await Pi.createPayment(paymentData, paymentCallbacks);
      console.log("Client payment created:", payment);
    } catch (error) {
      console.error("Payment creation error:", error);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>SafePi Payment</h1>

      <button
        onClick={handlePayment}
        style={{
          padding: "12px 22px",
          background: "purple",
          color: "white",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          marginTop: "20px",
        }}
      >
        Pay 1 π
      </button>
    </div>
  );
}
