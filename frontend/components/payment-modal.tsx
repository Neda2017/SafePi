"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Shield, Clock, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { PAYMENT_CONFIG } from "@/lib/payment-config"

interface PaymentModalProps {
  open: boolean
  onClose?: () => void
  onOpenChange?: (open: boolean) => void
  onPaymentComplete: () => void
  scansRemaining?: number
}

export function PaymentModal({
  open,
  onClose,
  onOpenChange,
  onPaymentComplete,
  scansRemaining = PAYMENT_CONFIG.FREE_SCANS_PER_DAY,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [isDev, setIsDev] = useState(false)

  useEffect(() => {
    setIsDev(PAYMENT_CONFIG.isDevelopmentMode())
  }, [])

  const handlePurchaseDailyPass = async () => {
    setIsProcessing(true)
    setPaymentStatus("processing")
    setErrorMessage("")

    try {
      if (isDev || PAYMENT_CONFIG.isDevelopmentMode()) {
        console.log("[v0] Development mode - simulating payment")
        await new Promise((resolve) => setTimeout(resolve, 1500))

        completePayment(`dev_payment_${Date.now()}`, `dev_txid_${Date.now()}`)
        return
      }

      if (typeof window === "undefined" || !window.Pi) {
        throw new Error("Pi SDK not available. Please use Pi Browser.")
      }

      console.log("[v0] Starting Pi payment flow...")

      // First authenticate with payments scope
      const authResult = await window.Pi.authenticate(
        ["username", "payments", "wallet_address"],
        onIncompletePaymentFound
      )
      console.log("[v0] Authenticated with payments scope")

      // Initialize wallet if needed
      try {
        const walletAddress = await window.Pi.requestWalletAddress?.()
        if (!walletAddress) {
          throw new Error("Wallet not initialized. Please create a wallet in Pi Browser.")
        }
        console.log("[v0] Wallet address verified:", walletAddress)
      } catch (walletError) {
        console.error("[v0] Wallet error:", walletError)
        throw new Error(
          "Wallet not initialized. Please create a wallet in Pi App > Settings > Wallet before making payments."
        )
      }

      await window.Pi.createPayment(
        {
          amount: PAYMENT_CONFIG.DAILY_PASS_PRICE,
          memo: PAYMENT_CONFIG.PAYMENT_MEMO,
          metadata: {
            product: "daily_pass",
            timestamp: Date.now(),
          },
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            console.log("[v0] Payment ready for approval:", paymentId)
            await postJson("/api/pi/approve-payment", { paymentId })
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            console.log("[v0] Payment completed:", paymentId, txid)
            await postJson("/api/pi/complete-payment", { paymentId, txid })
            completePayment(paymentId, txid)
          },
          onCancel: async (paymentId: string) => {
            console.log("[v0] Payment cancelled")
            await postJson("/api/pi/cancel-payment", { paymentId }).catch(console.error)
            setPaymentStatus("error")
            setErrorMessage("Payment was cancelled")
            setIsProcessing(false)
          },
          onError: (error: Error) => {
            console.error("[v0] Payment error:", error.message)
            // Better error messages
            let userMessage = error.message || "Payment failed"
            if (
              userMessage.includes("developer") ||
              userMessage.includes("wallet") ||
              userMessage.includes("not created")
            ) {
              userMessage =
                "Developer wallet not configured. Contact app developer to set up payment wallet in Pi Admin Portal."
            } else if (userMessage.includes("insufficient")) {
              userMessage = "Insufficient Pi balance. Please add more Pi to your wallet."
            }
            setPaymentStatus("error")
            setErrorMessage(userMessage)
            setIsProcessing(false)
          },
        },
      )
    } catch (error: any) {
      console.error("[v0] Payment error:", error)
      let userMessage = error.message || "Payment failed. Please try again."

      // Provide specific error messages
      if (userMessage.includes("not available")) {
        userMessage = "Pi SDK not available. Please use Pi Browser to make payments."
      } else if (userMessage.includes("Wallet not initialized")) {
        userMessage =
          "Your Pi Wallet is not initialized. Go to Pi App > Settings > Wallet to create one."
      } else if (userMessage.includes("developer") || userMessage.includes("not created")) {
        userMessage =
          "Developer wallet not configured. Contact the app developer to enable payments in Pi Admin Portal."
      }

      setPaymentStatus("error")
      setErrorMessage(userMessage)
      setIsProcessing(false)
    }
  }

  function onIncompletePaymentFound(payment: any) {
    console.log("[v0] Incomplete payment found:", payment)
    const txid = payment.transaction?.txid
    if (txid && !payment.status?.developer_completed) {
      return postJson("/api/pi/complete-payment", { paymentId: payment.identifier, txid })
    }

    if (!payment.status?.developer_approved) {
      return postJson("/api/pi/approve-payment", { paymentId: payment.identifier })
    }
  }

  const completePayment = async (paymentId: string, txid: string) => {
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000
    localStorage.setItem(
      "dailyPass",
      JSON.stringify({
        active: true,
        expiresAt,
        txid,
        paymentId,
      }),
    )

    setPaymentStatus("success")
    setIsProcessing(false)

    setTimeout(() => {
      onPaymentComplete()
      closeModal()
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? onOpenChange?.(true) : closeModal())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-500" />
            Upgrade to Daily Pass
          </DialogTitle>
          <DialogDescription>Get unlimited scans for 24 hours</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isDev && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
              <p className="text-xs text-yellow-500 text-center">Development Mode - Payment will be simulated</p>
            </div>
          )}

          {paymentStatus === "idle" && (
            <>
              <div className="bg-zinc-900 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Free scans remaining today:</span>
                  <span className="text-lg font-bold text-orange-500">{scansRemaining}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Daily Pass Price:</span>
                  <span className="text-2xl font-bold text-green-500">{PAYMENT_CONFIG.DAILY_PASS_PRICE} Pi</span>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-400">
                    You'll be prompted to grant payment permission and approve the transaction in your Pi Wallet.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Includes:</h4>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Unlimited URL scans for 24 hours
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Unlimited wallet address checks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Access to all premium features
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    Valid for 24 hours from purchase
                  </li>
                </ul>
              </div>

              <Button
                onClick={handlePurchaseDailyPass}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Purchase Daily Pass for {PAYMENT_CONFIG.DAILY_PASS_PRICE} Pi</>
                )}
              </Button>
            </>
          )}

          {paymentStatus === "processing" && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
              <p className="text-lg font-semibold">Processing Payment...</p>
              <p className="text-sm text-zinc-400 mt-2">Please complete the payment in the Pi Wallet</p>
            </div>
          )}

          {paymentStatus === "success" && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-green-500">Payment Successful!</p>
              <p className="text-sm text-zinc-400 mt-2">Your daily pass is now active</p>
            </div>
          )}

          {paymentStatus === "error" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">❌</span>
              </div>
              <p className="text-lg font-semibold text-red-500">Payment Failed</p>
              <p className="text-sm text-zinc-400 mt-2">{errorMessage}</p>
              <Button
                onClick={() => {
                  setPaymentStatus("idle")
                  setErrorMessage("")
                }}
                variant="outline"
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )

  function closeModal() {
    onOpenChange?.(false)
    onClose?.()
  }
}

async function postJson(path: string, body: Record<string, unknown>) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || "Request failed")
  }

  return data
}
