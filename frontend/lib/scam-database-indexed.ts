export interface ScamEntry {
  url: string
  type: string
  description: string
  severity: "high" | "medium" | "critical"
  reports: number
  lastReported: string
  category: string
}

// Database index for O(1) lookups
export class ScamDatabaseIndex {
  private urlIndex: Map<string, ScamEntry>
  private categoryIndex: Map<string, ScamEntry[]>
  private severityIndex: Map<string, ScamEntry[]>

  constructor(entries: ScamEntry[]) {
    this.urlIndex = new Map()
    this.categoryIndex = new Map()
    this.severityIndex = new Map()

    this.buildIndexes(entries)
  }

  private buildIndexes(entries: ScamEntry[]) {
    entries.forEach((entry) => {
      // URL index for fast exact lookups
      const normalized = this.normalizeUrl(entry.url)
      this.urlIndex.set(normalized, entry)

      // Category index
      if (!this.categoryIndex.has(entry.type)) {
        this.categoryIndex.set(entry.type, [])
      }
      this.categoryIndex.get(entry.type)!.push(entry)

      // Severity index
      if (!this.severityIndex.has(entry.severity)) {
        this.severityIndex.set(entry.severity, [])
      }
      this.severityIndex.get(entry.severity)!.push(entry)
    })
  }

  private normalizeUrl(url: string): string {
    return url
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
      .replace(/^www\./, "")
  }

  findByUrl(url: string): ScamEntry | undefined {
    return this.urlIndex.get(this.normalizeUrl(url))
  }

  findByCategory(category: string): ScamEntry[] {
    return this.categoryIndex.get(category) || []
  }

  findBySeverity(severity: string): ScamEntry[] {
    return this.severityIndex.get(severity) || []
  }

  search(query: string): ScamEntry[] {
    const queryLower = query.toLowerCase()
    const results: ScamEntry[] = []

    this.urlIndex.forEach((entry) => {
      if (
        entry.url.toLowerCase().includes(queryLower) ||
        entry.description.toLowerCase().includes(queryLower) ||
        entry.type.toLowerCase().includes(queryLower)
      ) {
        results.push(entry)
      }
    })

    return results
  }

  getAllCategories(): string[] {
    return Array.from(this.categoryIndex.keys())
  }

  getStats() {
    return {
      total: this.urlIndex.size,
      byCategory: Array.from(this.categoryIndex.entries()).map(([cat, entries]) => ({
        category: cat,
        count: entries.length,
      })),
      bySeverity: Array.from(this.severityIndex.entries()).map(([sev, entries]) => ({
        severity: sev,
        count: entries.length,
      })),
    }
  }
}
