"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { calculateTrustScore, type TrustScoreResult } from "@/lib/trust-score";

type PiAuth = {
  accessToken: string;
  user: {
    uid?: string;
    username?: string;
  };
};

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
      init: (config: { version: string; sandbox?: boolean }) => void;
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound: (payment: PiPayment) => Promise<void> | void,
      ) => Promise<PiAuth>;
      createPayment: (
        payment: {
          amount: number;
          memo: string;
          metadata: Record<string, unknown>;
        },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => Promise<unknown> | unknown;
          onReadyForServerCompletion: (paymentId: string, txid: string) => Promise<unknown> | unknown;
          onCancel: (paymentId: string) => Promise<void> | void;
          onError: (error: Error, payment?: PiPayment) => void;
        },
      ) => Promise<void>;
    };
  }
}

const sampleLinks = [
  "https://wallet.pinet.com",
  "https://minepihub.com",
  "https://giftnetpi2025.com/wallet.php",
];

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

export default function Page() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<TrustScoreResult | null>(null);
  const [status, setStatus] = useState("Open in Pi Browser to connect your Pi account.");
  const [auth, setAuth] = useState<PiAuth | null>(null);
  const [busy, setBusy] = useState(false);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [activity, setActivity] = useState<string[]>([
    "SafePi is ready to scan links and connect with Pi Browser.",
  ]);

  const statusTone = useMemo(() => {
    if (auth) return "ready";
    if (status.toLowerCase().includes("failed") || status.toLowerCase().includes("pi browser")) return "warn";
    return "idle";
  }, [auth, status]);

  const addActivity = (message: string) => {
    setActivity((items) => [message, ...items].slice(0, 6));
  };

  const scanUrl = (value = url) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const score = calculateTrustScore(trimmed);
    setUrl(trimmed);
    setResult(score);
    addActivity(`Scanned ${trimmed}: ${score.threatLabel} (${score.score}/100).`);
  };

  const approvePayment = async (paymentId: string) => {
    addActivity("Approving Pi payment on the server.");
    return postJson("/api/pi/approve-payment", { paymentId });
  };

  const completePayment = async (paymentId: string, txid: string) => {
    addActivity("Completing Pi payment on the server.");
    return postJson("/api/pi/complete-payment", { paymentId, txid });
  };

  const cancelPayment = async (paymentId: string) => {
    addActivity(`Cancelling Pi payment ${paymentId}.`);
    return postJson("/api/pi/cancel-payment", { paymentId });
  };

  const handleIncompletePayment = async (payment: PiPayment) => {
    addActivity(`Found incomplete payment ${payment.identifier}.`);

    if (payment.transaction?.txid && !payment.status?.developer_completed) {
      await completePayment(payment.identifier, payment.transaction.txid);
      return;
    }

    if (!payment.status?.developer_approved) {
      await approvePayment(payment.identifier);
    }
  };

  const connectPi = async () => {
    setBusy(true);

    try {
      if (!window.Pi) {
        throw new Error("Pi SDK not found. Open this app inside Pi Browser.");
      }

      window.Pi.init({ version: "2.0", sandbox: isSandboxMode() });
      const nextAuth = await window.Pi.authenticate(["username", "payments"], handleIncompletePayment);
      await postJson("/api/pi/verify-user", { accessToken: nextAuth.accessToken });

      setAuth(nextAuth);
      setStatus(`Connected as @${nextAuth.user.username || "pioneer"}.`);
      addActivity("Pi account verified with the Platform API.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Pi connection failed.";
      setStatus(message);
      addActivity(message);
    } finally {
      setBusy(false);
    }
  };

  const createTestPayment = async () => {
    setPaymentBusy(true);

    try {
      if (!window.Pi) {
        throw new Error("Pi SDK not found. Open this app inside Pi Browser.");
      }

      await window.Pi.createPayment(
        {
          amount: 0.01,
          memo: "SafePi verification payment",
          metadata: {
            product: "safe-link-scan",
            createdAt: new Date().toISOString(),
          },
        },
        {
          onReadyForServerApproval: approvePayment,
          onReadyForServerCompletion: completePayment,
          onCancel: async (paymentId) => {
            await cancelPayment(paymentId);
            addActivity(`Payment ${paymentId} was cancelled.`);
          },
          onError: (error) => {
            addActivity(error.message || "Pi payment failed.");
          },
        },
      );

      addActivity("Pi payment completed.");
    } catch (error) {
      addActivity(error instanceof Error ? error.message : "Pi payment failed.");
    } finally {
      setPaymentBusy(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Pi safety scanner</p>
          <h1>SafePi</h1>
          <p className="lede">
            Scan suspicious Pi links, check trust signals, and connect your Pioneer account through the Pi SDK.
          </p>
          <div className="hero-actions">
            <button type="button" onClick={connectPi} disabled={busy}>
              {busy ? "Connecting..." : auth ? "Reconnect Pi" : "Connect Pi"}
            </button>
            <Link className="secondary-action" href="/scanner">
              Open scanner route
            </Link>
          </div>
        </div>

        <div className={`pi-status ${statusTone}`}>
          <span />
          <p>{status}</p>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="tool-panel scanner-panel">
          <div className="panel-heading">
            <p className="eyebrow">Live check</p>
            <h2>Scan a Pi link</h2>
          </div>

          <div className="scan-form">
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Paste a Pi, wallet, marketplace, or reward URL"
              aria-label="URL to scan"
            />
            <button type="button" onClick={() => scanUrl()}>
              Scan
            </button>
          </div>

          <div className="sample-row">
            {sampleLinks.map((sample) => (
              <button key={sample} type="button" onClick={() => scanUrl(sample)}>
                {sample.replace("https://", "")}
              </button>
            ))}
          </div>

          {result && (
            <div className={`result-card ${result.level}`}>
              <div>
                <p className="result-label">{result.threatLabel}</p>
                <h3>{result.score}/100 trust score</h3>
              </div>
              <ul>
                {result.factors.slice(0, 4).map((factor) => (
                  <li key={`${factor.name}-${factor.description}`}>
                    <strong>{factor.name}:</strong> {factor.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="tool-panel">
          <div className="panel-heading">
            <p className="eyebrow">Pi SDK</p>
            <h2>Payments and account</h2>
          </div>
          <p className="muted">
            After Pi connection, SafePi can request a small test payment and complete it through Vercel API routes.
          </p>
          <button type="button" onClick={createTestPayment} disabled={!auth || paymentBusy}>
            {paymentBusy ? "Opening Wallet..." : "Test 0.01 Pi payment"}
          </button>
          <div className="account-box">
            <span>Account</span>
            <strong>{auth?.user.username ? `@${auth.user.username}` : "Not connected"}</strong>
          </div>
        </div>
      </section>

      <section className="activity-panel">
        <h2>Activity</h2>
        <ol>
          {activity.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
