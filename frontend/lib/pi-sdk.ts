// Pi SDK integration for authentication and blockchain access
// Documentation: https://developers.minepi.com/doc/javascript-sdk

export interface PiUser {
  uid: string
  username: string
}

export interface AuthResult {
  accessToken: string
  user: PiUser
}

export interface PaymentDTO {
  amount: number
  memo: string
  metadata: object
}

export interface PaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void
  onReadyForServerCompletion: (paymentId: string, txid: string) => void
  onCancel: (paymentId: string) => void
  onError: (error: Error, payment?: PaymentDTO) => void
}

export class PiSDK {
  private piInstance: any = null
  private initialized = false

  async initialize() {
    if (this.initialized) return

    // Load Pi SDK script dynamically
    if (typeof window !== "undefined") {
      await this.loadPiSDK()
      this.initialized = true
    }
  }

  private loadPiSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Pi) {
        this.piInstance = (window as any).Pi
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = "https://sdk.minepi.com/pi-sdk.js"
      script.async = true
      script.onload = () => {
        this.piInstance = (window as any).Pi
        resolve()
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  async authenticate(): Promise<AuthResult> {
    await this.initialize()

    if (!this.piInstance) {
      throw new Error("Pi SDK not initialized")
    }

    try {
      const scopes = ["username", "payments"]
      const authResult = await this.piInstance.authenticate(scopes, onIncompletePaymentFound)
      return authResult
    } catch (error) {
      console.error("Pi authentication error:", error)
      throw error
    }
  }

  async createPayment(payment: PaymentDTO, callbacks: PaymentCallbacks) {
    await this.initialize()

    if (!this.piInstance) {
      throw new Error("Pi SDK not initialized")
    }

    return this.piInstance.createPayment(payment, callbacks)
  }

  async getUser(): Promise<PiUser | null> {
    if (typeof window === "undefined") return null

    const stored = localStorage.getItem("pi_user")
    return stored ? JSON.parse(stored) : null
  }

  async signOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("pi_user")
      localStorage.removeItem("pi_access_token")
    }
  }

  async verifyWalletOwnership(address: string, uid: string): Promise<boolean> {
    await this.initialize()

    // In production, this would call Pi blockchain API
    // Example: GET https://api.mainnet.minepi.com/v2/wallet/{address}/verify
    try {
      // Mock implementation - replace with actual API call
      const response = await fetch(`https://api.mainnet.minepi.com/v2/wallet/${address}/info`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pi_access_token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        return data.exists && data.verified
      }
    } catch (error) {
      console.error("Wallet verification error:", error)
    }

    // Fallback to mock verification for demo
    return Math.random() > 0.3
  }

  async getWalletTransactions(address: string): Promise<any[]> {
    await this.initialize()

    try {
      // In production: GET https://api.mainnet.minepi.com/v2/transactions/{address}
      const response = await fetch(`https://api.mainnet.minepi.com/v2/transactions/${address}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pi_access_token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        return data.transactions || []
      }
    } catch (error) {
      console.error("Transaction fetch error:", error)
    }

    // Mock data for demonstration
    return [
      {
        id: "tx1",
        type: "receive",
        amount: 10.5,
        timestamp: "2025-06-01T10:00:00Z",
        from: "GBX...ABC",
      },
      {
        id: "tx2",
        type: "send",
        amount: 5.0,
        timestamp: "2025-06-02T14:30:00Z",
        to: "GBY...DEF",
      },
    ]
  }

  async checkWalletRiskScore(address: string, scamWallets: string[]): Promise<number> {
    await this.initialize()

    try {
      const transactions = await this.getWalletTransactions(address)

      // Calculate risk score based on interactions with scam wallets
      let riskScore = 0
      transactions.forEach((tx) => {
        const counterparty = tx.from || tx.to
        if (scamWallets.includes(counterparty)) {
          riskScore += 25 // Increase risk for each scam wallet interaction
        }
      })

      return Math.min(riskScore, 100) // Cap at 100
    } catch (error) {
      console.error("Risk score calculation error:", error)
      return 0
    }
  }
}

function onIncompletePaymentFound(payment: any) {
  console.log("Incomplete payment found:", payment)
  const txid = payment.transaction?.txid

  if (txid && !payment.status?.developer_completed) {
    return fetch("/api/pi/complete-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId: payment.identifier, txid }),
    })
  }

  if (!payment.status?.developer_approved) {
    return fetch("/api/pi/approve-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId: payment.identifier }),
    })
  }
}

const piSDK = new PiSDK()
