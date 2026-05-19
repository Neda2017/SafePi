"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { setApiAuthToken } from "@/lib/api";

export type LoginDTO = {
  id: string;
  username: string;
  credits_balance: number;
  terms_accepted: boolean;
};

interface PiAuthResult {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
}

type PiPayment = {
  identifier: string;
  status?: {
    developer_approved?: boolean;
    developer_completed?: boolean;
  };
  transaction?: {
    txid?: string;
  } | null;
};

declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox?: boolean }) => void | Promise<void>;
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound?: (payment: PiPayment) => Promise<void> | void,
      ) => Promise<PiAuthResult>;
    };
  }
}

interface PiAuthContextType {
  isAuthenticated: boolean;
  authMessage: string;
  piAccessToken: string | null;
  userData: LoginDTO | null;
  reinitialize: () => Promise<void>;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

function isSandboxMode() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("sandbox") === "true";
}

async function postJson(path: string, body: Record<string, unknown>) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

async function handleIncompletePayment(payment: PiPayment) {
  if (payment.transaction?.txid && !payment.status?.developer_completed) {
    await postJson("/api/pi/complete-payment", {
      paymentId: payment.identifier,
      txid: payment.transaction.txid,
    });
    return;
  }

  if (!payment.status?.developer_approved) {
    await postJson("/api/pi/approve-payment", { paymentId: payment.identifier });
  }
}

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState("Open in Pi Browser to connect.");
  const [piAccessToken, setPiAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<LoginDTO | null>(null);

  const initializePiAndAuthenticate = async () => {
    try {
      setAuthMessage("Checking Pi Browser...");

      if (typeof window === "undefined" || !window.Pi) {
        setAuthMessage("Pi SDK is available only inside Pi Browser.");
        return;
      }

      setAuthMessage("Initializing Pi SDK...");
      await window.Pi.init({ version: "2.0", sandbox: isSandboxMode() });

      setAuthMessage("Authenticating with Pi Network...");
      const piAuthResult = await window.Pi.authenticate(["username", "payments"], handleIncompletePayment);

      await postJson("/api/pi/verify-user", { accessToken: piAuthResult.accessToken });

      setPiAccessToken(piAuthResult.accessToken);
      setApiAuthToken(piAuthResult.accessToken);
      setUserData({
        id: piAuthResult.user.uid,
        username: piAuthResult.user.username,
        credits_balance: 0,
        terms_accepted: true,
      });
      setIsAuthenticated(true);
      setAuthMessage(`Connected as @${piAuthResult.user.username}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Pi authentication failed.";
      console.error("Pi Network initialization failed:", error);
      setAuthMessage(message);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    initializePiAndAuthenticate();
  }, []);

  return (
    <PiAuthContext.Provider
      value={{
        isAuthenticated,
        authMessage,
        piAccessToken,
        userData,
        reinitialize: initializePiAndAuthenticate,
      }}
    >
      {children}
    </PiAuthContext.Provider>
  );
}

export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (context === undefined) {
    throw new Error("usePiAuth must be used within a PiAuthProvider");
  }
  return context;
}
