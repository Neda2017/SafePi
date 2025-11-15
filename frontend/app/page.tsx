"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [piReady, setPiReady] = useState(false);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://safepi-botj.onrender.com";

  // Load Pi SDK + authenticate user
  useEffect(() => {
    const loadPiSDK = () => {
      if (typeof window !== "undefined" && window.Pi) {
        console.log("Pi SDK detected");

        window.Pi.init({
          version: "2.0",
          sandbox: false, // set to true if sandbox mode
        });

        window.Pi.authenticate(["payments"], (incomplete) => {
          console.log("Incomplete payment found:", incomplete);
        })
          .then((auth) => {
            console.log("Pi User Authenticated:", auth);
            setPiReady(true);
          })
          .catch((err) => console.error("Pi Auth Error:", err));
      } else {
        console.log("Pi SDK NOT detected (not inside Pi Browser?)");
      }
    };

    loadPiSDK();
  }, []);

  // Handle full payment flow
  async function handlePayment() {
    if (!piReady) {
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
      onReadyForServerApproval: async (paymentId) => {
        console.log("Ready for server approval:", paymentId);

        const res = await fetch(`${BACKEND_URL}/api/create-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId }),
        });

        const data = await res.json();
        console.log("Server Approval Response:", data);
      },

      onReadyForServerCompletion: async (paymentId, txid) => {
        console.log("Ready for server completion:", paymentId, txid);

        const res = await fetch(`${BACKEND_URL}/api/complete-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, txid }),
        });

        const data = await res.json();
        console.log("Server Completion Response:", data);
      },

      onCancel: (paymentId) => {
        console.warn("Payment Cancelled:", paymentId);
      },

      onError: (error, payment) => {
        console.error("Payment Error:", error, payment);
      },
    };

    try {
      const payment = await window.Pi.createPayment(paymentData, paymentCallbacks);
      console.log("Client payment created:", payment);
    } catch (error) {
      console.error("Pi.createPayment error:", error);
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
