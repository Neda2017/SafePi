export class SafePiAPIClient {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl = "/api", apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  async checkUrl(url: string): Promise<any> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (this.apiKey) {
      headers["X-API-Key"] = this.apiKey
    }

    const response = await fetch(`${this.baseUrl}/check-url`, {
      method: "POST",
      headers,
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async checkWallet(address: string): Promise<any> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (this.apiKey) {
      headers["X-API-Key"] = this.apiKey
    }

    const response = await fetch(`${this.baseUrl}/check-wallet`, {
      method: "POST",
      headers,
      body: JSON.stringify({ address }),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async submitReport(data: any): Promise<any> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (this.apiKey) {
      headers["X-API-Key"] = this.apiKey
    }

    const response = await fetch(`${this.baseUrl}/reports`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}

// Export singleton for easy use
export const safepiAPI = new SafePiAPIClient()
