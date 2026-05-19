interface RateLimitEntry {
  count: number
  firstRequest: number
  blocked: boolean
  blockUntil?: number
}

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  blockDurationMs: number
  suspiciousThreshold: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 10, // 10 scans
  windowMs: 60 * 1000, // per minute
  blockDurationMs: 15 * 60 * 1000, // 15 minute block
  suspiciousThreshold: 20, // Flag as suspicious after 20 scans in window
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()
  private config: RateLimitConfig

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.loadFromStorage()
    this.startCleanup()
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem("rateLimits")
      if (stored) {
        const data = JSON.parse(stored)
        this.limits = new Map(Object.entries(data))
      }
    } catch (error) {
      console.error("[v0] Failed to load rate limits:", error)
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return

    try {
      const data = Object.fromEntries(this.limits)
      localStorage.setItem("rateLimits", JSON.stringify(data))
    } catch (error) {
      console.error("[v0] Failed to save rate limits:", error)
    }
  }

  private getIdentifier(): string {
    // Use a combination of factors to identify users
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      new Date().getTimezoneOffset(),
      screen.width,
      screen.height,
    ].join("|")

    // Simple hash function
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }

    return `user_${Math.abs(hash)}`
  }

  checkLimit(action: string = "scan"): {
    allowed: boolean
    remaining: number
    resetIn: number
    blocked: boolean
    suspicious: boolean
  } {
    const identifier = `${this.getIdentifier()}_${action}`
    const now = Date.now()
    const entry = this.limits.get(identifier)

    // Check if blocked
    if (entry?.blocked && entry.blockUntil) {
      if (now < entry.blockUntil) {
        return {
          allowed: false,
          remaining: 0,
          resetIn: entry.blockUntil - now,
          blocked: true,
          suspicious: true,
        }
      }
      // Block expired, reset
      this.limits.delete(identifier)
      this.saveToStorage()
    }

    // Check rate limit
    if (!entry || now - entry.firstRequest > this.config.windowMs) {
      // New window
      this.limits.set(identifier, {
        count: 1,
        firstRequest: now,
        blocked: false,
      })
      this.saveToStorage()

      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetIn: this.config.windowMs,
        blocked: false,
        suspicious: false,
      }
    }

    // Within window
    const newCount = entry.count + 1
    const suspicious = newCount >= this.config.suspiciousThreshold

    if (newCount > this.config.maxRequests) {
      // Block user
      this.limits.set(identifier, {
        ...entry,
        count: newCount,
        blocked: true,
        blockUntil: now + this.config.blockDurationMs,
      })
      this.saveToStorage()

      return {
        allowed: false,
        remaining: 0,
        resetIn: this.config.windowMs - (now - entry.firstRequest),
        blocked: true,
        suspicious: true,
      }
    }

    // Update count
    this.limits.set(identifier, {
      ...entry,
      count: newCount,
    })
    this.saveToStorage()

    return {
      allowed: true,
      remaining: this.config.maxRequests - newCount,
      resetIn: this.config.windowMs - (now - entry.firstRequest),
      blocked: false,
      suspicious,
    }
  }

  recordAction(action: string = "scan"): void {
    const identifier = `${this.getIdentifier()}_${action}`
    const now = Date.now()
    const entry = this.limits.get(identifier)

    if (!entry || now - entry.firstRequest > this.config.windowMs) {
      this.limits.set(identifier, {
        count: 1,
        firstRequest: now,
        blocked: false,
      })
    } else {
      this.limits.set(identifier, {
        ...entry,
        count: entry.count + 1,
      })
    }

    this.saveToStorage()
  }

  reset(action?: string): void {
    if (action) {
      const identifier = `${this.getIdentifier()}_${action}`
      this.limits.delete(identifier)
    } else {
      this.limits.clear()
    }
    this.saveToStorage()
  }

  private startCleanup() {
    if (typeof window === "undefined") return

    // Cleanup old entries every 5 minutes
    setInterval(() => {
      const now = Date.now()
      let cleaned = false

      for (const [key, entry] of this.limits.entries()) {
        // Remove entries older than 1 hour
        if (now - entry.firstRequest > 60 * 60 * 1000) {
          this.limits.delete(key)
          cleaned = true
        }
        // Remove expired blocks
        if (entry.blocked && entry.blockUntil && now > entry.blockUntil) {
          this.limits.delete(key)
          cleaned = true
        }
      }

      if (cleaned) {
        this.saveToStorage()
      }
    }, 5 * 60 * 1000)
  }

  getStats(): {
    totalEntries: number
    blockedUsers: number
    suspiciousActivity: number
  } {
    let blocked = 0
    let suspicious = 0

    for (const entry of this.limits.values()) {
      if (entry.blocked) blocked++
      if (entry.count >= this.config.suspiciousThreshold) suspicious++
    }

    return {
      totalEntries: this.limits.size,
      blockedUsers: blocked,
      suspiciousActivity: suspicious,
    }
  }
}

export const rateLimiter = new RateLimiter()

export function checkRateLimit(action: string = "scan") {
  return rateLimiter.checkLimit(action)
}

export function recordAction(action: string = "scan") {
  return rateLimiter.recordAction(action)
}

export function resetRateLimit(action?: string) {
  return rateLimiter.reset(action)
}
