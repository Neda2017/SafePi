const CACHE_NAME = "safepi-v3"
const CACHE_URLS = ["/", "/dashboard", "/education", "/browser-extension", "/help", "/offline"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS)
    }),
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          // Return offline page if network fails
          if (event.request.mode === "navigate") {
            return caches.match("/offline")
          }
        })
      )
    }),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
    }),
  )
})

// Background sync for offline reports
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-reports") {
    event.waitUntil(syncReports())
  }
})

async function syncReports() {
  const getQueuedReports = async () => {
    // Implement logic to get queued reports
    return []
  }

  const removeQueuedReport = async (id) => {
    // Implement logic to remove a queued report by id
  }

  const reports = await getQueuedReports()
  for (const report of reports) {
    try {
      await fetch("/api/reports", {
        method: "POST",
        body: JSON.stringify(report),
      })
      await removeQueuedReport(report.id)
    } catch (error) {
      console.error("Failed to sync report:", error)
    }
  }
}
