export interface ScamWallet {
  address: string
  reports: number
  type: string
  description: string
  lastReported: string
  severity: "critical" | "high" | "medium"
}

export const scamWallets: ScamWallet[] = [
  {
    address: "GD7HK7QQG372CKUWDWGWQLH4F3WKNBPLIWFYCXT6HHJ7DIOHPA4YFRUS",
    reports: 2847,
    type: "Token Theft",
    description: "Known to steal Pi tokens during unlock process. Splits stolen funds into hundreds of wallets.",
    lastReported: "2025-06-15",
    severity: "critical",
  },
  {
    address: "GABC123EXAMPLE456WALLET789ADDRESSXYZ",
    reports: 1523,
    type: "Phishing",
    description: "Associated with fake airdrop campaigns. Collects tokens from victims of 2pidays scam.",
    lastReported: "2025-06-10",
    severity: "critical",
  },
  {
    address: "GDEF456SCAMMER789WALLET012ADDRESSABC",
    reports: 892,
    type: "Fake Exchange",
    description: "Pretends to be a Pi exchange. Takes deposits but never returns funds.",
    lastReported: "2025-06-08",
    severity: "high",
  },
  {
    address: "GHIJ789FRAUDULENT012WALLET345ADDRESSDEF",
    reports: 645,
    type: "Impersonation",
    description: "Claims to be Pi Core Team wallet. Used in fake verification scams.",
    lastReported: "2025-06-05",
    severity: "high",
  },
  {
    address: "GKLM012MALICIOUS345WALLET678ADDRESSGHI",
    reports: 423,
    type: "Token Drain",
    description: "Associated with fake wallet apps that drain user balances.",
    lastReported: "2025-06-01",
    severity: "critical",
  },
  {
    address: "GNOP345SUSPICIOUS678WALLET901ADDRESSJKL",
    reports: 318,
    type: "P2P Scam",
    description: "Fake P2P trader. Takes payment but never sends Pi tokens.",
    lastReported: "2025-05-28",
    severity: "medium",
  },
  {
    address: "GQRS678FRAUDSTER901WALLET234ADDRESSMNO",
    reports: 256,
    type: "Investment Scam",
    description: "Promises high returns on Pi investments. Never returns funds.",
    lastReported: "2025-05-25",
    severity: "high",
  },
  {
    address: "GTUV901MALWARE234WALLET567ADDRESSPQR",
    reports: 189,
    type: "Malware",
    description: "Connected to mining app malware. Automatically drains wallets.",
    lastReported: "2025-05-20",
    severity: "critical",
  },
]

export function checkWalletAddress(address: string): {
  isSafe: boolean
  walletInfo?: ScamWallet
} {
  const normalizedAddress = address.toUpperCase().trim()
  const scamWallet = scamWallets.find((wallet) => wallet.address === normalizedAddress)

  if (scamWallet) {
    return {
      isSafe: false,
      walletInfo: scamWallet,
    }
  }

  return {
    isSafe: true,
  }
}
